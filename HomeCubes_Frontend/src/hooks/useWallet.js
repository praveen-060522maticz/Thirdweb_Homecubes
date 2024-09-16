// import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Config from "../config/config";
import erc20Abi from '../Abi/erc20.json'
import marketAbi from '../Abi/market.json'
// import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { EthereumProvider } from '@walletconnect/ethereum-provider';
// import { useWeb3React } from '@web3-react/core'
// import { useDispatch, useSelector } from 'react-redux';
// import { network } from '../config/network'
import { toast } from "react-toastify";
import { getBNBvalue } from "../actions/common";
import TradeAbi from '../Abi/trade.json';
import home from '../assets/images/home.svg';
// const { Network } = useSelector(
//   (state) => state.LoginReducer
// );


export const connectWallet = async (type, changechainid, switched, Torus) => {

  var accountDetails = {}
  var web3Obj = {}

  if (type == "MetaMask" || type == 'BinanceWallet' || type == 'TrustWallet') {
    web3Obj = await MetamaskWallet(type, changechainid)
    console.log("webobjadaws", web3Obj)

  }
  if (type == 'WalletConnect') {
    web3Obj = await WalletConnect(type, changechainid, switched)
  }

  if (type == "smartWallet") {
    web3Obj = await smartWalletConnect(type, changechainid)
  }

  // if (type == "Toruswallet") {
  // }

  if (web3Obj && Object.keys(web3Obj)?.length != 0) {
    console.log("get Web3", web3Obj)
    try {
      var web3p = new Web3(Config.RPC_URL)
      // console.log('web3ssssp---->',web3p);
      const accounts = web3Obj?.web3 ? await web3Obj?.web3.eth.getAccounts() : await web3Obj.eth.getAccounts();
      console.log('accountsaaaa---->', accounts);
      accountDetails.accountAddress = accounts[0]?.toString()?.toLowerCase();
      // since integrated smart wallet in changechainid - smartaccount address provided
      // accountDetails.accountAddress = changechainid?.toLowerCase();
      console.log("sgegegegxvdzsfezefefezf", await web3p.eth.getBalance(accountDetails.accountAddress));
      accountDetails.coinBalance = await web3p.eth.getBalance(accountDetails.accountAddress) / 1e18
      accountDetails.web3p = web3p;
      accountDetails.web3 = web3Obj?.web3 ? web3Obj?.web3 : web3Obj;
      accountDetails.web3auth = web3Obj?.web3auth ? web3Obj?.web3auth : web3Obj;
      accountDetails.tokenBalance = 0
      accountDetails.BNBUSDT = parseFloat(await getBNBvalue("BNBUSDT"))
      console.log("acocococococo", accountDetails);
      let CONTRACT = await new web3p.eth.Contract(TradeAbi, Config.TradeContract);

      accountDetails.USDTaddress = CONTRACT.methods?.["staticToken"] ? await CONTRACT.methods?.staticToken?.()?.call() : Config.STATIC_TOKEN
      console.log("acocococococo", accountDetails);
      return accountDetails;
    }
    catch (e) {
      console.log("find ee", e)
      return accountDetails;
    }
  }
  else {
    return {}
  }
}

export const smartWalletConnect = async (type, address) => {
  try {
    var web3 = new Web3(window.ethereum ?? Config?.RPC_URL);
    console.log('window.ethereum---->', window.ethereum);
    localStorage.setItem("accountInfo", address)
    localStorage.setItem('walletConnectType', type)
    return web3;
  } catch (e) {
    console.log('error smaert connect---->', e);
  }
}

export const MetamaskWallet = async (type, changechainid) => {
  var web3
  try {
    console.log("window.ethereum", window.ethereum);
    if (window.ethereum && type == 'MetaMask') {
      web3 = new Web3(window.ethereum);
      if (window.ethereum.isMetaMask) {
        const chainId = await web3?.eth.getChainId();
        var correctchainid = (!Config.chain_Id_List.includes(chainId)) ? Config.CHAIN_ID : (!changechainid) ? chainId : changechainid
        console.log("accountDetails type id@che", Config.CHAIN_ID, chainId)
        if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
          chainIdCheck(Config.CHAIN_ID, web3)
        }
        web3 = new Web3(window.ethereum);
        console.log("SWITCH", await web3.eth.getChainId())
        await window.ethereum.enable().then(async () => {
          console.log("jkjj");
          // User has allowed account access to DApp...
          const accounts = await web3.eth.getAccounts();
          const account = accounts[0].toString().toLowerCase();
          localStorage.setItem("accountInfo", account)
          localStorage.setItem('walletConnectType', type)
        });

      }
      else {
        alert("Please Uninstall TrustWallet or Connect to TrustWallet")
        return false;
      }
      console.log("return web3;", web3);
      return web3;

    }
    else if (window.BinanceChain && type == 'BinanceWallet') {
      web3 = new Web3(window.BinanceChain);
      const chainId = await web3.eth.getChainId();
      ////console("accountDetails type id",chainId,web3)
      if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
        chainIdCheck()
        return true
      }
      await window.BinanceChain.enable().then(async () => {
        // User has allowed account access to DApp...
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0].toString().toLowerCase();
        localStorage.setItem("accountInfo", account)
        localStorage.setItem('walletConnectType', type)
      });
    }
    else if (type == 'TrustWallet') {
      const isTrustWallet = (ethereum) => {
        // Identify if Trust Wallet injected provider is present.
        const trustWallet = !!ethereum.isTrust;

        return trustWallet;
      };
      web3 = new Web3(window.ethereum);
      console.log("etiriumenable", web3, window.ethereum.isTrust, window.ethereum.isTrustWallet);

      const chainId = await web3.eth.getChainId();
      //console("accountDetails type id",chainId,web3)
      if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
        chainIdCheck(Config.CHAIN_ID, web3)
        return true
      }
      await window.ethereum.enable().then(async () => {
        // User has allowed account access to DApp...
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0].toString().toLowerCase();
        localStorage.setItem("accountInfo", account)
        localStorage.setItem('walletConnectType', type)
      });
    }
    // Legacy DApp Browsers
    //check
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      const chainId = await web3.eth.getChainId();
      if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
        chainIdCheck()
        return true
      }
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0].toString().toLowerCase();
      localStorage.setItem("accountInfo", account)
      localStorage.setItem('walletConnectType', type)
    }
    // Non-DApp Browsers
    else {
      //alert('No Dapp Supported Wallet Found');
      ////console("No Dapp Supported Wallet Found")
    }

  } catch (e) {
    console.log("accountDetails type id1 last", e)
  }
  // console.log("return web3;",web3);
  return web3;

}

