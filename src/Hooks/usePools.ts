import { readContract } from 'wagmi/actions';
import UniswapV2FactoryABI from '../ABI/UniswapV2Factory.json';
import UniswapQuery from '../ABI/UniswapQuery.json';
import { EthAddress } from '../Types';
import { useCallback, useMemo } from 'react';
import { useUniswap } from './useUniswap';
import { useConfig } from './useConfig';
import { useRecoilValue } from 'recoil';
import { PoolsState } from '../State/Pools';

export const usePools = () => {
    const { uniswapConfig } = useUniswap();
    const { activeChainConfig } = useConfig();
    const poolsState = useRecoilValue(PoolsState);

    const getPools = useCallback(async () => {
        const pairsLength = await readContract({
            address: uniswapConfig.factory,
            abi: UniswapV2FactoryABI,
            functionName: 'allPairsLength',
            args: [],
            chainId: Number(activeChainConfig.id),
        });
        // needs optimization based on the number of pairs already stored in the State
        return readContract({
            address: uniswapConfig.uniswapQuery,
            abi: UniswapQuery,
            functionName: 'getPairsByIndexRange',
            args: [uniswapConfig.factory, 0, pairsLength],
            chainId: Number(activeChainConfig.id),
        }) as Promise<[EthAddress, EthAddress, EthAddress][]>; // token0, token1, pairAddress
    }, [activeChainConfig.id, uniswapConfig]);

    const pools = useMemo(() => {
        return poolsState[activeChainConfig.id];
    }, [activeChainConfig, poolsState]);

    return { getPools, pools };
};
