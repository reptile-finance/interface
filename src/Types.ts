export type EthAddress = `0x${string}`;

export type AppConfig = {
    [chainId: string]: {
        tokens: EthAddress[];
    };
};
