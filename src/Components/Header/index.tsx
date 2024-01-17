import { HeaderWrapper, HeaderNavigation, LogoItem, HeaderItem, AccountWrapper, AccountBalance } from './Styles';

import { useNavigate } from 'react-router-dom';
import Logo from '../../Assets/custom-token.png';
import { useBalances } from '../../Hooks/useBalances';
import { useConfig } from '../../Hooks/useConfig';
import { useMemo } from 'react';
import { zeroAddress } from 'viem';
import { formatBalance } from '../../Utils/Bignumber';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLocation } from 'react-router-dom';

export const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getBalance } = useBalances();
    const { activeChainConfig } = useConfig();

    const balance = useMemo(() => {
        return formatBalance(getBalance(zeroAddress), activeChainConfig?.nativeCurrency.decimals, 4);
    }, [activeChainConfig, getBalance]);

    const sectionTitle = useMemo(() => {
        const title = location.pathname.replace('/', '');
        return title.length > 0 ? title : 'Overview';
    }, [location.pathname]);

    return (
        <HeaderWrapper>
            <HeaderNavigation>
                <LogoItem src={Logo} />
                <HeaderItem
                    onClick={() => navigate('/overview')}
                    className={/overview/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>Overview</span>
                </HeaderItem>
                <HeaderItem
                    onClick={() => navigate('/earn')}
                    className={/earn/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>Earn</span>
                </HeaderItem>
                <HeaderItem
                    onClick={() => window.open('https://testnet.opbnbscan.com/', '_blank')}
                    className={/explorer/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>Explorer</span>
                </HeaderItem>
                <HeaderItem
                    onClick={() => window.open('https://google.com', '_blank')}
                    className={/docs/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>Docs</span>
                </HeaderItem>
            </HeaderNavigation>
            <AccountWrapper>
                <AccountBalance>
                    {balance} {activeChainConfig?.nativeCurrency.symbol}
                </AccountBalance>
                <ConnectButton showBalance={false} />
            </AccountWrapper>
        </HeaderWrapper>
    );
};
