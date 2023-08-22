import { Address } from "viem";
import { readContract } from "wagmi/actions";
import { useUniswap } from "./useUniswap";
import UniswapV2Router02ABI from '../ABI/UniswapV2Router02.json';
import { useCallback } from "react";
import { useConfig } from "./useConfig";

export const useRouter = () => {
    const { uniswapConfig } = useUniswap();
    const { activeChainConfig } = useConfig();

    const getAmountsOut = useCallback(
        async (amountIn: string, path: Address[]) => {
            const data = await readContract({
                address: uniswapConfig.router,
                abi: UniswapV2Router02ABI,
                functionName: 'getAmountsOut',
                args: [amountIn, path],
                chainId: Number(activeChainConfig.id),
            });

            return data as bigint;
        }
    , [uniswapConfig.router]);

    return { getAmountsOut };
}