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
import { useUniswap } from '../../Hooks/useUniswap';
import { eventBus } from '../../Bus';
import { Notification } from '../Notifications';
import { erc20ABI, useContractReads, useWalletClient } from 'wagmi';
import { useConfig } from '../../Hooks/useConfig';
import { Config } from '../../Config';
import { BN, parseFormattedBalance } from '../../Utils/Bignumber';
import { useERC20 } from '../../Hooks/useERC20';
import { waitForTransaction } from 'wagmi/actions';

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
    const { addLiquidity } = useUniswap();
    const [value0, setValue0] = useState('');
    const [value1, setValue1] = useState('');
    const [token0, setToken0] = useState<TokenMetadata | undefined>(undefined);
    const [token1, setToken1] = useState<TokenMetadata | undefined>(undefined);
    const { activeChainConfig } = useConfig();
    const { data: wallet } = useWalletClient();
    const { approve } = useERC20();
    const [loading, setLoading] = useState(0);

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
        const amount = parseFormattedBalance(value0, token0.decimals);
        return allowance && BN(allowance.result.toString()).gte(BN(amount));
    }, [allowances, token0, value0]);

    const isEnoughAllowance1 = useMemo(() => {
        if (!allowances || !token1) return false;
        if (token1.address === zeroAddress) return true;
        const allowance = allowances.length > 1 ? allowances[1] : allowances[0];
        const amount = parseFormattedBalance(value1, token1.decimals);
        return allowance && BN(allowance.result.toString()).gte(BN(amount));
    }, [allowances, token1, value1]);

    const state = useMemo((): keyof typeof STATES => {
        if (token0 === token1 || !token0 || !token1) return 'WRONG_TOKENS';
        if (!isEnoughAllowance0 || !isEnoughAllowance1) return 'APPROVE';
        return 'ADD_LIQUIDITY';
    }, [isEnoughAllowance0, isEnoughAllowance1, token0, token1]);

    const approveTokens = useCallback(async () => {
        if (!token0 || !token1) return;
        const promises: Promise<void>[] = [];
        if (!isEnoughAllowance0) {
            const amount = parseFormattedBalance(value0, token0.decimals);
            const p = approve(token0.address, uniswapConfig.router, amount).then((hash) =>
                waitForTransaction({ hash, chainId: activeChainConfig.id }),
            );
            promises.push(p);
        }
        if (!isEnoughAllowance1) {
            const amount = parseFormattedBalance(value1, token1.decimals);
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
        value0,
        value1,
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
                        amount0Desired: value0,
                        amount1Desired: value1,
                    }).then((hash) => waitForTransaction({ hash, chainId: activeChainConfig.id }));
                    break;
            }
        } catch (e) {
            console.error(e);
            eventBus.emit('NOTIFICATION', Notification.buildNotification('error', e.shortMessage || e.message));
        } finally {
            setLoading((st) => (st -= 1));
        }
    }, [activeChainConfig.id, addLiquidity, approveTokens, state, token0.address, token1.address, value0, value1]);

    const buttonText = useMemo(() => {
        if (loading > 0) return 'Loading...';
        return STATES[state];
    }, [loading, state]);

    return (
        <AddLiquidityWrapper>
            <AddLiquidityHeader>
                <span className="swap">Add Liquidity</span>
            </AddLiquidityHeader>
            <AddLiquidityBox defaultToken={zeroAddress} value={value0} onChange={setValue0} onTokenChange={setToken0} />
            <AddLiquidityBox defaultToken={zeroAddress} value={value1} onChange={setValue1} onTokenChange={setToken1} />
            <AddLiquidityActionButtonWrapper>
                <AddLiquidityActionButton loading={loading > 0} onClick={onSubmit}>
                    {buttonText}
                </AddLiquidityActionButton>
            </AddLiquidityActionButtonWrapper>
        </AddLiquidityWrapper>
    );
};
