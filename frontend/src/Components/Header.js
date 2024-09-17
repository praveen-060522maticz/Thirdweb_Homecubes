import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Offcanvas, Navbar, Nav, Dropdown, DropdownToggle, DropdownMenu } from "react-bootstrap";
import wallety from "../assets/lotties/wallet.json";
import Lottie from "lottie-react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import ConnectWallet from "../Modals/ConnectWallet";
import { useDispatch, useSelector } from "react-redux";
import { GetNftCookieToken } from "../actions/axioss/nft.axios";
import { GetUserCookieToken, getFessFunc, userRegister } from "../actions/axioss/user.axios";
import { connectWallet, getServiceFees } from "../hooks/useWallet";
import { toast } from "react-toastify";
import { address_showing, getBNBvalue, isEmpty, sleep } from "../actions/common";
import { Currency, TOKENPRICE, USDPRICE } from "../actions/axioss/cms.axios";
import config from "../config/config";
import CopyToClipboard from "react-copy-to-clipboard";
import { usePrivy, useWallets, useLinkAccount } from "@privy-io/react-auth";
import useContractProviderHook from "../actions/contractProviderHook";
import Web3 from "web3";
import TradeAbi from '../Abi/trade.json';
import Token from '../Abi/token.json';
import web3utill from 'web3-utils'




