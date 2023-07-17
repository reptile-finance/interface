import { atom } from 'recoil';
import { EthAddress } from '../Types';
import { localStorageEffect } from './Utils';

export type TTokenState = {
    [tokenAddress: EthAddress]: {
        decimals: number;
        name: string;
        symbol: string;
        address: EthAddress;
    };
};

export const TokensState = atom<TTokenState>({
    key: 'tokens-state',
    default: {},
    effects: [localStorageEffect<TTokenState>('tokens-state')],
});
