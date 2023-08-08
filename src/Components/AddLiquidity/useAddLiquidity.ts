import { useMemo, useState } from 'react';
import { TokenMetadata } from '../../Types';
import { zeroAddress } from 'viem';
import { useWalletClient, useContractReads, erc20ABI } from 'wagmi';
import { Config } from '../../Config';
import { useConfig } from '../../Hooks/useConfig';
import { parseFormattedBalance, BN } from '../../Utils/Bignumber';

const ERC20Config = {
    abi: erc20ABI,
    functionName: 'allowance',
};

export const useAddLiquidity = () => {
    const { data: wallet } = useWalletClient();
    const [value, setValue] = useState<[string, string]>(['', '']);
    const { activeChainConfig } = useConfig();
    const [token0, setToken0] = useState<TokenMetadata | undefined>(undefined);
    const [token1, setToken1] = useState<TokenMetadata | undefined>(undefined);

    const uniswapConfig = useMemo(() => {
        return Config[activeChainConfig.id.toString()];
    }, [activeChainConfig.id]);

    const { data: allowances } = useContractReads({
        contracts: [
            {
                ...(token0 && token0.address !== zeroAddress
                    ? {
                          address: token0.address,
                          args: [wallet.account.address, uniswapConfig.router],
                          chainId: activeChainConfig.id,
                          ...ERC20Config,
                      }
                    : {}),
                ...(token1 && token1.address !== zeroAddress
                    ? {
                          address: token1.address,
                          args: [wallet.account.address, uniswapConfig.router],
                          chainId: activeChainConfig.id,
                          ...ERC20Config,
                      }
                    : {}),
            },
        ],
        watch: true,
    });

    const isEnoughAllowance0 = useMemo(() => {
        if (!allowances || !token0) return false;
        if (token0.address === zeroAddress) return true;
        const allowance = allowances[0];
        const amount = parseFormattedBalance(value[0], token0.decimals);
        return allowance && BN(allowance.result.toString()).gte(BN(amount));
    }, [allowances, token0, value]);

    const isEnoughAllowance1 = useMemo(() => {
        if (!allowances || !token1) return false;
        if (token1.address === zeroAddress) return true;
        const allowance = allowances.length > 1 ? allowances[1] : allowances[0];
        const amount = parseFormattedBalance(value[1], token1.decimals);
        return allowance && BN(allowance.result.toString()).gte(BN(amount));
    }, [allowances, token1, value]);

    return {
        token0,
        setToken0,
        token1,
        setToken1,
        value,
        setValue,
        allowances,
        uniswapConfig,
        activeChainConfig,
        isEnoughAllowance0,
        isEnoughAllowance1,
    };
};
