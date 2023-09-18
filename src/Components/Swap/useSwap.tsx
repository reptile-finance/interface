import { useEffect, useMemo, useState } from "react";
import { EthAddress, TokenMetadata } from "../../Types";
import { usePathFinder } from "../../Hooks/usePathFinder"
import { useRouter } from "../../Hooks/useRouter"
import { formatBalance, parseFormattedBalance } from "../../Utils/Bignumber";

export enum SwapType {
    EXACT_IN = 'EXACT_IN',
    EXACT_OUT = 'EXACT_OUT'
}

export const useSwap = () => {
    const [ swapType, setSwapType ] = useState<SwapType>(SwapType.EXACT_IN);
    const [token0, setToken0] = useState<TokenMetadata | undefined>(undefined);
    const [token1, setToken1] = useState<TokenMetadata | undefined>(undefined);
    const [path, setPath] = useState<EthAddress[]>([]);
    const [value, setValue] = useState<string[]>(['0', '0']);
    const [loading, setLoading] = useState<boolean[]>([false, false]);
    const [priceImpact, setPriceImpact] = useState<string>('0');


    const { getBestPathWithWithExactIn, getBestPathWithExactOut } = usePathFinder();
    const { getAmountsOut, getAmountsIn } = useRouter();

    useEffect(() => {
            console.log("useEffect", "EXACT_IN", value[0]);
            if (swapType === SwapType.EXACT_IN) {
                if (value[0] === '0') {
                    setPath([]);
                    return;
                }
                
                setLoading([false, true]);

                getBestPathWithWithExactIn(token0.address, token1.address, parseFormattedBalance(value[0], token0.decimals))
                    .then(result => {
                        setPath(result)

                        getAmountsOut(parseFormattedBalance(value[0],  token0.decimals), result)
                        .then(result => {
                            setValue([value[0], formatBalance(result[result.length - 1], 4, token1?.decimals ?? 18)]);
                            setLoading([false, false]);
                        });
                    });
            }
    }, [token0, token1, value[0], swapType, setLoading]);

    useEffect(() => {
        console.log("useEffect", swapType, value[1]);
        if (swapType === SwapType.EXACT_OUT) {
            if (value[1] === '0') {
                setPath([]);
                return;
            }
            console.log("useEffect", swapType, value[1]);
            setLoading([true, false]);
            getBestPathWithExactOut(token0.address, token1.address, parseFormattedBalance(value[1], token1.decimals))
                .then(result => {
                    setPath(result);

                    getAmountsIn(parseFormattedBalance(value[1], token1.decimals), result).then(result => {
                        setValue([formatBalance(result[0], 4, token0?.decimals ?? 18), value[1]]);
                        setLoading([false, false]);
                    }).catch(e => {
                        console.log(e);
                    })
                });
        } 
    
}, [token0, token1, value[1], swapType]);


    const changeSwapType = (swapType: SwapType, ) => {
        setSwapType(swapType);
    } 

    return {
        value,
        setValue,
        token0,
        setToken0,
        token1,
        setToken1,
        changeSwapType,
        loading,
        path
    }

};