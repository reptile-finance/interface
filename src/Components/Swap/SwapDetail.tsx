import { useEffect, useState } from 'react';
import { EthAddress } from '../../Types';
import { SwapDetailContent, SwapDetailRow, SwapDetailWrapper } from './Styles';
import { fetchToken } from 'wagmi/actions';

export const SwapDetail: React.FC<{
    path: EthAddress[];
}> = ({
    path,
}) => {
    
    const [tokenSymbols, setTokenSymbols] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        if (!path) return;
    
        Promise.all(path.map(async (address) => {
            const token = await fetchToken({address});
            return token.symbol;
        })).then(setTokenSymbols);

    }, [path]);


    return (
        <SwapDetailWrapper>
            <SwapDetailContent>
                <SwapDetailRow>
                    <span>Minimum Received</span>
                    <span>12 REPT</span>
                </SwapDetailRow>
                <SwapDetailRow>
                    <span>Price Impact</span>
                    <span>&lt; 0.01%</span>
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
                    <span>{tokenSymbols ? tokenSymbols.join(" > ") : "undefined"}</span>
                </SwapDetailRow>
            </SwapDetailContent>
        </SwapDetailWrapper>
    );
};
