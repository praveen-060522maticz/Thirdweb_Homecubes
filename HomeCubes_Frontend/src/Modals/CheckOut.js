import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useContractProviderHook from '../actions/contractProviderHook';
import { getBNBvalue, isEmpty } from '../actions/common';
import { toast } from 'react-toastify'
import config from '../config/config';
import { network } from '../config/network';
import { BuyAccept } from '../actions/axioss/nft.axios';
import useThirdWeb from '../actions/useThirdWeb';
import { userRegister } from '../actions/axioss/user.axios';

function CheckOut({ show, handleClose, item, owner, file }) {


   const navigate = useNavigate();
   console.log('buyyyyyyyy', item, owner);
   const { currency } = useSelector((state) => state.LoginReducer);
   const { web3, web3p, accountAddress, coinBalance, BNBUSDT } = useSelector(
      (state) => state.LoginReducer.AccountDetails
   );
   const { Network } = useSelector((state) => state.LoginReducer)
   // console.log('coinnnnballl',coinBalance,web3p.utils.fromWei(coinBalance.toString()))
   const { buyerFees, sellerFees } = useSelector(
      (state) => state.LoginReducer.ServiceFees
   );
   const {  gasFee } = useSelector((state) => state.LoginReducer.User);

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

   useEffect(() => {
      getBNBvalue("CAKEUSDT").then((val) => {
         setCakeValue(val)
      }).catch((e) => {
         console.log("err on get", e);
      })


   }, [])

   const getThirdweb = useThirdWeb()
   const [canReload, setCanReload] = useState(true);
   const [allowed, setAllowed] = useState(false)
   useEffect(() => {
      const handleBeforeUnload = (event) => {
         if (!canReload) {
            const confirmationMessage = 'Do Not Refresh!';
            event.preventDefault();
            event.returnValue = confirmationMessage; // For Chrome
            return confirmationMessage; // For Safari
         }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
         window.removeEventListener('beforeunload', handleBeforeUnload);
      };
   }, [canReload]);
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
   console.log("YouWillGet", YouWillGet);;

   useEffect(() => {

      const getAllowance = async () => {
         const getdata = await getThirdweb.getAllowance(token_address);
         const getPay = web3.utils.toWei(String(YouWillGet))
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
         // let cont = await ContractCall.approve_721_1155(
         //    token_address,
         //    network[Network].tradeContract,
         //    web3p.utils.toWei(YouWillGet.toString())
         // );
         let cont = await getThirdweb.useContractCall(
            "approve",
            0,
            token_address,
            network[Network].tradeContract,
            web3p.utils.toWei((YouWillGet + 2).toString()),
         )
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
            accountAddress
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
         web3p.utils.toWei(YouWillGet.toString()),
         owner.CoinName == "PancakeSwap Token" ? "CAKE" : owner.CoinName,
         owner.NFTOwner,
         [
            owner.NFTId,
            web3p.utils.toWei(String(owner.NFTPrice * NFTQuantity)),
            NFTQuantity,
            item.ContractType,
            web3p.utils.toWei(String(referredUser?.earnPercentage ?? 0)),
            web3p.utils.toWei(
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
         // let cont = await ContractCall.buy_721_1155(
         //    web3p.utils.toWei(YouWillGet.toString()),
         //    owner.CoinName,
         //    owner.NFTOwner,
         //    [
         //       owner.NFTId,
         //       web3p.utils.toWei(String(owner.NFTPrice * NFTQuantity)),
         //       NFTQuantity,
         //       item.ContractType,
         //       web3p.utils.toWei(YouWillGet.toString())
         //    ],
         //    item.ContractAddress,
         //    "2500000000000000000"
         // );

         var Arr = [
            owner.CoinName == "BNB" ? "saleToken" : "saleWithToken",
            owner.CoinName == "BNB" ? web3p.utils.toWei(YouWillGet.toString()) : 0,
            owner.CoinName !== "BNB" ? 7 : 1,
            owner.NFTOwner,
            [
               owner.NFTId,
               web3p.utils.toWei(String(owner.NFTPrice * NFTQuantity)),
               NFTQuantity,
               item.ContractType
            ],
            item.ContractAddress,
            web3p.utils.toWei(YouWillGet.toString()),
            buyerDetails?.parentAddress,
            gasFee?.collectAddress,
            "2500000000000000000"
         ]
         if (owner.CoinName != "BNB") Arr.splice(3, 0, owner.CoinName)
         console.log('ArrArrArrArrArr---->',Arr);
         let cont = await getThirdweb.useContractCall(...Arr)
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
               royaltyReceiver: cont.royaltyInfo[1],
               earnPercentage: web3p.utils.fromWei(String(cont.royaltyInfo[2])),
               Earning: web3p.utils.fromWei(String(cont.royaltyInfo[3])),
               projectId: owner.projectId
            };
            setCanReload(false)
            let Resp = await BuyAccept({ newOwner: newOwner, item: item });
            setCanReload(true)
            console.log("Resp", Resp);
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
         var Nftbalance = await ContractCall.Current_NFT_Balance(owner, item);
         console.log("ownneerrsnftbuynowbalittemmm", Nftbalance, "  sadsadas", owner);
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
      console.log('getProfile---->',getProfile);
      setBuyerDetails(getProfile?.data ?? {})
   }

   return (
      <>
         <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            className='common_modal'
         >
            <Modal.Body>
               <div className='modal_top'>
                  <p className='modal_title text-center'>Check out</p>
                  <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer' />

               </div>

               <div className='modal_body mt-3'>

                  <div className='cp_nftimage_holder'>
                     <img className='cp_nftImage' src={file} />
                     <p className='cp_nftName mt-3'>{item?.NFTName}</p>
                  </div>


                  <p className='blogInfo_inplabel mt-3 mb-4'>Summary:</p>
                  <div className='bidmodal_summary mb-3'>
                     <p className='modal_summaryLabel'>Your balance</p>
                     <p className='modal_summaryLabel'>
                        {(owner.CoinName != "BNB" && owner.CoinName != "ETH")
                           ? TokenBalance
                           : coinBalance}{" "}
                        {owner.CoinName}
                     </p>
                  </div>

                  <div className='bidmodal_summary mb-3'>
                     <p className='modal_summaryLabel'>Service fees</p>
                     <p className='modal_summaryLabel'>{web3p.utils.fromWei(String(buyerFees))}% {owner.CoinName}</p>
                  </div>

                  <div className='bidmodal_summary mb-3'>
                     <p className='modal_summaryLabel'>Price of the NFT</p>
                     <p className='modal_summaryLabel'>{Number(YouWillGet).toFixed(6)} {owner.CoinName}</p>
                  </div>

                  <div className='bidmodal_summary mb-3'>
                     <p className='modal_summaryLabel'>Price in $</p>{console.log("awfawfafawf", Number(YouWillGet), Number(YouWillGet) * BNBUSDT)}
                     <p className='modal_summaryLabel'> {owner.CoinName != "BNB" ? (Number(YouWillGet) * cakeValue).toFixed(6) : (Number(YouWillGet) * BNBUSDT).toFixed(6)}</p>
                  </div>

                  {owner?.CoinName != "BNB" && allowed && <button
                     className='bodygradientBtn modal_grdientBtn mt-4'
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
                     className='additional_btn modal_additionalBtn mt-3'
                     disabled={Btn != 'done' && App_Btn == 'init' || App_Btn == 'error' || App_Btn === "process" || App_Btn === "done" ? true : false}
                     onClick={App_Btn == 'start' || App_Btn === "try" ? _Buy : null}
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