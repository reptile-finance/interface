import { HeaderWrapper, HeaderNavigation, LogoItem, HeaderItem, AccountWrapper, AccountBalance } from './Styles';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Assets/reptile-navbar-icon.png';
import { useBalances } from '../../Hooks/useBalances';
import { useConfig } from '../../Hooks/useConfig';
import { useMemo } from 'react';
import { zeroAddress } from 'viem';
import { formatBalance } from '../../Utils/Bignumber';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLocation } from 'react-router-dom';
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { GrOverview } from 'react-icons/gr';
import { PiMagnifyingGlass, PiMoney } from 'react-icons/pi';
import { IoDocumentOutline, IoWalletOutline } from 'react-icons/io5';
import { GiReptileTail } from 'react-icons/gi';

export const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getBalance } = useBalances();
    const { activeChainConfig } = useConfig();
    const { openConnectModal } = useConnectModal();
    const { openAccountModal } = useAccountModal();
    const { openChainModal } = useChainModal();

    const balance = useMemo(() => {
        return formatBalance(getBalance(zeroAddress), activeChainConfig?.nativeCurrency.decimals, 4);
    }, [activeChainConfig, getBalance]);

    const sectionTitle = useMemo(() => {
        const title = location.pathname.replace('/', '');
        return title.length > 0 ? title : 'Overview';
    }, [location.pathname]);

    return (
        <HeaderWrapper>
            <LogoItem src={Logo} alt="logo" onClick={() => navigate('/trade')} />
            <HeaderNavigation>
                <HeaderItem
                    onClick={() => navigate('/trade')}
                    className={/trade/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>Trade</span>
                    <GrOverview />
                </HeaderItem>
                <HeaderItem
                    onClick={() => navigate('/earn')}
                    className={/earn/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>Earn</span>
                    <PiMoney />
                </HeaderItem>
                <HeaderItem
                    onClick={() => navigate('/reptile')}
                    className={/reptile/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>RFT</span>
                    <GiReptileTail />
                </HeaderItem>
                <HeaderItem
                    onClick={() => window.open('https://opbnb-testnet.bscscan.com/', '_blank')}
                    className={/explorer/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>Explorer</span>
                    <PiMagnifyingGlass />
                </HeaderItem>
                <HeaderItem
                    onClick={() => window.open('https://google.com', '_blank')}
                    className={/docs/i.test(sectionTitle) ? 'active' : 'no-active'}
                >
                    <span>Docs</span>
                    <IoDocumentOutline />
                </HeaderItem>
                {openAccountModal && (
                    <HeaderItem onClick={openAccountModal} className="wallet">
                        <span>Wallet</span>
                        <IoWalletOutline />
                    </HeaderItem>
                )}
                {!openAccountModal && openChainModal && (
                    <HeaderItem onClick={openChainModal} className="wrong-network">
                        <span>Wrong network</span>
                        <IoWalletOutline />
                    </HeaderItem>
                )}
                {openConnectModal && (
                    <HeaderItem onClick={openConnectModal} className="wallet">
                        <span>Connect</span>
                        <IoWalletOutline />
                    </HeaderItem>
                )}
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
