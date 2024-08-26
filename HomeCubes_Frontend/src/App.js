

import React from 'react';
import './App.css';
import '../src/assets/css/Style.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import Staking from './Screens/Staking';
import CollectionInfo from './Screens/CollectionInfo';
import Marketplace from './Screens/Marketplace';
import NFTInfo from './Screens/NFTInfo';
import Projects from './Screens/Projects';
import ProjectInfo from './Screens/ProjectInfo';
import Minting from './Screens/Minting';
import Home from './Screens/Home';
import HowitWorks from './Screens/HowitWorks';
import RoadMapView from './Screens/RoadMapView';
import AboutUs from './Screens/AboutUs';
import Blogs from './Screens/Blogs';
import BlogInfo from './Screens/BlogInfo';
import Contact from './Screens/Contact';
import ModalButtons from './Screens/ModalButtons';
import Profile from './Screens/Profile';
import MintProjects from './Screens/MintProjects';
import MintNFTCards from './Screens/MintNFTCards';
import CollectionNfts from './Screens/CollectionNfts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { base, baseGoerli, mainnet, sepolia, polygon, polygonMumbai } from 'viem/chains';
import ParentOutlet from './Screens/ParentOutlet';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<ParentOutlet />}>
      <Route path="Home" element={<Home />} />
      <Route path="staking" element={<Staking />} />
      <Route path="collectionInfo" element={<CollectionInfo />} />
      <Route path="marketplace" element={<Marketplace />} />
      <Route path="nftInfo/:Owner/:Id" element={<NFTInfo />} />
      <Route path="projects" element={<Projects />} />
      <Route path="projectInfo/:projectTitle" element={<ProjectInfo />} />
      <Route path="minting" element={<MintProjects />} />
      <Route path="mint/:_id" element={<Minting />} />
      <Route path="mintNFTs/:_id" element={<MintNFTCards />} />
      <Route path="howitworks" element={<HowitWorks />} />
      <Route path="roadmap" element={<RoadMapView />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="contact" element={<Contact />} />
      <Route path="modalbuttons" element={<ModalButtons />} />
      <Route path="blogInfo/:slug" element={<BlogInfo />} />
      <Route path="profile/:customurl" element={<Profile />} />
      <Route path="CollectionNfts/:projectTitle" element={<CollectionNfts />} />
    </Route>
  )
);

export default function App() {
  return (
    <>
      <PrivyProvider
        appId={process.env.REACT_APP_APPKEY}
        onSuccess={(user) => console.log(`User ${user.id} logged in!`)}
        config={{
          appearance: {
            accentColor: "#6A6FF5",
            theme: "#222224",
            showWalletLoginFirst: false,
            logo: "https://home-cubes-frontend-2.pages.dev/static/media/logo.b931aee24b93273c30989770522e8f9c.svg",
          },
          loginMethods: ["email", "wallet", "google", "apple", "sms"],
          embeddedWallets: { createOnLogin: "users-without-wallets", requireUserPasswordOnCreate: false },
          defaultChain: sepolia,
          supportedChains: [mainnet, sepolia, base, baseGoerli, polygon, polygonMumbai],
          mfa: { noPromptOnMfaRequired: false },
        }}
      >
        <RouterProvider router={router} />
      </PrivyProvider>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        rtl={true}
        closeOnClick={true}
        closeButton={true}
        style={{
          zIndex: "999999",
          width: "400px",
          wordBreak: "break-word",
          textAlign: "center",
          fontWeight: "500",
          marginTop: "70px",
        }}
      />
    </>
  );
}


// import React, { useEffect } from 'react';
// import './App.css';
// import '../src/assets/css/Style.css'
// import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
// import Staking from './Screens/Staking';
// import CollectionInfo from './Screens/CollectionInfo';
// import Marketplace from './Screens/Marketplace';
// import NFTInfo from './Screens/NFTInfo';
// import Projects from './Screens/Projects';
// import ProjectInfo from './Screens/ProjectInfo';
// import Minting from './Screens/Minting';
// import Home from './Screens/Home';
// import HowitWorks from './Screens/HowitWorks';
// import RoadMapView from './Screens/RoadMapView';
// import AboutUs from './Screens/AboutUs';
// import Blogs from './Screens/Blogs';
// import BlogInfo from './Screens/BlogInfo';
// import Contact from './Screens/Contact';
// import ModalButtons from './Screens/ModalButtons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Profile from './Screens/Profile';
// import MintProjects from './Screens/MintProjects';
// import MintNFTCards from './Screens/MintNFTCards';
// import CollectionNfts from './Screens/CollectionNfts'
// import config from "./config/config";
// import { base, baseGoerli, mainnet, sepolia, polygon, polygonMumbai } from 'viem/chains';
// import { PrivyProvider } from '@privy-io/react-auth';


// function App() {



//   return (
//     <>
//       <PrivyProvider
//         appId={process.env.REACT_APP_APPKEY}
//         onSuccess={(user) => console.log(`User ${user.id} logged in!`)}
//         config={{
//           "appearance": { "accentColor": "#6A6FF5", "theme": "#222224", "showWalletLoginFirst": false, "logo": "https://home-cubes-frontend-2.pages.dev/static/media/logo.b931aee24b93273c30989770522e8f9c.svg" },
//           "loginMethods": ["email", "wallet", "google", "apple", "sms"],
//           "embeddedWallets": { "createOnLogin": "users-without-wallets", "requireUserPasswordOnCreate": false },
//           defaultChain: sepolia,
//           // Replace this with a list of your desired supported chains
//           supportedChains: [mainnet, sepolia, base, baseGoerli, polygon, polygonMumbai],
//           "mfa": { "noPromptOnMfaRequired": false }
//         }}>
//         <BrowserRouter basename='/'>
//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path='/staking' element={<Staking />} />
//             <Route path={`/collectionInfo`} element={<CollectionInfo />} />
//             <Route path='/marketplace' element={<Marketplace />} />
//             <Route path={`/nftInfo/:Owner/:Id`} element={<NFTInfo />} />
//             <Route path='/projects' element={<Projects />} />
//             <Route path={`/projectInfo/:projectTitle`} element={<ProjectInfo />} />
//             <Route path='/minting' element={<MintProjects />} />
//             <Route path='/mint/:_id' element={<Minting />} />
//             <Route path='/mintNFTs/:_id' element={<MintNFTCards />} />
//             <Route path='/howitworks' element={<HowitWorks />} />
//             <Route path='/roadmap' element={<RoadMapView />} />
//             <Route path='/about' element={<AboutUs />} />
//             <Route path='/blogs' element={<Blogs />} />
//             <Route path='/contact' element={<Contact />} />
//             <Route path='/modalbuttons' element={<ModalButtons />} />
//             <Route path={`/blogInfo/:slug`} element={<BlogInfo />} />
//             <Route path='/profile/:customurl' element={<Profile />} />
//             <Route path='/CollectionNfts/:projectTitle' element={<CollectionNfts />} />
//           </Routes>
//         </BrowserRouter>
//       </PrivyProvider>
//       <ToastContainer
//         position="top-right"
//         autoClose={1000}
//         hideProgressBar={false}
//         rtl={true}
//         closeOnClick={true}
//         closeButton={true}
//         style={
//           {
//             zIndex: "999999",
//             "width": "400px",
//             "wordBreak": "break-word",
//             "text-align": "center",
//             "fontWeight": "500",
//             marginTop: "70px",
//           }}
//       />
//     </>

//   );
// }

// export default App;
