import { Chain, WalletClient } from 'viem';
import UniswapV2Router02 from '../../../ABI/UniswapV2Router02';
import { BlockchainContractsConfig } from '../../../Config';
import { EthAddress } from '../../../Types';
import { prepareWriteContract, writeContract } from 'wagmi/actions';

export const swapExactTokensForTokens = async (
    walletClient: WalletClient,
    amountIn: string,
    amountOutMin: string,
    path: EthAddress[],
    to: EthAddress,
    uniswapConfig: BlockchainContractsConfig,
    config: Chain,
) => {
    const { request } = await prepareWriteContract({
        address: uniswapConfig.router,
        abi: UniswapV2Router02,
        functionName: 'swapExactTokensForTokens',
        args: [BigInt(amountIn), BigInt(amountOutMin), path, to, generateDeadline()],
        chainId: Number(config.id),
        walletClient,
    });
    return writeContract(request);
};

export const swapExactETHForTokens = async (
    walletClient: WalletClient,
    ethAmount: string,
    amountOutMin: string,
    path: EthAddress[],
    to: EthAddress,
    uniswapConfig: BlockchainContractsConfig,
    config: Chain,
) => {
    const { request } = await prepareWriteContract({
        address: uniswapConfig.router,
        abi: UniswapV2Router02,
        functionName: 'swapExactETHForTokens',
        args: [BigInt(amountOutMin), path, to, generateDeadline()],
        value: BigInt(ethAmount),
        walletClient,
        chainId: Number(config.id),
    });
    return writeContract(request);
};

export const swapExactTokensForETH = async (
    walletClient: WalletClient,
    amountIn: string,
    amountOutMin: string,
    path: EthAddress[],
    to: EthAddress,
    uniswapConfig: BlockchainContractsConfig,
    config: Chain,
) => {
    const { request } = await prepareWriteContract({
        address: uniswapConfig.router,
        abi: UniswapV2Router02,
        functionName: 'swapExactTokensForETH',
        args: [BigInt(amountIn), BigInt(amountOutMin), path, to, generateDeadline()],
        chainId: Number(config.id),
        walletClient,
    });
    return writeContract(request);
};

export const swapETHForExactTokens = async (
    walletClient: WalletClient,
    amountOut: string,
    path: EthAddress[],
    to: EthAddress,
    uniswapConfig: BlockchainContractsConfig,
    config: Chain,
) => {
    const { request } = await prepareWriteContract({
        address: uniswapConfig.router,
        abi: UniswapV2Router02,
        functionName: 'swapETHForExactTokens',
        args: [BigInt(amountOut), path, to, generateDeadline()],
        chainId: Number(config.id),
        value: BigInt(amountOut),
        walletClient,
    });
    return writeContract(request);
};

export const swapTokensForExactETH = async (
    walletClient: WalletClient,
    amountOut: string,
    amountInMax: string,
    path: EthAddress[],
    to: EthAddress,
    uniswapConfig: BlockchainContractsConfig,
    config: Chain,
) => {
    const { request } = await prepareWriteContract({
        address: uniswapConfig.router,
        abi: UniswapV2Router02,
        functionName: 'swapTokensForExactETH',
        args: [BigInt(amountOut), BigInt(amountInMax), path, to, generateDeadline()],
        chainId: Number(config.id),
        walletClient,
    });
    return writeContract(request);
};

export const swapTokensForExactTokens = async (
    walletClient: WalletClient,
    amountOut: string,
    amountInMax: string,
    path: EthAddress[],
    to: EthAddress,
    uniswapConfig: BlockchainContractsConfig,
    config: Chain,
) => {
    const { request } = await prepareWriteContract({
        address: uniswapConfig.router,
        abi: UniswapV2Router02,
        functionName: 'swapTokensForExactTokens',
        args: [BigInt(amountOut), BigInt(amountInMax), path, to, generateDeadline()],
        chainId: Number(config.id),
        walletClient,
    });
    return writeContract(request);
};

function generateDeadline(minutes = 1) {
    return BigInt(Date.now() + 1000 * 60 * minutes);
}
