import { useEffect, useMemo, useState } from 'react';
import { EthAddress } from '../../Types';
import { SwapDetailContent, SwapDetailRow, SwapDetailWrapper } from './Styles';
import { fetchToken } from 'wagmi/actions';
import { usePriceImpact } from '../../Hooks/usePriceImpact';
import { useToken } from '../../Hooks/useToken';
import { substractPercentage } from '../../Utils/Bignumber';
import { useConfig } from '../../Hooks/useConfig';

export const SwapDetail: React.FC<{
    path: EthAddress[];
    values: string[];
}> = ({ path, values }) => {
    const [tokenSymbols, setTokenSymbols] = useState<string[] | undefined>(undefined);
    const { priceImpact } = usePriceImpact();
    const { userConfig } = useConfig();

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

    const minimumReceived = useMemo(() => {
        if (!values[1]) return undefined;
        return substractPercentage(values[1], userConfig?.slippage ?? 0.5);
    }, [userConfig, values]);

    return (
        <SwapDetailWrapper>
            <SwapDetailContent>
                <SwapDetailRow>
                    <span>Minimum Received</span>
                    <span>
                        {minimumReceived} {tokenData?.symbol}
                    </span>
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
