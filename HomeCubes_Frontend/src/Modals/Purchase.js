import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useContractProviderHook from '../actions/contractProviderHook';
import { isEmpty } from '../actions/common';
import {toast} from 'react-toastify'
import config from '../config/config';
import { network } from '../config/network';
import { BuyAccept } from '../actions/axioss/nft.axios';

function Purchase({ show, handleClose, owner, item  }) {

  const navigate = useNavigate();
  console.log('buyyyyyyyy', item, owner);
  const { currency } = useSelector((state) => state.LoginReducer);
  const { web3, web3p, accountAddress, coinBalance } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );
  const { Network } = useSelector((state) => state.LoginReducer)
  // console.log('coinnnnballl',coinBalance,web3p.utils.fromWei(coinBalance.toString()))
  const { buyerFees, sellerFees } = useSelector(
    (state) => state.LoginReducer.ServiceFees
  );
  console.log("getServiceFees", buyerFees, sellerFees);
  const ContractCall = useContractProviderHook();
  const dispatch = useDispatch()
  const push = useNavigate();
  // const AxiosFile = useAxiosFile()
  const { payload } = useSelector((state) => state.LoginReducer.User);
  console.log("payload", payload);
  const [referredUser, setReferredUser] = useState({});

  const [Btn, SetBtn] = useState("start");
  const [App_Btn, SetApp_Btn] = useState(
    owner.CoinName != "BNB" ? "init" : "start"
  );
  const [Error, SetError] = useState("");
  const [NFTQuantity, SetNFTQuantity] = useState(1);
  const [TokenBalance, SetTokenBalance] = useState("0");
  const [show10, setShow10] = useState(false);
  const [proceedtopayment, setProceedtopayment] = useState(false);
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
    const id = toast.loading("Purchasing Token on processing");
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
      let cont = await ContractCall.approve_721_1155(
        token_address,
        network[Network].tradeContract,
        web3p.utils.toWei(YouWillGet.toString())
      );
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
      let cont = await ContractCall.buy_721_1155(
        web3p.utils.toWei(YouWillGet.toString()),
        owner.CoinName,
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
          earnPercentage: referredUser?.earnPercentage ?? 0,
          adminFeePercentage:
            Number(buyerFees) / 1e18 + Number(sellerFees) / 1e18,
        };
        let Resp = await BuyAccept({ newOwner: newOwner, item: item });

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
          if (payload?.initialBuy == false) {
            var newPayload = payload
            newPayload.initialBuy = true
            dispatch({
              type: 'Register_Section',
              Register_Section: {
                User: {
                  payload: newPayload
                }
              }
            })
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

  const onChange = (e) => {
    // console.log('vallll',e.target.value)
    var numberRegex = /^\d+$/;
    console.log('vallll', e.target.value)
    if (numberRegex.test(e.target.value) || e.target.value == "") {
      SetNFTQuantity(e.target.value); SetError(''); SetBtn('start'); SetApp_Btn('init')
    }
    else {
      SetError("Token Quantity must be in number")
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
        toast.warning("You won't buy at this moment please refresh you data");
        setTimeout(() => {
          push("/");
        }, 1000);
      }
      
    }

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



            <p className='modal_summaryLabel text-center'>Send transaction with your wallet</p>



            <button className='bodygradientBtn modal_grdientBtn mt-4'>Proceed to Payment</button>

          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default Purchase