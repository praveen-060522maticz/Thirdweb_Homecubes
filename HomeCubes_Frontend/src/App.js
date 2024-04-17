import React from 'react';
import './App.css';
import '../src/assets/css/Style.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './Screens/Profile';
import MintProjects from './Screens/MintProjects';
import MintNFTCards from './Screens/MintNFTCards';
import CollectionNfts from './Screens/CollectionNfts'
import { createThirdwebClient } from 'thirdweb';
import config from "./config/config";
import { ThirdwebProvider } from "thirdweb/react";
import { smartWallet } from 'thirdweb/wallets';

export const client = createThirdwebClient({
  clientId: config.CLIENT_ID,
  secretKey: config.SECRET_KEY
});

function App() {

  return (
    <>
      <ThirdwebProvider
        activeChain={'sepolia'}
        supportedWallets={[
          smartWallet({
            factoryAddress: config.FACTORYADDRESS,
            thirdwebApiKey: config.SECRET_KEY,
            gasless: true
          })
        ]}
      >
        <BrowserRouter basename='/'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/staking' element={<Staking />} />
            <Route path={`/collectionInfo`} element={<CollectionInfo />} />
            <Route path='/marketplace' element={<Marketplace />} />
            <Route path={`/nftInfo/:Owner/:Id`} element={<NFTInfo />} />
            <Route path='/projects' element={<Projects />} />
            <Route path={`/projectInfo/:projectTitle`} element={<ProjectInfo />} />
            <Route path='/minting' element={<MintProjects />} />
            <Route path='/mint/:_id' element={<Minting />} />
            <Route path='/mintNFTs/:_id' element={<MintNFTCards />} />
            <Route path='/howitworks' element={<HowitWorks />} />
            <Route path='/roadmap' element={<RoadMapView />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/modalbuttons' element={<ModalButtons />} />
            <Route path={`/blogInfo/:slug`} element={<BlogInfo />} />
            <Route path='/profile/:customurl' element={<Profile />} />
            <Route path='/CollectionNfts/:projectTitle' element={<CollectionNfts />} />
          </Routes>
        </BrowserRouter>
      </ThirdwebProvider>
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
