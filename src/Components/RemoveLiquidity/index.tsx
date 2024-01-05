import { useCallback, useMemo, useState } from 'react';
import { usePool2 } from '../../Hooks/usePool2';
import { EthAddress } from '../../Types';
import { Modal } from '../Modal';
import {
    RemoveLiquidityActionButton,
    RemoveLiquidityBoxToken,
    RemoveLiquidityExchangeWrapper,
    RemoveLiquidityInputNumber,
    RemoveLiquidityInputTokenBalances,
    RemoveLiquidityWrapper,
} from './Styles';
import { useAccount, useBalance } from 'wagmi';
import { BN, formatBalance, isNaN, parseFormattedBalance, toPresentationLength } from '../../Utils/Bignumber';
import { useRemoveLiquidity } from './useRemoveLiquidity';
import { eventBus } from '../../Bus';
import { Notification } from '../Notifications';
import { waitForTransaction } from 'wagmi/actions';
import { useConfig } from '../../Hooks/useConfig';

const STATES: { [state: string]: string } = {
    APPROVE: 'Approve',
    WRONG_AMOUNT: 'Wrong amount',
    REMOVE_LIQUIDITY: 'Remove liquidity',
};

export const RemoveLiquidity: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    token0: EthAddress;
    token1: EthAddress;
    pool: EthAddress;
}> = ({ isOpen, onClose, token0, token1, pool }) => {
    const { isEnoughAllowance, setValue, value, token0Data, token1Data, poolToken, approveLpToken, removeLiquidity } =
        useRemoveLiquidity(pool, token0, token1);
    const [loading, setLoading] = useState(0);
    const account = useAccount();
    const { activeChainConfig } = useConfig();
    const { data } = usePool2({
        token0: token0,
        token1: token1,
    });
    const { data: balanceData } = useBalance({
        token: pool,
        address: account.address,
    });

    const token0Return = useMemo(() => {
        if (!data || !poolToken || !value) return '0';
        const formatted = parseFormattedBalance(value, poolToken.decimals);
        const val = BN(formatted)
            .div(poolToken.totalSupply.value.toString())
            .multipliedBy(data[0].toString())
            .dp(10)
            .toFixed();
        return isNaN(val) ? '0' : formatBalance(val, token0Data?.decimals);
    }, [data, poolToken, token0Data?.decimals, value]);

    const token1Return = useMemo(() => {
        if (!data || !poolToken || !value) return '0';
        const formatted = parseFormattedBalance(value, poolToken.decimals);
        const val = BN(formatted)
            .div(poolToken.totalSupply.value.toString())
            .multipliedBy(data[1].toString())
            .dp(10)
            .toFixed();
        return isNaN(val) ? '0' : formatBalance(val, token1Data?.decimals);
    }, [data, poolToken, token1Data?.decimals, value]);

    const state = useMemo((): keyof typeof STATES => {
        if ((balanceData && value && BN(balanceData.formatted).lt(BN(value))) || !value || BN(value).isZero())
            return 'WRONG_AMOUNT';
        if (!isEnoughAllowance) return 'APPROVE';
        return 'REMOVE_LIQUIDITY';
    }, [balanceData, isEnoughAllowance, value]);

    const onSubmit = useCallback(async () => {
        setLoading((st) => (st += 1));
        try {
            switch (state) {
                case 'APPROVE':
                    await approveLpToken();
                    break;
                case 'REMOVE_LIQUIDITY':
                    await removeLiquidity({
                        token0,
                        token1,
                        amount0Min: token0Return,
                        amount1Min: token1Return,
                        liquidity: value,
                    }).then(({ hash }) => waitForTransaction({ hash, chainId: activeChainConfig.id }));
                    break;
            }
        } catch (e) {
            console.error(e);
            eventBus.emit('NOTIFICATION', Notification.buildNotification('error', e.shortMessage || e.message));
        } finally {
            setLoading((st) => (st -= 1));
        }
    }, [
        activeChainConfig.id,
        approveLpToken,
        removeLiquidity,
        state,
        token0,
        token0Return,
        token1,
        token1Return,
        value,
    ]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Remove Liquidity">
            <RemoveLiquidityWrapper>
                <RemoveLiquidityInputTokenBalances>
                    <RemoveLiquidityBoxToken>
                        <img src="/custom-token.png" alt="BNB" />
                        {token0Data?.symbol}-{token1Data?.symbol} LP
                    </RemoveLiquidityBoxToken>
                    <span>Balance: {toPresentationLength(balanceData.formatted ?? '0')}</span>
                </RemoveLiquidityInputTokenBalances>
                <RemoveLiquidityInputNumber>
                    <input
                        type="decimals"
                        placeholder="0.0"
                        value={value}
                        onChange={(evt) => setValue(evt.currentTarget.value)}
                    />
                </RemoveLiquidityInputNumber>
                <RemoveLiquidityExchangeWrapper>
                    <div>You will get</div>
                    <div>
                        <span>{token0Data?.symbol}</span>
                        <span>
                            {token0Return} {token0Data?.symbol}
                        </span>
                    </div>
                    <div>
                        <span>{token1Data?.symbol}</span>
                        <span>
                            {token1Return} {token1Data?.symbol}
                        </span>
                    </div>
                </RemoveLiquidityExchangeWrapper>
                <div>
                    <RemoveLiquidityActionButton loading={(loading > 0).toString()} onClick={onSubmit}>
                        {STATES[state]}
                    </RemoveLiquidityActionButton>
                </div>
            </RemoveLiquidityWrapper>
        </Modal>
    );
};
