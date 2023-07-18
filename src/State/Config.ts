import { atom } from 'recoil';
import { localStorageEffect } from './Utils';
import { opBnbChain } from '../Providers/Blockchain';
import { AppConfig } from '../Types';

export type TConfigState = {
    chainId: string; // active chain
    appConfig: AppConfig;
};

export const ConfigState = atom<TConfigState>({
    key: 'config-state',
    default: {
        chainId: opBnbChain.id.toString(),
        appConfig: {
            [opBnbChain.id]: {
                tokens: [],
            },
        },
    },
    effects: [localStorageEffect<TConfigState>('config-state')],
});
