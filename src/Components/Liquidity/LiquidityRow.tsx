import { useAccount, useBalance, useToken } from 'wagmi';
import { EthAddress } from '../../Types';
import { Button } from '../Button';
import { LiquidityPositionsRow, PositionNameWrapper, PositionLogosWrapper, PositionActionsWrapper } from './Styles';
import React from 'react';
import { toPresentationLength } from '../../Utils/Bignumber';

export const LiquidityRow: React.FC<{ pool: { token0: EthAddress; token1: EthAddress; pool: EthAddress } }> = ({
    pool,
}) => {
    const account = useAccount();
    const { data, isError, isLoading } = useBalance({
        token: pool.pool,
        address: account.address,
    });

    if (isError || isLoading) return null;

    return (
        <LiquidityPositionsRow>
            <PositionNameWrapper>
                <PositionLogosWrapper>
                    <img src="/custom-token.png" alt="BNB" />
                    <img src="/custom-token.png" alt="USDT" />
                </PositionLogosWrapper>
                <span className="name">
                    <LiquidityToken address={pool.token0} />
                    <span>-</span>
                    <LiquidityToken address={pool.token1} />
                </span>
            </PositionNameWrapper>
            <span>{toPresentationLength(data?.formatted)}</span>
            <PositionActionsWrapper>
                <Button>Withdraw</Button>
                <Button>Explore</Button>
            </PositionActionsWrapper>
        </LiquidityPositionsRow>
    );
};

export const LiquidityToken: React.FC<{ address: EthAddress }> = ({ address }) => {
    const { data } = useToken({
        address,
    });

    if (data) {
        return <span>{data.symbol}</span>;
    }
    return null;
};
