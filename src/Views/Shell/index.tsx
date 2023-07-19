import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AccountBalance, AccountWrapper, ShellBody, ShellBodyContent, ShellBodyHeader, ShellWrapper } from './Styles';
import { Sidebar } from '../../Components/Sidebar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMemo } from 'react';
import { useBalances } from '../../Hooks/useBalances';
import { formatBalance } from '../../Utils/Bignumber';
import { zeroAddress } from 'viem';
import { useConfig } from '../../Hooks/useConfig';

export const Shell = () => {
    const location = useLocation();
    const { getBalance } = useBalances();
    const navigate = useNavigate();
    const { activeChainConfig } = useConfig();

    const sectionTitle = useMemo(() => {
        const title = location.pathname.replace('/', '').replace('-', ' ');
        return title.length > 0 ? title : 'Overview';
    }, [location.pathname]);

    const balance = useMemo(() => {
        return formatBalance(getBalance(zeroAddress), 4, activeChainConfig?.nativeCurrency.decimals);
    }, [activeChainConfig, getBalance]);

    return (
        <ShellWrapper>
            <Sidebar />
            <ShellBody id="shellBody">
                <ShellBodyHeader>
                    <h1 className="current-path">{sectionTitle}</h1>
                    <img src={''} alt="mini-logo" onClick={() => navigate('/')} />
                    <AccountWrapper>
                        <AccountBalance>
                            {balance} {activeChainConfig?.nativeCurrency.symbol}
                        </AccountBalance>
                        <ConnectButton showBalance={false} />
                    </AccountWrapper>
                </ShellBodyHeader>
                <ShellBodyContent>
                    <Outlet />
                </ShellBodyContent>
            </ShellBody>
        </ShellWrapper>
    );
};
