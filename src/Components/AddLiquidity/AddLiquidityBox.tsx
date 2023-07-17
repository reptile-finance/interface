import {
    AddLiquidityBoxToken,
    AddLiquidityInputBox,
    AddLiquidityInputNumber,
    AddLiquidityInputTokenBalances,
} from './Styles';
import { useBalances } from '../../Hooks/useBalances';
import { useMemo, useState } from 'react';
import { formatBalance } from '../../Utils/Bignumber';
import { TokenSelector } from '../TokenSelector';
import { EthAddress } from '../../Types';
import { useToken } from '../../Hooks/useToken';

export const AddLiquidityBox: React.FC<{ defaultToken?: EthAddress }> = ({ defaultToken }) => {
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
                <AddLiquidityBoxToken onClick={() => setSelectorOpen(true)}>
                    <img src="/custom-token.png" />
                    {data.symbol}
                </AddLiquidityBoxToken>
                <span>Balance: {balance}</span>
            </>
        );
    }, [balance, data, isError, isLoading]);

    return (
        <>
            <AddLiquidityInputBox>
                <AddLiquidityInputTokenBalances>
                    <BalanceInfo />
                </AddLiquidityInputTokenBalances>
                <AddLiquidityInputNumber>
                    <input type="decimals" placeholder="0.0" />
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
