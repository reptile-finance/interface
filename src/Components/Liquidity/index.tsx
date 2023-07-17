import { Button } from '../Button';
import {
    LiquidityPositionsRow,
    LiquidityPositionsRowHeader,
    LiquidityPositionsTable,
    LiquidityTitle,
    LiquidityWrapper,
    LiquidtyContent,
    PositionActionsWrapper,
    PositionLogosWrapper,
    PositionNameWrapper,
} from './Styles';

export const Liquidity = () => {
    return (
        <LiquidityWrapper>
            <LiquidityTitle>
                <div className="title">Your Liquidity</div>
                <div>Manage your liquidity positions (LPs)</div>
            </LiquidityTitle>
            <LiquidtyContent>
                <LiquidityPositionsTable>
                    <LiquidityPositionsRowHeader>
                        <span>Liquidity Pool</span>
                        <span>Balance</span>
                        <span></span>
                    </LiquidityPositionsRowHeader>
                    <LiquidityPositionsRow>
                        <PositionNameWrapper>
                            <PositionLogosWrapper>
                                <img src="/custom-token.png" alt="BNB" />
                                <img src="/custom-token.png" alt="USDT" />
                            </PositionLogosWrapper>
                            <span className="name">BNB-USDT</span>
                        </PositionNameWrapper>
                        <span>423.424</span>
                        <PositionActionsWrapper>
                            <Button>Withdraw</Button>
                            <Button>Explore</Button>
                        </PositionActionsWrapper>
                    </LiquidityPositionsRow>
                    <LiquidityPositionsRow>
                        <PositionNameWrapper>
                            <PositionLogosWrapper>
                                <img src="/custom-token.png" alt="BNB" />
                                <img src="/custom-token.png" alt="USDT" />
                            </PositionLogosWrapper>
                            <span className="name">BNB-USDT</span>
                        </PositionNameWrapper>
                        <span>423.424</span>
                        <PositionActionsWrapper>
                            <Button>Withdraw</Button>
                            <Button>Explore</Button>
                        </PositionActionsWrapper>
                    </LiquidityPositionsRow>
                    <LiquidityPositionsRow>
                        <PositionNameWrapper>
                            <PositionLogosWrapper>
                                <img src="/custom-token.png" alt="BNB" />
                                <img src="/custom-token.png" alt="USDT" />
                            </PositionLogosWrapper>
                            <span className="name">BNB-USDT</span>
                        </PositionNameWrapper>
                        <span>423.424</span>
                        <PositionActionsWrapper>
                            <Button>Withdraw</Button>
                            <Button>Explore</Button>
                        </PositionActionsWrapper>
                    </LiquidityPositionsRow>
                </LiquidityPositionsTable>
            </LiquidtyContent>
        </LiquidityWrapper>
    );
};
