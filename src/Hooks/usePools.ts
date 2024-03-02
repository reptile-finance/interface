import UniswapV2FactoryABI from '../ABI/UniswapV2Factory.json';
import UniswapQuery from '../ABI/UniswapQuery.json';
import { EthAddress } from '../Types';
import { useCallback, useMemo } from 'react';
import { useUniswap } from './useUniswap';
import { useConfig } from './useConfig';
import { useRecoilValue } from 'recoil';
import { PoolsState } from '../State/Pools';
import { zeroAddress } from 'viem';
import { usePublicClient } from 'wagmi';

export const usePools = () => {
    const { uniswapConfig } = useUniswap();
    const { activeChainConfig } = useConfig();
    const poolsState = useRecoilValue(PoolsState);
    const publicClient = usePublicClient();

    const getPools = useCallback(async () => {
        const pairsLength = await publicClient.readContract({
            address: uniswapConfig.factory,
            abi: UniswapV2FactoryABI,
            functionName: 'allPairsLength',
            args: [],
        });
        // needs optimization based on the number of pairs already stored in the State
        return publicClient.readContract({
            address: uniswapConfig.uniswapQuery,
            abi: UniswapQuery,
            functionName: 'getPairsByIndexRange',
            args: [uniswapConfig.factory, 0, pairsLength],
        }) as Promise<[EthAddress, EthAddress, EthAddress][]>; // token0, token1, pairAddress
    }, [publicClient, uniswapConfig]);

    const getReservesByPools = useCallback(
        async (pools: EthAddress[]) => {
            const reserves = await publicClient.readContract({
                address: uniswapConfig.uniswapQuery,
                abi: UniswapQuery,
                functionName: 'getReservesByPairs',
                args: [pools],
            });
            return reserves as [string, string, string][];
        },
        [publicClient, uniswapConfig],
    );

    const getPool = useCallback(
        (token0: EthAddress, token1: EthAddress) => {
            try {
                return publicClient.readContract({
                    address: uniswapConfig.factory,
                    abi: UniswapV2FactoryABI,
                    functionName: 'getPair',
                    args: [token0, token1],
                });
            } catch (error) {
                console.error(error);
                return zeroAddress;
            }
        },
        [publicClient, uniswapConfig],
    );

    const pools = useMemo(() => {
        return poolsState[activeChainConfig.id];
    }, [activeChainConfig, poolsState]);

    return { getPools, getPool, getReservesByPools, pools };
};
