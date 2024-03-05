import { Outlet } from 'react-router-dom';
import { ShellBody, ShellBodyContent, ShellWrapper } from './Styles';
import { Header } from '../../Components/Header';

export const Shell = () => {
    return (
        <ShellWrapper>
            <Header />
            <ShellBody id="shellBody">
                <ShellBodyContent>
                    <Outlet />
                </ShellBodyContent>
            </ShellBody>
        </ShellWrapper>
    );
};
