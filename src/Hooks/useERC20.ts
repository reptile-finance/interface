import { useCallback } from 'react';
import { EthAddress } from '../Types';
import { useWalletClient } from 'wagmi';
import ERC20ABI from '../ABI/ERC20.json';

export const useERC20 = () => {
    const { data: wallet } = useWalletClient();

    const transfer = useCallback(
        async (address: EthAddress, to: EthAddress, amount: bigint) => {
            if (!wallet) {
                throw new Error('Wallet not connected');
            }

            return wallet.writeContract({
                address,
                abi: ERC20ABI,
                functionName: 'transfer',
                args: [to, amount],
                chain: undefined,
            });
        },
        [wallet],
    );

    return { transfer };
};
