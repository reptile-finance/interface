import { SwapBoxToken, SwapInputBox, SwapInputNumber, SwapInputTokenBalances } from './Styles';
import { useBalances } from '../../Hooks/useBalances';
import { useEffect, useMemo, useState } from 'react';
import { formatBalance } from '../../Utils/Bignumber';
import { TokenSelector } from '../TokenSelector';
import { EthAddress } from '../../Types';
import { useToken } from '../../Hooks/useToken';

export interface SwapBoxData {
    token: EthAddress;
    amount: string;
}

export const SwapBox: React.FC<{ value: SwapBoxData, onChange: (_: SwapBoxData) => void }> = ({ value, onChange }) => {
    const { getBalance } = useBalances();
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [amount, setAmount] = useState<string | undefined>();
    const [token, setToken] = useState<EthAddress | undefined>(value.token ?? undefined);
    const { data, isLoading, isError } = useToken({
        address: token,
    });

    useEffect(() => {
        if (token) {
            onChange({
                token,
                amount: amount ?? '0',
            });
        }
    }, [token, amount]);

    const balance = useMemo(() => {
        if (!token) return '0';
        return formatBalance(getBalance(token), 4, data?.decimals ?? 18);
    }, [data, getBalance, token]);


    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    }

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
                    <input type="decimals" placeholder="0.0" value={amount} onChange={handleAmountChange}/>
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
