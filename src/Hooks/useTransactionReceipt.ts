import { useCallback } from "react";
import { Hash } from "viem";
import { getPublicClient } from "wagmi/actions";

export const useTransactionReceipt = () => {
  const getTransactionReceipt = useCallback(
    async (hash: Hash) => getPublicClient().getTransactionReceipt({ hash }),
    []
  );

  return { getTransactionReceipt };
};
