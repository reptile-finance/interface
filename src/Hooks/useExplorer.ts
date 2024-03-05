import { usePublicClient } from 'wagmi';

export const useExplorer = () => {
    const publicClient = usePublicClient();

    const getExplorerUrl = () => {
        return publicClient.chain.blockExplorers.default.url;
    };

    const getAddressExplorerUrl = (address: string) => {
        return `${getExplorerUrl()}/address/${address}`;
    };

    const getTxExplorerUrl = (tx: string) => {
        return `${getExplorerUrl()}/tx/${tx}`;
    };

    const getContractExplorerUrl = (contract: string) => {
        return `${getExplorerUrl()}/address/${contract}`;
    };

    return {
        getExplorerUrl,
        getAddressExplorerUrl,
        getTxExplorerUrl,
        getContractExplorerUrl,
    };
};
