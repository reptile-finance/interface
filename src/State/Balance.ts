import { atom } from 'recoil';
import { EthAddress } from '../Types';
import { localStorageEffect } from './Utils';
import { opBnbChain } from '../Providers/Blockchain';

export type TBalanceState = {
    [chainId: string]: {
        [key: EthAddress]: string;
    };
};

export const BalanceState = atom<TBalanceState>({
    key: 'balance-state',
    default: {
        [opBnbChain.id.toString()]: {},
    },
    effects: [localStorageEffect<TBalanceState>('balances-state')],
});
