import { Address } from 'viem';
import { readContract } from 'wagmi/actions';
import { useUniswap } from './useUniswap';
import UniswapV2Router02ABI from '../ABI/UniswapV2Router02';
import { useCallback } from 'react';
import { useConfig } from './useConfig';

export const useRouter = () => {
    const { uniswapConfig } = useUniswap();
    const { activeChainConfig } = useConfig();

    const getAmountsOut = useCallback(
        async (amountIn: string, path: Address[]) => {
            const data: bigint[] = (await readContract({
                address: uniswapConfig.router,
                abi: UniswapV2Router02ABI,
                functionName: 'getAmountsOut',
                args: [amountIn, path],
                chainId: Number(activeChainConfig.id),
            })) as bigint[];

            return data.map((value) => value.toString());
        },
        [activeChainConfig.id, uniswapConfig.router],
    );

    const getAmountsIn = useCallback(
        async (amountOut: string, path: Address[]) => {
            const data: bigint[] = (await readContract({
                address: uniswapConfig.router,
                abi: UniswapV2Router02ABI,
                functionName: 'getAmountsIn',
                args: [amountOut, path],
                chainId: Number(activeChainConfig.id),
            })) as bigint[];

            return data.map((value) => value.toString());
        },
        [activeChainConfig.id, uniswapConfig.router],
    );

    const getPair = useCallback(
        async (tokenA: Address, tokenB: Address) => {
            const data: Address = (await readContract({
                address: uniswapConfig.factory,
                abi: UniswapV2Router02ABI,
                functionName: 'getPair',
                args: [tokenA, tokenB],
                chainId: Number(activeChainConfig.id),
            })) as Address;

            return data;
        },
        [activeChainConfig.id, uniswapConfig.factory],
    );

    return { getAmountsOut, getAmountsIn, getPair };
};
