import { SwapBoxToken, SwapInputBox, SwapInputNumber, SwapInputTokenBalances } from './Styles';
import { useBalances } from '../../Hooks/useBalances';
import { useMemo, useState } from 'react';
import { formatBalance } from '../../Utils/Bignumber';
import { TokenSelector } from '../TokenSelector';
import { EthAddress } from '../../Types';
import { useToken } from '../../Hooks/useToken';

export const SwapBox: React.FC<{ defaultToken?: EthAddress }> = ({ defaultToken }) => {
    const { getBalance } = useBalances();
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [token, setToken] = useState<EthAddress | undefined>(defaultToken ?? undefined);
    const { data, isLoading, isError } = useToken({
        address: token,
    });

    const balance = useMemo(() => {
        if (!token) return '0';
        return formatBalance(getBalance(token), 4, data?.decimals ?? 18);
    }, [data, getBalance, token]);

    const BalanceInfo = useMemo(() => {
        if (isLoading || !data || isError) {
            return () => (
                <>
                    <span>Loading...</span>
                </>
            );
        }
        return () => (
            <>
                <SwapBoxToken onClick={() => setSelectorOpen(true)}>
                    <img src="/custom-token.png" />
                    {data.symbol}
                </SwapBoxToken>
                <span>Balance: {balance}</span>
            </>
        );
    }, [balance, data, isError, isLoading]);

    return (
        <>
            <SwapInputBox>
                <SwapInputTokenBalances>
                    <BalanceInfo />
                </SwapInputTokenBalances>
                <SwapInputNumber>
                    <input type="decimals" placeholder="0.0" />
                </SwapInputNumber>
            </SwapInputBox>
            <TokenSelector
                open={selectorOpen}
                setOpen={(isOpen) => setSelectorOpen(isOpen)}
                setToken={(token) => setToken(token)}
            />
        </>
    );
};
