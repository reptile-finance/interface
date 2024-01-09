import { useCallback, useEffect, useState } from 'react';
import router02 from '../Components/Swap/Uniswap/Router02';
import { usePools } from './usePools';
import { BN } from '../Utils/Bignumber';

export const usePriceImpact = () => {
    const [requestId, setRequestId] = useState<number>(0);
    const [priceImpact, setPriceImpact] = useState<string>('0');
    const { getReservesByPools } = usePools();

    const calcPriceImpact = useCallback(
        async (amountsOut: string[]) => {
            const sortestPath = router02.findSortestPath();
            const pathWithReserves = await getReservesByPools(sortestPath.pools);
            const midPrice = calcMidPrice(pathWithReserves);
            const aIn = amountsOut[0];
            const aOut = amountsOut[amountsOut.length - 1];

            const result = BN(aIn)
                .dividedBy(aOut)
                .minus(midPrice)
                .dividedBy(midPrice)
                .multipliedBy(100)
                .abs()
                .minus(0.25) // PLATFORM FEE
                .toFixed(2);

            if (BN(result).isGreaterThan(100)) {
                setPriceImpact('100');
            } else {
                setPriceImpact(result);
            }
        },
        [getReservesByPools],
    );

    useEffect(() => {
        const fn = ({ reqId, amountsOut }: { reqId: number; amountsOut: string[] }) => {
            try {
                if (reqId >= requestId) {
                    calcPriceImpact(amountsOut);
                }
            } catch (e) {
                console.error(e);
                setPriceImpact('0');
            } finally {
                setRequestId(reqId);
            }
        };
        router02.on('amountsOut', fn);
        return () => {
            router02.off('amountsOut', fn);
        };
    }, [calcPriceImpact, getReservesByPools, requestId]);

    const calcMidPrice = (pathWithReserves: [string, string, string][]) => {
        const midPrice = pathWithReserves.reduce((acc, reserve) => {
            const [token0Reserve, token1Reserve] = reserve;
            const price = BN(token0Reserve.toString()).div(token1Reserve.toString());
            return BN(acc).multipliedBy(price).toString();
        }, '1');
        return midPrice;
    };

    return { priceImpact };
};
