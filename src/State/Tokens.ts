import { atom } from 'recoil';
import { EthAddress } from '../Types';
import { localStorageEffect } from './Utils';
import { opBnbChain } from '../Providers/Blockchain';

export type TTokenState = {
    [chainId: string]: {
        [tokenAddress: EthAddress]: {
            decimals: number;
            name: string;
            symbol: string;
            address: EthAddress;
        };
    };
};

export const TokensState = atom<TTokenState>({
    key: 'tokens-state',
    default: {
        [opBnbChain.id.toString()]: {},
    },
    effects: [localStorageEffect<TTokenState>('tokens-state')],
});
