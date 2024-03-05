import { useConfig } from '../../Hooks/useConfig';
import { useToken } from '../../Hooks/useToken';
import { BN, formatBalance, localiseNumber } from '../../Utils/Bignumber';
import Logo from '../../Assets/reptile-token.png';
import {
    ReptileContentWrapper,
    ReptileTitleWrapper,
    ReptileTokenInfo,
    ReptileTokenInfoDetail,
    ReptileTokenInfoWrapper,
    ReptileTokenListHeader,
    ReptileTokenListWrapper,
    ReptileWrapper,
} from './Styles';
import { useExplorer } from '../../Hooks/useExplorer';
import { useRecoilValue } from 'recoil';
import { TokensState } from '../../State/Tokens';
import { useMemo } from 'react';
import { erc20ABI, useContractReads } from 'wagmi';
import { zeroAddress } from 'viem';

export const Reptile = () => {
    const { uniswapConfig } = useConfig();
    const { data } = useToken({
        address: uniswapConfig.token,
    });
    const { getContractExplorerUrl } = useExplorer();

    return (
        <ReptileWrapper>
            <ReptileTitleWrapper>
                <div className="title">REPTILE Ecosystem</div>
                <div>
                    REPTILE (RFT) is a decentralized finance token that is used to incentivize liquidity providers and
                    yield farmers on the Reptile Finance platform. Behind the scenes, every swap accrues a 0.25% fee
                    that is sent to the liquidity providers and the Reptile Finance treasury. The treasury is used to
                    fund incentivace the use of the token and to fund future development of the platform.
                </div>
            </ReptileTitleWrapper>
            <ReptileContentWrapper>
                <ReptileTokenInfoWrapper>
                    <ReptileTokenInfo>
                        <img src={Logo} alt="logo" />
                        <span>
                            <div className="bolder">{data?.name}</div>
                            <div>${data?.symbol}</div>
                        </span>
                    </ReptileTokenInfo>
                    <ReptileTokenInfoDetail>
                        <div>
                            <div>🔍 Address</div>
                            <div
                                className="bolder"
                                data-reptile-content="link"
                                onClick={() => data && window.open(getContractExplorerUrl(data.address), '_blank')}
                            >
                                {data ? data.address : ''}
                            </div>
                        </div>
                        <div>
                            <div>🫰 Circulation Supply</div>
                            <div className="bolder">
                                {data ? localiseNumber(formatBalance(data.totalSupply, data.decimals)) : '0'} /{' '}
                                {(100000000).toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div>💰 Price</div>
                            <div className="bolder">$1.02</div>
                        </div>
                    </ReptileTokenInfoDetail>
                </ReptileTokenInfoWrapper>
                <ReptileTokenInfoWrapper>
                    <ReptileTokenListHeader>
                        <div className="bolder">Treasury</div>
                        <div>Rewards collected from protocol usage</div>
                    </ReptileTokenListHeader>
                    <TreasuryBalances />
                </ReptileTokenInfoWrapper>
            </ReptileContentWrapper>
        </ReptileWrapper>
    );
};

const TreasuryBalances = () => {
    const { config, uniswapConfig } = useConfig();
    const tokens = useRecoilValue(TokensState);

    const chainTokens = useMemo(() => {
        return Object.values(tokens[config.id]).filter((t) => t.address !== zeroAddress);
    }, [config.id, tokens]);

    const { data, isError, isLoading } = useContractReads({
        contracts: chainTokens.map((token) => ({
            address: token.address,
            functionName: 'balanceOf',
            abi: erc20ABI,
            args: [uniswapConfig.treasury],
        })),
    });

    const normalizedData = useMemo(() => {
        if (isError || isLoading) return [];
        const result = chainTokens.map((token, index) => {
            const dataRow = data[index];
            if (dataRow.status !== 'success') {
                return {
                    symbol: token.symbol,
                    balance: '0',
                };
            }
            return {
                symbol: token.symbol,
                balance: localiseNumber(formatBalance(dataRow.result.toString(), token.decimals, 2)),
            };
        });
        result.sort((a, b) => {
            if (BN(a.balance).lt(b.balance)) return 1;
            if (BN(a.balance).gt(b.balance)) return -1;
            return 0;
        });
        return result;
    }, [chainTokens, data, isError, isLoading]);

    return (
        <ReptileTokenListWrapper>
            {normalizedData.map((token) => (
                <div>
                    <span>{token.symbol}</span>
                    <span>{token.balance}</span>
                </div>
            ))}
        </ReptileTokenListWrapper>
    );
};
