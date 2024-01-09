import { useCallback, useEffect, useState } from 'react';
import { AsyncResult, initialAsyncResultValue } from '../Utils/AsyncResult';
import { useChainId, usePublicClient, useWalletClient } from 'wagmi';
import FarmControllerAbi from '../ABI/FarmController.json';
import { readContract, writeContract } from 'viem/contract';
import { Config } from '../Config';

interface FarmControllerData {
    totalAllocatedPoints: bigint;
    totalRewardPerBlock: bigint;
}

export const useFarmController = () => {
    const [result, setResult] = useState<AsyncResult<FarmControllerData>>(initialAsyncResultValue);
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const walletClient = useWalletClient();

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

    const stake = useCallback(
        async (farmIndex: number, amount: bigint) => {
            const tx = writeContract(walletClient.data, {
                functionName: 'deposit',
                abi: FarmControllerAbi,
                address: config.farmController,
                chain: null,
                args: [farmIndex, amount],
            });

            return tx;
        },
        [config.farmController, walletClient.data],
    );

    const unstake = useCallback(
        async (farmIndex: number, amount: bigint) => {
            const tx = writeContract(walletClient.data, {
                functionName: 'withdraw',
                abi: FarmControllerAbi,
                address: config.farmController,
                chain: null,
                args: [farmIndex, amount],
            });

            return tx;
        },
        [config.farmController, walletClient.data],
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
