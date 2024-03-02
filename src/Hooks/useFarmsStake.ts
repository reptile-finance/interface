import { useCallback, useEffect, useState } from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { AsyncResult, initialAsyncResultValue } from '../Utils/AsyncResult';
import { useFarms } from './useFarms';
import FarmControllerAbi from '../ABI/FarmController.json';
import { Config } from '../Config';
import { EncodedUserInfo, UserInfo } from '../Models/UserInfo';

type UserStake = UserInfo;

type UserFarmStakeInfo = UserStake[];

export const useFarmsStake = () => {
    const publicClient = usePublicClient();
    const chainId = useChainId();
    const { address } = useAccount();
    const { result: farms } = useFarms();
    const config = Config[chainId];
    const [result, setResult] = useState<AsyncResult<UserFarmStakeInfo>>(initialAsyncResultValue);

    const fetchFarmStakeInfo = useCallback(
        async (i: number) => {
            if (!address || !farms) return { amount: 0n, rewardDebt: 0n };
            return publicClient
                .readContract({
                    address: config.farmController,
                    functionName: 'usersInfo',
                    args: [i, address],
                    abi: FarmControllerAbi,
                })
                .then((e) => {
                    const [amount, rewardDebt] = e as EncodedUserInfo;
                    return { amount, rewardDebt };
                });
        },
        [address, config.farmController, farms, publicClient],
    );

    useEffect(() => {
        if (!farms || farms.length === 0) return;
        setResult(initialAsyncResultValue);
        const promises = farms.map((_, i) => fetchFarmStakeInfo(i));
        Promise.all(promises).then((data) => setResult({ result: data, loading: false, error: null }));
    }, [farms, fetchFarmStakeInfo, setResult]);

    return result;
};