export const WalletConnect = async (type, changechainid, status) => {
  console.log("2222")
  const CHAIN_ID = Config.CHAIN_ID;
  console.log("awrwdewe", type, changechainid, status);

  if (localStorage.getItem("accountInfo")) {
    try {


      const provider = await EthereumProvider.init({
        projectId: 'b8a1daa2dd22335a2fe1d2e139980ae0', // required
        chains: [CHAIN_ID], // required
        optionalChains: [1, 56, 43113],
        showQrModal: true // requires @walletconnect/modal
      })
      await provider.enable()

      var web3 = new Web3(provider);
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      var account = accounts[0].toString();
      localStorage.setItem("accountInfo", account)
      localStorage.setItem('walletConnectType', type)
      return web3;
    }
    catch (err) {
      toast.warning(err.toString())
    }
  }
  else {
    try {
      const provider = await EthereumProvider.init({
        projectId: 'b8a1daa2dd22335a2fe1d2e139980ae0', // required
        chains: [Config.ETHCHAIN], // required
        optionalChains: [1, 56, 43113],
        showQrModal: true // requires @walletconnect/modal
      })
      console.log("prprprprprpr", provider);
      await provider.connect()
      console.log("prprprprprpr", provider);
      var web3 = new Web3(provider);
      provider.request({
        method: 'eth_requestAccounts',
      }).then((val) => {
        console.log("valval", val);
        var account = val[0].toString();
        localStorage.setItem("accountInfo", account)
        localStorage.setItem('walletConnectType', type)
      })
        .catch((e) => {
          console.log(" eroroe on wallete connect", e);
        })


      return web3;
    }
    catch (err) {
      console.log("errr on AWfAWf", err);
      toast.warning(err.toString())
      return ({})
    }
  }

}



// export const CoinBaseWallet = async (type,apphooks) => {
//   var web3
//   const { activate, deactivate } = apphooks();
//   const { active, chainId } = apphooks();
//   //Create WalletConnect Provider
//   ////console("Wallet connect");
//   const provider = new WalletLinkConnector({
//     url: Config.RPC_URL,
//     appName: "Web3-react Demo",
//     supportedChainIds: [1, 3, 4, 5, 42],
//    });
//    activate(provider)
//    console.log('web3333333',provider)

//   // await provider.enable().then(function (error, result) {
//   //  // //console('error: ' + error);
//   //  // //console("accountInfo", result);

//   // })
//   //   .catch(e => {
//   //     //try again
//   //   });
//   // web3 = new Web3(provider);
//   // const accounts = await web3.eth.getAccounts();
//   // ////console("Account : ", accounts[0]);
//   // const account = accounts[0].toString().toLowerCase();
//   // localStorage.setItem("accountInfo", account)
//   // localStorage.setItem('walletConnectType', type)
//   ////console("accountInfo", account);
//   // localStorage.setItem("provider",JSON.stringify(provider))
//   return web3;
// }

const chainIdCheck = async (e, web3) => {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  // const hexString = Config.CHAIN_ID.toString(16);
  // console.log("hexString",hexString);
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(e).toString(16) }], // chainId must be in hexadecimal numbers
      });

      return true;
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: web3.utils.toHex(e).toString(16),
                rpcUrl: Config.RPC_URL,
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  } else {
    // if no window.ethereum then MetaMask is not installed
    //console('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    return false;

  }
}


export const getServiceFees = async () => {
  var rpcObj = new Web3(Config.RPC_URL)
  var fees = {}
  if (rpcObj) {
    try {
      var marketObj = new rpcObj.eth.Contract(
        marketAbi,
        Config.TradeContract
      );
      var servicefees = await marketObj.methods.getServiceFee().call()
      console.log("servicefeesfsefw", servicefees);
      fees.buyerFees = parseInt(servicefees[0])
      fees.sellerFees = parseInt(servicefees[1])

      return fees;
    }
    catch (e) {
      console.log("service fees catch blok running", e)
    }
  }
}
