export type EthAddress = `0x${string}`;

export type AppConfig = {
    [chainId: string]: {
        tokens: EthAddress[];
    };
};

export type UniswapAddLiquidity = {
    token0: EthAddress;
    token1: EthAddress;
    amount0Desired: string;
    amount1Desired: string;
    amount0Min?: string;
    amount1Min?: string;
    to?: EthAddress;
    deadline?: number | string | bigint;
};

export type UniswapRemoveLiquidity = Omit<UniswapAddLiquidity, 'amount0Desired' | 'amount1Desired'> & {
    liquidity: string;
};

export interface TokenMetadata {
    name: string;
    symbol: string;
    decimals: number;
    address: EthAddress;
}
