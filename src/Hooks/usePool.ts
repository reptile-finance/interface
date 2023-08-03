import { useCallback, useEffect, useMemo, useState } from 'react';
import { EthAddress } from '../Types';
import { readContract } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import { useConfig } from './useConfig';
import UniswapV2PairABI from '../ABI/UniswapV2Pair.json';

export const usePool = ({ address }: { address: EthAddress | undefined }) => {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const { chains } = useNetwork();
    const { config } = useConfig();
    const [reserves, setReserves] = useState<[string, string]>(['0', '0']);

    const fetchData = useCallback(() => {
        if (isLoading) return;
        const chainCfg = chains.find((c) => c.id.toString() === config.chainId);
        if (!address || !chainCfg) return;
        setLoading(true);

        readContract({
            address,
            abi: UniswapV2PairABI,
            functionName: 'getReserves',
            args: [],
            chainId: Number(chainCfg.id),
        })
            .then((data: [string, string, string]) => {
                setReserves([data[0], data[1]]);
            })
            .catch((err) => {
                setError(true);
                throw err;
            })
            .finally(() => {
                setLoading(false);
            });
    }, [address, chains, config.chainId, isLoading]);

    useEffect(() => {
        if (!address) return;
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chains]);

    const data = useMemo(() => {
        if (!address) return undefined;
        return reserves;
    }, [address, reserves]);

    return { isLoading, isError, data };
};
