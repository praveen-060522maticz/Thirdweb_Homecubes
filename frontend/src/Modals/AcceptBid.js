import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import useContractProviderHook from '../actions/contractProviderHook';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../actions/common';
import { toast } from 'react-toastify';
import { BidApprove } from '../actions/axioss/nft.axios';
import { network } from '../config/network';
import config from '../config/config'
import { userRegister } from '../actions/axioss/user.axios';
import web3utils from 'web3-utils';
import { useWallets } from '@privy-io/react-auth';
import Prompt from '../Components/Prompt';
function AcceptBid({
   show,
   handleClose,
   bidder,
   closePop,
   bid,
   owner,
   item,
   file,
   type,
   thumb,
   approvestatus,
}) {

   const { currency } = useSelector((state) => state.LoginReducer);
   const { web3 } = useSelector(
      (state) => state.LoginReducer.AccountDetails
   );
   const { gasFee } = useSelector((state) => state.LoginReducer.User);
   const { buyerFees, sellerFees } = useSelector(
      (state) => state.LoginReducer.ServiceFees
   );
   const ContractCall = useContractProviderHook();
   const dispatch = useDispatch()
   const push = useNavigate();
   const { payload } = useSelector((state) => state.LoginReducer.User);
   const [Btn, SetBtn] = useState("start");
   const [Error, SetError] = useState({});
   const [TokenQuantity, SetTokenQuantity] = useState("1");
   const [TokenBal, SetTokenBal] = useState(0);
   const [show6, setShow6] = useState(true);
   const [TokenBtn, SetTokenBtn] = useState("start");
   const [bidderDetail, setBidderDetail] = useState({})
   const handleClose6 = () => setShow6(false);
   const token_address =
      currency?.filter((item) => item.label == bidder?.CoinName)?.pop()
         ?.address ?? "0x7CAB80ce0E55F46378E493B584eE61aD68878f11";
   const [referredUser, setReferredUser] = useState({});
   const { Network } = useSelector(
      (state) => state.LoginReducer
   );
   const { wallets } = useWallets()
   console.log('token_address', token_address)
   useEffect(() => {
      BalCal(token_address);
   }, [token_address]);

   const [canReload, setCanReload] = useState(true);
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

   const BalCal = async (data) => {
      let TokenBal = await ContractCall.Token_Balance_Calculation(
         data ?? token_address,
         bidder?.TokenBidderAddress
      );
      SetTokenBal(TokenBal);
   };

   console.log("aeawefefr", Network);

   const YouWillGet = useMemo(() => {
      return ContractCall.price_calculation(
         (bidder?.TokenBidAmt * TokenQuantity).toString()
      );
   }, [bidder?.TokenBidAmt, TokenQuantity]);

   const Validation = async () => {
      var Error = {};
      if (isEmpty(TokenQuantity))
         Error.TokenQuantity = "Must Select Atleast One Token";
      else if (Number(TokenQuantity) % 1 !== 0)
         Error.TokenQuantity = "Token Quantity Must Be Valid";
      if (await ContractCall.Contract_Base_Validation())
         Error.Wal = await ContractCall.Contract_Base_Validation();
      if (!isEmpty(TokenQuantity)) {
         console.log("cheackapprovecalla", TokenBal, token_address, TokenQuantity, bidder?.TokenBidAmt, bidder?.TokenBidderAddress, network[Network].tradeContract, TokenQuantity * bidder?.TokenBidAmt);
         console.log("efhkasfawfaw", await ContractCall.allowance_721_1155(
            token_address,
            bidder?.TokenBidderAddress,
            network[Network].tradeContract
         ));
         // if (
         //    TokenQuantity * bidder?.TokenBidAmt >
         //    Number(web3.utils.fromWei(
         //       String(
         //          (await ContractCall.allowance_721_1155(
         //             token_address,
         //             bidder?.TokenBidderAddress,
         //             network[Network].tradeContract
         //          ))
         //             ? await ContractCall.allowance_721_1155(
         //                token_address,
         //                bidder?.TokenBidderAddress,
         //                network[Network].tradeContract
         //             )
         //             : 0
         //       )
         //    ))
         // )
         //    Error.Wal = "Bidder Doesn't have enough Allowance";
         // if (TokenQuantity * bidder?.TokenBidAmt > TokenBal)
         //    Error.Wal = "Bidder Doesn't have enough Balance";
      }
      return Error;
   };
   console.log("bidder?.Pending", bidder?.Pending);
   const TokenApproveCall = async () => {
      SetTokenBtn("process");
      const id = toast.loading("Approve Processing...Do not refresh!");
      setCanReload(false)

      // const cont = await getThirdweb.useContractCall(
      //    "setApprovalForAll",
      //    0,
      //    0,
      //    item.ContractAddress, true
      //  );

      // const cont = await ContractCall.gasLessTransaction(
      //    "setApprovalForAll",
      //    0,
      //    0,
      //    wallets[0],
      //    item.ContractAddress, true
      // );

      const cont = await ContractCall.SetApproveStatus(
         item.ContractType == 721 || item.ContractType == "721"
            ? "Single"
            : "Multiple",
         item.ContractAddress,
         wallets[0]
      );
      setCanReload(true)

      toast.update(id, {
         render: cont ? "Approved Successfully" : "Approved Failed",
         type: cont ? "success" : "error",
         isLoading: false,
         autoClose: 1000,
         closeButton: true,
         closeOnClick: true,
      });
      if (cont.status) {
         SetTokenBtn("done");
         SetBtn("start");
      } else SetTokenBtn("try");
   };
   console.log("ehjusehfrefrwasRefffff", bidder, referredUser, payload);

   const FormSubmit = async () => {
      const id = toast.loading("Accepting Token on processing");
      SetError({});
      SetBtn("process");
      var error = await Validation();
      if (!isEmpty(error)) {
         toast.update(id, {
            render: Object.values(error)[0],
            type: "error",
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
         });
         SetBtn("error");

         SetError(error);
      } else {
         console.log("sefreeree");
         toast.update(id, {
            render: "Accepting Bid",
            type: "success",
            isLoading: true,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
         });
         console.log(
            "swefred",
            bidder?.TokenBidAmt * TokenQuantity,
            bidder?.TokenBidAmt,
            TokenQuantity,
            bidder?.CoinName,
            bidder?.TokenBidderAddress,
            bidder?.ContractAddress,
         );
         setCanReload(false)
         let cont = await ContractCall.accept_721_1155(
            wallets[0],
            bidder?.CoinName == "BNB" ? "Coin" : bidder?.CoinName,
            bidder?.TokenBidderAddress,
            [
               item.NFTId,
               web3utils.toWei(String(bidder?.TokenBidAmt * TokenQuantity)),
               TokenQuantity,
               bidder?.ContractType,
            ],
            bidder?.ContractAddress
         );
         setCanReload(true)

         // let cont = await getThirdweb.useContractCall(
         //    "acceptBId",
         //    0,
         //    0,
         //    "Coin",
         //    bidder?.TokenBidderAddress,
         //    [
         //       item.NFTId,
         //       web3.utils.toWei(String(bidder?.TokenBidAmt * TokenQuantity)),
         //       TokenQuantity,
         //       721,
         //    ],
         //    bidder?.ContractAddress,
         //    bidderDetail?.parentAddress,
         //    gasFee?.collectAddress,
         //    "2500000000000000000"
         // );

         let TStamp = Date.now();
         // let cont = await ContractCall.gasLessTransaction(
         //    "acceptBId",
         //    0,
         //    0,
         //    wallets[0],
         //    bidder?.CoinName,
         //    bidder?.TokenBidderAddress,
         //    [
         //       item.NFTId,
         //       web3utils.toWei(String(bidder?.TokenBidAmt * TokenQuantity)),
         //       TokenQuantity,
         //       bidder?.ContractType,
         //    ],
         //    bidder?.ContractAddress,
         //    TStamp,
         //    gasFee?.collectAddress,
         //    "2500000000000000000"
         // );

         console.log('contaaaaaaaaa---->', cont);
         if (cont) {
            var FormValue = {
               TokenBidderAddress: bidder?.TokenBidderAddress,
               NFTQuantity: TokenQuantity,
               NFTId: item.NFTId,
               ContractAddress: item.ContractAddress,
               CollectionNetwork: item.CollectionNetwork,
               ContractType: item.ContractType,
               from: "accept",
               EmailId: payload.EmailId,
               item: item,
               newOwner: {
                  HashValue: cont?.HashValue,
                  NewTokenOwner: bidder?.TokenBidderAddress,
                  NFTQuantity: TokenQuantity,
                  NFTId: item.NFTId,
                  NFTOwner: owner?.NFTOwner,
                  PutOnSale: owner?.PutOnSale,
                  PutOnSaleType: owner?.PutOnSaleType,
                  TP:
                     owner.PutOnSaleType == "FixedPrice"
                        ? owner?.NFTPrice
                        : bidder?.TokenBidAmt
                           ? bidder?.TokenBidAmt
                           : bidder?.NFTPrice,
                  CN:
                     owner.PutOnSaleType == "FixedPrice"
                        ? owner?.CoinName
                        : bidder?.CoinName,
                  activity: "Accept",
                  Category: item.Category,
                  New_EmailId: bidder?.EmailId,
                  Old_EmailId: payload?.EmailId,
                  click: `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${bidder?.TokenBidderAddress}/${owner?.NFTId}`,
                  initialBuy: bidderDetail?.initialBuy,
                  referedBy: bidderDetail?.referedBy,
                  royaltyReceiver: cont?.royaltyInfo[1],
                  earnPercentage: web3utils.fromWei(String(cont?.royaltyInfo[2])),
                  Earning: web3utils.fromWei(String(cont?.royaltyInfo[3])),
                  projectId: owner.projectId
               },
            };

            let Resp = await BidApprove(FormValue);


            if (Resp.success == "success") {
               toast.update(id, {
                  render: "Accepting Token Successfully",
                  type: "success",
                  isLoading: false,
                  autoClose: 1000,
                  closeButton: true,
                  closeOnClick: true,
               });
               SetBtn("done");
               push(`/profile/${payload?.CustomUrl}`);
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

   const onChange = async (e, data) => {
      SetError({});
      SetBtn("start");
      SetTokenQuantity(e.target.value);
   };

   const [once, setOnce] = useState(true)
   useEffect(() => {
      async function BalanceCheck() {
         if (once) {
            setOnce(false)
            var Nftbalance = await ContractCall.Current_NFT_Balance(owner, item, wallets[0]);
            console.log("ACEEPTBalanceCheck", owner, item, Nftbalance);
            if (Nftbalance?.toLowerCase() != owner.NFTOwner?.toLowerCase()) {
               toast.warning("You won't buy at this moment please refresh you data");
               setTimeout(() => {
                  push("/");
               }, 1000);
            }
         }
      }
      BalanceCheck();
   }, [item, owner]);

   useEffect(() => {
      getBidderDetail()
   }, [bidder])

   const getBidderDetail = async () => {
      const getProfile = await userRegister({ Type: "getProfile", CustomUrl: bidder?.TokenBidderAddress });
      console.log('getProfile---->', getProfile);
      setBidderDetail(getProfile?.data ?? {})
   }
   return (
      <>
         <Prompt when={!canReload} message={"Are you sure!!! changes may be lost...!"} />u
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

                  <p className='modal_title text-center'>Accept Bid</p>
                  <img src={require('../assets/images/close.svg').default} id='redCloser' onClick={() => handleClose()} className='modal_closer' />

               </div>

               <div className='modal_body mt_2'>
                  <p className='modal_summaryLabel text-center mt_2 mb_2'>you are about to accept bid for <span className='cancelSale'>{item.NFTName}</span> from <span className='cancelSale'> {bidder?.DisplayName ? bidder?.DisplayName : bidder?.TokenBidderAddress}</span> </p>

                  <p className='cancel_salePrice mt_2 text-center'>
                     {bidder?.TokenBidAmt + " " + bidder?.CoinName} for{" "}
                     {Number(TokenQuantity)} Edition(s)
                  </p>

                  {/* <div className='mt-3'>
                     <p className='modal_summaryLabel'>Quantity</p>
                     <input type="number" className='modal_singleinput mt-3 cmnInput_scrollerHider' placeholder='Enter your quality' />
                  </div> */}

                  <p className='blogInfo_inplabel mt_2 mb_2'>Summary:</p>
                  <div className='bidmodal_summary mb_2'>
                     <p className='modal_summaryLabel'>Royal fee in %</p>
                     <p className='modal_summaryValue'>{item.NFTRoyalty} %</p>
                  </div>

                  <div className='bidmodal_summary mb_2'>
                     <p className='modal_summaryLabel'>Service fee in %</p>
                     <p className='modal_summaryValue'>{web3utils.fromWei(String(sellerFees))}% {bidder?.CoinName}</p>
                  </div>

                  <div className='bidmodal_summary mb_2'>
                     <p className='modal_summaryLabel'>You will get</p>
                     <p className='modal_summaryValue'>
                        {Number(YouWillGet).toFixed(6)}
                        {bidder?.CoinName}
                     </p>
                  </div>

                  <div className='mt_2'>
                     {approvestatus === "open" &&
                        <button
                           disabled={
                              TokenBtn == "process" || TokenBtn == "done" ? true : false
                           }
                           onClick={
                              TokenBtn == "start" || TokenBtn == "try"
                                 ? TokenApproveCall
                                 : null
                           }
                           disableRipple
                           className='bodygradientBtn modal_grdientBtn mt-4'
                        >
                           {TokenBtn == "start" && "Approve"}
                           {TokenBtn == "process" && "In-Progress"}
                           {TokenBtn == "try" && "Try-Again"}
                           {TokenBtn == "done" && "Done"}
                        </button>}

                     {((approvestatus !== "open") || (TokenBtn == "done")) &&
                        <button
                           className='bodygradientBtn modal_grdientBtn mt_3'
                           disabled={
                              TokenBtn == "done" ?
                                 Btn == "error" || Btn === "process" || Btn === "done"
                                    ? true
                                    : false
                                 : false
                           }
                           onClick={Btn == "start" || Btn === "try" ? FormSubmit : null}
                        > {(Btn == "start" && "Accept Bid") ||
                           (Btn == "try" && "Try-Again") ||
                           (Btn == "error" && "Error") ||
                           (Btn == "done" && "Done") ||
                           (Btn == "process" && "In-Progress") ||
                           (Btn == "putonsale" && "List")}</button>
                     }

                     <button className='hc-button__gray mt_2'
                        disabled={
                           TokenBtn == "done" ?
                              Btn == "error" || Btn === "process" || Btn === "done"
                                 ? true
                                 : false
                              : false
                        }
                        onClick={() => handleClose()}
                     >
                        Cancel
                     </button>
                  </div>

               </div>

            </Modal.Body>

         </Modal>
      </>
   )
}

export default AcceptBid