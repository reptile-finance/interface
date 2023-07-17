import { useCallback } from "react";
import { Hash } from "viem";
import { getPublicClient } from "wagmi/actions";

export const useTransactionData = () => {
  const getTransactionData = useCallback(
    async (hash: Hash) => getPublicClient().getTransaction({ hash }),
    []
  );

  return {
    getTransactionData,
  };
};
