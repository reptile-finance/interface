import { zeroAddress } from 'viem';
import { SwapActionButton, SwapActionButtonWrapper, SwapHeader, SwapWrapper } from './Styles';
import { SwapBox } from './SwapBox';
import { SwapDetail } from './SwapDetail';
import { usePathFinder } from "../../Hooks/usePathFinder";
import { useCallback, useEffect, useState } from 'react';
import { EthAddress } from '../../Types';
import { useRouter } from '../../Hooks/useRouter';
import { useToken } from '../../Hooks/useToken';
import { fetchToken } from 'wagmi/actions';
import { SwapType, useSwap } from "./useSwap"
import { BN, isNaN } from '../../Utils/Bignumber';



export const Swap = () => {

    const { value, setValue, token0, token1, setToken0, setToken1, changeSwapType, loading, path} = useSwap();

    const onChangeInput = useCallback((index: 0 | 1) => (v: string) => {
        console.log("onChangeInput", index, v);
        changeSwapType(index === 0 ? SwapType.EXACT_IN : SwapType.EXACT_OUT);
        setValue([index === 0 ? v : '0', index === 1 ? v : '0']);
    }, [changeSwapType]);



    return (
        <SwapWrapper>
            <SwapHeader>
                <span className="swap">Swap</span>
            </SwapHeader>
            <SwapBox 
                defaultToken={zeroAddress}
                value={isNaN(value[0]) ? '0' : value[0]}
                onChange={onChangeInput(0)}
                onTokenChange={setToken0}
                loading={loading[0]}
            />
            <SwapBox                 
                defaultToken={zeroAddress}
                value={isNaN(value[1]) ? '0' : value[1]}
                onChange={onChangeInput(1)}
                onTokenChange={setToken1}
                loading={loading[1]}/>
            <SwapDetail 
                path={path}
            />
            <SwapActionButtonWrapper>
                <SwapActionButton>Swap</SwapActionButton>
            </SwapActionButtonWrapper>
        </SwapWrapper>
    );
};
