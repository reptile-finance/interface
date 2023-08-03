import { useMemo } from 'react';
import { useConfig } from './useConfig';
import { Config } from '../Config';

export const useUniswap = () => {
    const { activeChainConfig } = useConfig();

    const uniswapConfig = useMemo(() => {
        return Config[activeChainConfig.id.toString()];
    }, [activeChainConfig.id]);

    return { uniswapConfig };
};
