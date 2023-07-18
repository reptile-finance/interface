import { EthAddress } from '../Types';

export const Config: { [chainId: string]: { router: EthAddress; factory: EthAddress } } = {
    '5611': {
        // opBNB testnet
        router: '0x5F7aCb0763457efA8Dee63a3b0f526406a910ADb',
        factory: '0x9834Abb30CD485fBCfccb95a9c408083c306B3d0',
    },
};
