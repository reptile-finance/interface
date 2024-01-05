import { useCallback, useMemo, useState } from 'react';
import { erc20ABI, useAccount, useContractRead, useToken, useWalletClient } from 'wagmi';
import { useUniswap } from '../../Hooks/useUniswap';
import { EthAddress, UniswapRemoveLiquidity } from '../../Types';
import { useConfig } from '../../Hooks/useConfig';
import { BN, parseFormattedBalance } from '../../Utils/Bignumber';
import { useERC20 } from '../../Hooks/useERC20';
import { prepareWriteContract, waitForTransaction, writeContract } from 'wagmi/actions';
import { zeroAddress } from 'viem';
import UniswapV2Router02ABI from '../../ABI/UniswapV2Router02';

export const useRemoveLiquidity = (pool: EthAddress, token0: EthAddress, token1: EthAddress) => {
    const { address } = useAccount();
    const { data: wallet } = useWalletClient();
    const [value, setValue] = useState<string>('');
    const { activeChainConfig } = useConfig();
    const { uniswapConfig } = useUniswap();
    const { approve } = useERC20();
    const { data } = useContractRead({
        address: pool,
        args: [address, uniswapConfig.router],
        chainId: activeChainConfig.id,
        abi: erc20ABI,
        functionName: 'allowance',
        watch: true,
    });
    const { data: poolToken } = useToken({ address: pool });
    const { data: token0Data } = useToken({ address: token0 });
    const { data: token1Data } = useToken({ address: token1 });

    const isEnoughAllowance = useMemo(() => {
        if (!data || !poolToken) return false;
        const weiValue = parseFormattedBalance(value ? value : '0', poolToken.decimals);
        return data && BN(data).gte(weiValue);
    }, [data, poolToken, value]);

    const approveLpToken = useCallback(() => {
        if (isEnoughAllowance || !poolToken || !value) return;
        const weiValue = parseFormattedBalance(value, poolToken.decimals);
        return approve(pool, uniswapConfig.router, weiValue).then(({ hash }) =>
            waitForTransaction({
                hash,
                chainId: activeChainConfig.id,
            }),
        );
    }, [activeChainConfig.id, approve, isEnoughAllowance, pool, poolToken, uniswapConfig.router, value]);

    const removeLiquidityETH = useCallback(
        async ({ liquidity, amount0Min, amount1Min, to, deadline }: UniswapRemoveLiquidity) => {
            const { request } = await prepareWriteContract({
                address: uniswapConfig.router,
                abi: UniswapV2Router02ABI,
                functionName: 'removeLiquidityETH',
                walletClient: wallet,
                args: [token0, token1, liquidity, amount0Min, amount1Min, to, deadline],
                chain: activeChainConfig,
            });
            return writeContract(request);
        },
        [activeChainConfig, token0, token1, uniswapConfig.router, wallet],
    );

    const removeLiquidity = useCallback(
        async ({ token0, token1, liquidity, amount0Min, amount1Min, to, deadline }: UniswapRemoveLiquidity) => {
            if (!wallet) {
                throw new Error('Wallet not connected');
            }
            const functionName: 'removeLiquidity' | 'removeLiquidityETH' = [token0, token1].includes(zeroAddress)
                ? 'removeLiquidityETH'
                : 'removeLiquidity';

            const liquidityAmount = parseFormattedBalance(liquidity, poolToken?.decimals);
            const reducedDeadline = deadline ?? Math.floor(Date.now() / 1000) + 60; // 1 minute from the current Unix time in Seconds
            const reducedTo = to ?? wallet.account.address;
            const [amount0, amount1] = BN(token0).isLessThan(token1)
                ? [amount0Min, amount1Min]
                : [amount1Min, amount0Min];
            const amount0DesiredFormatted = parseFormattedBalance(
                BN(amount0).multipliedBy(0.99).toString(),
                token0Data.decimals,
            );
            const amount1DesiredFormatted = parseFormattedBalance(
                BN(amount1).multipliedBy(0.99).toString(),
                token1Data.decimals,
            );
            const [t0, t1] = BN(token0).isLessThan(token1) ? [token0, token1] : [token1, token0];

            if (functionName === 'removeLiquidityETH') {
                return removeLiquidityETH({
                    token0: t0,
                    token1: t1,
                    liquidity: liquidityAmount,
                    deadline: reducedDeadline,
                    to: reducedTo,
                    amount0Min: amount0DesiredFormatted,
                    amount1Min: amount1DesiredFormatted,
                });
            }
            const { request } = await prepareWriteContract({
                address: uniswapConfig.router,
                abi: UniswapV2Router02ABI,
                functionName,
                walletClient: wallet,
                args: [
                    t0,
                    t1,
                    liquidityAmount,
                    amount0DesiredFormatted,
                    amount1DesiredFormatted,
                    reducedTo,
                    reducedDeadline,
                ],
                chain: activeChainConfig,
            });
            return writeContract(request);
        },
        [
            activeChainConfig,
            poolToken?.decimals,
            removeLiquidityETH,
            token0Data?.decimals,
            token1Data?.decimals,
            uniswapConfig.router,
            wallet,
        ],
    );

    return { isEnoughAllowance, setValue, approveLpToken, removeLiquidity, value, poolToken, token0Data, token1Data };
};
