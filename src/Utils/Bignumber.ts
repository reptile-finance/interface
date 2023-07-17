import BNjs from "bignumber.js";

export const BigNumber = (arg: BNjs.Value, base?: number) =>
  new BNjs(arg, base);

export const BN = BigNumber;

export const isNumber = (num: string | number) => !BigNumber(num).isNaN();

export const isNumberAndNonZero = (n: string | number) => {
  const num = BigNumber(n);
  return !num.isNaN() && !num.isZero();
};

export const areNumbers = (numbers: Array<string | number>) =>
  numbers.every(isNumber);

export const localiseNumber = (num: string | number) =>
  BigNumber(num).toNumber().toLocaleString();

export const truncate = (num: string | number) =>
  Math.trunc(BigNumber(num).toNumber()).toString(10);

export const toNumber = (num: string | number) => BigNumber(num).toNumber();

export const toBNFixed = (num: string | number) => BigNumber(num).toFixed();

export const toHex = (num: string | number) =>
  "0x" + BigNumber(num).toString(16);

export const isNaN = (num: string) => {
  return BigNumber(num).isNaN();
};

/**
 * Given a number, limits decimal to 8 places.
 */
export const toPresentationLength = (num: string | number) =>
  BigNumber(num).dp(8).toFixed();

export const formatBalance = (
  balance: number | string,
  precisionDecimals = 4,
  tokenDecimals: string | number = 18
) => {
  return BigNumber(balance)
    .dividedBy(BigNumber(10).pow(tokenDecimals))
    .dp(precisionDecimals)
    .toFixed();
};

export const parseFormattedBalance = (
  balance: number | string,
  decimals: string | number = 18
) => {
  return BigNumber(balance).times(BigNumber(10).pow(decimals)).toFixed();
};
