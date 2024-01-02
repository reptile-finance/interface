import { EthAddress } from '../../../Types';
import { Pool } from './Router02';

// tokens should be normalized previously
export const getAllPaths = (tokenSource: EthAddress, tokenDestination: EthAddress, pools: Pool[]) => {
    if (!tokenSource || !tokenDestination || !pools) return [];
    const paths: EthAddress[][] = [];
    const MAX_DEPTH = 5;

    const computeRoute = (currentRoute: EthAddress[], depth: number, availablePools: Pool[]) => {
        const previousToken = currentRoute[currentRoute.length - 1] ?? tokenSource;
        if (compareAddress(previousToken, tokenDestination)) {
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
    computeRoute([tokenSource], 0, pools);
    return paths;
};

const compareAddress = (a: EthAddress, b: EthAddress): boolean => {
    return a.toLocaleLowerCase() === b.toLocaleLowerCase();
};

const pathContainsToken = (path: EthAddress[], token: EthAddress): boolean => {
    return path.includes(token);
};

const tokenOutWhenSwapPool = (pool: Pool, tokenIn: EthAddress): EthAddress | undefined => {
    if (compareAddress(pool[0], tokenIn)) {
        return pool[1];
    } else if (compareAddress(pool[1], tokenIn)) {
        return pool[0];
    } else {
        return undefined;
    }
};
