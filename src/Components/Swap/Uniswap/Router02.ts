import EventEmitter from 'eventemitter3';
import { EthAddress } from '../../../Types';
import { getAllPaths } from './Routing';
import { Address, zeroAddress } from 'viem';
import UniswapV2Router02ABI from '../../../ABI/UniswapV2Router02';
import { Chain, erc20ABI } from 'wagmi';
import { readContract, writeContract, prepareWriteContract } from '@wagmi/core';
import { WriteContractResult } from 'wagmi/actions';
import { BlockchainContractsConfig } from '../../../Config';
import { isNumber, substractPercentage } from '../../../Utils/Bignumber';

type Events = 'loading' | 'amountsOutReq' | 'amountsOut' | 'amountsInReq' | 'amountsIn';

export enum SwapType {
    EXACT_IN = 'EXACT_IN',
    EXACT_OUT = 'EXACT_OUT',
}

// token0, token1, pairAddress
export type Pool = [EthAddress, EthAddress, EthAddress];

export class Router02 extends EventEmitter<Events> {
    public token0: EthAddress = zeroAddress;
    public token1: EthAddress = zeroAddress;
    public value0 = '0';
    public value1 = '0';
    public pools: Pool[] = [];
    public reqId = 0;
    public uniswapConfig: undefined | BlockchainContractsConfig;
    public config: undefined | Chain;
    public slippage = '0.5';
    public requests = {
        requestOnFlight: 0,
        requestCompleted: 0,
    };

    constructor() {
        super();
        this.attachEvents();
    }

    async swap(lastInput: 0 | 1, toAddress: Address) {
        let method = lastInput === 0 ? 'swapExactTokensForTokens' : 'swapTokensForExactTokens';
        if (this.token0 === zeroAddress) {
            method = lastInput === 0 ? 'swapExactETHForTokens' : 'swapETHForExactTokens';
        } else if (this.token1 === zeroAddress) {
            method = lastInput === 0 ? 'swapExactTokensForETH' : 'swapTokensForExactETH';
        }
        const { path: shortestPath } = this.findShortestPath();

        let swapPromise: Promise<WriteContractResult>;

        switch (method) {
            case 'swapExactETHForTokens':
                swapPromise = prepareWriteContract({
                    address: this.uniswapConfig.router,
                    abi: UniswapV2Router02ABI,
                    functionName: method,
                    args: [
                        BigInt(substractPercentage(this.value0, this.slippage)),
                        shortestPath,
                        toAddress,
                        BigInt(Date.now() + 1000 * 60 * 10),
                    ],
                    value: BigInt(this.value0),
                    chainId: Number(this.config.id),
                }).then((prepared) => writeContract(prepared.request));
                break;
            case 'swapETHForExactTokens':
                swapPromise = prepareWriteContract({
                    address: this.uniswapConfig.router,
                    abi: UniswapV2Router02ABI,
                    functionName: method,
                    args: [BigInt(this.value1), shortestPath, toAddress, BigInt(Date.now() + 1000 * 60 * 10)],
                    value: BigInt(this.value0),
                    chainId: Number(this.config.id),
                }).then((prepared) => writeContract(prepared.request));
                break;
            case 'swapExactTokensForETH':
                swapPromise = prepareWriteContract({
                    address: this.uniswapConfig.router,
                    abi: UniswapV2Router02ABI,
                    functionName: method,
                    args: [
                        BigInt(this.value0),
                        BigInt(substractPercentage(this.value1, this.slippage)),
                        shortestPath,
                        toAddress,
                        BigInt(Date.now() + 1000 * 60 * 10),
                    ],
                    chainId: Number(this.config.id),
                }).then((prepared) => writeContract(prepared.request));
                break;
            case 'swapTokensForExactETH':
                swapPromise = prepareWriteContract({
                    address: this.uniswapConfig.router,
                    abi: UniswapV2Router02ABI,
                    functionName: method,
                    args: [
                        BigInt(this.value1),
                        BigInt(substractPercentage(this.value0, this.slippage)),
                        shortestPath,
                        toAddress,
                        BigInt(Date.now() + 1000 * 60 * 10),
                    ],
                    chainId: Number(this.config.id),
                }).then((prepared) => writeContract(prepared.request));
                break;
            case 'swapExactTokensForTokens':
                swapPromise = prepareWriteContract({
                    address: this.uniswapConfig.router,
                    abi: UniswapV2Router02ABI,
                    functionName: method,
                    args: [
                        BigInt(this.value0),
                        BigInt(substractPercentage(this.value1, this.slippage)),
                        shortestPath,
                        toAddress,
                        BigInt(Date.now() + 1000 * 60 * 10),
                    ],
                    chainId: Number(this.config.id),
                }).then((prepared) => writeContract(prepared.request));
                break;
            case 'swapTokensForExactTokens':
                swapPromise = prepareWriteContract({
                    address: this.uniswapConfig.router,
                    abi: UniswapV2Router02ABI,
                    functionName: method,
                    args: [
                        BigInt(this.value1),
                        BigInt(this.value0),
                        shortestPath,
                        toAddress,
                        BigInt(Date.now() + 1000 * 60 * 10),
                    ],
                    chainId: Number(this.config.id),
                }).then((prepared) => writeContract(prepared.request));
                break;
            default:
                throw new Error('Invalid swap method');
        }
        await swapPromise;
    }

