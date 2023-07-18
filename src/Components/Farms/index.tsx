    import { Button } from "../Button";
import {
    FarmsContent,
    FarmsTitle,
    FarmsWrapper,
    FarmsTable,
    FarmsTableRow,
    FarmsTableRowHeader,
    FarmsNameWrapper,
    FarmsLogosWrapper,
    FarmsActionsWrapper
} from "./Styles";


export const Farms = () => {
    return (
        <FarmsWrapper>
            <FarmsTitle>
                <div className="title">Farms</div>
                <div>Stake your LP tokens to earn Reptiles</div>
            </FarmsTitle>
            <FarmsContent>
                <FarmsTable>
                    <FarmsTableRowHeader>
                        <span>Farm</span>
                        <span>Earned</span>
                        <span>APR</span>
                        <span>Staked Liquidity</span>
                        <span>Available</span>
                        <span>Staked</span>
                        <span></span>
                    </FarmsTableRowHeader>

                    <FarmsTableRow>
                        <FarmsNameWrapper>
                            <FarmsLogosWrapper>
                                <img src="/custom-token.png" alt="BNB" />
                                <img src="/custom-token.png" alt="USDT" />
                            </FarmsLogosWrapper>
                            <span className="name">BNB-USDT LP</span>
                        </FarmsNameWrapper>
                        <span>3  RPTL</span>
                        <span>27.11%</span>
                        <span>$8,866,240</span>
                        <span>100 LP</span>
                        <span>2000 LP</span>
                        <FarmsActionsWrapper>
                            <Button>Stake</Button>
                            <Button>Withdraw</Button>
                        </FarmsActionsWrapper>
                    </FarmsTableRow>

                    <FarmsTableRow>
                        <FarmsNameWrapper>
                            <FarmsLogosWrapper>
                                <img src="/custom-token.png" alt="BNB" />
                                <img src="/custom-token.png" alt="USDT" />
                            </FarmsLogosWrapper>
                        <span className="name">BNB-USDT LP</span>
                        </FarmsNameWrapper>
                        <span>3  RPTL</span>
                        <span>27.11%</span>
                        <span>$8,866,240</span>
                        <span>100 LP</span>
                        <span>2000 LP</span>
                        <FarmsActionsWrapper>
                            <Button>Stake</Button>
                            <Button>Withdraw</Button>
                        </FarmsActionsWrapper>
                    </FarmsTableRow>

                    <FarmsTableRow>
                        <FarmsNameWrapper>
                            <FarmsLogosWrapper>
                                <img src="/custom-token.png" alt="BNB" />
                                <img src="/custom-token.png" alt="USDT" />
                            </FarmsLogosWrapper>
                            <span className="name">BNB-USDT LP</span>
                        </FarmsNameWrapper>
                        <span>3  RPTL</span>
                        <span>27.11%</span>
                        <span>$8,866,240</span>
                        <span>100 LP</span>
                        <span>2000 LP</span>
                        <FarmsActionsWrapper>
                            <Button>Stake</Button>
                            <Button>Withdraw</Button>
                        </FarmsActionsWrapper>
                    </FarmsTableRow>
                </FarmsTable>
            </FarmsContent>
        </FarmsWrapper>

    );
};