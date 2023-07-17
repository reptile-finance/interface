import { useCallback, useEffect, useMemo, useState } from 'react';
import { EthAddress } from '../Types';
import { fetchToken } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import { zeroAddress } from 'viem';
import { useRecoilState } from 'recoil';
import { TokensState } from '../State/Tokens';

export const useToken = ({ address }: { address: EthAddress | undefined }) => {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [tokens, setTokens] = useRecoilState(TokensState);
    const { chain } = useNetwork();

    const fetchData = useCallback(() => {
        if (isLoading) return;
        if (!address || !chain) return;
        setLoading(true);

        if (address === zeroAddress) {
            setTokens((st) => ({
                ...st,
                [zeroAddress.toLowerCase() as EthAddress]: {
                    decimals: chain.nativeCurrency.decimals,
                    name: chain.nativeCurrency.name,
                    symbol: chain.nativeCurrency.symbol,
                    address: zeroAddress.toLowerCase() as EthAddress,
                },
            }));
            setLoading(false);
            return;
        }

        fetchToken({ address })
            .then((data) => {
                setTokens((st) => ({
                    ...st,
                    [address.toLowerCase() as EthAddress]: {
                        decimals: data.decimals,
                        name: data.name,
                        symbol: data.symbol,
                        address: data.address.toLowerCase() as EthAddress,
                    },
                }));
            })
            .catch((err) => {
                setError(true);
                throw err;
            })
            .finally(() => {
                setLoading(false);
            });
    }, [address, chain, isLoading, setTokens]);

    useEffect(() => {
        if (!address) return;
        if (tokens[address.toLowerCase() as EthAddress]) return;
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chain]);

    const data = useMemo(() => {
        if (!address) return undefined;
        return tokens[address.toLowerCase() as EthAddress];
    }, [tokens, address]);

    return { isLoading, isError, data };
};
