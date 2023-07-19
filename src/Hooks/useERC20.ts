import { useCallback } from 'react';
import { EthAddress } from '../Types';
import { useWalletClient } from 'wagmi';
import ERC20ABI from '../ABI/ERC20.json';
import { prepareWriteContract } from 'wagmi/actions';
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
                abi: ERC20ABI,
                functionName: 'transfer',
                args: [to, amount],
                chain: activeChainConfig.id,
                walletClient: wallet,
            });
            return wallet.writeContract(request);
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
                abi: ERC20ABI,
                functionName: 'approve',
                args: [to, amount],
                chain: activeChainConfig.id,
                walletClient: wallet,
            });
            return wallet.writeContract(request);
        },
        [activeChainConfig.id, wallet],
    );

    return { transfer, approve };
};
