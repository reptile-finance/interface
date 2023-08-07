import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Chain } from 'wagmi';

export const opBnbChain: Chain = {
    id: 5611,
    name: 'opBNB Testnet',
    network: 'opbnb-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'tBNB',
    },
    testnet: true,
    blockExplorers: {
        default: {
            name: 'opBNBScan',
            url: 'https://opbnbscan.com/',
        },
    },
    rpcUrls: {
        default: {
            http: ['https://opbnb-testnet-rpc.bnbchain.org'],
        },
        public: {
            http: ['https://opbnb-testnet-rpc.bnbchain.org'],
        },
    },
    contracts: {
        multicall3: {
            // https://raw.githubusercontent.com/mds1/multicall/main/src/Multicall3.sol
            address: '0xEe7207c782d6937BE63E38FCF902fF59E5498386',
            blockCreated: 2305930,
        },
    },
};

const { chains, publicClient } = configureChains([opBnbChain], [publicProvider()], {
    pollingInterval: 3_000, // Multicall polling interval
});

const { connectors } = getDefaultWallets({
    appName: 'Reptile Finance',
    projectId: '56e43641cb90850e1d15c57bc97e2fbf',
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export { wagmiConfig, chains, connectors, publicClient };
