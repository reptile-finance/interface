import { zeroAddress } from 'viem';
import { SwapActionButton, SwapActionButtonWrapper, SwapHeader, SwapWrapper } from './Styles';
import { SwapBox } from './SwapBox';
import { SwapDetail } from './SwapDetail';
import { useCallback } from 'react';
import { useSwap } from './useSwap';

export const Swap = () => {
    const { values, setLastInputValue, setToken0, setToken1, loading, path, swap } = useSwap();

    const onChangeInput = useCallback(
        (index: 0 | 1) => (v: string) => {
            setLastInputValue(index)(v);
        },
        [setLastInputValue],
    );

    return (
        <SwapWrapper>
            <SwapHeader>
                <span className="swap">Swap</span>
            </SwapHeader>
            <SwapBox
                defaultToken={zeroAddress}
                value={values[0]}
                onChange={onChangeInput(0)}
                onTokenChange={setToken0}
                loading={loading}
            />
            <SwapBox
                defaultToken={zeroAddress}
                value={values[1]}
                onChange={onChangeInput(1)}
                onTokenChange={setToken1}
                loading={loading}
            />
            <SwapDetail path={path} />
            <SwapActionButtonWrapper>
                <SwapActionButton onClick={swap}>Swap</SwapActionButton>
            </SwapActionButtonWrapper>
        </SwapWrapper>
    );
};
