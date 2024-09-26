import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useContractProviderHook from '../actions/contractProviderHook';
import { getBNBvalue, isEmpty } from '../actions/common';
import { toast } from 'react-toastify'
import config from '../config/config';
import { network } from '../config/network';
import { BuyAccept, setPendingTransaction } from '../actions/axioss/nft.axios';
import { userRegister } from '../actions/axioss/user.axios';
import { useWallets } from '@privy-io/react-auth';
import web3utils from 'web3-utils';
import Prompt from '../Components/Prompt';
function CheckOut({ show, handleClose, item, owner, file }) {


   const navigate = useNavigate();
   console.log('buyyyyyyyy', item, owner);
   const { currency } = useSelector((state) => state.LoginReducer);
   const { web3, web3p, accountAddress, coinBalance, BNBUSDT } = useSelector(
      (state) => state.LoginReducer.AccountDetails
   );
   const { Network } = useSelector((state) => state.LoginReducer)
   // console.log('coinnnnballl',coinBalance,web3utils.fromWei(coinBalance.toString()))
   const { buyerFees, sellerFees } = useSelector(
      (state) => state.LoginReducer.ServiceFees
   );
   const { gasFee } = useSelector((state) => state.LoginReducer.User);

   console.log("getServiceFees", buyerFees, sellerFees);
   const ContractCall = useContractProviderHook();
   const dispatch = useDispatch()
   const push = useNavigate();
   // const AxiosFile = useAxiosFile()
   const { payload } = useSelector((state) => state.LoginReducer.User);
   console.log("payloadcurrency", payload, currency);
   const [referredUser, setReferredUser] = useState({});

   const [Btn, SetBtn] = useState("start");
   const [App_Btn, SetApp_Btn] = useState();
   const [Error, SetError] = useState("");
   const [NFTQuantity, SetNFTQuantity] = useState(1);
   const [TokenBalance, SetTokenBalance] = useState("0");
   const [buyerDetails, setBuyerDetails] = useState({});
   const [cakeValue, setCakeValue] = useState(0);
   const { wallets } = useWallets();
   console.log('walletswallets---->', wallets);

   useEffect(() => {
      getBNBvalue("CAKEUSDT").then((val) => {
         setCakeValue(val)
      }).catch((e) => {
         console.log("err on get", e);
      })


   }, [])

   const [canReload, setCanReload] = useState(true);
   const [allowed, setAllowed] = useState(false)
   // useEffect(() => {
   //    const handleBeforeUnload = (event) => {
   //       if (!canReload) {
   //          const confirmationMessage = 'Do Not Refresh!';
   //          event.preventDefault();
   //          event.returnValue = confirmationMessage; // For Chrome
   //          return confirmationMessage; // For Safari
   //       }
   //    };

   //    window.addEventListener('beforeunload', handleBeforeUnload);

   //    return () => {
   //       window.removeEventListener('beforeunload', handleBeforeUnload);
   //    };
   // }, [canReload]);
   console.log('allowed---->', allowed);



   const [once, setOnce] = useState(true)
   const decimal =
      currency?.filter((item) => item.label === owner.CoinName)?.pop()?.decimal ??
      18;
   // console.log('aaaaaaabbbb',currency,owner.CoinName,currency?.filter(item => item.label === owner.CoinName))
   const token_address =
      currency?.filter((item) => item.label === owner.CoinName)?.pop()?.address ??
      config.DEADADDRESS;

   const YouWillGet = useMemo(() => {
      return ContractCall.buy_bid_price_calculation(
         (owner.NFTPrice * NFTQuantity).toString(),
         decimal.toString()
      );
   }, [owner.TokenPrice, NFTQuantity]);
   console.log("YouWillGet", YouWillGet);

   useEffect(() => {

      const getAllowance = async () => {
         const getdata = await ContractCall.getAllowance(token_address, wallets[0]);
         const getPay = web3utils.toWei(String(YouWillGet))
         console.log('getThirdweb---->', getdata, getPay, getdata < getPay);
         setAllowed(getdata < getPay)
         SetApp_Btn((owner.CoinName != "BNB" && getdata < getPay) ? "init" : "start")
      }
      getAllowance()
   }, [YouWillGet, token_address])

   const Validation = async () => {
      var error = {};
      if (isEmpty(NFTQuantity)) return "Token Quantity Required";
      else if (Number(owner.NFTBalance) < Number(NFTQuantity))
         return (error.NFTQuantity =
            "NFT Quantity should be less than " + owner.NFTBalance);
      if (
         owner.CoinName != "BNB" &&
         Number(owner.TokenPrice) * Number(NFTQuantity) > Number(TokenBalance)
      )
         return "Insufficient Balance";
      else return await ContractCall.Contract_Base_Validation();
   };

   const FormSubmit = async () => {
      const id = toast.loading("Purchasing Token on processing... Do not refresh!");
      SetError("");
      SetBtn("process");
      var error = await Validation();
      console.log("after", error);
      if (error) {
         toast.update(id, {
            render: error,
            type: "error",
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
         });
         SetBtn("error");
         SetError(error);
      } else {
         console.log(
            "vaada",
            currency?.filter((item) => item.label === owner.CoinName)?.pop()
               ?.address
         );
         console.log("token_address", token_address, config.TradeContract, YouWillGet);
         setCanReload(false)
         let cont = await ContractCall.approve_721_1155( //normal
            wallets[0],
            token_address,
            network[Network].tradeContract,
            "100000000000000000000000000000000000000000000000000000000"
         );

         // let cont = await getThirdweb.useContractCall( //thirdweb
         //    "approve",
         //    0,
         //    token_address,
         //    network[Network].tradeContract,
         //    web3utils.toWei((YouWillGet + 2).toString()),
         // )

         console.log("appprove log", "approve",
            0,
            0,
            wallets[0],
            token_address,
            network[Network]?.tradeContract,
            web3utils.toWei((YouWillGet + 2).toString()),);

         // let cont = await ContractCall.gasLessTransaction( // openzepline
         //    "approve",
         //    0,
         //    0,
         //    wallets[0],
         //    token_address,
         //    network[Network]?.tradeContract,
         //    web3utils.toWei((YouWillGet + 2).toString()),
         // ) 

         // let cont = await ContractCall.validateApproveforUSDT(
         //    web3utils.toWei((YouWillGet + 2).toString()),
         //    false,
         //    wallets[0],
         //    token_address
         // )

         setCanReload(true)
         console.log("cont", cont);
         if (cont) {
            toast.update(id, {
               render: "Approve Token Successfully",
               type: "success",
               isLoading: false,
               autoClose: 1000,
               closeButton: true,
               closeOnClick: true,
            });
            SetBtn("done");
            SetApp_Btn("start");
         } else {
            toast.update(id, {
               render: "Transaction Failed",
               type: "error",
               isLoading: false,
               autoClose: 1000,
               closeButton: true,
               closeOnClick: true,
            });
            SetBtn("try");
         }
      }
   };

   useEffect(() => {
      (async () => {
         const TokenBalance = await ContractCall.Token_Balance_Calculation(
            token_address,
            accountAddress,
            wallets[0]
         );
         // console.log('tokkkeeeenballl',TokenBalance)
         SetTokenBalance(TokenBalance ? TokenBalance : 0);
      })();
   }, [TokenBalance]);


   const _Buy = async () => {
      SetApp_Btn("process");
      console.log("ghgdhdg", referredUser, payload);
      const id = toast.loading("Purchasing Token on processing");
      var error = await Validation();
      console.log(
         "ghgdhdg errrrrrrrrr",
         web3utils.toWei(YouWillGet.toString()),
         owner.CoinName == "PancakeSwap Token" ? "CAKE" : owner.CoinName,
         owner.NFTOwner,
         [
            owner.NFTId,
            web3utils.toWei(String(owner.NFTPrice * NFTQuantity)),
            NFTQuantity,
            item.ContractType,
            web3utils.toWei(String(referredUser?.earnPercentage ?? 0)),
            web3utils.toWei(
               String(payload?.referedBy && payload?.initialBuy == false ? 4 : 0)
            ),
         ],
         [
            item.ContractAddress,
            payload?.referedBy ? payload?.referedBy : config.DEADADDRESS,
         ]
      );
      SetError(error);
      if (isEmpty(error)) {
         setCanReload(false)
         let cont = await ContractCall.buy_721_1155(
            wallets[0],
            web3utils.toWei(YouWillGet.toString()),
            owner.CoinName,
            owner.NFTOwner,
            [
               owner.NFTId,
               web3utils.toWei(String(owner.NFTPrice * NFTQuantity)),
               NFTQuantity,
               item.ContractType,
               web3utils.toWei(YouWillGet.toString())
            ],
            item.ContractAddress,
         );
         let TStamp = Date.now();

         // var Arr = [
         //    owner.CoinName == "BNB" ? "saleToken" : "saleWithToken",
         //    owner.CoinName == "BNB" ? web3utils.toWei(YouWillGet.toString()) : 0,
         //    owner.CoinName !== "BNB" ? 6 : 0,
         //    wallets[0],
         //    owner.NFTOwner,
         //    [
         //       owner.NFTId,
         //       web3utils.toWei(String(owner.NFTPrice * NFTQuantity)),
         //       NFTQuantity,
         //       item.ContractType
         //    ],
         //    item.ContractAddress,
         //    TStamp,
         //    gasFee?.collectAddress,
         //    "2500000000000000000"
         // ]
         // if (owner.CoinName != "BNB") Arr.splice(4, 0, owner.CoinName)
         // console.log('ArrArrArrArrArr---->', Arr);
         // let cont = await getThirdweb.useContractCall(...Arr)
         // let cont = await ContractCall.gasLessTransaction(...Arr)
         setCanReload(true)
         console.log("contcont", cont);
         if (cont) {
            let newOwner = {
               HashValue: cont.HashValue,
               NewTokenOwner: accountAddress,
               NFTQuantity: NFTQuantity,
               NFTId: owner.NFTId,
               NFTOwner: owner.NFTOwner,
               PutOnSale: owner.PutOnSale,
               PutOnSaleType: owner.PutOnSaleType,
               activity: "Buy",
               TP: owner.NFTPrice,
               New_EmailId: payload?.EmailId,
               CN: owner.CoinName,
               click: `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${accountAddress}/${owner.NFTId}`,
               initialBuy: payload?.initialBuy,
               referedBy: payload?.referedBy,
               royaltyReceiver: cont?.royaltyInfo?.[1] || "",
               earnPercentage: cont?.royaltyInfo?.[2] ? web3utils.fromWei(String(cont.royaltyInfo[2])) : 0,
               Earning: cont?.royaltyInfo?.[3] ? web3utils.fromWei(String(cont.royaltyInfo[3])) : 0,
               projectId: owner.projectId
            };

            let pendingObj = {
               From: accountAddress,
               method: owner.CoinName == "BNB" ? "saleToken" : "saleWithToken",
               params: [{ newOwner: newOwner, item: item }],
               TimeStamp: TStamp
            }

            let Resp = cont.status == "pending" ? await setPendingTransaction(pendingObj) : await BuyAccept({ newOwner: newOwner, item: item });
            console.log("Resp", Resp);

            if (cont.status == "pending") {
               setTimeout(() => {
                  navigate("/");
               }, 1500)

               return toast.update(id, {
                  render:
                     <div>
                        <p className="mb-0">Sale is pending...</p>
                        <p className="mb-0">Please check after some time!</p>
                     </div>,
                  type: 'warning', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true
               })

            }

            if (Resp.success == "success") {
               toast.update(id, {
                  render: "The NFT is successfully purchased",
                  type: "success",
                  isLoading: false,
                  autoClose: 1000,
                  closeButton: true,
                  closeOnClick: true,
               });
               SetApp_Btn("done");
               navigate(`/profile/${payload.CustomUrl}`, {
                  state: { Tab: "owned" },
               });
            } else {
               toast.update(id, {
                  render: "Transaction Failed",
                  type: "error",
                  isLoading: false,
                  autoClose: 1000,
                  closeButton: true,
                  closeOnClick: true,
               });
               SetApp_Btn("try");
            }
         } else {
            toast.update(id, {
               render: "Transaction Failed",
               type: "error",
               isLoading: false,
               autoClose: 1000,
               closeButton: true,
               closeOnClick: true,
            });
            SetApp_Btn("try");
         }
      } else {
         toast.update(id, {
            render: "Validation failed",
            type: "error",
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
         });
      }
   };


   useEffect(() => {
      BalanceCheck();
   }, [item, owner]);

   async function BalanceCheck() {
      if (once) {
         setOnce(false)
         var Nftbalance = await ContractCall.Current_NFT_Balance(owner, item, wallets[0]);
         console.log("ownneerrsnftbuynowbalittemmm", Nftbalance, "  sadsadas", owner, wallets[0]);
         if (Nftbalance?.toLowerCase() != owner.NFTOwner?.toLowerCase()) {
            setTimeout(() => {
               toast.warning("You won't buy at this moment please refresh you data");
               push("/");
            }, 1000);
         }
      }

   }

   useEffect(() => {
      getBidderDetail()
   }, [owner])

   const getBidderDetail = async () => {
      const getProfile = await userRegister({ Type: "getProfile", CustomUrl: owner.NFTOwner });
      console.log('getProfile---->', getProfile);
      setBuyerDetails(getProfile?.data ?? {})
   }

   return (
      <>
         <Prompt when={!canReload} message={"Are you sure!!! changes may be lost...!"} />

         <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            className='common_modal hc-modal checkoutmodal'
            size='md'
         >
            <Modal.Body>
               <div className='modal_top'>
                  <p className='modal_title text-center'>Check out</p>
                  <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer' />

               </div>

               <div className='modal_body mt_2'>

                  <div className='cp_nftimage_holder'>
                     <img className='cp_nftImage' src={file} />
                     <p className='cp_nftName mt-3'>{item?.NFTName}</p>
                  </div>


                  <p className='modal_summaryLabel mt_2 mb_2'>Summary:</p>
                  <div className='bidmodal_summary mb_2'>
                     <p className='modal_summaryLabel'>Your balance</p>
                     <p className='modal_summaryValue'>
                        {(owner.CoinName != "BNB" && owner.CoinName != "ETH")
                           ? TokenBalance
                           : coinBalance}{" "}
                        {owner.CoinName}
                     </p>
                  </div>

                  <div className='bidmodal_summary mb_2'>
                     <p className='modal_summaryLabel'>Service fees</p>
                     <p className='modal_summaryValue'>{web3utils.fromWei(String(buyerFees))}% {owner.CoinName}</p>
                  </div>

                  <div className='bidmodal_summary mb_2'>
                     <p className='modal_summaryLabel'>Price of the NFT</p>
                     <p className='modal_summaryValue'>{Number(YouWillGet).toFixed(6)} {owner.CoinName}</p>
                  </div>

                  {/* <div className='bidmodal_summary mb-3'>
                     <p className='modal_summaryLabel'>Price in $</p>{console.log("awfawfafawf", Number(YouWillGet), Number(YouWillGet) * BNBUSDT)}
                     <p className='modal_summaryLabel'> {owner.CoinName != "BNB" ? (Number(YouWillGet) * cakeValue).toFixed(6) : (Number(YouWillGet) * BNBUSDT).toFixed(6)}</p>
                  </div> */}

                  {owner?.CoinName != "BNB" && allowed && <button
                     className='bodygradientBtn modal_grdientBtn mt_3'
                     disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
                     onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null}
                  >
                     {Btn == 'start' && 'Approve'
                        || Btn == 'try' && 'Try-Again'
                        || Btn == 'error' && 'Error'
                        || Btn == 'done' && 'Done'
                        || Btn == 'process' && 'In-Progress'
                     }
                  </button>}
                  <button
                     className='nftinfo_gradeientBtn web_listitem_btn mt_2'
                     disabled={Btn != 'done' && App_Btn == 'init' || App_Btn == 'error' || App_Btn === "process" || App_Btn === "done" ? true : false}
                     onClick={App_Btn == 'start' || App_Btn === "try" ? _Buy : null}
                  // onClick={() => _Buy()}
                  >
                     {App_Btn == 'start' && 'Proceed to pay'
                        || App_Btn == 'try' && 'Try-Again'
                        || App_Btn == 'error' && 'Error'
                        || App_Btn == 'done' && 'Done'
                        || App_Btn == 'process' && 'In-Progress'
                        || App_Btn == 'init' && 'Proceed to pay'
                     }
                  </button>

               </div>
            </Modal.Body>

         </Modal >
      </>
   )
}

export default CheckOut