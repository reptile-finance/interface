import { useCallback } from 'react';
import { usePools } from './usePools';
import { Address } from 'wagmi';
import { useRouter } from './useRouter';
import { useUniswap } from './useUniswap';
import { zeroAddress } from 'viem';

// token0, token1, pairAddress
type PoolData = [`0x${string}`, `0x${string}`, `0x${string}`];

export const usePathFinder = () => {
    const { getAmountsOut, getAmountsIn } = useRouter();
    const { pools } = usePools();
    const { uniswapConfig } = useUniswap();

    const tokenOutWhenSwapPool = useCallback((pool: PoolData, tokenIn: Address): Address | undefined => {
        if (compareAddress(pool[0], tokenIn)) {
            return pool[1];
        } else if (compareAddress(pool[1], tokenIn)) {
            return pool[0];
        } else {
            return undefined;
        }
    }, []);

    const getAllPaths = useCallback(
        (tokenSource: Address, tokenDestination: Address, pools: PoolData[]) => {
            const paths: Address[][] = [];
            const normalizedTokenDestination = tokenDestination === zeroAddress ? uniswapConfig.weth : tokenDestination;
            const normalizedTokenSource = tokenSource === zeroAddress ? uniswapConfig.weth : tokenSource;
            const MAX_DEPTH = 5;

            const computeRoute = (currentRoute: Address[], depth: number, availablePools: PoolData[]) => {
                const previousToken = currentRoute[currentRoute.length - 1] ?? tokenSource;
                if (compareAddress(previousToken, normalizedTokenDestination)) {
                    paths.push(currentRoute);
                    return;
                }

                if (depth === MAX_DEPTH) {
                    return;
                }

                for (let i = 0; i < pools.length; i++) {
                    const tokenOut = tokenOutWhenSwapPool(pools[i], previousToken);
                    if (!tokenOut) {
                        continue;
                    }
                    if (pathContainsToken(currentRoute, tokenOut)) {
                        continue;
                    }
                    const poolsCopy = [...availablePools];
                    poolsCopy.splice(i, 1);
                    computeRoute([...currentRoute, tokenOut], depth + 1, poolsCopy);
                }
            };
            computeRoute([normalizedTokenSource], 0, pools);
            return paths;
        },
        [tokenOutWhenSwapPool, uniswapConfig.weth],
    );

    const getBestPathIn = useCallback(
        async (paths: Address[][], amountIn: string): Promise<Address[]> => {
            const amountsOut = await Promise.all(
                paths.map(async (path) => {
                    try {
                        const amountOut = await getAmountsOut(amountIn, path);
                        return amountOut[amountOut.length - 1];
                    } catch (error) {
                        return '0';
                    }
                }),
            );
            const maxAmountOutIndex = amountsOut.indexOf(
                maxBigInt(...amountsOut.map((amount) => BigInt(amount))).toString(),
            );
            return paths[maxAmountOutIndex] ?? [];
        },
        [getAmountsOut],
    );

    const getBestPathWithExactIn = useCallback(
        async (tokenIn: Address, tokenOut: Address, amountIn: string) => {
            if (compareAddress(tokenIn, tokenOut)) {
                return [];
            }

            if (amountIn === '0') {
                return [];
            }

            const normalizedPools = Object.keys(pools).map((poolAddress) => {
                const pool = pools[poolAddress];
                return [pool.token0, pool.token1, poolAddress] as PoolData;
            });

            const allPaths = getAllPaths(tokenIn, tokenOut, normalizedPools);

            const bestPath = await getBestPathIn(allPaths, amountIn);

            return bestPath;
        },
        [getAllPaths, getBestPathIn, pools],
    );

    const getBestPathOut = useCallback(
        async (paths: Address[][], amountOut: string): Promise<Address[]> => {
            const amountsIn = await Promise.all(
                paths.map(async (path) => {
                    try {
                        const amountIn = await getAmountsIn(amountOut, path);
                        return amountIn[0];
                    } catch (error) {
                        return undefined;
                    }
                }),
            );
            const minAmountInIndex = amountsIn.indexOf(
                minBigInt(
                    ...amountsIn.filter((value) => value != undefined).map((amount) => BigInt(amount)),
                ).toString(),
            );
            return paths[minAmountInIndex] ?? [];
        },
        [getAmountsIn],
    );

    const pathContainsToken = (path: Address[], token: Address): boolean => {
        return path.includes(token);
    };

    const getBestPathWithExactOut = useCallback(
        async (tokenIn: Address, tokenOut: Address, amountOut: string) => {
            if (compareAddress(tokenIn, tokenOut)) {
                return [];
            }
            if (amountOut === '0') {
                return [];
            }
            const normalizedPools = Object.keys(pools).map((poolAddress) => {
                const pool = pools[poolAddress];
                return [pool.token0, pool.token1, poolAddress] as PoolData;
            });
            const allPaths = getAllPaths(tokenIn, tokenOut, normalizedPools);
            const bestPath = await getBestPathOut(allPaths, amountOut);
            return bestPath;
        },
        [getAllPaths, getBestPathOut, pools],
    );

    const minBigInt = (...values: bigint[]): bigint | undefined => {
        return values.reduce((min, value) => (!min || value < min ? value : min));
    };

    const maxBigInt = (...values: bigint[]): bigint => {
        return values.reduce((max, value) => (value > max ? value : max));
    };

    const compareAddress = (a: Address, b: Address): boolean => {
        return a.toLocaleLowerCase() === b.toLocaleLowerCase();
    };

    return { getBestPathWithWithExactIn: getBestPathWithExactIn, getBestPathWithExactOut };
};
