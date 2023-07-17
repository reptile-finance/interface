import { SwapDetailContent, SwapDetailRow, SwapDetailWrapper } from './Styles';

export const SwapDetail = () => {
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
                    <span>BNB &gt; REPT</span>
                </SwapDetailRow>
            </SwapDetailContent>
        </SwapDetailWrapper>
    );
};
