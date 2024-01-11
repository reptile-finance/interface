import { useCallback, useEffect, useMemo, useState } from 'react';
import { EthAddress, TokenMetadata } from '../../Types';
import { formatBalance, isNaN, parseFormattedBalance } from '../../Utils/Bignumber';
import router02, { Pool, Router02 } from './Uniswap/Router02';
import { useConfig } from '../../Hooks/useConfig';
import { useUniswap } from '../../Hooks/useUniswap';
import { usePools } from '../../Hooks/usePools';
import { erc20ABI, useAccount, useContractRead } from 'wagmi';
import { zeroAddress } from 'viem';

export const useSwap = () => {
    const [token0, setToken0] = useState<TokenMetadata | undefined>(undefined);
    const [token1, setToken1] = useState<TokenMetadata | undefined>(undefined);
    const [values, setValues] = useState<string[]>(['0', '0']);
    const [lastReqId, setReqId] = useState(router02.reqId);
    const { activeChainConfig, userConfig } = useConfig();
    const { uniswapConfig } = useUniswap();
    const { pools } = usePools();
    const [lastInput, setLastInput] = useState<0 | 1>(0);
    const [loading, setLoading] = useState<Router02['requests']>({
        requestOnFlight: 0,
        requestCompleted: 0,
    });
    const [path, setPath] = useState<EthAddress[]>([]);
    const { address } = useAccount();

    const { data: allowance } = useContractRead({
        address: token0?.address,
        args: [address ?? zeroAddress, uniswapConfig.router],
        chainId: activeChainConfig.id,
        abi: erc20ABI,
        functionName: 'allowance',
        watch: true,
        enabled: token0?.address !== undefined && address !== undefined && token0.address !== zeroAddress,
    });

    const setLastInputValue = useCallback(
        (input: typeof lastInput) => (v: string) => {
            if (isNaN(v)) {
                if (v == '') {
                    setValues((st) => [...st.slice(0, input), '0', ...st.slice(input + 1)]);
                }
                return;
            }
            setLastInput(input);
            setValues((st) => [...st.slice(0, input), sanitizedValue, ...st.slice(input + 1)]);
            const sanitizedValue = v == '' ? '0' : v;
            const factorizedValue = parseFormattedBalance(
                sanitizedValue,
                input === 0 ? token0?.decimals : token1?.decimals,
            );
            if (input === 0) {
                router02.setValue0(factorizedValue);
            } else {
                router02.setValue1(factorizedValue);
            }
        },
        [token0?.decimals, token1?.decimals],
    );

    useEffect(() => {
        router02.setToken0(token0?.address);
    }, [token0?.address]);

    useEffect(() => {
        router02.setToken1(token1?.address);
    }, [token1?.address]);

    useEffect(() => {
        const amountsOutFn = async ({ reqId, amountsOut }: { reqId: number; amountsOut: string[] }) => {
            if (reqId > lastReqId) {
                const newValue1 = amountsOut[amountsOut.length - 1];
                const formatedValue = formatBalance(newValue1, token1?.decimals, 8);
                setValues((st) => [...st.slice(0, 1), formatedValue]);
                setReqId(reqId);
            }
        };
        router02.on('amountsOut', amountsOutFn);
        return () => {
            router02.off('amountsOut', amountsOutFn);
        };
    }, [lastReqId, token1?.decimals]);

    useEffect(() => {
        const amountsInFn = async ({ reqId, amountsIn }: { reqId: number; amountsIn: string[] }) => {
            if (reqId > lastReqId) {
                const newValue0 = amountsIn[0];
                const formatedValue = formatBalance(newValue0, token0?.decimals, 8);
                setValues((st) => [formatedValue, ...st.slice(1)]);
                setReqId(reqId);
            }
        };
        router02.on('amountsIn', amountsInFn);
        return () => {
            router02.off('amountsIn', amountsInFn);
        };
    }, [lastReqId, token0?.decimals]);

    useEffect(() => {
        const loadingFn = async ({ requestCompleted, requestOnFlight }: Router02['requests']) => {
            setLoading({ requestCompleted, requestOnFlight });
        };
        router02.on('loading', loadingFn);
        return () => {
            router02.off('loading', loadingFn);
        };
    }, [lastReqId]);

    useEffect(() => {
        router02.setConfig(activeChainConfig);
    }, [activeChainConfig]);

    useEffect(() => {
        router02.setUniswapConfig(uniswapConfig);
    }, [uniswapConfig]);

    useEffect(() => {
        router02.setSlippage(userConfig.slippage);
    }, [userConfig]);

    useEffect(() => {
        const normalizedPools: Pool[] = Object.keys(pools).map((poolAddr: EthAddress) => {
            const t0 = pools[poolAddr].token0 as EthAddress;
            const t1 = pools[poolAddr].token1 as EthAddress;
            return [t0, t1, poolAddr];
        });
        router02.setPools(normalizedPools);
    }, [pools]);

    useEffect(() => {
        const path = router02.findSortestPath();
        setPath(path?.path);
    }, [token0, token1]);

    const isLoading = useMemo(() => loading.requestOnFlight > loading.requestCompleted, [loading]);

    const isEnoughAllowance = useMemo(() => {
        if (token0 && token0.address === zeroAddress) return true;
        return token0 && allowance >= BigInt(router02.value0);
    }, [allowance, token0]);

    const swap = useCallback(async () => {
        if (!token0 || !token1 || !address) return;
        if (!isEnoughAllowance) {
            return;
        }
        return router02.swap(lastInput, address);
    }, [address, isEnoughAllowance, lastInput, token0, token1]);

    const approve = useCallback(async () => {
        if (!token0 || !address) return;
        return router02.approve();
    }, [address, token0]);

    return {
        setValues,
        setLastInputValue,
        setToken0,
        swap,
        setToken1,
        approve,
        isEnoughAllowance,
        values,
        token1,
        token0,
        loading: isLoading,
        path,
    };
};
