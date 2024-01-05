import {
    AddLiquidityBoxToken,
    AddLiquidityInputBox,
    AddLiquidityInputNumber,
    AddLiquidityInputTokenBalances,
} from './Styles';
import { useBalances } from '../../Hooks/useBalances';
import { useEffect, useMemo, useState } from 'react';
import { formatBalance } from '../../Utils/Bignumber';
import { TokenSelector } from '../TokenSelector';
import { EthAddress, TokenMetadata } from '../../Types';
import { useToken } from '../../Hooks/useToken';

export const AddLiquidityBox: React.FC<{
    defaultToken?: EthAddress;
    onTokenChange?: (token: TokenMetadata) => void;
    onChange?: (v: string) => void;
    value: string;
}> = ({ defaultToken, value, onChange, onTokenChange }) => {
    const { getBalance } = useBalances();
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [token, setToken] = useState<EthAddress | undefined>(defaultToken ?? undefined);
    const { data, isLoading, isError } = useToken({
        address: token,
    });

    const balance = useMemo(() => {
        if (!token) return '0';
        return formatBalance(getBalance(token), data?.decimals ?? 18);
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
                <AddLiquidityBoxToken onClick={() => setSelectorOpen(true)}>
                    <img src="/custom-token.png" />
                    {data.symbol}
                </AddLiquidityBoxToken>
                <span>Balance: {balance}</span>
            </>
        );
    }, [balance, data, isError, isLoading]);

    useEffect(() => {
        if (token) {
            onTokenChange && onTokenChange(data);
        }
    }, [data, onTokenChange, token]);

    return (
        <>
            <AddLiquidityInputBox>
                <AddLiquidityInputTokenBalances>
                    <BalanceInfo />
                </AddLiquidityInputTokenBalances>
                <AddLiquidityInputNumber>
                    <input
                        type="decimals"
                        placeholder="0.0"
                        value={value}
                        onChange={(evt) => onChange(evt.currentTarget.value)}
                    />
                </AddLiquidityInputNumber>
            </AddLiquidityInputBox>
            <TokenSelector
                open={selectorOpen}
                setOpen={(isOpen) => setSelectorOpen(isOpen)}
                setToken={(token) => setToken(token)}
            />
        </>
    );
};
