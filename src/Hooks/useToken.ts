import { useCallback, useEffect, useMemo, useState } from 'react';
import { EthAddress } from '../Types';
import { zeroAddress } from 'viem';
import { useRecoilState } from 'recoil';
import { TokensState } from '../State/Tokens';
import { useConfig } from './useConfig';
import { erc20ABI, usePublicClient } from 'wagmi';

export const useToken = ({ address }: { address: EthAddress | undefined }) => {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [tokens, setTokens] = useRecoilState(TokensState);
    const { config, activeChainConfig } = useConfig();
    const publicClient = usePublicClient();

    const fetchToken = useCallback(
        (address: EthAddress) => {
            const name = publicClient.readContract({
                address,
                abi: erc20ABI,
                functionName: 'name',
            });
            const symbol = publicClient.readContract({
                address,
                abi: erc20ABI,
                functionName: 'symbol',
            });
            const decimals = publicClient.readContract({
                address,
                abi: erc20ABI,
                functionName: 'decimals',
            });
            const totalSupply = publicClient.readContract({
                address,
                abi: erc20ABI,
                functionName: 'totalSupply',
            });
            return Promise.all([name, symbol, decimals, totalSupply]).then(([name, symbol, decimals, totalSupply]) => {
                return { name, symbol, decimals, totalSupply, address };
            });
        },
        [publicClient],
    );

    const fetchData = useCallback(() => {
        if (isLoading) return;
        const chainCfg = activeChainConfig;
        if (!chainCfg) return;
        setLoading(true);

        if (address === zeroAddress) {
            setTokens((st) => ({
                ...st,
                [config.id]: {
                    ...st[config.id],
                    [zeroAddress.toLowerCase() as EthAddress]: {
                        decimals: chainCfg.nativeCurrency.decimals,
                        name: chainCfg.nativeCurrency.name,
                        symbol: chainCfg.nativeCurrency.symbol,
                        totalSupply: '0',
                        address: zeroAddress.toLowerCase() as EthAddress,
                    },
                },
            }));
            setLoading(false);
            return;
        }

        fetchToken(address)
            .then((data) => {
                setTokens((st) => ({
                    ...st,
                    [config.id]: {
                        ...st[config.id],
                        [address.toLowerCase() as EthAddress]: {
                            decimals: data.decimals,
                            name: data.name,
                            symbol: data.symbol,
                            totalSupply: data.totalSupply.toString(),
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
    }, [isLoading, activeChainConfig, address, fetchToken, setTokens, config.id]);

    useEffect(() => {
        if (!address) return;
        if (tokens[config.id] && tokens[config.id][address.toLowerCase() as EthAddress]) return;
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, activeChainConfig]);

    const data = useMemo(() => {
        if (!address || !tokens[config.id]) return undefined;
        return tokens[config.id][address.toLowerCase() as EthAddress];
    }, [address, tokens, config.id]);

    return { isLoading, isError, data };
};
