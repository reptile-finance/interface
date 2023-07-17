const BASE_URL = "https://token-icons.s3.amazonaws.com/{{ADDRESS}}.png";

// Symbol - ETH Address
const TokenSymholMapping: { [symbol: string]: string } = {
  USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  BUSD: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
};

// STBL Address - Symbol
const TokenAddressMapping: { [address: string]: string } = {
  ["0xFa8464fD7d2b92F147e7DF50593ce47358859aa7".toLowerCase()]: "USDT",
};

export class IconsProvider {
  public static getIconUrl(symbol: string): string {
    const url = TokenSymholMapping[symbol.toUpperCase()];
    if (url) {
      return BASE_URL.replace("{{ADDRESS}}", url.toLowerCase());
    }
    return "/custom-token.png";
  }

  public static getIconUrlByAddress(address: string): string {
    const symbol = TokenAddressMapping[address.toLowerCase()];
    if (symbol) {
      return this.getIconUrl(symbol);
    }
    return "/custom-token.png";
  }
}
