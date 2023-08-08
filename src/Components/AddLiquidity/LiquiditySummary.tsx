import { formatEther } from 'viem';
import { TokenMetadata } from '../../Types';
import { LiquditySummaryLpRow, LiquditySummaryLpWrapper, LiquiditySummaryWrapper } from './Styles';
import { BN } from '../../Utils/Bignumber';

export const LiquiditySummary: React.FC<{
    token0?: TokenMetadata;
    token1?: TokenMetadata;
    data?: [bigint, bigint];
    isError: boolean;
}> = ({ token0, token1, data, isError }) => {
    if (token0 && token1 && token0.address === token1.address) {
        return (
            <LiquiditySummaryWrapper>
                <div className="error">
                    Identical tokens!
                    <br />
                    Choose different tokens to swap.
                </div>
            </LiquiditySummaryWrapper>
        );
    }
    return (
        <LiquiditySummaryWrapper>
            {data && token0 && token1 && !isError && (
                <LiquditySummaryLpWrapper>
                    <LiquditySummaryLpRow>
                        <span>
                            1 {token0.symbol} to {token1.symbol}
                        </span>
                        <span>
                            {BN(1)
                                .multipliedBy(BN(data[1].toString() || 0))
                                .div(BN(data[0].toString() || 0))
                                .toFixed()}
                        </span>
                    </LiquditySummaryLpRow>
                    <LiquditySummaryLpRow>
                        <span>
                            1 {token1.symbol} to {token0.symbol}
                        </span>
                        <span>
                            {BN(1)
                                .multipliedBy(BN(data[0].toString() || 0))
                                .div(BN(data[1].toString() || 0))
                                .toFixed()}
                        </span>
                    </LiquditySummaryLpRow>
                    <LiquditySummaryLpRow>
                        <span>Reserves 0</span>
                        <span>
                            {formatEther(data[0])} {token0.symbol}
                        </span>
                    </LiquditySummaryLpRow>
                    <LiquditySummaryLpRow>
                        <span>Reserves 1</span>
                        <span>
                            {formatEther(data[1])} {token1.symbol}
                        </span>
                    </LiquditySummaryLpRow>
                </LiquditySummaryLpWrapper>
            )}
            {isError && (
                <div className="error">
                    You're adding liquidity and creating a new LP! Please take a moment to ensure the price is set
                    correctly.
                </div>
            )}
        </LiquiditySummaryWrapper>
    );
};
