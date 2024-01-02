import { useCallback, useEffect, useMemo, useState } from 'react';
import { EthAddress } from '../Types';
import { readContract } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import { useConfig } from './useConfig';
import UniswapHelperABI from '../ABI/UniswapHelper.json';
import { useUniswap } from './useUniswap';
import { zeroAddress } from 'viem';

// by pool tokens
export const usePool2 = ({ token0, token1 }: { token0?: EthAddress; token1?: EthAddress }) => {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const { chains } = useNetwork();
    const { config, activeChainConfig } = useConfig();
    const { uniswapConfig } = useUniswap();
    const [reserves, setReserves] = useState<[bigint, bigint]>([0n, 0n]);

    const fetchData = useCallback(() => {
        if (isLoading) return;
        if (!activeChainConfig || !token0 || !token1 || !uniswapConfig.uniswapHelper || !config) return;
        setLoading(true);

        const reducedToken0 = token0 === zeroAddress ? uniswapConfig.weth : token0;
        const reducedToken1 = token1 === zeroAddress ? uniswapConfig.weth : token1;

        readContract({
            address: uniswapConfig.uniswapHelper,
            abi: UniswapHelperABI,
            functionName: 'getReserves',
            args: [uniswapConfig.factory, reducedToken0, reducedToken1],
            chainId: Number(activeChainConfig.id),
        })
            .then((data: [bigint, bigint, bigint]) => {
                setReserves([data[0], data[1]]);
                setError(false);
            })
            .catch((err) => {
                setError(true);
                setReserves([0n, 0n]);
                throw err;
            })
            .finally(() => {
                setLoading(false);
            });
    }, [activeChainConfig, config, isLoading, token0, token1, uniswapConfig]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token0, token1, chains]);

    const data = useMemo(() => {
        return reserves;
    }, [reserves]);

    return { isLoading, isError, data };
};
