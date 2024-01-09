import BNjs from 'bignumber.js';

export const BigNumber = (arg: BNjs.Value, base?: number) => new BNjs(arg, base);

export const BN = (arg: BNjs.Value | bigint, base?: number) => {
    let num = arg;
    if (typeof num === 'bigint') {
        num = num.toString();
    }
    return BigNumber(num, base);
};

export const isNumber = (num: string | number) => !BigNumber(num).isNaN();

export const isNumberAndNonZero = (n: string | number) => {
    const num = BigNumber(n);
    return !num.isNaN() && !num.isZero();
};

export const areNumbers = (numbers: Array<string | number>) => numbers.every(isNumber);

export const localiseNumber = (num: string | number) => BigNumber(num).toNumber().toLocaleString();

export const truncate = (num: string | number) => Math.trunc(BigNumber(num).toNumber()).toString(10);

export const toNumber = (num: string | number) => BigNumber(num).toNumber();

export const toBNFixed = (num: string | number) => BigNumber(num).toFixed();

export const toHex = (num: string | number) => '0x' + BigNumber(num).toString(16);

export const isNaN = (num: string) => {
    return BigNumber(num).isNaN();
};

/**
 * Given a number, limits decimal to 8 places.
 */
export const toPresentationLength = (num: string | number) => BigNumber(num).dp(8).toFixed();

export const formatBalance = (balance: number | string, tokenDecimals: string | number = 18, precisionDecimals = 4) => {
    return BigNumber(balance).dividedBy(BigNumber(10).pow(tokenDecimals)).dp(precisionDecimals).toFixed();
};

export const parseFormattedBalance = (balance: number | string, decimals: string | number = 18) => {
    return BigNumber(balance).times(BigNumber(10).pow(decimals)).dp(0).toFixed();
};

export const substractPercentage = (num: string | number, percentage: string | number) => {
    return BigNumber(num).minus(BigNumber(num).times(percentage).dividedBy(100)).toFixed();
};
