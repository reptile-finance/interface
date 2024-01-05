import { useCallback } from 'react';
import { EthAddress } from '../Types';
import { erc20ABI, useWalletClient } from 'wagmi';
import { prepareWriteContract, writeContract } from 'wagmi/actions';
import { useConfig } from './useConfig';

export const useERC20 = () => {
    const { data: wallet } = useWalletClient();
    const { activeChainConfig } = useConfig();

    const transfer = useCallback(
        async (tokenAddress: EthAddress, to: EthAddress, amount: bigint) => {
            if (!wallet) {
                throw new Error('Wallet not connected');
            }
            const { request } = await prepareWriteContract({
                address: tokenAddress,
                abi: erc20ABI,
                functionName: 'transfer',
                args: [to, amount],
                chain: activeChainConfig.id,
                walletClient: wallet,
            });
            return writeContract(request);
        },
        [activeChainConfig.id, wallet],
    );

    const approve = useCallback(
        async (tokenAddress: EthAddress, to: EthAddress, amount: bigint | string) => {
            if (!wallet) {
                throw new Error('Wallet not connected');
            }
            const { request } = await prepareWriteContract({
                address: tokenAddress,
                abi: erc20ABI,
                functionName: 'approve',
                args: [to, amount],
                chain: activeChainConfig.id,
                walletClient: wallet,
            });
            return writeContract(request);
        },
        [activeChainConfig.id, wallet],
    );

    return { transfer, approve };
};
