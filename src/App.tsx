import '@rainbow-me/rainbowkit/styles.css';
import './App.css';

import { RecoilRoot } from 'recoil';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig, chains } from './Providers/Blockchain';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Overview } from './Views/Overview';
import { ThemeProvider } from 'styled-components';
import { base } from './Theme';
import { Toaster } from 'react-hot-toast';
import { Updater } from './Components/Updater';
import { ErrorBoundary } from './Components/ErrorBoundary';
import { Notifications } from './Components/Notifications';
import { Shell } from './Views/Shell';
import { Earn } from './Views/Earn';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <ErrorBoundary>
                    <Shell />
                </ErrorBoundary>
                <Toaster />
            </>
        ),
        children: [
            { path: '/', element: <Overview />, index: true },
            { path: '/overview', element: <Overview /> },
            { path: '/earn', element: <Earn />}
        ],
    },
]);

function App() {
    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <RainbowKitProvider showRecentTransactions chains={chains} modalSize="compact" theme={darkTheme()}>
                    <RecoilRoot>
                        <ThemeProvider theme={base}>
                            <RouterProvider router={router} />
                        </ThemeProvider>
                        <Updater />
                        <Notifications />
                    </RecoilRoot>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}

export default App;
