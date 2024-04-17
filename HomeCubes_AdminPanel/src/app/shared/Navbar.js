import React, { Component, useState, useEffect, useRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getInitialProps, Trans } from 'react-i18next';
import $ from 'jquery';
import Modal from 'react-modal';
import { walletconnect } from '../../connectwallet/connectwallet.js'
import '@metamask/legacy-web3'
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { WALLET_CONNECT, WALLET_DISCONNECT } from '../../redux/action.js';
import { useLocation, useHistory } from 'react-router-dom';






import { Account_Connect, Account_disConnect, Initial_Connect } from "../../redux/action.js";


import config from '../../lib/config.js'
import { getCurrencyList } from '../../axioscalls/token.js';

toast.configure();



export default function Navbar() {


  // functions for modal 

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);




  const toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  const toggleRightSidebar = () => {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }


  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }


  ////  end of modal function \\\\\\


  const location = useLocation();
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const Wallet_Details = useSelector((state) => state.wallet_detail)
  const history = useHistory();

  const [connectButton, setConnectButton] = React.useState(true);


  // useEffect(() => {
  //   if (window?.ethereum) {
  //     window?.ethereum?.on("accountsChanged", handleAccountChange);
  //     return () => {
  //       window?.ethereum?.removeListener("accountsChanged", handleAccountChange);
  //     };
  //   }
  // }, [])

  // const handleAccountChange = (...args) => {
  //   getinit(localStorage.walletConnectType)
  // }



  useEffect(() => {
    getinit(localStorage.walletConnectType)
    console.log("wallet address useeffect", Wallet_Details && Wallet_Details.UserAccountAddr)
  }, [Wallet_Details && Wallet_Details.UserAccountAddr])


  async function getinit(type) {
    var provider = await connect_Wallet(type);
    if (provider) {
      console.log("providr", provider)
      try {
        if (localStorage.walletConnectType == "wc") {
          provider.enable().
            then(async (accounts) => {
              localStorage.setItem('walletConnectType', type)
              console.log(accounts, "accountssssssss")
              localStorage.setItem("info", accounts[0])

              // window.$('#connect_modal').modal('hide')
              closeModal();
              var web3 = new Web3(provider)

              if ((web3.currentProvider.chainId == config.chainId)
              ) {
                localStorage.setItem('walletConnectType', type)
                var balance = 0, setacc = '', currAddr = '';


                var result = JSON.parse(localStorage.walletconnect).accounts
                setacc = result[0];
                var val = await web3.eth.getBalance(setacc)
                balance = web3.utils.fromWei(String(val));
                currAddr = String(setacc).toLowerCase();
                //  var respval = await AddressUserDetails_GetOrSave_Call(currAddr);
                //var wenbl = await WenlamboValue(currAddr, web3)

                dispatch({
                  type: Account_Connect,
                  Account_Detail: {
                    UserAccountAddr: currAddr,
                    providers: provider,
                    UserAccountBal: Number(balance),
                    WalletConnected: "true",
                    Accounts: setacc,
                    web3: web3,
                    web3p: new Web3(config.ETHprovider),
                    // AddressUserDetails: respval,
                    //Wen_Bln: Number(wenbl),
                    load: "true"
                  }
                })
              }
              else {
                dispatch({
                  type: Account_disConnect,
                  Account_Detail_Disconnect: {

                    UserAccountAddr: '',
                    providers: null,
                    UserAccountBal: 0,
                    WalletConnected: "false",
                    Accounts: '',
                    AddressUserDetails: null,
                    Wen_Bln: 0,
                    load: 'wrong'

                  }
                })
                toast.warning("Please Connect to Binace Network", config.toasterOption);
              }
            })
            .catch((e) => { })
        }
        else {
          console.log("hexString", config.chainId);
          provider.request({ 'method': 'eth_requestAccounts' }).
            then(async (accounts) => {
              console.log("sdkfask")
              localStorage.setItem('walletConnectType', type)
              //window.$('#connect_modal').modal('hide')
              closeModal();
              var web3 = new Web3(provider)
              console.log("provider address", web3.currentProvider, web3.currentProvider.networkVersion, web3.currentProvider.chainId, config.chainId)
              console.log("web3.currentProvider.chainId", web3.currentProvider.chainId, config.chainlist, config.chainlist.includes(`${web3.currentProvider.chainId}`), config.versionlist.includes(`${web3.currentProvider.chainId}`))
              const chainId = await web3.eth.getChainId();
              if (parseInt(chainId) == parseInt(config.chainId)) {
                console.log("insiddecondition")
                localStorage.setItem('walletConnectType', type)
                var balance = 0, setacc = '', currAddr = '';

                var result = await web3.eth.getAccounts()
                setacc = accounts[0];
                localStorage.setItem("info", setacc)
                console.log("account", setacc)
                await web3.eth.getBalance(setacc)
                  .then(async (val) => {
                    var val = await web3.eth.getBalance(setacc)
                    balance = web3.utils.fromWei(String(val));
                    console.log("balance", balance)
                  })
                currAddr = String(setacc).toLowerCase();
                // var respval = await AddressUserDetails_GetOrSave_Call(currAddr);
                //var wenbl = await WenlamboValue(currAddr, web3)
                ////("mt wallet address check ",currAddr);
                console.log("cuuraddress", currAddr)

                localStorage.setItem("info", currAddr)
                dispatch({
                  type: Account_Connect,
                  Account_Detail: {
                    UserAccountAddr: currAddr,
                    providers: provider,
                    UserAccountBal: Number(balance),
                    WalletConnected: "true",
                    Accounts: setacc,
                    chain: web3.currentProvider.chainId,
                    web3: web3,
                    web3p: new Web3(config.ETHprovider),
                    // AddressUserDetails: respval,
                    // Wen_Bln: Number(wenbl),
                    load: "true"
                  }
                })
              }
              else {
                console.log("elsecondition")
                await chainIdCheck(web3)
                dispatch({
                  type: Account_disConnect,
                  Account_Detail_Disconnect: {

                    UserAccountAddr: '',
                    providers: null,
                    UserAccountBal: 0,
                    WalletConnected: "false",
                    Accounts: '',
                    AddressUserDetails: null,
                    Wen_Bln: 0,
                    load: 'wrong'

                  }
                })

                // toast.warning("Please Switch the Network", config.toasterOption);
              }
            })
            .catch((e) => { })
        }
      }
      catch (err) {
        console.log("err in walletconnection", err)
        toast.warning("Something went wrong" + err, config.toasterOption);

      }
    } else {
      console.log("noprovider")
      dispatch({
        type: Account_disConnect,
        Account_Detail_Disconnect: {

          SingleContract: null,
          MultipleContract: null,
          UserAccountAddr: '',
          providers: null,
          UserAccountBal: 0,
          WalletConnected: "false",
          Accounts: '',
          AddressUserDetails: null,
          Wen_Bln: 0
        }
      })
      toast.warning("Please Connect Wallet", config.toasterOption);

    }

  }


  useEffect(() => {
    getTokenList();
  }, [])


  const getTokenList = async () => {
    var resp = await getCurrencyList();
    if (resp?.success) {
      console.log(":", resp?.msg, config);
      let eth = resp?.msg.filter((item) => item.ChainId == String(config?.ETHCHAIN))
      let bnb = resp?.msg.filter((item) => item.ChainId == String(config?.BNBCHAIN))
      console.log(":::", eth, bnb)
      dispatch({
        type: Account_Connect,
        Account_Detail: {
          Categorys: config?.chainId == 97 ? bnb[0]?.CurrencyDetails : eth[0]?.CurrencyDetails ?? []
        }
      })

    }
  }


  const chainIdCheck = async (web3) => {
    // Check if MetaMask is installed
    // MetaMask injects the global API into window.ethereum
    const hexString = config.chainId.toString(16);
    console.log("hexString", hexString, web3.utils.toHex(config.chainId).toString(16));
    if (window.ethereum) {
      try {
        // check if the chain to connect to is installed

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(config.chainId).toString(16) }], // chainId must be in hexadecimal numbers
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
                  chainId: "0x" + hexString,
                  rpcUrl: config.BNBProvider,
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


  async function connect_Wallet(type) {
    console.log("type", type)
    if (type == 'wc') {
      var provider = new WalletConnectProvider({
        rpc: {
          // 56: "https://bsc-dataseed1.binance.org",
          43313: "https://api.avax-test.network/ext/bc/C/rpc" //avax
        },
        // network: 'binance',
        // chainId: 56,43113
        network: "avalanche",
        chainId: 43113
      }
      );
      localStorage.setItem('walletConnectType', type)

      return provider;
    }
    else if (type == 'mt' || type == 'math') {
      var provider = window.ethereum;
      return provider;

    }
    else if (type == 'coin98') {
      var provider = window.ethereum || window.coin98;
      return provider;

    }
    else if (type == 'binance') {
      var provider = window.BinanceChain;
      return provider;

    }
  }


  window.addEventListener('load', async () => {
    console.log("akjsfkjhasdjfhasjkfjkas")
    if (localStorage.walletConnectType == "wc") {
      var provider3 = null
      if (provider3 == null) {
        provider3 = await connect_Wallet("wc");
      }
      else if (provider3 != null) {
        (provider3).on("connect", () => {
          getinit('wc')
        });
        (provider3).on("disconnect", () => {
          localStorage.removeItem('walletConnectType')
        });
      }
    }



    else {
      if (window.ethereum) {

        window.ethereum.on('connect', function (accounts) {
          window.ethereum.on('accountsChanged', function (accounts) {
            console.log("accounts cahge function")
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
              getinit(localStorage.walletConnectType);
            }, 1000);
          })
          window.ethereum.on('chainChanged', async function (networkId) {
            console.log("chain id", networkId);
            if ((networkId == config.chainId) || (networkId == config.networkVersion)) {

              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }
              timerRef.current = setTimeout(() => {
                getinit(localStorage.walletConnectType);

              }, 1000);

            }
            else {
              getinit('mt');
            }
          })
        })
      }
      if (window.coin98) {
        window.coin98.on('connect', function (accounts) {

          window.coin98.on('accountsChanged', function (accounts) {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
              getinit(localStorage.walletConnectType);
            }, 1000);
          })

          window.coin98.on('chainChanged', async function (networkId) {
            // //("chain id",networkId);
            if (networkId == config.chainId) {
              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }
              timerRef.current = setTimeout(() => {
                getinit(localStorage.walletConnectType);

              }, 1000);

            }
            else {
              getinit('mt');
            }
          })
        })
      }
      if (window.BinanceChain) {
        // (window.BinanceChain).on('connect', function (accounts) {
        // alert(2)
        window.BinanceChain.on('accountsChanged', function (accounts) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            getinit(localStorage.walletConnectType);
          }, 1000);
        })

        window.BinanceChain.on('chainChanged', async function (networkId) {
          // //("chain id",networkId);
          if (networkId == config.chainId) {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
              getinit(localStorage.walletConnectType);

            }, 1000);

          }
          else {
            getinit('mt');
          }
        })
        // })
      }
    }


  })





  const Disconnect = async () => {

    if (localStorage.walletconnect != null && localStorage.walletConnectType == 'wc') {
      await (Wallet_Details.providers).disconnect()
      localStorage.removeItem('walletconnect')
    }
    localStorage.removeItem('walletConnectType');
    dispatch({
      type: Account_disConnect,
      Account_Detail_Disconnect: {
        SingleContract: null,
        MultipleContract: null,
        UserAccountAddr: '',
        providers: null,
        UserAccountBal: 0,
        WalletConnected: "false",
        Accounts: '',
        AddressUserDetails: null,
        Wen_Bln: 0,
        load: "false"
      }
    })



  }

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('walletConnectType');
    dispatch({
      type: Account_disConnect,
      Account_Detail_Disconnect: {
        SingleContract: null,
        MultipleContract: null,
        UserAccountAddr: '',
        providers: null,
        UserAccountBal: 0,
        WalletConnected: "false",
        Accounts: '',
        AddressUserDetails: null,
        Wen_Bln: 0,
        load: "false"
      }
    })
    localStorage.setItem("adminlogin", "no");
    history.push("/")
  }






  return (
    <>
      <nav className={(location?.pathname == "/") ? "navbar loginnavbar p-0 fixed-top d-flex flex-row" : "navbar p-0 fixed-top d-flex flex-row"}>
        {console.log("navbar")}
        <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
          <Link className="navbar-brand brand-logo-mini" to="/"><img src={require('../../assets/images/logomob.svg')} alt="logo" /></Link>
        </div>
        <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <button className={(location?.pathname == "/") ? "d-none" : "navbar-toggler align-self-center"} type="button" onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
            <span className="mdi mdi-menu"></span>
          </button>

          <ul className="navbar-nav navbar-nav-right">
            {(!Wallet_Details.UserAccountAddr) ?
              <div className="navbar-profile">
                <button className="mb-0  navbar-profile-name btn allbtn" onClick={() => setIsOpen(true)} ><Trans>Connect Wallet</Trans></button>
              </div> :


              <Dropdown alignRight as="li" className="nav-item">
                <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
                  <div className="navbar-profile">
                    <img className="img-xs rounded-circle" src={require('../../assets/images/faces/facing.png')} alt="profile" />
                    <p className="mb-0 d-none d-sm-block navbar-profile-name"><Trans>{(Wallet_Details.UserAccountAddr == Wallet_Details.Admin_Address) ? "ADMIN" : Wallet_Details.UserAccountAddr}</Trans></p>
                    <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
                  <h6 className="p-3 mb-0"><Trans>Profile</Trans></h6>
                  <Dropdown.Divider />
                  {/* <Dropdown.Item href="!#" onClick={evt => evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-settings text-success"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1"><Trans>Settings</Trans></p>
                    </div>
                  </Dropdown.Item> */}
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt => evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-logout text-danger"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <button onClick={Disconnect} className="preview-subject mb-1 allbtnlogout"><Trans>Disconnect</Trans></button>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                </Dropdown.Menu>
              </Dropdown>
            }

            {(localStorage.adminlogin == "yes") &&
              <Dropdown alignRight as="li" className="nav-item">
                <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
                  <div className="navbar-profile">
                    <p className="mb-0 d-none d-sm-block navbar-profile-name"><Trans>LOG OUT</Trans></p>
                    <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
                  <h6 className="p-3 mb-0"><Trans>Profile</Trans></h6>
                  <Dropdown.Divider />
                  {/* <Dropdown.Item href="!#" onClick={evt => evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-settings text-success"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1"><Trans>Settings</Trans></p>
                    </div>
                  </Dropdown.Item> */}
                  <Dropdown.Divider />
                  <Dropdown.Item href="!#" onClick={evt => evt.preventDefault()} className="preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-logout text-danger"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <button onClick={() => logout()} className="preview-subject mb-1 btn allbtnlogout"><Trans>Log out</Trans></button>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                </Dropdown.Menu>
              </Dropdown>}

          </ul>


          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
            <span className="mdi mdi-format-line-spacing"></span>
          </button>
        </div>

      </nav>
      <>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Wallet Options</h2>
          <button className='btn closebtn' onClick={closeModal}>x</button>
          <div>Connect Wallet</div>
          <div>
            {window && (window.ethereum) && <>
              {

                window.ethereum
                && new Web3(window.ethereum)
                && (new Web3(window.ethereum).currentProvider)
                && (new Web3(window.ethereum).currentProvider.isMetaMask)
                && (new Web3(window.ethereum).currentProvider.isMetaMask == true) &&
                <div>
                  <button className='btn allbtn mt-3' onClick={() => getinit('mt')}>Metamask</button>
                </div>}


              {/* {
										window.ethereum
										&& new Web3(window.ethereum)
										&& new Web3(window.web3.currentProvider)
										&& ((window.web3.currentProvider.isWalletConnect)==true) &&
          <div>
          <button onClick={() => {getinit('mt')}}>trust wallet</button>
          </div>} */}
              <div>
                {/* <button onClick={() => {getinit('wc')}}>wallet connect</button> */}
              </div>
              <div>
                {/* <button>coinbase</button> */}
              </div>
            </>}
          </div>
        </Modal></>

    </>

  );

}