    async approve() {
        return prepareWriteContract({
            address: this.token0,
            abi: erc20ABI,
            functionName: 'approve',
            args: [this.uniswapConfig.router, BigInt(this.value0)],
            chainId: Number(this.config.id),
        }).then((prepared) => writeContract(prepared.request));
    }

    setPools(pools: Pool[]) {
        this.pools = pools;
    }

    setValue0(value0: string) {
        const prev = this.value0;
        this.value0 = value0;
        if (prev !== value0) {
            this.emit('amountsOutReq', { reqId: this.reqId++ });
        }
    }

    setValue1(value1: string) {
        const prev = this.value1;
        this.value1 = value1;
        if (prev !== value1) {
            this.emit('amountsInReq', { reqId: this.reqId++ });
        }
    }

    setToken0(token0: EthAddress) {
        this.token0 = token0;
    }

    setToken1(token1: EthAddress) {
        this.token1 = token1;
    }

    setUniswapConfig(config: BlockchainContractsConfig) {
        this.uniswapConfig = config;
    }

    setSlippage(slippage: string) {
        if (isNumber(slippage)) {
            this.slippage = slippage;
        }
    }

    setConfig(config: Chain) {
        this.config = config;
    }

    public findPaths() {
        return getAllPaths(this.normalizedToken0, this.normalizedToken1, this.pools);
    }

    public findShortestPath() {
        const paths = this.findPaths();
        const shortestPath = paths.reduce((prev, curr) => {
            return prev.path.length > curr.path.length && curr.path.length > 1 ? curr : prev;
        }, paths[0]);
        return shortestPath;
    }

    private checkConfig() {
        if (!this.uniswapConfig || !this.config) {
            throw new Error('Config not set');
        }
    }

    private get normalizedToken0() {
        this.checkConfig();
        return this.token0 === zeroAddress ? this.uniswapConfig.weth : this.token0;
    }

    private get normalizedToken1() {
        this.checkConfig();
        return this.token1 === zeroAddress ? this.uniswapConfig.weth : this.token1;
    }

    private async getAmountsOut(path: EthAddress[]) {
        this.checkConfig();
        const data: bigint[] = (await readContract({
            address: this.uniswapConfig.router,
            abi: UniswapV2Router02ABI,
            functionName: 'getAmountsOut',
            args: [BigInt(this.value0), path],
            chainId: Number(this.config.id),
        })) as bigint[];
        return data.map((value) => value.toString());
    }

    private async getAmountsIn(path: EthAddress[]) {
        this.checkConfig();
        const data: bigint[] = (await readContract({
            address: this.uniswapConfig.router,
            abi: UniswapV2Router02ABI,
            functionName: 'getAmountsIn',
            args: [BigInt(this.value1), path],
            chainId: Number(this.config.id),
        })) as bigint[];
        return data.map((value) => value.toString());
    }

    private attachEvents() {
        this.on('amountsOutReq', ({ reqId }) => {
            this.addRequestOnFlight();
            const shortestPath = this.findShortestPath();
            this.getAmountsOut(shortestPath.path)
                .then((amountsOut) => {
                    this.emit('amountsOut', { reqId, amountsOut });
                })
                .finally(() => this.addRequestCompleted());
        });

        this.on('amountsInReq', ({ reqId }) => {
            this.addRequestOnFlight();
            const shortestPath = this.findShortestPath();
            this.getAmountsIn(shortestPath.path)
                .then((amountsIn) => {
                    this.emit('amountsIn', { reqId, amountsIn });
                })
                .finally(() => this.addRequestCompleted());
        });
    }

    private addRequestOnFlight() {
        this.requests.requestOnFlight++;
        this.emit('loading', { ...this.requests });
    }

    private addRequestCompleted() {
        this.requests.requestCompleted++;
        this.emit('loading', { ...this.requests });
    }
}

const router02 = new Router02();

export default router02;
