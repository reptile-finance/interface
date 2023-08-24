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
import { BN, isNaN, toPresentationLength } from '../../Utils/Bignumber';
import { useRemoveLiquidity } from './useRemoveLiquidity';
import { eventBus } from '../../Bus';
import { Notification } from '../Notifications';
import { waitForTransaction } from 'wagmi/actions';
import { useConfig } from '../../Hooks/useConfig';

const STATES: { [state: string]: string } = {
    APPROVE: 'Approve',
    WRONG_AMOUNT: 'Wrong amount',
    ADD_LIQUIDITY: 'Remove liquidity',
};

export const RemoveLiquidity: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    token0: EthAddress;
    token1: EthAddress;
    pool: EthAddress;
}> = ({ isOpen, onClose, token0, token1, pool }) => {
    const { isEnoughAllowance, setValue, value, token0Data, token1Data, approveLpToken, removeLiquidity } =
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

    const aToB = useMemo(() => {
        if (!data) return '0';
        return BN(data[0].toString()).div(BN(data[1].toString())).toFixed();
    }, [data]);

    const bToA = useMemo(() => {
        if (!data) return '0';
        return BN(data[1].toString()).div(BN(data[0].toString())).toFixed();
    }, [data]);

    const token0Return = useMemo(() => {
        if (!data) return '0';
        const val = BN(value ? value : '0')
            .times(BN(aToB))
            .dp(10)
            .toFixed();
        return isNaN(val) ? '0' : val;
    }, [aToB, data, value]);

    const token1Return = useMemo(() => {
        if (!data) return '0';
        const val = BN(value ? value : '0')
            .times(BN(bToA))
            .dp(10)
            .toFixed();
        return isNaN(val) ? '0' : val;
    }, [bToA, data, value]);

    const state = useMemo((): keyof typeof STATES => {
        if ((balanceData && value && BN(balanceData.formatted).lt(BN(value))) || !value || BN(value).isZero())
            return 'WRONG_AMOUNT';
        if (!isEnoughAllowance) return 'APPROVE';
        return 'ADD_LIQUIDITY';
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
                        amount0Min: aToB,
                        amount1Min: bToA,
                        liquidity: value,
                    }).then((hash) => waitForTransaction({ hash, chainId: activeChainConfig.id }));
                    break;
            }
        } catch (e) {
            console.error(e);
            eventBus.emit('NOTIFICATION', Notification.buildNotification('error', e.shortMessage || e.message));
        } finally {
            setLoading((st) => (st -= 1));
        }
    }, [aToB, activeChainConfig.id, approveLpToken, bToA, removeLiquidity, state, token0, token1, value]);

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
