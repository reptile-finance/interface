import '@rainbow-me/rainbowkit/styles.css';
import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { RecoilRoot } from 'recoil';
import { WagmiConfig } from 'wagmi';
import { ToastContainer } from 'react-toastify';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig, chains } from './Providers/Blockchain';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Trade } from './Views/Trade';
import { ThemeProvider } from 'styled-components';
import { base } from './Theme';
import { Toaster } from 'react-hot-toast';
import { Updater } from './Components/Updater';
import { ErrorBoundary } from './Components/ErrorBoundary';
import { Notifications } from './Components/Notifications';
import { Shell } from './Views/Shell';
import { Earn } from './Views/Earn';
import { Reptile } from './Views/Reptile';

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
            { path: '/', element: <Trade />, index: true },
            { path: '/trade', element: <Trade /> },
            { path: '/earn', element: <Earn /> },
            { path: '/reptile', element: <Reptile /> },
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
                        <ToastContainer />
                    </RecoilRoot>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}

export default App;
