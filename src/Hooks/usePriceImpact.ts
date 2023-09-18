import { EthAddress } from "../Types";
import { usePool } from "./usePool";
import { useRouter } from "./useRouter";

export const usePriceImpact = () => {
    const { getAmountsOut, getAmountsIn, getPair } = useRouter();
    
    const [] = usePool
    

    async function calculatePriceImpact(amountIn: string, path: EthAddress[]): number {
        
        let priceImpact = 0;
        let lastAmountIn = amountIn;
        for (let i = 0; i < path.length - 1; i++) {
            const pair = await getPair(path[i], path[i + 1]);
            const amountsOut = await getAmountsOut(lastAmountIn, [path[i], path[i + 1]]);

            const amountOut = amountsOut[1];
            const reserveIn = pair.reserve0;

            priceImpact += Math.abs(reserveIn) + Math.abs(amountIn);
            amountIn = amountOut;
        }

        priceImpact = priceImpact / Math.abs(amountIn);
        return priceImpact.toString();
        
    }
}