import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Select from "react-select";
import useContractProviderHook from '../actions/contractProviderHook';
import { useNavigate } from 'react-router-dom';
import { NumANdDotOnly, NumberOnly, isEmpty } from '../actions/common';
import { toast } from 'react-toastify'
import { BidApprove, setPendingTransaction } from '../actions/axioss/nft.axios';
import config from '../config/config'
import { network } from '../config/network';
import web3utils from 'web3-utils';
import { useWallets } from '@privy-io/react-auth';
import Prompt from '../Components/Prompt';

function PlaceaBid({ showBid, handleCloseBid, bidder, bid, owner, item }) {
  const [selectedOption, setSelectedOption] = useState(null);

  console.log('ffffffffffffffffff---->', bidder, bid, owner, item);
  const options = [
    { value: "USD", label: "USD" },
    { value: "ETH", label: "ETH" },
    { value: "BNB", label: "BNB" },
    { value: "WETH", label: "WETH" },
    { value: "WEETH", label: "WEETH" },
  ];

  const stylesgraybg = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      color: "#6C6A81",
      background: isFocused
        ? "#F5F6F7"
        : isSelected
          ? "#F5F6F7"
          : isHovered
            ? "red"
            : "#F5F6F7",

      zIndex: 1,
      cursor: "pointer",
      fontSize: "13px",
    }),

    option: (styles, { isFocused, isSelected, isHovered }) => {
      // const color = chroma(data.color);

      return {
        ...styles,
        backgroundColor: isHovered
          ? "#16EBC3"
          : isSelected
            ? "#16EBC3"
            : isFocused
              ? "#16EBC3"
              : "#151515",
        cursor: "pointer",
        color: isHovered
          ? "#000"
          : isSelected
            ? "#000"
            : isFocused
              ? "#000"
              : "#fff",
        fontSize: "13px",
      };
    },
    valueContainer: (provided, { isFocused, isSelected, isHovered }) => ({
      ...provided,
      height: "40px",
      width: "70px",
      backgroundColor: isHovered
        ? "transperant"
        : isSelected
          ? "transperant"
          : isFocused
            ? "transperant"
            : "transperant",
      // border: "1px solid rgba(34, 34, 34, 0.32)",
      borderRadius: 5,
      fontSize: "13px",
      color: "#fff",
    }),
    control: (provided, { isFocused, isSelected, isHovered }) => ({
      ...provided,
      height: "40px",
      width: "70px",
      borderRadius: 5,
      backgroundColor: isHovered
        ? "transperant"
        : isSelected
          ? "transperant"
          : isFocused
            ? "transperant"
            : "transperant",
      // backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
      color: "#fff",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      width: "20px",
      position: "absolute",
      right: 0,
      top: 0,
      color: "#6C6A81",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#16EBC3",
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  const { gasFee } = useSelector((state) => state.LoginReducer.User);
  const { currency } = useSelector(state => state.LoginReducer)
  const { web3, accountAddress, coinBalance } = useSelector(state => state.LoginReducer.AccountDetails);
  const { buyerFees } = useSelector(state => state.LoginReducer.ServiceFees);
  const ContractCall = useContractProviderHook();
  const push = useNavigate()
  const { payload } = useSelector(state => state.LoginReducer.User)
  const { Network } = useSelector((state) => state.LoginReducer)
  const [Btn, SetBtn] = useState('start')
  const [Error, SetError] = useState({})
  const [TokenQuantity, SetTokenQuantity] = useState('1')
  const [TokenBal, SetTokenBal] = useState(0)
  const [show7, setShow7] = useState(true);

  console.log('currencydawdaw', currency, owner, bidder, currency.filter(item => item.address !== config.DEADADDRESS)[0], (isEmpty(owner?.CoinName) || owner?.PutOnSaleType != "TimedAuction") ?
    isEmpty(bidder) ?
      currency?.filter(item => item.address != config.DEADADDRESS)?.length > 0 ?
        currency.filter(item => item.address !== config.DEADADDRESS)[0].label
        : 'WBNB'
      : bidder.CoinName : owner?.CoinName)
  const [FormValue, SetFormValue] = useState({
    TokenBidderAddress: accountAddress,
    TokenOwner_id: item?._id,
    Category: item.Category,
    NFTQuantity: isEmpty(bidder) ? 1 : bidder.NFTQuantity,
    TokenBidAmt: isEmpty(bidder) ? 0 : bidder.TokenBidAmt,
    NFTId: item.NFTId,
    ContractAddress: item.ContractAddress,
    ContractType: item.ContractType,
    CollectionNetwork: item.CollectionNetwork,
    CoinName: (isEmpty(owner?.CoinName) || owner?.PutOnSaleType != "TimedAuction") ?
      isEmpty(bidder) ?
        currency?.filter(item => item.address != config.DEADADDRESS)?.length > 0 ?
          currency.filter(item => item.address !== config.DEADADDRESS)[0].label
          : 'WBNB'
        : bidder.CoinName : owner?.CoinName,
    NFTOwner: item.NFTOwner
  })
  console.log("FormValue", FormValue);

  const {wallets} = useWallets();

  useEffect(() => {
    BalCal(FormValue.CoinName)
  }, [])

  const [canReload, setCanReload] = useState(true);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (!canReload) {
  //       const confirmationMessage = 'Do Not Refresh!';
  //       event.preventDefault();
  //       event.returnValue = confirmationMessage; // For Chrome
  //       return confirmationMessage; // For Safari
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [canReload]);



  const Token_details = useMemo(() => {
    var data = currency?.filter(item => item.label === FormValue.CoinName)?.pop() ?? currency?.filter(item => item.label !== "BNB")?.pop()
console.log('TOkendsetails data---->',data);
    return {
      decimal: data?.decimal || 18,
      token_address: data?.address ?? config.DEADADDRESS
    }
  }, [FormValue.CoinName])
console.log('Token_details---->',Token_details);
  const BalCal = async (data) => {
    let TokenBal = await ContractCall.Token_Balance_Calculation(Token_details.token_address, accountAddress,wallets[0])
    console.log('====================================TokenBal0', TokenBal);
    SetTokenBal(TokenBal)
  }

  const YouWillGet = useMemo(() => { return ContractCall.buy_bid_price_calculation((FormValue?.TokenBidAmt * FormValue?.NFTQuantity).toString(), Token_details?.decimal?.toString()) }, [FormValue?.TokenBidAmt, FormValue?.NFTQuantity])
  console.log('YouWillGet---->', YouWillGet);
  const Validation = async () => {
    // console.log('validddddd',(Number(FormValue.NFTQuantity) % 1 !== 0),FormValue,FormValue.TokenBidAmt <= Number(owner.NFTPrice))
    var Error = {}
    if (isEmpty(FormValue.TokenBidAmt)) Error.TokenBidAmt = "Must Enter Bid Amount"
    if (isEmpty(FormValue.NFTQuantity)) Error.NFTQuantity = "Must Select Atleast One Token"
    else if (Number(owner.NFTBalance) < Number(FormValue.NFTQuantity)) Error.NFTQuantity = "Token Quantity Must be less than token Available"
    else if (Number(FormValue.NFTQuantity) % 1 !== 0) Error.NFTQuantity = "Token Quantity Must be a Valid Count"
    if (ContractCall.Contract_Base_Validation()) Error.Wal = await ContractCall.Contract_Base_Validation()
    if (!isEmpty(bid)) {
      if (FormValue?.TokenBidAmt <= bid?.TokenBidAmt) Error.TokenBidAmt = "Must Be greater Than " + bid.TokenBidAmt
    }
    else if (owner?.PutOnSaleType === "TimedAuction" && isEmpty(bid)) {
      if (FormValue.TokenBidAmt < Number(owner.NFTPrice)) Error.TokenBidAmt = "Minimum Bid is " + owner.NFTPrice
    }
    // if (coinBalance <= YouWillGet) Error.TokenBal = "Not Enough balance in your Wallet"
    return Error
  }

  const FormSubmit = async () => {
    const id = toast.loading(`${isEmpty(bidder) ? "Biding" : "Editing Bid"} on processing... Do not refresh!`)
    SetError({})
    SetBtn('process')
    var error = await Validation()
    console.log('RFGSFGRG', error)
    if (!isEmpty(error)) {
      setTimeout(() => {
        toast.update(id, { render: Object.values(error)[0], type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })

      }, 1000);
      SetBtn('error')
      SetError(error)
    }
    else {

      const checkApprove = await ContractCall.validateApproveforUSDT(YouWillGet, false, wallets[0], Token_details.token_address)
      if (!checkApprove) return toast.update(id, { render: "Bidding failed", type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })

      // let allow = web3utils.fromWei((await ContractCall.allowance_721_1155(Token_details.token_address, accountAddress)) ? String(await ContractCall.allowance_721_1155(Token_details.token_address, accountAddress)) : '0')
      // // console.log('fhfhfa',Token_details,accountAddress,Number(allow))
      // console.log("YouWillGet", YouWillGet, allow, String(Number(YouWillGet) + Number(allow)));

      setCanReload(false)

      const getValue = isEmpty(bidder) ?
        web3utils.toWei(String(Number(YouWillGet))) :
        web3utils.toWei((Number(YouWillGet) - ContractCall.buy_bid_price_calculation((bidder?.TokenBidAmt)?.toString(), "18"))?.toFixed(7)?.toString());

      const Method = isEmpty(bidder) ? "bidNFT" : "editBid"
      let TStamp = Date.now();
      console.log('getValue---->', getValue, Method);

      // let cont = await ContractCall.BidNFt_Contract(getValue, Method, FormValue?.NFTId, item.ContractAddress, getValue, "2500000000000000000", "2500000000000000000")
      // let cont = await getThirdweb.useContractCall(Method, getValue, 0, FormValue?.NFTId, item.ContractAddress,getValue, "2500000000000000000",gasFee?.collectAddress, "2500000000000000000");
      var param = [Method, 0, 0,wallets[0], FormValue?.NFTId, item.ContractAddress,TStamp, gasFee?.collectAddress, getValue, "2500000000000000000"]
      if(Method == "bidNFT") param.splice(8,0, FormValue?.CoinName)
      console.log("paramamamamam",param);
      let cont = await ContractCall.gasLessTransaction(...param);
      setCanReload(true)
      if (cont) {

        var _data = FormValue
        _data.HashValue = cont.HashValue
        // _data.TokenOwner = owner.TokenOwner
        _data.from = isEmpty(bidder) ? 'Bid' : 'Edit'
        _data.activity = isEmpty(bidder) ? 'Bid' : 'Edit'
        _data.EmailId = payload.EmailId
        _data.click = `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`


        let pendingObj = {
          From: accountAddress,
          method: Method,
          params: [_data],
          TimeStamp: TStamp
        }

        var Resp = cont.status == "pending" ? await setPendingTransaction(pendingObj) : await BidApprove(_data)
        console.log("BACKAPPROVE", Resp);
        if (cont.status == "pending") {
          toast.update(id, {
            render:
              <div>
                <p className="mb-0">bid placement pending...</p>
                <p className="mb-0">Please check after some time!</p>
              </div>,
            type: 'warning', isLoading: false, autoClose: 1500, closeButton: true, closeOnClick: true
          })
          setTimeout(() => {
            push("/marketplace");
          }, 1000)
        } 
        else if (Resp.success == 'success') {
          toast.update(id, { render: 'The bid is successfully placed', type: 'success', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          SetBtn('done')
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          // push(`/my-item/${payload?.CustomUrl}`)
        }
        else {
          toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          SetBtn('try')
        }
      }
      else {
        toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        SetBtn('try')
      }

    }
  }

  const onChange = async (e, data) => {
    let oii = (data === "price") ? e : e.target
    SetBtn('start')
    const { value, id, name } = oii
    let val = (data === "price") ? "CoinName" : id
    SetFormValue({ ...FormValue, ...{ [val]: data === "inp" ? (name == "NumDotOnly" ? NumANdDotOnly(value) : NumberOnly(value)) : value } })
    if (data === "price") {
      BalCal(value)
    }
  }

  const [once, setOnce] = useState(true)

  useEffect(() => {
    async function BalanceCheck() {
      if (once) {
        setOnce(false);
        var Nftbalance = await ContractCall.Current_NFT_Balance(owner, item,wallets[0])
        console.log('BIDBalanceCheck', owner, item, Nftbalance);
        if (Nftbalance?.toLowerCase() != owner.NFTOwner?.toLowerCase()) {
          toast.warning("You won't buy at this moment please refresh you data");
          setTimeout(() => {
            push("/")
          }, 1000);
        }
      }

    }
    BalanceCheck();
  }, [item, owner])


  return (

    <>
      <Prompt when={!canReload} message={"Are you sure!!! changes may be lost...!"} />u

      <Modal
        show={showBid}
        onHide={handleCloseBid}
        backdrop="static"
        keyboard={false}
        centered
        className='common_modal'
      >
        <Modal.Body>
          <div className='modal_top'>
            <p className='modal_title text-center'>Place a Bid</p>
            <img src={require('../assets/images/close.svg').default} onClick={() => handleCloseBid()} className='modal_closer' />

          </div>

          <div className='modal_body mt-5'>

            <div className='modal_inputGroup'>
              <input
                type="text"
                pattern="\d*"
                maxlength="10"
                className='modal_input'
                placeholder='Enter Bid Amount'
                id="TokenBidAmt"
                value={FormValue.TokenBidAmt}
                name="NumDotOnly"
                onChange={(e) => onChange(e, 'inp')}
                aria-label="bid"
                aria-describedby="basic-addon2"
              />
              {/* <input
                type="number"
                className='modal_input'
                placeholder='Enter Bid Amount'
                max="4"

                id="TokenBidAmt"
                value={FormValue.TokenBidAmt}
                name="NumDotOnly"
                onChange={(e) => onChange(e, 'inp')}
                aria-label="bid"
                aria-describedby="basic-addon2"
              /> */}
              <Select
                className="border_select"
                placeholder="CoinName"
                styles={stylesgraybg}
                value={{ label: FormValue?.CoinName, value: FormValue?.CoinName }}
                onChange={(e) => { SetFormValue({...FormValue,CoinName:e.value}) }}
                options={currency?.filter(item => item.address?.toLowerCase() != config.DEADADDRESS)}
                id='CoinName'
                isSearchable={false}
                isDisabled={true}
                classNamePrefix="react-select"
              />
            </div>

            <p className='blogInfo_inplabel mt-3 mb-4'>Summary:</p>
            <div className='bidmodal_summary mb-3'>
              <p className='modal_summaryLabel'>Your balance</p>
              <p className='modal_summaryLabel'>{parseFloat(coinBalance).toFixed(6)} {item?.CollectionNetwork}</p>
            </div>

            <div className='bidmodal_summary mb-3'>
              <p className='modal_summaryLabel'>Token balance</p>
              <p className='modal_summaryLabel'>{TokenBal} {FormValue.CoinName}</p>
            </div>

            <div className='bidmodal_summary mb-3'>
              <p className='modal_summaryLabel'>Service fees</p>
              <p className='modal_summaryLabel'>{web3utils.fromWei(String(buyerFees))}% {FormValue?.CoinName}</p>
            </div>

            <div className='bidmodal_summary mb-3'>
              <p className='modal_summaryLabel'>Total bid amount</p>
              <p className='modal_summaryLabel'>{Number(YouWillGet)?.toFixed(6)} {FormValue?.CoinName}</p>
            </div>

            <div className='bidmodal_summary mb-3'>
              <p className='modal_summaryLabel'>Minimum bid amount</p>
              <p className='modal_summaryLabel'>{bid?.TokenBidAmt ? bid?.TokenBidAmt : owner?.NFTPrice} {FormValue?.CoinName}</p>
            </div>

            <button
              className='bodygradientBtn modal_grdientBtn mt-4'
              disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
              onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null}
            >
              {Btn == 'start' && (isEmpty(bidder) ? 'Place a bid' : 'Edit Bid')
                || Btn == 'try' && 'Try-Again'
                || Btn == 'error' && 'Error'
                || Btn == 'done' && 'Done'
                || Btn == 'process' && 'In-Progress'
              }
            </button>

            <button
              className='additional_btn modal_additionalBtn mt-3'
              onClick={() => handleCloseBid()}
              disabled={Btn == 'process'}
            >
              Cancel
            </button>

          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default PlaceaBid