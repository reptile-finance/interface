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
            totalSupply: string;
            address: EthAddress;
        };
    };
};

export const TokensState = atom<TTokenState>({
    key: 'tokens-state-03032024',
    default: {
        [opBnbChain.id.toString()]: {},
    },
    effects: [localStorageEffect<TTokenState>('tokens-state')],
});
