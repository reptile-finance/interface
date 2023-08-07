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
    const { config } = useConfig();

    const getBalances = useCallback(async (): Promise<{ address: EthAddress; balance: string; chainId: string }[]> => {
        if (!address) return Promise.resolve([]);
        const supportedTokens = await getTokens();
        const chainId = config.id;
        const promises = supportedTokens.map((token) => {
            return readContract({
                address: token,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address],
                chainId: Number(config.id),
            })
                .then((balance) => {
                    return {
                        address: token.toLowerCase() as EthAddress,
                        balance: balance.toString(),
                        chainId,
                    };
                })
                .catch(() => {
                    return {
                        address: token.toLowerCase() as EthAddress,
                        balance: '0',
                        chainId,
                    };
                });
        });
        const nativeBalance = fetchBalance({
            address,
            chainId: Number(config.id),
        })
            .then(({ value }) => ({ address: zeroAddress as EthAddress, balance: value.toString(), chainId }))
            .catch(() => ({
                address: zeroAddress as EthAddress,
                balance: '0',
                chainId,
            }));
        return Promise.all([...promises, nativeBalance]);
    }, [address, config.id, getTokens]);

    const getBalance = useCallback(
        (tokenAddress: EthAddress) => {
            const balance = balances[config.id] && balances[config.id][tokenAddress.toLowerCase() as EthAddress];
            return balance ?? '0';
        },
        [balances, config.id],
    );

    return { getBalances, balances, getBalance };
};
