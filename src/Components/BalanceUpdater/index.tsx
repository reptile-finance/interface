import { useRecoilState } from 'recoil';
import { BalanceState } from '../../State/Balance';
import { useCallback, useEffect } from 'react';
import { useBalances } from '../../Hooks/useBalances';
import { useInterval } from 'usehooks-ts';
import { EthAddress } from '../../Types';

export const BalanceUpdater = () => {
    const [, setBalances] = useRecoilState(BalanceState);
    const { getBalances } = useBalances();

    const update = useCallback(async () => {
        getBalances().then((balances) => {
            const balancesObj = balances.reduce<{ [addr: EthAddress]: string }>((acc, balance) => {
                acc[balance.address] = balance.balance;
                return acc;
            }, {});
            setBalances(balancesObj);
        });
    }, [getBalances, setBalances]);

    useInterval(() => {
        update();
    }, 5000);

    useEffect(() => {
        update();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
};
