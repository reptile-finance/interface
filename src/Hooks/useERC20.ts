import { useCallback } from "react";
import { EthAddress } from "../Types";
import { useWalletClient } from "wagmi";
import { Hash } from "viem";
import ERC20ABI from "../ABI/ERC20.json";
import SampleERC20 from "../CustomContracts/SampleERC20.json";

export const useERC20 = () => {
  const { data: wallet } = useWalletClient();

  const transfer = useCallback(
    async (address: EthAddress, to: EthAddress, amount: bigint) => {
      if (!wallet) {
        throw new Error("Wallet not connected");
      }

      return wallet.writeContract({
        address,
        abi: ERC20ABI,
        functionName: "transfer",
        args: [to, amount],
      });
    },
    [wallet]
  );

  const deploySampleContract = useCallback(
    async (name: string, symbol: string) => {
      if (!wallet) {
        throw new Error("Wallet not connected");
      }

      const txHash = await wallet.deployContract({
        bytecode: SampleERC20.bytecode as Hash,
        args: [name, symbol],
        abi: SampleERC20.abi,
      });

      console.log(`Deployed ${name} in txHash ${txHash}`);

      return txHash;
    },
    [wallet]
  );

  return { transfer, deploySampleContract };
};
