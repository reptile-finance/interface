import { zeroAddress } from 'viem';
import { SwapActionButton, SwapActionButtonWrapper, SwapHeader, SwapWrapper } from './Styles';
import { SwapBox } from './SwapBox';
import { SwapDetail } from './SwapDetail';

export const Swap = () => {
    return (
        <SwapWrapper>
            <SwapHeader>
                <span className="swap">Swap</span>
            </SwapHeader>
            <SwapBox defaultToken={zeroAddress} />
            <SwapBox defaultToken={zeroAddress} />
            <SwapDetail />
            <SwapActionButtonWrapper>
                <SwapActionButton>Swap</SwapActionButton>
            </SwapActionButtonWrapper>
        </SwapWrapper>
    );
};
