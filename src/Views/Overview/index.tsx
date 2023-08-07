import { useMemo, useState } from 'react';
import { useBalances } from '../../Hooks/useBalances';
import {
    LiquidityWrapper,
    OverviewBalance,
    OverviewContent,
    SwapWrapper,
    Tabs,
    TabsItem,
    WelcomeBalance,
    WelcomeMsg,
} from './Styles';
import { formatBalance } from '../../Utils/Bignumber';
import { zeroAddress } from 'viem';
import { Swap } from '../../Components/Swap';
import { AddLiquidity } from '../../Components/AddLiquidity';
import { Liquidity } from '../../Components/Liquidity';
import { useConfig } from '../../Hooks/useConfig';

export const Overview = () => {
    const { getBalance } = useBalances();
    const { activeChainConfig } = useConfig();
    const [activeTab, setActiveTab] = useState(0);

    const userBalance = useMemo(() => {
        return formatBalance(getBalance(zeroAddress), 4, activeChainConfig.nativeCurrency.decimals);
    }, [activeChainConfig.nativeCurrency.decimals, getBalance]);

    const Tab = useMemo(() => {
        switch (activeTab) {
            case 0:
                return () => (
                    <SwapWrapper>
                        <Swap />
                    </SwapWrapper>
                );
            case 1:
                return () => (
                    <SwapWrapper>
                        <AddLiquidity />
                    </SwapWrapper>
                );
            case 2:
                return () => (
                    <LiquidityWrapper>
                        <Liquidity />
                    </LiquidityWrapper>
                );

            default:
                return () => <Swap />;
        }
    }, [activeTab]);

    return (
        <>
            <OverviewBalance>
                <WelcomeMsg>Welcome, you have</WelcomeMsg>
                <WelcomeBalance>
                    {userBalance} <span>{activeChainConfig?.nativeCurrency.symbol}</span>
                </WelcomeBalance>
            </OverviewBalance>
            <Tabs>
                <TabsItem onClick={() => setActiveTab(0)} className={activeTab === 0 ? 'active' : 'no-active'}>
                    Swap
                </TabsItem>
                <TabsItem onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : 'no-active'}>
                    Add Liquidity
                </TabsItem>
                <TabsItem onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'active' : 'no-active'}>
                    Your Liquidity
                </TabsItem>
            </Tabs>
            <OverviewContent>
                <SwapWrapper>
                    <Tab />
                </SwapWrapper>
            </OverviewContent>
        </>
    );
};
