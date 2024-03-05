const BASE_URL = 'https://token-icons.s3.amazonaws.com/{{ADDRESS}}.png';

// Symbol - ETH Address
const TokenSymbolMapping: { [symbol: string]: string } = {
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    BUSD: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
};

// STBL Address - Symbol
const TokenAddressMapping: { [address: string]: string } = {
    ['0xd5d6709e1ce520076f0a5435ff00ef175c87d49c'.toLowerCase()]: 'USDT',
    ['0x338843a584083409152a5272e8a88cbea2c2031e'.toLowerCase()]: 'USDC',
    ['0x0000000000000000000000000000000000000000'.toLowerCase()]: 'BNB',
    ['0x4200000000000000000000000000000000000006'.toLowerCase()]: 'BNB',
    ['0x7ef6ed0895a273e4219cd2a1f1eea4409b9eadf3'.toLowerCase()]: 'RFT',
};

export class IconsProvider {
    public static getIconUrl(symbol: string): string {
        const url = TokenSymbolMapping[symbol.toUpperCase()];
        if (symbol === 'RFT') {
            return '/reptile-token.png';
        }
        if (url) {
            return BASE_URL.replace('{{ADDRESS}}', url.toLowerCase());
        }
        return '/reptile-unknown-token.png';
    }

    public static getIconUrlByAddress(address: string): string {
        const symbol = TokenAddressMapping[address.toLowerCase()];
        if (symbol === 'RFT') {
            return '/reptile-token.png';
        }
        if (symbol) {
            return this.getIconUrl(symbol);
        }
        return '/reptile-unknown-token.png';
    }
}
