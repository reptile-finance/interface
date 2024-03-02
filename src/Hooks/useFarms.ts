import { useChainId, usePublicClient } from 'wagmi';
import { Config } from '../Config';
import { useCallback, useEffect, useState } from 'react';
import FarmControllerAbi from '../ABI/FarmController.json';
import ERC20Abi from '../ABI/ERC20.json';
import { EncodedFarmInfo, FarmInfo } from '../Models/FarmInfo';
import { AsyncResult, initialAsyncResultValue } from '../Utils/AsyncResult';

interface Farm extends FarmInfo {
    totalStake: bigint;
    lpTokenSymbol: string;
}

export const useFarms = () => {
    const [result, setResult] = useState<AsyncResult<Farm[]>>(initialAsyncResultValue);
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const config = Config[chainId];

    const fetchFarms = useCallback(async () => {
        const farms: Farm[] = [];
        do {
            const poolInfo = await publicClient
                .readContract({
                    address: config.farmController,
                    functionName: 'poolInfo',
                    args: [farms.length],
                    abi: FarmControllerAbi,
                })
                .then((e) => e as EncodedFarmInfo)
                .then(([lpToken, allocPoint, lastRewardBlock, accCakePerShare]) => ({
                    lpToken,
                    allocPoint,
                    lastRewardBlock,
                    accCakePerShare,
                }))
                .then(async (farmInfo) => {
                    const totalStake = await publicClient.readContract({
                        address: farmInfo.lpToken,
                        functionName: 'balanceOf',
                        args: [config.farmController],
                        abi: ERC20Abi,
                    });

                    const lpTokenSymbol = await publicClient.readContract({
                        address: farmInfo.lpToken,
                        functionName: 'symbol',
                        args: [],
                        abi: ERC20Abi,
                    });

                    return {
                        ...farmInfo,
                        totalStake,
                        lpTokenSymbol,
                    };
                })
                .catch(() => null);
            farms.push(poolInfo);
        } while (farms[farms.length - 1] !== null);
        return farms.slice(0, -1);
    }, [config.farmController, publicClient]);

    useEffect(() => {
        setResult(initialAsyncResultValue);
        fetchFarms()
            .then((farms) => setResult({ result: farms, loading: false, error: null }))
            .catch((error) => setResult({ result: undefined, loading: false, error }));
    }, [fetchFarms, setResult]);

    return result;
};
