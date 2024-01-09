import { useEffect, useMemo, useState } from 'react';
import { EthAddress } from '../../Types';
import { SwapDetailContent, SwapDetailRow, SwapDetailWrapper } from './Styles';
import { fetchToken } from 'wagmi/actions';
import { usePriceImpact } from '../../Hooks/usePriceImpact';
import { useToken } from '../../Hooks/useToken';

export const SwapDetail: React.FC<{
    path: EthAddress[];
}> = ({ path }) => {
    const [tokenSymbols, setTokenSymbols] = useState<string[] | undefined>(undefined);
    const { priceImpact } = usePriceImpact();

    const tokenOut = useMemo(() => {
        if (!path) return undefined;
        return path[path.length - 1];
    }, [path]);

    const { data: tokenData } = useToken({ address: tokenOut });

    useEffect(() => {
        if (!path) return;
        Promise.all(
            path.map(async (address) => {
                const token = await fetchToken({ address });
                return token.symbol;
            }),
        ).then(setTokenSymbols);
    }, [path]);

    return (
        <SwapDetailWrapper>
            <SwapDetailContent>
                <SwapDetailRow>
                    <span>Minimum Received</span>
                    <span>12 {tokenData?.symbol}</span>
                </SwapDetailRow>
                <SwapDetailRow>
                    <span>Price Impact</span>
                    <span>{priceImpact}%</span>
                </SwapDetailRow>
                <SwapDetailRow>
                    <span>Swap Fee</span>
                    <span>0.25%</span>
                </SwapDetailRow>
                <SwapDetailRow>
                    <span>Reptile Fee</span>
                    <span>0.05%</span>
                </SwapDetailRow>
                <SwapDetailRow>
                    <span>Route</span>
                    <span>{tokenSymbols ? tokenSymbols.join(' > ') : 'NA'}</span>
                </SwapDetailRow>
            </SwapDetailContent>
        </SwapDetailWrapper>
    );
};
