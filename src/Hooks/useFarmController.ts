import { useCallback, useEffect, useState } from 'react';
import { AsyncResult, initialAsyncResultValue } from '../Utils/AsyncResult';
import { useChainId, usePublicClient } from 'wagmi';
import FarmControllerAbi from '../ABI/FarmController.json';
import { readContract } from 'viem/contract';
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
        const totalAllocatedPoints = await readContract(publicClient, {
            address: config.farmController,
            functionName: 'totalAllocatedPoints',
            abi: FarmControllerAbi,
        });

        const totalRewardPerBlock = await readContract(publicClient, {
            address: config.farmController,
            functionName: 'totalRewardPerBlock',
            abi: FarmControllerAbi,
        });

        return { totalAllocatedPoints, totalRewardPerBlock } as FarmControllerData;
    }, [config.farmController, publicClient]);

    useEffect(() => {
        setResult(initialAsyncResultValue);
        fetchFarmControllerData()
            .then((data) => setResult({ result: data, loading: false, error: null }))
            .catch((error) => {
                console.error(error);
                setResult({ result: undefined, loading: false, error });
            });
    }, [fetchFarmControllerData, setResult]);

    return result;
};
