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
        const chainId = config.chainId;
        const promises = supportedTokens.map((token) => {
            return readContract({
                address: token,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address],
                chainId: Number(config.chainId),
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
            chainId: Number(config.chainId),
        })
            .then(({ value }) => ({ address: zeroAddress as EthAddress, balance: value.toString(), chainId }))
            .catch(() => ({
                address: zeroAddress as EthAddress,
                balance: '0',
                chainId,
            }));
        return Promise.all([...promises, nativeBalance]);
    }, [address, config.chainId, getTokens]);

    const getBalance = useCallback(
        (tokenAddress: string) => {
            const balance = balances[config.chainId][tokenAddress.toLowerCase() as EthAddress];
            return balance ?? '0';
        },
        [balances, config.chainId],
    );

    return { getBalances, balances, getBalance };
};
