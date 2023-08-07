import { useCallback, useMemo, useState } from 'react';
import { zeroAddress } from 'viem';
import {
    AddLiquidityActionButton,
    AddLiquidityActionButtonWrapper,
    AddLiquidityHeader,
    AddLiquidityWrapper,
} from './Styles';
import { AddLiquidityBox } from './AddLiquidityBox';
import { TokenMetadata } from '../../Types';
import { eventBus } from '../../Bus';
import { Notification } from '../Notifications';
import { erc20ABI, useContractReads, useWalletClient } from 'wagmi';
import { useConfig } from '../../Hooks/useConfig';
import { Config } from '../../Config';
import { BN, parseFormattedBalance } from '../../Utils/Bignumber';
import { useERC20 } from '../../Hooks/useERC20';
import { waitForTransaction } from 'wagmi/actions';
import { useLiquidity } from '../../Hooks/useLiquidity';
import { usePool2 } from '../../Hooks/usePool2';

const ERC20Config = {
    abi: erc20ABI,
    functionName: 'allowance',
};

const STATES: { [state: string]: string } = {
    WRONG_TOKENS: 'Choose tokens',
    APPROVE: 'Approve',
    ADD_LIQUIDITY: 'Submit liquidity',
};

export const AddLiquidity = () => {
    const { addLiquidity } = useLiquidity();
    const [value, setValue] = useState<[string, string]>(['', '']);
    const [token0, setToken0] = useState<TokenMetadata | undefined>(undefined);
    const [token1, setToken1] = useState<TokenMetadata | undefined>(undefined);
    const { activeChainConfig } = useConfig();
    const { data: wallet } = useWalletClient();
    const { approve } = useERC20();
    const [loading, setLoading] = useState(0);
    const { data, isError } = usePool2({ token0: token0?.address, token1: token1?.address });

    const uniswapConfig = useMemo(() => {
        return Config[activeChainConfig.id.toString()];
    }, [activeChainConfig.id]);

    const { data: allowances } = useContractReads({
        contracts: [
            {
                ...(token0 && token0.address !== zeroAddress
                    ? {
                          address: token0.address,
                          args: [wallet.account.address, uniswapConfig.router],
                          chainId: activeChainConfig.id,
                          ...ERC20Config,
                      }
                    : {}),
                ...(token1 && token1.address !== zeroAddress
                    ? {
                          address: token1.address,
                          args: [wallet.account.address, uniswapConfig.router],
                          chainId: activeChainConfig.id,
                          ...ERC20Config,
                      }
                    : {}),
            },
        ],
        watch: true,
    });

    const isEnoughAllowance0 = useMemo(() => {
        if (!allowances || !token0) return false;
        if (token0.address === zeroAddress) return true;
        const allowance = allowances[0];
        const amount = parseFormattedBalance(value[0], token0.decimals);
        return allowance && BN(allowance.result.toString()).gte(BN(amount));
    }, [allowances, token0, value]);

    const isEnoughAllowance1 = useMemo(() => {
        if (!allowances || !token1) return false;
        if (token1.address === zeroAddress) return true;
        const allowance = allowances.length > 1 ? allowances[1] : allowances[0];
        const amount = parseFormattedBalance(value[1], token1.decimals);
        return allowance && BN(allowance.result.toString()).gte(BN(amount));
    }, [allowances, token1, value]);

    const state = useMemo((): keyof typeof STATES => {
        if (token0 === token1 || !token0 || !token1) return 'WRONG_TOKENS';
        if (!isEnoughAllowance0 || !isEnoughAllowance1) return 'APPROVE';
        return 'ADD_LIQUIDITY';
    }, [isEnoughAllowance0, isEnoughAllowance1, token0, token1]);

    const approveTokens = useCallback(async () => {
        if (!token0 || !token1) return;
        const promises: Promise<void>[] = [];
        if (!isEnoughAllowance0) {
            const amount = parseFormattedBalance(value[0], token0.decimals);
            const p = approve(token0.address, uniswapConfig.router, amount).then((hash) =>
                waitForTransaction({ hash, chainId: activeChainConfig.id }),
            );
            promises.push(p);
        }
        if (!isEnoughAllowance1) {
            const amount = parseFormattedBalance(value[1], token1.decimals);
            const p = approve(token1.address, uniswapConfig.router, amount).then((hash) =>
                waitForTransaction({ hash, chainId: activeChainConfig.id }),
            );
            promises.push(p);
        }
        return promises;
    }, [
        activeChainConfig.id,
        approve,
        isEnoughAllowance0,
        isEnoughAllowance1,
        token0,
        token1,
        uniswapConfig.router,
        value,
    ]);

    const onSubmit = useCallback(async () => {
        setLoading((st) => (st += 1));
        try {
            switch (state) {
                case 'APPROVE':
                    await approveTokens();
                    break;
                case 'ADD_LIQUIDITY':
                    await addLiquidity({
                        token0: token0.address,
                        token1: token1.address,
                        amount0Desired: value[0],
                        amount1Desired: value[1],
                    }).then((hash) => waitForTransaction({ hash, chainId: activeChainConfig.id }));
                    break;
            }
        } catch (e) {
            console.error(e);
            eventBus.emit('NOTIFICATION', Notification.buildNotification('error', e.shortMessage || e.message));
        } finally {
            setLoading((st) => (st -= 1));
        }
    }, [activeChainConfig.id, addLiquidity, approveTokens, state, token0, token1, value]);

    const buttonText = useMemo(() => {
        if (loading > 0) return 'Loading...';
        return STATES[state];
    }, [loading, state]);

    const setValueFn = useCallback(
        (index: 0 | 1) => (value: string) => {
            if (!isError) {
                // pool exists
                if (index === 0) {
                    const value1 = BN(value)
                        .multipliedBy(BN(data[1].toString() || 0))
                        .div(BN(data[0].toString() || 0))
                        .toFixed();
                    return setValue([value, value1]);
                } else {
                    const value0 = BN(value)
                        .multipliedBy(BN(data[0].toString() || 0))
                        .div(BN(data[1].toString() || 0))
                        .toFixed();
                    return setValue([value0, value]);
                }
            }
            setValue((st) => {
                const newState: [string, string] = [...st];
                newState[index] = value;
                return newState;
            });
        },
        [data, isError],
    );

    return (
        <AddLiquidityWrapper>
            {isError && <div>This LP doesn't exists, you will set the initial price!</div>}
            <AddLiquidityHeader>
                <span className="swap">Add Liquidity</span>
            </AddLiquidityHeader>
            <AddLiquidityBox
                defaultToken={zeroAddress}
                value={value[0]}
                onChange={setValueFn(0)}
                onTokenChange={setToken0}
            />
            <AddLiquidityBox
                defaultToken={zeroAddress}
                value={value[1]}
                onChange={setValueFn(1)}
                onTokenChange={setToken1}
            />
            <AddLiquidityActionButtonWrapper>
                <AddLiquidityActionButton loading={loading > 0} onClick={onSubmit}>
                    {buttonText}
                </AddLiquidityActionButton>
            </AddLiquidityActionButtonWrapper>
        </AddLiquidityWrapper>
    );
};
