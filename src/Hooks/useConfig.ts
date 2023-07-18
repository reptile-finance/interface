import { useCallback } from 'react';
import { AppConfig, EthAddress } from '../Types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { TokensState } from '../State/Tokens';
import { ConfigState } from '../State/Config';

export const useConfig = () => {
    const savedTokens = useRecoilValue(TokensState);
    const [config, setConfig] = useRecoilState(ConfigState);

    const updateAppConfig = useCallback(async () => {
        const appConfig = (await fetch('/Config.json').then((res) => res.json())) as AppConfig;
        setConfig((prev) => ({
            ...prev,
            appConfig,
        }));
    }, [setConfig]);

    const getTokens = useCallback(async () => {
        const cfg = config.appConfig[config.chainId]?.tokens;
        const tokenSet = new Set<EthAddress>();
        cfg.forEach((token) => {
            tokenSet.add(token.toLowerCase() as EthAddress);
        });
        Object.keys(savedTokens[config.chainId]).forEach((token) => {
            tokenSet.add(token.toLowerCase() as EthAddress);
        });
        return [...tokenSet];
    }, [config.appConfig, config.chainId, savedTokens]);

    return { config, getTokens, updateAppConfig };
};