function Header() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);  // initially closed
    const toggleMenu = () => {
        // alert(1)
        const getWindowWidth = window.innerWidth
        console.log("windn", getWindowWidth, menuOpen)
        if (getWindowWidth < 992) {

            setMenuOpen(false)
        } else { setMenuOpen(false) }

        // this handler is "regular"
        // setMenuOpen(!menuOpen);    // open and close...
    };


    const [active, setActive] = useState();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showWallet, setShowWallet] = useState(false);

    const handleCloseWallet = () => setShowWallet(false);
    const handleShowWallet = () => setShowWallet(true);
    const [once, setOnce] = useState(false);

    const wallet = useSelector((state) => state.LoginReducer.AccountDetails);
    const { payload, token, gasFee } = useSelector((state) => state.LoginReducer.User);
    const { currency } = useSelector(state => state.LoginReducer)
    const isWalletConnected = useSelector((state) => state.LoginReducer.walletConnected);
    console.log('payloadpayloadpayload---->', payload, gasFee);
    console.log('isWalletConnected---->', isWalletConnected);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [reconnect, setReconnect] = useState(true);
    const { login, logout, connectOrCreateWallet, authenticated } = usePrivy();
    const { wallets, ready, } = useWallets();
    const connectedwalet = wallets[0];
    console.log('connectedwalet---->', currency);
    console.log('Check Page---->', ready, authenticated, !isWalletConnected, reconnect, connectedwalet);
    useEffect(() => {
        // if (
        //   localStorage.getItem("walletConnectType") &&
        //   wallet?.accountAddress == "" &&
        //   reconnect
        // ) {
        //   initialConnectWallet(localStorage.getItem("walletConnectType"));

        //   setReconnect(false);
        // }
        getInitialSeviceFee();
    }, []);

    useEffect(() => {
        if (ready && authenticated && !isWalletConnected && reconnect && connectedwalet) {
            // wallets[0].linked
            initialConnectWallet("privyWallet");
            CurrencyList();
            return setReconnect(false)
        }
        // else if (ready && authenticated && isEmpty(connectedwalet)) localStorage.clear()

    }, [ready, authenticated, isWalletConnected, connectedwalet, reconnect])

    // useEffect(() => {
    //   if (window.ethereum) {
    //     window.ethereum?.on("accountsChanged", handleAccountChange);
    //     return () => {
    //       window.ethereum?.removeListener("accountsChanged", handleAccountChange);
    //     };
    //   }
    // }, []);

    // const handleAccountChange = (...args) => {
    //   if (connectedwalet?.connectorType == "injected")
    //     initialConnectWallet(localStorage.walletConnectType, true);
    // };

    const initialConnectWallet = async (type, homePage) => {
        const id = toast.loading("Wallet Connecting...", {
            closeButton: true,
            closeOnClick: true,
        });
        console.log("ennanadkkuthu", type);
        // if(!localStorage.getItem("accountInfo")){
        // sleep(2000)
        var accountDetails = type == "privyWallet" ? await connectPrivyWalllet(type) : await connectWallet(type);
        console.log('accountDetailsasa--->', accountDetails);
        if (!isEmpty(accountDetails)) {
            if (accountDetails?.accountAddress) {
                console.log("accountDetails", accountDetails);
                const getFees = await getFessFunc({ action: "get" });
                console.log('getFees---->', getFees);
                var NewMethod = {
                    Type: "InitialConnect",
                    WalletAddress: accountDetails?.accountAddress,
                    parentAddress: accountDetails?.accountAddress,
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
                                gasFee: getFees || {}
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
                    // setTimeout(()=>{
                    //   toast("ahfoiahwofahwf sgsg sgseg sgsegseges",{
                    //     autoClose:1000000000,
                    //     progressStyle:{
                    //       "color": "#190083",
                    //     },
                    //     style:{
                    //     "color": "#190083",
                    //     "background-color": "#78dca6",
                    //     "font-weight": 700,
                    //     "text-wrap": "wrap",

                    //   }})
                    // },2000)

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
                            autoClose: 100000,
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

    const walletDisconnect = async () => {
        try {
            localStorage.removeItem("accountInfo")
            localStorage.removeItem("walletConnectType")
            connectedwalet.disconnect();
            await logout()
            // localStorage.clear();
            // getThirdweb.disconnectWallet();
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
            toast.success("Wallet disconnected...");
            setReconnect(true)
            // window.location.reload();
            document.cookie = "token" + "=" + "" + ";" + ";path=/";
            GetNftCookieToken();
            GetUserCookieToken();
        } catch (e) {
            console.log('Erorro on desconnect---->', e);
        }

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

        if (connectedwalet && typeof Resp?.msg != "string") {



            var sen = [];
            var bnb =
                Resp?.msg?.filter((item) => item.ChainId == config.BNBCHAIN) ?? [];
            var eth =
                Resp?.msg?.filter((item) => item.ChainId == config.ETHCHAIN) ?? [];
            console.log("aaaaaaasssssssssssssssssssssssssaa", sen, bnb, eth);
            var bnbdatas = await Promise.all(
                bnb[0]?.CurrencyDetails ||
                []?.map(async (data) => {
                    // if (data.label == "BNB" || data.label == "ETH")
                    //   var USD = await USDPRICE(data.label);
                    // else var USD = await TOKENPRICE(data.address);
                    const web3p = new Web3(config.RPC_URL)
                    let TokenContract;
                    try {

                        TokenContract = new web3p.eth.Contract(Token, data.address);
                    } catch (e) {
                        console.log('Error---->', e);
                    }
                    const getBalance = await TokenContract?.methods?.balanceOf(connectedwalet.address)?.call();
                    const getSymbol = await TokenContract?.methods?.symbol(connectedwalet.address)?.call();
                    const convertPrice = await getBNBvalue(`${getSymbol}USDT`)
                    console.log('convertPrice---->', convertPrice);
                    sen.push({
                        value: data.value,
                        label: data.label,
                        address: data.address.toLowerCase(),
                        balance: getBalance ? getBalance : 0,
                        decimal: data.decimal,
                        convertPrice
                    });
                })
            );
            var ethdatas = await Promise.all(
                eth[0]?.CurrencyDetails?.map(async (data) => {
                    console.log('data---->', data);
                    // if (data.label == "BNB" || data.label == "ETH")
                    //   var USD = await USDPRICE(data.label);
                    // else var USD = await TOKENPRICE(data.address);
                    const web3p = new Web3(config.RPC_URL)
                    let TokenContract;

                    if (data?.address == config.DEADADDRESS) {
                        var getBalance = await web3p.eth.getBalance(connectedwalet.address)
                    } else {
                        try {

                            TokenContract = new web3p.eth.Contract(Token, data.address);
                        } catch (e) {
                            console.log('Error---->', e);
                        }
                        var getBalance = await TokenContract?.methods?.balanceOf(connectedwalet.address).call();
                        console.log('getBalance---->', getBalance, parseFloat(getBalance));
                    }
                    const getSymbol = await TokenContract?.methods?.symbol(connectedwalet.address).call();
                    const convertPrice = await getBNBvalue(`${getSymbol?.toUpperCase()}USDT`)
                    console.log('convertPrice---->', convertPrice);

                    sen.push({
                        value: data.value,
                        label: data.label,
                        address: data.address.toLowerCase(),
                        balance: getBalance ? (parseFloat(getBalance) / 1e18).toFixed(5) : 0,
                        decimal: data.decimal,
                        convertPrice: parseFloat(convertPrice)
                    });
                })
            );
            console.log("currencydats", sen, bnbdatas, ethdatas);
            dispatch({
                type: "Register_Section",
                Register_Section: {
                    currency: config.CHAIN_ID == 97 ? bnbdatas : sen,
                    //   ethcurrency : ethdatas.length > 0 ? ethdatas : sen
                },
            });
        }
    };
    console.log("wwwwwwwwwwwwwwww", wallet);

    const connectPrivyWalllet = async (type) => {
        try {
            var accountDetails = {}
            // const wallet = wallets[0];
            const provider = await connectedwalet.getEthereumProvider();
            console.log('providerprovider---->', provider);
            const web3 = new Web3(provider);
            const web3p = new Web3(config.RPC_URL)
            const address = connectedwalet.address

            accountDetails.accountAddress = address?.toString()?.toLowerCase();
            localStorage.setItem("accountInfo", address)
            localStorage.setItem('walletConnectType', type);

            accountDetails.coinBalance = parseInt(await web3p.eth.getBalance(address)) / 1e18
            accountDetails.web3p = web3p;
            accountDetails.web3 = web3;
            accountDetails.tokenBalance = 0
            console.log("acocococococo", accountDetails);
            let CONTRACT = new web3p.eth.Contract(TradeAbi, config.TradeContract);

            // accountDetails.USDTaddress = CONTRACT.methods?.["staticToken"] ? await CONTRACT.methods?.staticToken()?.call() : config.STATIC_TOKEN
            // console.log("acocococococo", accountDetails);
            // let TokenContract = new web3p.eth.Contract(Token, accountDetails.USDTaddress);
            // const getSymbol = await TokenContract.methods.symbol().call();
            // const getBalance = await TokenContract.methods.balanceOf(address).call();
            // const getBnbValue = parseFloat(await getBNBvalue("BNBUSDT"))
            // const convertValue = getSymbol == "USDT" ? getBnbValue : (1 / getBnbValue)

            accountDetails.BNBUSDT = parseFloat(await getBNBvalue("BNBUSDT"))
            // console.log('Tokencinstra---->', getSymbol, getBalance, getBnbValue, convertValue);
            return accountDetails;
        } catch (e) {
            console.log('Error on connectPrivyWalllet---->', e);
        };


    }

    return (
        <>

            <div className="homecube_header">

                <Navbar key="lg" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">  <img
                            className="img-fluid mainLogo"
                            src={require("../assets/images/logo.svg").default}
                        />
                            <img
                                className="img-fluid logoMob"
                                src={require("../assets/images/logomob.svg").default}
                            />
                        </Navbar.Brand>
                        <div className="d-block d-lg-none">
                            <div className="d-flex align-items-center gap-3">
                                {wallet && wallet?.accountAddress &&
                                    <Dropdown onMouseLeave={() => setShowDropdown(false)}
                                        onMouseOver={() => setShowDropdown(true)}>
                                        <DropdownToggle className="droptoggle py-0 px-0">
                                            <NavLink
                                                className="user_hvr_btn primary_blueBtn me-0"
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
                                                        <i class="fa-solid fa-user"></i>}
                                                </span>
                                            </NavLink></DropdownToggle>
                                        <DropdownMenu className="dropmenu px-2" show={showDropdown}>
                                            <div className="mb-2 d-flex align-items-center justify-content-between">
                                                <p className="bal mb-0">Balances</p>
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
                                            {currency?.length != 0 && currency.map((val) => {
                                                return (
                                                    <p className="id mb-1">{val?.balance} {val?.value}</p>
                                                )
                                            })}
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
                                        </DropdownMenu>
                                    </Dropdown>
                                }
                                {wallet && wallet?.accountAddress && authenticated ? (
                                    <button
                                        className="logoutss"
                                        onClick={() => walletDisconnect()}
                                    >
                                        <i class="fa-solid fa-right-from-bracket"></i>


                                    </button>
                                ) : (
                                    <button
                                         className="walletbtn"
                                        onClick={() => {
                                            if (ready && authenticated && !isWalletConnected && connectedwalet) {
                                                // wallets[0].linked
                                                initialConnectWallet("privyWallet");
                                                CurrencyList();
                                                return setReconnect(false)
                                            }
                                            else if (ready && authenticated && !isWalletConnected && isEmpty(connectedwalet)) logout();
                                            else login();
                                        }}
                                    >
                                        <img
                                            className="header_wallet"
                                            src={require("../assets/images/wallet.svg").default}
                                        />

                                        <Lottie
                                            animationData={wallety}
                                            className="header_walletLottie"
                                            loop={true}
                                        />
                                    </button>
                                )}
                                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} onClick={() => setMenuOpen(!menuOpen)} />
                            </div>
                        </div>
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-lg`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                            placement="end"
                            restoreFocus={false}
                            show={menuOpen}
                            onHide={() => setMenuOpen(!menuOpen)}
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                                    <NavLink to="/" onClick={() => toggleMenu()}>
                                        <img
                                            className="img-fluid navLogo"
                                            src={require("../assets/images/logo.svg").default}
                                        />
                                    </NavLink></Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="ms-auto align-items-center">
                                    <NavLink to="https://homecubes.io/" target="_blank" activeClassName="active" onClick={() => toggleMenu()}> Website</NavLink>
                                    <NavLink to="/contact" activeClassName="active" onClick={() => toggleMenu()}> Contact</NavLink>
                                    {wallet && wallet?.accountAddress && (
                                        <NavLink to={`/profile/${wallet.accountAddress}`} activeClassName="active" onClick={() => toggleMenu()}> Profile</NavLink>)}
                                    {wallet && wallet?.accountAddress && authenticated ? (
                                        <button
                                            className="header_gradientBtn"
                                            onClick={() => walletDisconnect()}
                                        >
                                            <i class="fa-solid fa-right-from-bracket"></i>
                                            Disconnect
                                            <Lottie
                                                animationData={wallety}
                                                className="header_walletLottie"
                                                loop={true}
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            className="header_gradientBtn hc-auth__button"
                                            onClick={() => {
                                                if (ready && authenticated && !isWalletConnected && connectedwalet) {
                                                    // wallets[0].linked
                                                    initialConnectWallet("privyWallet");
                                                    CurrencyList();
                                                    return setReconnect(false)
                                                }
                                                else if (ready && authenticated && !isWalletConnected && isEmpty(connectedwalet)) logout();
                                                else login();
                                            }}
                                        >
                                            <img
                                                className="header_wallet"
                                                src={require("../assets/images/wallet.svg").default}
                                            />
                                            Login
                                            <Lottie
                                                animationData={wallety}
                                                className="header_walletLottie"
                                                loop={true}
                                            />
                                        </button>
                                    )}
                                    {wallet && wallet?.accountAddress &&
                                        <Dropdown onMouseLeave={() => setShowDropdown(false)}
                                            onMouseOver={() => setShowDropdown(true)}>
                                            <DropdownToggle className="droptoggle mt-3 mt-lg-0 py-0 px-0">
                                                <NavLink
                                                    className="user_hvr_btn primary_blueBtn me-0"
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
                                                            <i class="fa-solid fa-user"></i>}
                                                    </span>
                                                </NavLink></DropdownToggle>
                                            <DropdownMenu className="dropmenu px-3 py-3" show={showDropdown}>
                                                <div className="mb-2 d-flex align-items-center justify-content-between">
                                                    <p className="bal mb-0">Balances</p>
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
                                                {currency?.length != 0 && currency.map((val) => {
                                                    return (
                                                        <p className="id mb-1">{val?.balance} {val?.value}</p>
                                                    )
                                                })}
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
                                            </DropdownMenu>
                                        </Dropdown>
                                    }

                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            </div>



            <ConnectWallet show={showWallet} handleCloseWallet={handleCloseWallet} />
            {/* end of offcanvas */}
        </>
    );
}

export default Header;