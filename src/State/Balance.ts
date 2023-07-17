import { atom } from 'recoil';
import { EthAddress } from '../Types';
import { localStorageEffect } from './Utils';

export type TBalanceState = {
    [key: EthAddress]: string;
};

export const BalanceState = atom<TBalanceState>({
    key: 'balance-state',
    default: {},
    effects: [localStorageEffect<TBalanceState>('balances-state')],
});
