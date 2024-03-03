import { useMemo } from 'react';
import { useConfig } from './useConfig';
import { BlockchainContractsConfig, Config } from '../Config';

export const useUniswap = () => {
    const { activeChainConfig } = useConfig();

    const uniswapConfig: BlockchainContractsConfig = useMemo(() => {
        return Config[activeChainConfig.id.toString()];
    }, [activeChainConfig.id]);

    return { uniswapConfig };
};
