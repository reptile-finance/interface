import { useCallback } from 'react';
import { AppConfig, EthAddress } from '../Types';
import { useRecoilValue } from 'recoil';
import { TokensState } from '../State/Tokens';

let config: AppConfig | null = null;

export const useConfig = () => {
    const savedTokens = useRecoilValue(TokensState);

    const getTokens = useCallback(async () => {
        if (!config) {
            config = (await fetch('/Config.json').then((res) => res.json())) as AppConfig;
        }
        const tokenSet = new Set<EthAddress>();
        config.tokens.forEach((token) => {
            tokenSet.add(token.toLowerCase() as EthAddress);
        });
        Object.keys(savedTokens).forEach((token) => {
            tokenSet.add(token.toLowerCase() as EthAddress);
        });
        return [...tokenSet];
    }, [savedTokens]);

    return { getTokens };
};
