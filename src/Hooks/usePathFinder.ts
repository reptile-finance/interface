import { useCallback } from "react";
import { usePools } from "./usePools"
import { Address } from "wagmi";
import { useRouter } from "./useRouter";

type PoolData = [`0x${string}`, `0x${string}`, `0x${string}`]

export const usePathFinder = () => {
    const { getAmountsOut } = useRouter();
    const { getPools, pools } = usePools();

    
    const getBestPathWithWithExactIn = useCallback(
        async (tokenIn: Address, tokenOut: Address, amountIn: string) => {

            console.log('Obteniendo el mejor camino con exactIn...');

            console.log('Tokens de entrada:', tokenIn);
            console.log('Tokens de salida:', tokenOut);
            console.log('Cantidad de tokens de entrada:', amountIn);

            console.log('Obteniendo pools...');
            const pools = await getPools();
            console.log('Pools obtenidos:', pools);
            
            console.log('Obteniendo todos los caminos...');
            const allPaths = getAllPaths(tokenIn, tokenOut, pools);
            console.log('Todos los caminos obtenidos:', allPaths);

            console.log('Obteniendo el mejor camino...');
            const bestPath = await getBestPath(allPaths, amountIn);
            console.log('Mejor camino obtenido:', bestPath);

            console.log('Convirtiendo datos de la piscina a la ruta...');
            const path = poolDataArrayToPath(bestPath);
            console.log('Ruta obtenida:', path);

            return path;
        }
    , [getAmountsOut, pools]);
    

    const containsPool = (pairs: PoolData[], pair: PoolData): boolean => {
        return pairs.some((_pair) => compareAddress(_pair[2], pair[2]));
    }

    const getAllPaths = (tokenSource: Address, tokenDestination: Address, pools: PoolData[] ) =>  {
        const paths: PoolData[][] = [];
        const MAX_DEPTH = 3;

        const computeRoute  = (currentRoute: PoolData[], depth: number) => {
            if (currentRoute.length !== 0 && compareAddress(currentRoute[currentRoute.length - 1][1], tokenDestination)) {
                paths.push(currentRoute);
                return;
            }

            if (depth === MAX_DEPTH) {
                return;
            }

            for(let i = 0; i < pools.length; i++) {

                if (containsPool(currentRoute, pools[i])) {
                    continue;
                }

                if (currentRoute.length === 0 ) {
                    if (compareAddress(tokenSource, pools[i][0])) {
                        continue;
                    }
                }
                else if (compareAddress(currentRoute[currentRoute.length - 1][1], pools[i][1])) {
                        continue;
                }

                computeRoute([...currentRoute, pools[i]], depth + 1);
            }
        }

        computeRoute([], 0);

        return paths;
    }

    async function getBestPath(paths: PoolData[][], amountIn: string): Promise<PoolData[] | null> {
        const amountsOut = await Promise.all(paths.map(async (path) => {
            try {
                return await getAmountsOut(amountIn, poolDataArrayToPath(path));
            } catch (error) {
                return BigInt(0);
            }
        }));
    
        return paths[amountsOut.indexOf(maxBigInt(...amountsOut))];
    }

    const poolDataArrayToPath = (poolData: PoolData[]): Address[] => {
        if (poolData.length === 0) {
            return [];
        }
        return poolData.map((pool) => pool[0]).concat([poolData[poolData.length - 1][1]]);
    }

    const maxBigInt = (...values: bigint[]): bigint => {
        return values.reduce((max, value) => value > max ? value : max);
    }

    const compareAddress = (a: Address, b: Address): boolean => {
        return a.toLocaleLowerCase() === b.toLocaleLowerCase();
    }

    return { getBestPathWithWithExactIn };
}