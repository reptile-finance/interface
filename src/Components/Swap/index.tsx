import { zeroAddress } from 'viem';
import { SwapActionButton, SwapActionButtonWrapper, SwapHeader, SwapWrapper } from './Styles';
import { SwapBox, SwapBoxOutput } from './SwapBox';
import { SwapDetail } from './SwapDetail';
import { usePathFinder } from "../../Hooks/usePathFinder";
import { useEffect, useState } from 'react';
import { EthAddress } from '../../Types';
import { useRouter } from '../../Hooks/useRouter';
import { useToken } from '../../Hooks/useToken';
import { formatBalance, parseFormattedBalance } from '../../Utils/Bignumber';

enum SwapType {
    EXACT_TOKENS_FOR_TOKENS,
    TOKENS_FOR_EXACT_TOKENS,
}

export const Swap = () => {
    const { getBestPathWithWithExactIn } = usePathFinder();
    const { getAmountsOut } = useRouter();

    const [tokenIn, setTokenIn] = useState<EthAddress | undefined>(zeroAddress);
    const [amountIn, setAmountIn] = useState<string | undefined>();
    const [tokenDest, setTokenDest] = useState<EthAddress | undefined>(zeroAddress);
    const [amountDest, setAmountDest] = useState<string | undefined>();
    const [swapType, setSwapType] = useState<SwapType>(SwapType.EXACT_TOKENS_FOR_TOKENS);
    const [path, setPath] = useState<EthAddress[] | undefined>();

    const { data: tokenInData } = useToken({
        address: tokenIn,
    });

    const { data: tokenDestData } = useToken({
        address: tokenDest,
    });




    const handleTokenInChange = (token: SwapBoxOutput) => {
        setTokenIn(token.token);
        setAmountIn(token.amount);
    }

    const handleTokenDestChange = (token: SwapBoxOutput) => {
        setTokenDest(token.token);
        setAmountDest(token.amount);
    }

    useEffect(() => {

        if (swapType === SwapType.EXACT_TOKENS_FOR_TOKENS) {

            getBestPathWithWithExactIn(tokenIn, tokenDest, parseFormattedBalance(amountIn, tokenInData.decimals))
                .then((path) => {
                    setPath(path);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    }, [tokenIn, tokenDest, amountIn, amountDest, swapType]);

    useEffect(() => {
        getAmountsOut(amountIn, path)
    }, [path]);


    return (
        <SwapWrapper>
            <SwapHeader>
                <span className="swap">Swap</span>
            </SwapHeader>
            <SwapBox value = {{token: tokenIn, amount: amountIn}} onChange={handleTokenInChange} />
            <SwapBox value={{token: tokenDest, amount: amountDest}} onChange={handleTokenDestChange}/>
            <SwapDetail />
            <SwapActionButtonWrapper>
                <SwapActionButton>Swap</SwapActionButton>
            </SwapActionButtonWrapper>
        </SwapWrapper>
    );
};
