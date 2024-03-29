import { zeroAddress } from 'viem';
import { SwapActionButton, SwapActionButtonWrapper, SwapHeader, SwapWrapper } from './Styles';
import { SwapBox } from './SwapBox';
import { SwapDetail } from './SwapDetail';
import { useCallback, useState } from 'react';
import { useSwap } from './useSwap';
import toast from 'react-hot-toast';

export const Swap = () => {
    const { approve, values, setLastInputValue, setToken0, setToken1, loading, path, swap, isEnoughAllowance } =
        useSwap();
    const [buttonLoading, setButtonLoading] = useState('');

    const onChangeInput = useCallback(
        (index: 0 | 1) => (v: string) => {
            setLastInputValue(index)(v);
        },
        [setLastInputValue],
    );

    const functionHandler = useCallback(
        (fn: () => Promise<unknown>) => async () => {
            setButtonLoading('true');
            const promiseFn = fn();
            toast
                .promise(promiseFn, {
                    loading: 'Loading...',
                    success: 'Success',
                    error: 'An error ocurred, please try again',
                })
                .finally(() => {
                    setButtonLoading('');
                });
        },
        [setButtonLoading, buttonLoading, toast],
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
            <SwapDetail path={path} values={values} />
            <SwapActionButtonWrapper>
                {isEnoughAllowance ? (
                    <SwapActionButton loading={buttonLoading} onClick={functionHandler(swap)}>
                        Swap
                    </SwapActionButton>
                ) : (
                    <SwapActionButton loading={buttonLoading} onClick={functionHandler(approve)}>
                        Approve
                    </SwapActionButton>
                )}
            </SwapActionButtonWrapper>
        </SwapWrapper>
    );
};
