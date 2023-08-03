import { atom } from 'recoil';
import { EthAddress } from '../Types';
import { localStorageEffect } from './Utils';
import { opBnbChain } from '../Providers/Blockchain';

export type TPoolsState = {
    [chainId: string]: {
        [poolAddress: EthAddress]: {
            token0: EthAddress;
            token1: EthAddress;
        };
    };
};

export const PoolsState = atom<TPoolsState>({
    key: 'pools-state',
    default: {
        [opBnbChain.id.toString()]: {},
    },
    effects: [localStorageEffect<TPoolsState>('pools-state')],
});
