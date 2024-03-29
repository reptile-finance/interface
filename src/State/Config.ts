import { atom } from 'recoil';
import { localStorageEffect } from './Utils';
import { opBnbChain } from '../Providers/Blockchain';
import { AppConfig } from '../Types';

export type TConfigState = {
    chainId: string; // active chain
    appConfig: AppConfig;
    user: {
        slippage: string;
    };
};

export const ConfigState = atom<TConfigState>({
    key: 'config-state-v1',
    default: {
        chainId: opBnbChain.id.toString(),
        appConfig: {
            [opBnbChain.id.toString()]: {
                tokens: [],
            },
        },
        user: {
            slippage: '0.5',
        },
    },
    effects: [localStorageEffect<TConfigState>('config-state')],
});
