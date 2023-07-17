import { Address, Hash } from "viem";

export const shortHexString = (hexString: Hash | Address, length = 10) => {
  return (
    hexString.slice(0, length / 2 + 2) + "..." + hexString.slice(-length / 2)
  );
};
