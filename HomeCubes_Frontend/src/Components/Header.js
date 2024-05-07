import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Offcanvas } from "react-bootstrap";
import wallety from "../assets/lotties/wallet.json";
import Lottie from "lottie-react";
import { NavLink, useNavigate } from "react-router-dom";
import ConnectWallet from "../Modals/ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import { GetNftCookieToken } from "../actions/axioss/nft.axios";
import { GetUserCookieToken, userRegister } from "../actions/axioss/user.axios";
import { connectWallet, getServiceFees } from "../hooks/useWallet";
import { toast } from "react-toastify";
import { address_showing, isEmpty, sleep } from "../actions/common";
import { Currency, TOKENPRICE, USDPRICE } from "../actions/axioss/cms.axios";
import config from "../config/config";
import CopyToClipboard from "react-copy-to-clipboard";

import { client } from "../App";
import { createWallet } from "thirdweb/wallets";
import { sepolia } from 'thirdweb/chains'
import { ConnectButton } from "thirdweb/react";
import useThirdWeb from "../actions/useThirdWeb";

function Header() {
  const [active, setActive] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showWallet, setShowWallet] = useState(false);

  const handleCloseWallet = () => setShowWallet(false);
  const handleShowWallet = () => setShowWallet(true);
  const [once, setOnce] = useState(false);

  const wallet = useSelector((state) => state.LoginReducer.AccountDetails);
  const { payload, token } = useSelector((state) => state.LoginReducer.User);
  const isWalletConnected = useSelector((state) => state.LoginReducer.walletConnected);
  console.log('payloadpayloadpayload---->', payload);
  console.log('isWalletConnected---->', isWalletConnected);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [reconnect, setReconnect] = useState(true);

  const getThirdweb = useThirdWeb();
  console.log('smartAccount---->',);

  const walletDetails = getThirdweb.getSmartAccount();
  console.log('walletDetails---->', walletDetails);
  useEffect(() => {
    if (
      localStorage.getItem("walletConnectType") &&
      wallet?.accountAddress == "" &&
      reconnect
    ) {
      // initialConnectWallet(localStorage.getItem("walletConnectType"));

      setReconnect(false);
    }
    CurrencyList();
    getInitialSeviceFee();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum?.on("accountsChanged", handleAccountChange);
      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountChange);
      };
    }
  }, []);

  const handleAccountChange = (...args) => {
    // initialConnectWallet(localStorage.walletConnectType, true);
    if (walletDetails) {
      console.log('Inawaawawawawawaw---->',);
      walletDisconnect()
      // document.getElementById("ConnectWalletBtn").click();
      // initialConnectWallet("smartWallet")
      navigate("/");
    }
  };

  const isInitialRender = useRef(true);

  useEffect(() => {
    let localWallet = localStorage.getItem("thirdweb:active-wallet-id")
    if (localWallet && walletDetails && !isWalletConnected) initialConnectWallet("smartWallet");
    else {
      if (!isInitialRender.current) {
        walletDisconnect(true)
      }
    }
    console.log('isInitialRender.current---->', isInitialRender.current, localWallet, walletDetails);
    isInitialRender.current = false;
  }, [localStorage.getItem("thirdweb:active-wallet-id"), walletDetails])


  const initialConnectWallet = async (type, homePage) => {
    const id = toast.loading("Wallet Connecting...", {
      closeButton: true,
      closeOnClick: true,
    });
    console.log("ennanadkkuthu", type);
    // if(!localStorage.getItem("accountInfo")){
   sleep(2000)
    var accountDetails = await connectWallet(type, walletDetails.address);

    if (!isEmpty(accountDetails)) {
      if (accountDetails?.accountAddress) {
        const getAddress = await getThirdweb.getAdminAccountOfSmartWallet();
        console.log('getAddress---->',getAddress);
        accountDetails.parentAddress = getAddress[0]?.toString()?.toLowerCase();
        console.log("accountDetails", accountDetails);

        var NewMethod = {
          Type: "InitialConnect",
          WalletAddress: accountDetails?.accountAddress,
          parentAddress: accountDetails?.parentAddress,
          WalletType: type,
        };

        let Resp = await userRegister(NewMethod);
        console.log("errr on userRegister", Resp);
        if (Resp?.success == "success") {
          dispatch({
            type: "Register_Section",
            Register_Section: {
              User: {
                payload: Resp.data,
                token: Resp.token ? Resp.token : token,
              },
            },
          });
          dispatch({
            type: "walletConnect",
            walletSection: {
              walletConnected: true
            },
          });
          document.cookie = "token" + "=" + Resp?.token + ";" + ";path=/";
          GetNftCookieToken();
          GetUserCookieToken();
          toast.update(id, {
            render: Resp.msg,
            type: Resp.success,
            autoClose: 1000,
            isLoading: false,
            closeButton: true,
            closeOnClick: true,
          });
          handleCloseWallet();
          dispatch({
            type: "Account_Section",
            Account_Section: { AccountDetails: accountDetails },
          });
          if (homePage) navigate("/");
        } else {
          setTimeout(() => {
            toast.update(id, {
              render: Resp.msg,
              type: Resp.success,
              autoClose: 1000,
              isLoading: false,
              closeButton: true,
              closeOnClick: true,
            });
          }, 100);
        }
      } else {
        return {
          success: "error",
          msg: "No Address Detected.. Check Your Wallet",
        };
      }
    } else {
      toast.update(id, {
        render: "Try Again",
        type: "error",
        autoClose: 1000,
        isLoading: false,
        closeButton: true,
        closeOnClick: true,
      });
    }

  };

  const walletDisconnect = async (val) => {
    // localStorage.removeItem("accountInfo")
    // localStorage.removeItem("walletConnectType")
    localStorage.clear();
    getThirdweb.disconnectWallet();
    dispatch({
      type: "Account_Section",
      Account_Section: {
        AccountDetails: {
          accountAddress: "",
          tokenBalance: 0,
          coinBalance: 0,
        },
      },
    });
    dispatch({
      type: "walletConnect",
      walletSection: {
        walletConnected: false
      },
    });
    navigate("/");
    val && toast.success("Wallet disconnected...");
    // window.location.reload();
    document.cookie = "token" + "=" + "" + ";" + ";path=/";
    GetNftCookieToken();
    GetUserCookieToken();
  };


  // if (isEmpty(walletDetails)) walletDisconnect();

  const getInitialSeviceFee = async () => {
    var fees = await getServiceFees();
    console.log("getServiceFees", fees);
    if (fees) {
      dispatch({
        type: "ServiceFees",
        ServiceFees_Section: {
          ServiceFees: fees,
        },
      });
    }
  };

  const CurrencyList = async () => {
    let Resp = await Currency();
    console.log("Resp@123currency", Resp?.msg);

    if (typeof Resp?.msg != "string") {
      var sen = [];
      var bnb =
        Resp?.msg?.filter((item) => item.ChainId == config.BNBCHAIN) ?? [];
      var eth =
        Resp?.msg?.filter((item) => item.ChainId == config.ETHCHAIN) ?? [];
      console.log("aaaaaaasssssssssssssssssssssssssaa", sen, bnb, eth);
      var bnbdatas = await Promise.all(
        bnb[0]?.CurrencyDetails ||
        []?.map(async (data) => {
          if (data.label == "BNB" || data.label == "ETH")
            var USD = await USDPRICE(data.label);
          else var USD = await TOKENPRICE(data.address);
          sen.push({
            value: data.value,
            label: data.label,
            address: data.address.toLowerCase(),
            usd: USD ? USD : 0,
            decimal: data.decimal,
          });
        })
      );
      var ethdatas = await Promise.all(
        eth[0]?.CurrencyDetails ||
        []?.map(async (data) => {
          if (data.label == "BNB" || data.label == "ETH")
            var USD = await USDPRICE(data.label);
          else var USD = await TOKENPRICE(data.address);
          sen.push({
            value: data.value,
            label: data.label,
            address: data.address.toLowerCase(),
            usd: USD ? USD : 0,
            decimal: data.decimal,
          });
        })
      );
      console.log("currencydats", sen, bnbdatas, ethdatas);
      dispatch({
        type: "Register_Section",
        Register_Section: {
          currency: config.CHAIN_ID == 97 ? bnbdatas : ethdatas,
          //   ethcurrency : ethdatas.length > 0 ? ethdatas : sen
        },
      });
    }
  };
  console.log("wwwwwwwwwwwwwwww", wallet);

  return (
    <>
      <Container fluid className="whole_header">
        <Container className="custom_container">
          <Row className="header_row">
            <Col lg={2} md={3} sm={4} xs={4} xl={2} xxl={2} className="d-flex justify-content-start align-items-center">
              <NavLink to="/">
                <img
                  className="img-fluid mainLogo"
                  src={require("../assets/images/logo.svg").default}
                />
              </NavLink>
              <NavLink to="/">
                <img
                  className="img-fluid logoMob"
                  src={require("../assets/images/logomob.svg").default}
                />
              </NavLink>
            </Col>
            <Col xxl={7} xl={7} lg={7} sm={0} className="header_links">
              <div className="header_navs">
                <ul>
                  <NavLink className="sidetab_link" to="/howitworks">
                    <li
                      className={
                        active == "works" ? "active header_link" : "header_link"
                      }
                      onClick={() => setActive("works")}
                    >
                      How it works{" "}
                    </li>
                  </NavLink>
                  <NavLink className="sidetab_link" to="/roadmap">
                    <li
                      className={
                        active == "roadmap"
                          ? "active header_link"
                          : "header_link"
                      }
                      onClick={() => setActive("roadmap")}
                    >
                      Roadmap
                    </li>
                  </NavLink>
                  <NavLink className="sidetab_link" to="/about">
                    <li
                      className={
                        active == "about" ? "active header_link" : "header_link"
                      }
                      onClick={() => setActive("about")}
                    >
                      About & Team
                    </li>
                  </NavLink>
                  <NavLink className="sidetab_link" to="/projects">
                    <li
                      className={
                        active == "projects"
                          ? "active header_link"
                          : "header_link"
                      }
                      onClick={() => setActive("projects")}
                    >
                      Projects
                    </li>
                  </NavLink>
                  <NavLink className="sidetab_link" to="/blogs">
                    <li
                      className={
                        active == "news" ? "active header_link" : "header_link"
                      }
                      onClick={() => setActive("news")}
                    >
                      Blog
                    </li>
                  </NavLink>
                  <NavLink className="sidetab_link" to="/contact">
                    <li
                      className={
                        active == "contact"
                          ? "active header_link"
                          : "header_link"
                      }
                      onClick={() => setActive("contact")}
                    >
                      Contact us
                    </li>
                  </NavLink>

                  {wallet && wallet?.accountAddress && (
                    <NavLink
                      className="sidetab_link"
                      to={`/profile/${wallet.accountAddress}`}
                    >
                      <li
                        className={
                          active == "contact"
                            ? "active header_link"
                            : "header_link"
                        }
                        onClick={() => setActive("profile")}
                      >
                        My Profile
                      </li>
                    </NavLink>
                  )}
                  {/* <li className={active == "whitepaper" ? "active header_link" : "header_link"}
                    onClick={() => setActive("whitepaper")}>Whitepaper</li>
                   
                    <NavLink className="sidetab_link" to='/'>
                  <li className={active == "buysell" ? "active header_link" : "header_link"}
                    onClick={() => setActive("buysell")}>How-to-buy/sell </li>
                    </NavLink>
                    <NavLink className="sidetab_link" to='/'>
                  <li className={active == "news" ? "active header_link" : "header_link"}
                    onClick={() => setActive("news")}>News</li>
                    </NavLink> */}
                </ul>
              </div>
            </Col>
            <Col
              xl={3}
              xxl={2}
              lg={3}
              md={6}
              sm={4}
              xs={8}
              className="d-flex justify-content-end align-items-center"
            >
              {wallet && wallet?.accountAddress && <div className="position-relative custom_user_token_detail mbl_view_user_hvr me-2">
                {/* <span className="user_hvr_btn primary_blueBtn ms-2">
                  <i class="fa-solid fa-user"></i>
                </span> */}

                <NavLink
                  className="user_hvr_btn primary_blueBtn ms-2"
                  to={`/profile/${wallet.accountAddress}`}
                >
                  <span >
                    {payload?.Profile != "" ?
                      <img
                        className='img-fluid prof_img_header'
                        // style={{maxHeight:"100%",maxWidth:"100%"}}
                        src={`${config?.IMG_URL}/user/${payload?.WalletAddress}/profile/${payload?.Profile}`}
                      />
                      :
                      <i class="fa-solid fa-user mt-1"></i>}
                  </span>
                </NavLink>

                <div className="user_hidden_cnt">
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <p className="bal mb-0">Balance</p>
                    <NavLink
                      className="sidetab_link"
                      to={`/profile/${wallet.accountAddress}`}
                    >
                      <li
                        className={
                          active == "contact"
                            ? "active header_link"
                            : "header_link"
                        }
                        onClick={() => setActive("profile")}
                      >
                        My Profile
                      </li>
                    </NavLink>
                  </div>
                  <p className="id mb-1">{parseFloat(wallet?.coinBalance).toFixed(5)} BNB</p>
                  <p className="metamask mb-1">MetaMask</p>
                  <div className="token mb-1 d-flex align-items-center justify-content-between">
                    <span>{address_showing(wallet?.accountAddress)}</span>
                    <CopyToClipboard
                      onCopy={() => toast.success("Address copied successfully")}
                      text={`${wallet?.accountAddress}`}
                    >
                      <i class="fa-regular fa-copy"></i>

                    </CopyToClipboard>
                  </div>
                  <hr className="mt-2 mb-0" />
                </div>
              </div>}

              <div className="header__thirdParty">
                <ConnectButton
                  connectButton={{
                    label: "Connect",
                    className: "header_newGradientBtn",
                  }}
                  client={client}
                  wallets={[createWallet("io.metamask"),createWallet("walletConnect"),createWallet("com.coinbase.wallet")]}
                  accountAbstraction={{
                    chain: sepolia,
                    factoryAddress: "0x204e6475FB6611171EB7fa323dAb82da42bC72B8",
                    gasless: true,
                  }}
                  detailsButton={{
                    className: "header_aftConnect"
                  }}
                />
              </div>
              {/* <Lottie animationData={wallety} className="header_simmer" loop={true}/> */}

              {wallet && wallet?.accountAddress ? (
                <div className="burger_head">
                  {/* <div className="wallet_only active header_link" onClick={() => walletDisconnect()} >Disconnect</div> */}
                  {/* <button
                    className="wallet_only disconnect_ic me-2"
                    onClick={() => walletDisconnect()}
                  >
                    <i class="fa-solid fa-right-from-bracket"></i>
                  </button> */}
                  {/* <img
                    onClick={() => handleShowWallet()}
                    className="header_wallet wallet_only"
                    src={require("../assets/images/wallet.svg").default}
                  /> */}
                  <img
                    className="header_burger"
                    onClick={handleShow}
                    src={require("../assets/images/hamburger.svg").default}
                  />
                </div>
              ) : (
                <div className="burger_head">
                  {/* <img
                    onClick={() => handleShowWallet()}
                    className="header_wallet wallet_only"
                    src={require("../assets/images/wallet.svg").default}
                  /> */}
                  <img
                    className="header_burger"
                    onClick={handleShow}
                    src={require("../assets/images/hamburger.svg").default}
                  />
                </div>
              )}

              {wallet && wallet?.accountAddress && <div className="position-relative custom_user_token_detail web_view_user_hvr">
                <NavLink
                  className="user_hvr_btn primary_blueBtn ms-2"
                  to={`/profile/${wallet.accountAddress}`}
                >

                  {payload?.Profile != "" ?
                    <img
                      className='img-fluid'
                      src={`${config?.IMG_URL}/user/${payload?.WalletAddress}/profile/${payload?.Profile}`}
                    />
                    :
                    <span >
                      <i class="fa-solid fa-user"></i>
                    </span>
                  }

                </NavLink>

                <div className="user_hidden_cnt">
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    <p className="bal mb-0">Balance</p>
                    <NavLink
                      className="sidetab_link"
                      to={`/profile/${wallet.accountAddress}`}
                    >
                      <li
                        className={
                          active == "contact"
                            ? "active header_link"
                            : "header_link"
                        }
                        onClick={() => setActive("profile")}
                      >
                        My Profile
                      </li>
                    </NavLink>
                  </div>
                  <p className="id mb-1">{parseFloat(wallet?.coinBalance).toFixed(5)} BNB</p>
                  <p className="metamask mb-1">MetaMask</p>
                  <div className="token mb-1 d-flex align-items-center justify-content-between">
                    <span>{address_showing(wallet?.accountAddress)}</span>
                    <CopyToClipboard
                      onCopy={() => toast.success("Address copied successfully")}
                      text={`${wallet?.accountAddress}`}
                    >
                      <i class="fa-regular fa-copy"></i>

                    </CopyToClipboard>
                  </div>
                  <hr className="mt-3  mb-0" />
                </div>
              </div>}
            </Col>
          </Row>
        </Container>
      </Container>

      {/* offcanvas  */}
      <Offcanvas
        show={show}
        className="header_canva"
        placement="end"
        backdrop="static"
        onHide={handleClose}
      >
        <Offcanvas.Header>
          <div className="header_canvahead">
            <img
              className="header_canvalogo"
              src={require("../assets/images/logo.svg").default}
            />
            <i
              class="fa-solid fa-xmark canva_closer"
              onClick={() => handleClose()}
            />
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="canva_headerlinks">
            <ul>
              <NavLink className="sidetab_link" to="/howitworks">
                <li
                  className={
                    active == "works" ? "active header_link" : "header_link"
                  }
                  onClick={() => setActive("works")}
                >
                  How it works{" "}
                </li>
              </NavLink>
              <NavLink className="sidetab_link" to="/roadmap">
                <li
                  className={
                    active == "roadmap" ? "active header_link" : "header_link"
                  }
                  onClick={() => setActive("roadmap")}
                >
                  Roadmap
                </li>
              </NavLink>
              <NavLink className="sidetab_link" to="/about">
                <li
                  className={
                    active == "about" ? "active header_link" : "header_link"
                  }
                  onClick={() => setActive("about")}
                >
                  About & Team
                </li>
              </NavLink>
              <NavLink className="sidetab_link" to="/projects">
                <li
                  className={
                    active == "projects" ? "active header_link" : "header_link"
                  }
                  onClick={() => setActive("projects")}
                >
                  Projects
                </li>
              </NavLink>
              <NavLink className="sidetab_link" to="/blogs">
                <li
                  className={
                    active == "news" ? "active header_link" : "header_link"
                  }
                  onClick={() => setActive("news")}
                >
                  Blog
                </li>
              </NavLink>
              <NavLink className="sidetab_link" to="/contact">
                <li
                  className={
                    active == "contact" ? "active header_link" : "header_link"
                  }
                  onClick={() => setActive("contact")}
                >
                  Contact us
                </li>
              </NavLink>
              <NavLink
                className="sidetab_link"
                to={`/profile/${wallet.accountAddress}`}
              >
                <li
                  className={
                    active == "contact" ? "active header_link" : "header_link"
                  }
                  onClick={() => setActive("profile")}
                >
                  My Profile
                </li>
              </NavLink>

              {/* <li className={active == "whitepaper" ? "active header_link" : "header_link"}
                    onClick={() => setActive("whitepaper")}>Whitepaper</li>
                   
                    <NavLink className="sidetab_link" to='/'>
                  <li className={active == "buysell" ? "active header_link" : "header_link"}
                    onClick={() => setActive("buysell")}>How-to-buy/sell </li>
                    </NavLink>
                    <NavLink className="sidetab_link" to='/'>
                  <li className={active == "news" ? "active header_link" : "header_link"}
                    onClick={() => setActive("news")}>News</li>
                    </NavLink> */}
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <ConnectWallet show={showWallet} handleCloseWallet={handleCloseWallet} />
      {/* end of offcanvas */}
    </>
  );
}

export default Header;
