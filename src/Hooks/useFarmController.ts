import { useCallback, useEffect, useState } from 'react';
import { AsyncResult, initialAsyncResultValue } from '../Utils/AsyncResult';
import { useChainId, usePublicClient } from 'wagmi';
import FarmControllerAbi from '../ABI/FarmController.json';
import { readContract, writeContract } from 'wagmi/actions';
import { Config } from '../Config';

interface FarmControllerData {
    totalAllocatedPoints: bigint;
    totalRewardPerBlock: bigint;
}

export const useFarmController = () => {
    const [result, setResult] = useState<AsyncResult<FarmControllerData>>(initialAsyncResultValue);
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const config = Config[chainId];

    const fetchFarmControllerData = useCallback(async () => {
        const totalAllocatedPoints = await publicClient.readContract({
            address: config.farmController,
            functionName: 'totalAllocatedPoints',
            abi: FarmControllerAbi,
        });
        const totalRewardPerBlock = await publicClient.readContract({
            address: config.farmController,
            functionName: 'totalRewardPerBlock',
            abi: FarmControllerAbi,
        });
        return { totalAllocatedPoints, totalRewardPerBlock } as FarmControllerData;
    }, [config.farmController, publicClient]);

    const stake = useCallback(
        async (farmIndex: number, amount: bigint) => {
            const tx = writeContract({
                functionName: 'deposit',
                abi: FarmControllerAbi,
                address: config.farmController,
                chain: null,
                args: [farmIndex, amount],
            });

            return tx;
        },
        [config.farmController],
    );

    const unstake = useCallback(
        async (farmIndex: number, amount: bigint) => {
            const tx = writeContract({
                functionName: 'withdraw',
                abi: FarmControllerAbi,
                address: config.farmController,
                chain: null,
                args: [farmIndex, amount],
            });

            return tx;
        },
        [config.farmController],
    );

    useEffect(() => {
        setResult(initialAsyncResultValue);
        fetchFarmControllerData()
            .then((data) => setResult({ result: data, loading: false, error: null }))
            .catch((error) => {
                console.error(error);
                setResult({ result: undefined, loading: false, error });
            });
    }, [fetchFarmControllerData, setResult]);

    return { data: result, stake, unstake, address: config.farmController };
};
