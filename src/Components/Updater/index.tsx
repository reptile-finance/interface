import { useRecoilState } from 'recoil';
import { BalanceState } from '../../State/Balance';
import { useCallback, useEffect } from 'react';
import { useBalances } from '../../Hooks/useBalances';
import { useInterval } from 'usehooks-ts';
import { EthAddress } from '../../Types';
import { useConfig } from '../../Hooks/useConfig';
import { useNetwork } from 'wagmi';
import { ConfigState } from '../../State/Config';
import { PoolsState } from '../../State/Pools';
import { usePools } from '../../Hooks/usePools';

export const Updater = () => {
    const { updateAppConfig, config } = useConfig();
    const [, setBalances] = useRecoilState(BalanceState);
    const [, setPools] = useRecoilState(PoolsState);
    const { getBalances } = useBalances();
    const { chain } = useNetwork();
    const { getPools } = usePools();
    const [, setConfig] = useRecoilState(ConfigState);

    const updateBalances = useCallback(async () => {
        getBalances().then((balances) => {
            const balancesObj = balances.reduce<{ [addr: EthAddress]: string }>((acc, balance) => {
                acc[balance.address] = balance.balance;
                return acc;
            }, {});
            if (balances.length === 0) return;
            const chainId = balances[0].chainId;
            setBalances((st) => ({
                ...st,
                [chainId]: balancesObj,
            }));
        });
    }, [getBalances, setBalances]);

    const updatePools = useCallback(async () => {
        getPools().then((pools) => {
            const chainId = config.chainId;
            const poolsObj = pools.reduce<{ [poolAddr: EthAddress]: { token0: EthAddress; token1: EthAddress } }>(
                (acc, pool) => {
                    acc[pool[2]] = {
                        token0: pool[0],
                        token1: pool[1],
                    };
                    return acc;
                },
                {},
            );
            setPools((st) => ({
                ...st,
                [chainId]: poolsObj,
            }));
        });
    }, [config, getPools, setPools]);

    useInterval(() => {
        updateBalances();
    }, 5000);

    useInterval(() => {
        // updatePools();
    }, 10_000);

    useEffect(() => {
        updateAppConfig();
        updateBalances();
        updatePools();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (chain && config.chainId !== chain.id.toString() && Object.keys(config.appConfig).length > 0) {
            if (config.appConfig[chain.id.toString()]) {
                setConfig((st) => ({
                    ...st,
                    chainId: chain.id.toString(),
                }));
            }
        }
    }, [chain, config.appConfig, config.chainId, setConfig]);

    return <></>;
};
