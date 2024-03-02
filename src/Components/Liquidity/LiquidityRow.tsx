import { useAccount, useBalance } from 'wagmi';
import { EthAddress } from '../../Types';
import { Button } from '../Button';
import { LiquidityPositionsRow, PositionNameWrapper, PositionLogosWrapper, PositionActionsWrapper } from './Styles';
import React from 'react';
import { toPresentationLength } from '../../Utils/Bignumber';
import { useToken } from '../../Hooks/useToken';
import { RemoveLiquidity } from '../RemoveLiquidity';
import { useToggle } from 'usehooks-ts';

export const LiquidityRow: React.FC<{ pool: { token0: EthAddress; token1: EthAddress; pool: EthAddress } }> = ({
    pool,
}) => {
    const account = useAccount();
    const [isRemoveOpen, toggleRemove] = useToggle();
    const { data, isError, isLoading } = useBalance({
        token: pool.pool,
        address: account.address,
    });

    if (isError || isLoading || !data || data.value === 0n) return null;

    return (
        <>
            <LiquidityPositionsRow>
                <PositionNameWrapper>
                    <PositionLogosWrapper>
                        <img src="/reptile-token.png" alt="BNB" />
                        <img src="/reptile-token.png" alt="USDT" />
                    </PositionLogosWrapper>
                    <span className="name">
                        <LiquidityToken address={pool.token0} />
                        <span>/</span>
                        <LiquidityToken address={pool.token1} />
                    </span>
                </PositionNameWrapper>
                <span>{toPresentationLength(data?.formatted)}</span>
                <PositionActionsWrapper>
                    <Button onClick={toggleRemove}>Withdraw</Button>
                    <Button>Explore</Button>
                </PositionActionsWrapper>
            </LiquidityPositionsRow>

            <RemoveLiquidity
                isOpen={isRemoveOpen}
                onClose={toggleRemove}
                token0={pool.token0}
                token1={pool.token1}
                pool={pool.pool}
            />
        </>
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
