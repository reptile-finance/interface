import { useCallback } from 'react';
import { fetchBalance, readContract } from 'wagmi/actions';
import { erc20ABI, useAccount } from 'wagmi';
import { useRecoilValue } from 'recoil';
import { BalanceState } from '../State/Balance';
import { EthAddress } from '../Types';
import { useConfig } from './useConfig';
import { zeroAddress } from 'viem';

export const useBalances = () => {
    const { address } = useAccount();
    const { getTokens } = useConfig();
    const balances = useRecoilValue(BalanceState);

    const getBalances = useCallback(async (): Promise<{ address: EthAddress; balance: string }[]> => {
        if (!address) return Promise.resolve([]);
        const supportedTokens = await getTokens();
        const promises = supportedTokens.map((token) => {
            return readContract({
                address: token,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address],
            })
                .then((balance) => {
                    return {
                        address: token.toLowerCase() as EthAddress,
                        balance: balance.toString(),
                    };
                })
                .catch(() => {
                    return {
                        address: token.toLowerCase() as EthAddress,
                        balance: '0',
                    };
                });
        });
        const nativeBalance = fetchBalance({
            address,
        })
            .then(({ value }) => ({ address: zeroAddress as EthAddress, balance: value.toString() }))
            .catch(() => ({
                address: zeroAddress as EthAddress,
                balance: '0',
            }));
        return Promise.all([...promises, nativeBalance]);
    }, [address, getTokens]);

    const getBalance = useCallback(
        (tokenAddress: string) => {
            const balance = balances[tokenAddress.toLowerCase() as EthAddress];
            return balance ?? '0';
        },
        [balances],
    );

    return { getBalances, balances, getBalance };
};
