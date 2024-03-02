import { useChainId } from 'wagmi';
import { Config } from '../../Config';
import { useFarmController } from '../../Hooks/useFarmController';
import { useFarms } from '../../Hooks/useFarms';
import { Button } from '../Button';
import {
    FarmsContent,
    FarmsTitle,
    FarmsWrapper,
    FarmsTable,
    FarmsTableRow,
    FarmsTableRowHeader,
    FarmsNameWrapper,
    FarmsLogosWrapper,
    FarmsActionsWrapper,
} from './Styles';
import { formatEther } from 'viem';
import { useFarmsStake } from '../../Hooks/useFarmsStake';
import { FarmInteractionModal, TFarmInteractionModalType } from './FarmInteractionModal';
import { useState } from 'react';
import { formatBalance } from '../../Utils/Bignumber';

export const Farms = () => {
    const [typeFarmInteraction, setTypeFarmInteraction] = useState<{
        type: TFarmInteractionModalType | null;
        farmIndex?: number;
    }>({ type: null });
    const chainId = useChainId();
    const config = Config[chainId];
    const { result: farms } = useFarms();
    const {
        data: { result: farmControllerData },
    } = useFarmController();
    const { result: farmsStake } = useFarmsStake();

    return (
        <FarmsWrapper>
            <FarmInteractionModal
                type={typeFarmInteraction.type}
                lpIndex={typeFarmInteraction.farmIndex}
                onClose={() => setTypeFarmInteraction({ type: null })}
            />
            <FarmsTitle>
                <div className="title">Farms</div>
                <div>Stake your LP tokens to earn Reptiles</div>
            </FarmsTitle>
            <FarmsContent>
                <FarmsTable>
                    <FarmsTableRowHeader>
                        <span>Farm</span>
                        <span>Earned</span>
                        <span>Daily rewards</span>
                        <span>Your Stake</span>
                        <span>Total Staked</span>
                        <span></span>
                    </FarmsTableRowHeader>

                    {farms &&
                        farmControllerData &&
                        farms.map((farm, i: number) => {
                            const DAY_IN_SECONDS = 3600n * 24n;
                            const rewardPerDay =
                                (farmControllerData.totalRewardPerBlock * farm.allocPoint * DAY_IN_SECONDS) /
                                (config.secondsPerBlock * farmControllerData.totalAllocatedPoints);
                            const userStake = farmsStake ? farmsStake[i].amount : 0n;
                            const earnedAmount = farm.accCakePerShare * userStake;
                            const totalStake = farm.totalStake;
                            return (
                                <FarmsTableRow>
                                    <FarmsNameWrapper>
                                        <FarmsLogosWrapper>
                                            <img src="/custom-token.png" alt="BNB" />
                                            <img src="/custom-token.png" alt="USDT" />
                                        </FarmsLogosWrapper>
                                        <span className="name">{farm.lpTokenSymbol}</span>
                                    </FarmsNameWrapper>
                                    <span>{formatEther(earnedAmount)} RPTL</span>
                                    <span>{formatEther(rewardPerDay)} RPTL</span>
                                    <span>{formatEther(userStake)} LP</span>
                                    <span>{formatBalance(totalStake, 18, 4)} LP</span>
                                    <FarmsActionsWrapper>
                                        <Button onClick={() => setTypeFarmInteraction({ type: 'stake', farmIndex: i })}>
                                            Stake
                                        </Button>
                                        <Button
                                            onClick={() => setTypeFarmInteraction({ type: 'unstake', farmIndex: i })}
                                        >
                                            Withdraw
                                        </Button>
                                    </FarmsActionsWrapper>
                                </FarmsTableRow>
                            );
                        })}
                </FarmsTable>
            </FarmsContent>
        </FarmsWrapper>
    );
};
