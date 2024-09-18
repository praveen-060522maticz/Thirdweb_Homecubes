/** npm import */
import React from 'react';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { base, baseGoerli, mainnet, sepolia, polygon, polygonMumbai } from 'viem/chains';

/** local file import */

import './App.css';
import '../src/assets/css/Style1.css';
import '../src/assets/css/App.css'
import Home from './Screens/Home';
import Sticky from './Screens/Sticky';
import Minting from './Screens/Minting';
import MintProjects from './Screens/MintProjects';



/** code start */


function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/sticky",
            element: <Sticky />,
        },
        {
            path: "/minting",
            element: <MintProjects />,
        },
        // Add routes for any additional screens
    ]);

    return (
        <>
            <PrivyProvider
                appId={process.env.REACT_APP_APPKEY}
                onSuccess={(user) => console.log(`User ${user.id} logged in!`)}
                config={{
                    "appearance": { "accentColor": "#6A6FF5", "theme": "#222224", "showWalletLoginFirst": false, "logo": "https://home-cubes-frontend-3.pages.dev/static/media/logo.b931aee24b93273c30989770522e8f9c.svg" },
                    "loginMethods": ["email", "wallet", "google", "apple", "sms"],
                    "embeddedWallets": { "createOnLogin": "users-without-wallets", "requireUserPasswordOnCreate": false },
                    defaultChain: sepolia,
                    // Replace this with a list of your desired supported chains
                    supportedChains: [mainnet, sepolia, base, baseGoerli, polygon, polygonMumbai],
                    "mfa": { "noPromptOnMfaRequired": false }
                }}>
                <RouterProvider router={router} />
            </PrivyProvider>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                rtl={true}
                closeOnClick={true}
                closeButton={true}
                style={
                    {
                        zIndex: "999999",
                        "width": "400px",
                        "wordBreak": "break-word",
                        "text-align": "center",
                        "fontWeight": "500",
                        marginTop: "70px",
                    }}
            />
        </>

    );
}

export default App;