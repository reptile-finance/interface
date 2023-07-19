import { useRecoilState } from 'recoil';
import { TokensState } from '../State/Tokens';
import { useCallback } from 'react';
import { EthAddress } from '../Types';
import { fetchToken } from 'wagmi/actions';
import { useConfig } from './useConfig';
import { zeroAddress } from 'viem';

export const useTokens = () => {
    const [tokens, setTokens] = useRecoilState(TokensState);
    const { config, activeChainConfig } = useConfig();

    const getTokenMetadata = useCallback(
        async (address: EthAddress) => {
            if (address === zeroAddress) {
                return {
                    decimals: activeChainConfig.nativeCurrency.decimals,
                    name: activeChainConfig.nativeCurrency.name,
                    symbol: activeChainConfig.nativeCurrency.symbol,
                    address: zeroAddress.toLowerCase() as EthAddress,
                };
            }
            const isCached = tokens[config.chainId][address.toLowerCase() as EthAddress];
            if (isCached) {
                return isCached;
            }
            const token = await fetchToken({ address, chainId: Number(config.chainId) });
            setTokens((st) => ({
                ...st,
                [config.chainId]: {
                    ...st[config.chainId],
                    [address.toLowerCase() as EthAddress]: {
                        decimals: token.decimals,
                        name: token.name,
                        symbol: token.symbol,
                        address: token.address.toLowerCase() as EthAddress,
                    },
                },
            }));
            return token;
        },
        [activeChainConfig, config, setTokens, tokens],
    );

    return { getTokenMetadata };
};
