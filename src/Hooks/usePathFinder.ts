import { useCallback } from "react";
import { usePools } from "./usePools"
import { Address } from "wagmi";
import { useRouter } from "./useRouter";

type PoolData = [`0x${string}`, `0x${string}`, `0x${string}`]

export const usePathFinder = () => {
    const { getAmountsOut, getAmountsIn } = useRouter();
    const { getPools, pools } = usePools();

    
    const getBestPathWithWithExactIn = useCallback(
        async (tokenIn: Address, tokenOut: Address, amountIn: string) => {

            if (compareAddress(tokenIn, tokenOut)) {
                console.log("tokenIn and tokenOut are the same");
                return [];
            }

            if (amountIn === "0") {
                console.log("amountIn is 0");
                return [];
            }

            const pools = await getPools();

            

            const allPaths = getAllPaths(tokenIn, tokenOut, pools);



            const bestPath = await getBestPathIn(allPaths, amountIn);

            return bestPath;

        }
    , [getAmountsOut, pools]);
    

    const pathContainsToken = (path: Address[], token: Address): boolean => {
        return path.includes(token);
    }

    const getAllPaths = (tokenSource: Address, tokenDestination: Address, pools: PoolData[] ) =>  {
        const paths: Address[][] = [];
        const MAX_DEPTH = 3;

        const computeRoute  = (currentRoute: Address[], depth: number) => {
            if (compareAddress(currentRoute[currentRoute.length - 1], tokenDestination)) {
                paths.push(currentRoute);
                return;
            }

            if (depth === MAX_DEPTH) {
                return;
            }

            for(let i = 0; i < pools.length; i++) {
                
                const tokenOut  = tokenOutWhenSwapPool(pools[i], currentRoute[currentRoute.length - 1]);

                if (!tokenOut) {
                    continue;
                }

                if (pathContainsToken(currentRoute, tokenOut)) {
                    continue;
                }


                computeRoute([...currentRoute, tokenOut], depth + 1);
            }
        }

        computeRoute([tokenSource], 0);

        return paths;
    }

    async function getBestPathIn(paths: Address[][], amountIn: string): Promise<Address[]> {
        const amountsOut = await Promise.all(paths.map(async (path) => {
            try {
                const amountOut =  await getAmountsOut(amountIn, path);

                return amountOut[amountOut.length - 1];
            } catch (error) {
                return "0";
            }
        }));
    
        const maxAmountOutIndex = amountsOut.indexOf(maxBigInt(...amountsOut.map(amount => BigInt(amount))).toString());
        return paths[maxAmountOutIndex] ?? [];
    }

    const getBestPathWithExactOut = useCallback(
        async (tokenIn: Address, tokenOut: Address, amountOut: string) => {

            if (compareAddress(tokenIn, tokenOut)) {
                console.log("tokenIn and tokenOut are the same");
                return [];
            }

            if (amountOut === "0") {
                console.log("amountOut is 0");
                return [];
            }

            

            const pools = await getPools();

            const allPaths = getAllPaths(tokenIn, tokenOut, pools);

            const bestPath = await getBestPathOut(allPaths, amountOut);

            return bestPath;

        }
    , [getAmountsIn, pools]);

    async function getBestPathOut(paths: Address[][], amountOut: string): Promise<Address[]> {
        const amountsIn = await Promise.all(paths.map(async (path) => {
            try {
                const amountIn =  await getAmountsIn(amountOut, path);

                console.log(amountIn);
                return amountIn[0];
            } catch (error) {
                return undefined;
            }
        }));

        console.log("amounts in:", amountsIn);



    
        const minAmountInIndex = amountsIn.indexOf(minBigInt(...amountsIn.filter((value) => value != undefined).map(amount => BigInt(amount))).toString());
        // Devuelve el camino con el mínimo valor que no sea 0

        console.log("minAmount", minBigInt(...amountsIn.filter((value) => value != undefined).map(amount => BigInt(amount))).toString());
        return paths[minAmountInIndex] ?? [];
    }

    const minBigInt = (...values: bigint[]): bigint | undefined => {
        return values.reduce((min, value) => !min || value < min ? value : min);
    }

    


    const maxBigInt = (...values: bigint[]): bigint => {
        return values.reduce((max, value) => value > max ? value : max);
    }

    const compareAddress = (a: Address, b: Address): boolean => {
        return a.toLocaleLowerCase() === b.toLocaleLowerCase();
    }
    

    const tokenOutWhenSwapPool = (pool: PoolData, tokenIn: Address): Address | undefined => {
        if (compareAddress(pool[0], tokenIn)) {
            return pool[1];
        }
        else if (compareAddress(pool[1], tokenIn)) {
            return pool[0];
        }
        else {
            return undefined;
        }
    }

    return { getBestPathWithWithExactIn, getBestPathWithExactOut };
}