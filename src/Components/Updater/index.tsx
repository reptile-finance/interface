import { useRecoilState } from 'recoil';
import { BalanceState } from '../../State/Balance';
import { useCallback, useEffect } from 'react';
import { useBalances } from '../../Hooks/useBalances';
import { useInterval } from 'usehooks-ts';
import { EthAddress } from '../../Types';
import { useConfig } from '../../Hooks/useConfig';
import { useNetwork } from 'wagmi';
import { ConfigState } from '../../State/Config';

export const Updater = () => {
    const { updateAppConfig, config } = useConfig();
    const [, setBalances] = useRecoilState(BalanceState);
    const { getBalances } = useBalances();
    const { chain } = useNetwork();
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

    useInterval(() => {
        updateBalances();
    }, 5000);

    useEffect(() => {
        updateAppConfig();
        updateBalances();
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
