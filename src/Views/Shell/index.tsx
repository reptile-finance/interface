import { Outlet, useLocation } from 'react-router-dom';
import { AccountWrapper, ShellBody, ShellBodyContent, ShellBodyHeader, ShellWrapper } from './Styles';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMemo } from 'react';
import { Header } from '../../Components/Header';

export const Shell = () => {
    const location = useLocation();

    const sectionTitle = useMemo(() => {
        const title = location.pathname.replace('/', '').replace('-', ' ');
        return title.length > 0 ? title : 'Overview';
    }, [location.pathname]);

    return (
        <ShellWrapper>
            <Header />
            <ShellBody id="shellBody">
                <ShellBodyHeader>
                    <h1 className="current-path">{sectionTitle}</h1>
                    <AccountWrapper>
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
