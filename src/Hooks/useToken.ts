import { useCallback, useEffect, useMemo, useState } from 'react';
import { EthAddress } from '../Types';
import { fetchToken } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import { zeroAddress } from 'viem';
import { useRecoilState } from 'recoil';
import { TokensState } from '../State/Tokens';
import { useConfig } from './useConfig';

export const useToken = ({ address }: { address: EthAddress | undefined }) => {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [tokens, setTokens] = useRecoilState(TokensState);
    const { chains } = useNetwork();
    const { config } = useConfig();

    const fetchData = useCallback(() => {
        if (isLoading) return;
        const chainCfg = chains.find((c) => c.id.toString() === config.chainId);
        if (!address || !chainCfg) return;
        setLoading(true);

        if (address === zeroAddress) {
            setTokens((st) => ({
                ...st,
                [config.chainId]: {
                    ...st[config.chainId],
                    [zeroAddress.toLowerCase() as EthAddress]: {
                        decimals: chainCfg.nativeCurrency.decimals,
                        name: chainCfg.nativeCurrency.name,
                        symbol: chainCfg.nativeCurrency.symbol,
                        address: zeroAddress.toLowerCase() as EthAddress,
                    },
                },
            }));
            setLoading(false);
            return;
        }

        fetchToken({ address, chainId: Number(config.chainId) })
            .then((data) => {
                setTokens((st) => ({
                    ...st,
                    [config.chainId]: {
                        ...st[config.chainId],
                        [address.toLowerCase() as EthAddress]: {
                            decimals: data.decimals,
                            name: data.name,
                            symbol: data.symbol,
                            address: data.address.toLowerCase() as EthAddress,
                        },
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
    }, [address, chains, config.chainId, isLoading, setTokens]);

    useEffect(() => {
        if (!address) return;
        if (tokens[config.chainId][address.toLowerCase() as EthAddress]) return;
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chains]);

    const data = useMemo(() => {
        if (!address) return undefined;
        return tokens[config.chainId][address.toLowerCase() as EthAddress];
    }, [address, tokens, config.chainId]);

    return { isLoading, isError, data };
};
