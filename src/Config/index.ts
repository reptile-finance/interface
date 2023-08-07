import { EthAddress } from '../Types';

export const Config: {
    [chainId: string]: {
        router: EthAddress;
        factory: EthAddress;
        uniswapQuery: EthAddress;
        uniswapHelper: EthAddress;
        weth: EthAddress;
    };
} = {
    '5611': {
        // opBNB testnet
        router: '0x5F7aCb0763457efA8Dee63a3b0f526406a910ADb',
        factory: '0x9834Abb30CD485fBCfccb95a9c408083c306B3d0',
        uniswapQuery: '0x871a3c546b7315C749c6b0f5473d234170AFF39f',
        uniswapHelper: '0xddce1C777D4A9128c19d2373f5B7015797de8641',
        weth: '0x4200000000000000000000000000000000000006',
    },
};
