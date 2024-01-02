import EventEmitter from 'eventemitter3';
import { EthAddress } from '../../../Types';
import { UniswapConfig } from '../../../Config';
import { getAllPaths } from './Routing';
import { zeroAddress } from 'viem';
import UniswapV2Router02ABI from '../../../ABI/UniswapV2Router02';
import { Chain } from 'wagmi';
import { readContract } from '@wagmi/core';

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
    public uniswapConfig: undefined | UniswapConfig;
    public config: undefined | Chain;
    public requests = {
        requestOnFlight: 0,
        requestCompleted: 0,
    };

    constructor() {
        super();
        this.attachEvents();
    }

    swap(lastInput: 0 | 1) {}

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

    setUniswapConfig(config: UniswapConfig) {
        this.uniswapConfig = config;
    }

    setConfig(config: Chain) {
        this.config = config;
    }

    public findPaths() {
        return getAllPaths(this.normalizedToken0, this.normalizedToken1, this.pools);
    }

    public findSortestPath() {
        const paths = this.findPaths();
        const sortestPath = paths.reduce((prev, curr) => {
            return prev.length > curr.length && curr.length > 1 ? curr : prev;
        }, paths[0]);
        return sortestPath;
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
            args: [this.value0, path],
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
            args: [this.value1, path],
            chainId: Number(this.config.id),
        })) as bigint[];
        return data.map((value) => value.toString());
    }

    private attachEvents() {
        this.on('amountsOutReq', ({ reqId }) => {
            this.addRequestOnFlight();
            const sortestPath = this.findSortestPath();
            this.getAmountsOut(sortestPath)
                .then((amountsOut) => {
                    this.emit('amountsOut', { reqId, amountsOut });
                })
                .finally(() => this.addRequestCompleted());
        });

        this.on('amountsInReq', ({ reqId }) => {
            this.addRequestOnFlight();
            const sortestPath = this.findSortestPath();
            this.getAmountsIn(sortestPath)
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
