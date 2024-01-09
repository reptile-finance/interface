import { useCallback } from 'react';
import { useConfig } from './useConfig';
import { useWalletClient } from 'wagmi';
import { UniswapAddLiquidity } from '../Types';
import { zeroAddress } from 'viem';
import UniswapV2Router02ABI from '../ABI/UniswapV2Router02';
import { useTokens } from './useTokens';
import { BN, parseFormattedBalance, substractPercentage } from '../Utils/Bignumber';
import { prepareWriteContract, writeContract } from 'wagmi/actions';
import { useUniswap } from './useUniswap';

export const useLiquidity = () => {
    const { data: wallet } = useWalletClient();
    const { activeChainConfig, userConfig } = useConfig();
    const { getTokenMetadata } = useTokens();
    const { uniswapConfig } = useUniswap();

    // Only called internally
    const addLiquidityETH = useCallback(
        async ({
            token0,
            token1,
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            to,
            deadline,
        }: UniswapAddLiquidity) => {
            if (!wallet) {
                throw new Error('Wallet not connected');
            }

            const value = token0 === zeroAddress ? amount0Desired : amount1Desired;
            const token = token0 === zeroAddress ? token1 : token0;
            const amountETHMin = token0 === zeroAddress ? amount0Min : amount1Min;
            const amountTokenMin = token0 === zeroAddress ? amount1Min : amount0Min;
            const amountTokenDesired = token0 === zeroAddress ? amount1Desired : amount0Desired;

            const { request } = await prepareWriteContract({
                address: uniswapConfig.router,
                abi: UniswapV2Router02ABI,
                functionName: 'addLiquidityETH',
                args: [token, amountTokenDesired, amountTokenMin, amountETHMin, to, deadline],
                value,
                chain: activeChainConfig,
                walletClient: wallet,
            });
            return writeContract(request);
        },
        [activeChainConfig, uniswapConfig.router, wallet],
    );

    const addLiquidity = useCallback(
        async ({
            token0,
            token1,
            amount0Desired,
            amount1Desired,
            amount0Min,
            amount1Min,
            to,
            deadline,
        }: UniswapAddLiquidity) => {
            if (!wallet) {
                throw new Error('Wallet not connected');
            }

            const functionName: 'addLiquidity' | 'addLiquidityETH' = [token0, token1].includes(zeroAddress)
                ? 'addLiquidityETH'
                : 'addLiquidity';

            const token0Metadata = await getTokenMetadata(token0);
            const token1Metadata = await getTokenMetadata(token1);

            const amount0DesiredFormatted = parseFormattedBalance(amount0Desired, token0Metadata.decimals);
            const amount1DesiredFormatted = parseFormattedBalance(amount1Desired, token1Metadata.decimals);
            const token0Min = amount0Min
                ? parseFormattedBalance(amount0Min, token0Metadata.decimals)
                : BN(substractPercentage(amount0DesiredFormatted, userConfig?.slippage ?? '0.5'))
                      .dp(0)
                      .toFixed();
            const token1Min = amount1Min
                ? parseFormattedBalance(amount1Min, token1Metadata.decimals)
                : BN(substractPercentage(amount1DesiredFormatted, userConfig?.slippage ?? '0.5'))
                      .dp(0)
                      .toFixed();

            const reducedDeadline = deadline ?? Math.floor(Date.now() / 1000) + 60; // 1 minute from the current Unix time in Seconds
            const reducedTo = to ?? wallet.account.address;

            if (functionName === 'addLiquidityETH') {
                return addLiquidityETH({
                    token0,
                    token1,
                    amount0Desired: amount0DesiredFormatted,
                    amount1Desired: amount1DesiredFormatted,
                    amount0Min: token0Min,
                    amount1Min: token1Min,
                    to: reducedTo,
                    deadline: reducedDeadline,
                });
            }

            const { request } = await prepareWriteContract({
                address: uniswapConfig.router,
                abi: UniswapV2Router02ABI,
                functionName,
                walletClient: wallet,
                args: [
                    token0,
                    token1,
                    amount0DesiredFormatted,
                    amount1DesiredFormatted,
                    token0Min,
                    token1Min,
                    reducedTo,
                    reducedDeadline,
                ],
                chain: activeChainConfig,
            });
            return writeContract(request);
        },
        [addLiquidityETH, getTokenMetadata, activeChainConfig, uniswapConfig.router, wallet],
    );

    return { addLiquidity };
};
