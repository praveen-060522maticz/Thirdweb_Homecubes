import React, { useEffect, useState } from 'react'
import { Modal, Row, Col } from 'react-bootstrap'
import Select from "react-select";
import Datetime from 'react-datetime';
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import { useSelector } from 'react-redux';
import config from '../config/config';
import useContractProviderHook from '../actions/contractProviderHook';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { CreateOrder, setPendingTransaction } from '../actions/axioss/nft.axios';
import { isEmpty } from '../actions/common';
import Calendar from './Calendar';
import web3utils from 'web3-utils';
import { useWallets } from '@privy-io/react-auth';
import Prompt from '../Components/Prompt';
function ListItem({ show, handleClose, handleOpenCal, text, owner, types, closePop, file, type, thumb, item }) {

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionOne, setSelectedOptionOne] = useState(null);
  const [tab, setTab] = useState("fixedprice")
  const [FormValue, SetFormValue] = useState(item);
  const [Mintbtn, SetMintbtn] = useState("start");
  const [BtnData, SetBtnData] = useState("start");
  const [cal, setCal] = useState(false);
  const [TokenBtn, SetTokenBtn] = useState("start");
  const [Error, setError] = useState({});
  const [Once, setOnce] = useState(true)
  const [canReload, setCanReload] = useState(true);


  const { currency } = useSelector((state) => state.LoginReducer);
  const { payload, gasFee } = useSelector((state) => state.LoginReducer.User);
  const { web3, accountAddress } = useSelector((state) => state.LoginReducer.AccountDetails);
  const { wallets } = useWallets()
  useEffect(() => {
    SetFormValue({
      ...FormValue,
      ...{
        ["ClockTime"]: new Date(),
      },
    });
  }, [item])

  const ContractCall = useContractProviderHook();
  const push = useNavigate();

  console.log("currency", currency);

  console.log("FormValue", owner, FormValue);
  const options = [
    { value: "USD", label: "USD" },
    { value: "ETH", label: "ETH" },
    { value: "BNB", label: "BNB" },
    { value: "WETH", label: "WETH" },
    { value: "WEETH", label: "WEETH" },
  ];

  // const optionsOne = [
  //   { value: "oneday", label: "1 Day" },
  //   { value: "twoday", label: "2 Days" },
  //   { value: "specific", label: "Pick Specific Date" },
  // ];

  const optionsOne = [
    { value: "1 day", label: "1 day" },
    { value: "2 days", label: "2 days" },
    { value: "Scheduled Listing", label: "Scheduled Listing" },
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
      width: "60px",
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
      width: "60px",
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

  const stylesgraybgOne = {
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
      width: "150px",
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
      width: "150px",
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
      width: "10px",
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
  useEffect(() => {
    BalanceCheck();
  }, [item, owner]);

  async function BalanceCheck() {

    if (Once) {
      let Nftbalance = await ContractCall.Current_NFT_Balance(owner, item, wallets[0]);
      console.log("ownneerrsnftbusemmm in listitem", Nftbalance, owner?.NFTBalance, owner?.NFTOwner);

      if (Nftbalance && (Nftbalance.toLowerCase() != owner?.NFTOwner.toLowerCase())) {
        setOnce(false)
        toast.warning("You won't buy at this moment please refresh you data");
        setTimeout(() => {
          push("/");
        }, 1000);
      }

    }

  }


  const Validation = (data) => {
    let ValidateError = {};
    const { NFTPrice, CoinName, PutOnSaleType, ClockTime, EndClockTime, NFTQuantity, ContractType } = data;
    console.log('errrorrrr', NFTPrice, CoinName, PutOnSaleType, ClockTime, EndClockTime, NFTQuantity, ContractType)
    if (
      (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
      isEmpty(NFTPrice)
    )
      ValidateError.NFTPrice = "Token Price Required";
    if (
      (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
      !CoinName
    )
      ValidateError.CoinName = "CoinName Required";
    if (PutOnSaleType == "TimedAuction" && !EndClockTime)
      ValidateError.EndClockTime = "EndClockTime Required";
    if (PutOnSaleType == "TimedAuction") {
      if (new Date().toString() == EndClockTime?.toString()) {
        ValidateError.EndClockTime = "Time Auction should not be same";
      }

      if (new Date() > new Date(EndClockTime)) {
        ValidateError.EndClockTime = "Please Enter valid End Time"
      }
    }

    return ValidateError;
  };

  async function ListCall() {

    const validate = Validation(FormValue);
    console.log("validate", validate);
    if (!isEmpty(validate)) return setError(validate)

    const id = toast.loading("Listing Processing... Do not refresh!");
    SetMintbtn("process");
    if (FormValue.PutOnSaleType == "FixedPrice") {
      var error = await ContractCall.Contract_Base_Validation();
      console.log('====================================');
      console.log(error, FormValue);
      console.log('====================================');
      if (error)
        toast.update(id, {
          render: error,
          type: "error",
          isLoading: false,
          autoClose: 1000, closeButton: true, closeOnClick: true
        });
      else {

        const checkApprove = await ContractCall.GetApproveStatus(
          "single",
          FormValue.ContractAddress,
          wallets[0]
        )
        console.log("checkApprovecheckApprove", checkApprove);
        if (!checkApprove) {
          const aprroveId = toast.loading("Approve in process... Do not refresh!");

          setCanReload(false)
          const cont = await ContractCall.SetApproveStatus(
            FormValue.ContractType.includes('721') ? "Single" : "Multiple",
            FormValue.ContractAddress,
            wallets[0]
          );

          // const cont = await getThirdweb.useContractCall(
          //   "setApprovalForAll",
          //   0,
          //   0,
          //   FormValue.ContractAddress, true
          // );
          // const cont = await ContractCall.gasLessTransaction(
          //   "setApprovalForAll",
          //   0,
          //   0,
          //   wallets[0],
          //   FormValue.ContractAddress, true
          // );
          setCanReload(true)
          if (!cont) {
            toast.update(id, {
              render: "Transaction Failed",
              type: "error",
              isLoading: false,
              autoClose: 1000, closeButton: true, closeOnClick: true
            });
            SetMintbtn("try");

            return toast.update(aprroveId, {
              render: "Approved Failed",
              type: "error",
              isLoading: false,
              autoClose: 1000, closeButton: true, closeOnClick: true
            });
          } else {

            toast.update(aprroveId, {
              render: "Approved Success",
              type: "success",
              isLoading: false,
              autoClose: 1000, closeButton: true, closeOnClick: true
            });
          }

        }

        console.log('Loogogogoog---->', wallets[0],
          owner.NFTId,
          FormValue.NFTPrice,
          FormValue.ContractAddress,
          accountAddress,
          FormValue.ContractType,
          "data");

        setCanReload(false)
        const cont = await ContractCall.place_order_721_1155(
          wallets[0],
          owner.NFTId,
          web3utils.toWei(FormValue.NFTPrice),
          FormValue.ContractAddress,
          accountAddress,
          Number(FormValue.ContractType),
          "data"
        );
        console.log("cont", cont)
        console.log('gasgasFeeee---->', gasFee);

        // const cont = await getThirdweb.useContractCall(
        //   "orderPlace",
        //   0,
        //   0,
        //   owner.NFTId,
        //   web3.utils.toWei(FormValue.NFTPrice?.toString()),
        //   FormValue.ContractAddress,
        //   accountAddress,
        //   Number(FormValue.ContractType),
        //   "data",
        //   gasFee?.collectAddress,
        //   "2500000000000000000"
        // )
        let TStamp = Date.now();
        // const cont = await ContractCall.gasLessTransaction(
        //   "orderPlace",
        //   0,
        //   0,
        //   wallets[0],
        //   owner.NFTId,
        //   web3utils.toWei(FormValue.NFTPrice?.toString()),
        //   FormValue.ContractAddress,
        //   accountAddress,
        //   Number(FormValue.ContractType),
        //   "data",
        //   TStamp,
        //   gasFee?.collectAddress,
        //   "2500000000000000000"
        // )
        setCanReload(true)
        console.log('Cont---->', cont);
        if (cont) {
          let _data = FormValue;
          _data.NFTOwner = payload.WalletAddress;
          _data.HashValue = cont?.HashValue;
          _data.NFTId = owner.NFTId;
          _data.activity = "PutOnSale";
          _data.NFTBalance = owner?.NFTBalance
          _data.click = `${config.FRONT_URL}/info/${FormValue.CollectionNetwork}/${FormValue.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`;
          console.log("_datattatataa", _data);
          _data.EmailId = payload?.EmailId
          BackCall(id, _data);

          let pendingObj = {
            From: accountAddress,
            method: "orderPlace",
            params: [_data],
            TimeStamp: TStamp
          }
          if (cont?.status == "pending") {
            const pending = await setPendingTransaction(pendingObj);
            toast.update(id, {
              render:
                <div>
                  <p className="mb-0">Token List pending...</p>
                  <p className="mb-0">Please check after some time!</p>
                </div>,
              type: 'warning', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true
            })
            push("/marketplace");
          } else await BackCall(id, _data);

        } else {
          console.log("json fil")
          toast.update(id, {
            render: "Transaction Failed",
            type: "error",
            isLoading: false,
            autoClose: 1000, closeButton: true, closeOnClick: true
          });
          console.log("ewjewkljelwjrkwejkrweklr")
          SetMintbtn("try");
        }

      }
    } else {
      let _data = FormValue;
      _data.NFTOwner = payload.WalletAddress;
      _data.HashValue = "";
      _data.NFTId = owner.NFTId;
      _data.activity = "PutOnSale";
      _data.click = `${config.FRONT_URL}/info/${FormValue.CollectionNetwork}/${FormValue.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`;
      console.log("_datattatataa", _data);
      _data.EmailId = payload?.EmailId
      BackCall(id, _data);
    }
  }

  const BackCall = async (id, _data) => {

    let Resp = await CreateOrder(_data);

    if (Resp.success == "success") {
      toast.update(id, {
        render: "The NFT is successfully listed for sale ",
        type: Resp.success,
        isLoading: false,
        autoClose: 1000, closeButton: true, closeOnClick: true
      });
      SetMintbtn("done");
      push("/profile/" + payload.CustomUrl, { state: { Tab: 'owned' } });
    } else {
      console.log("dsahgdhasgjgdjasd")
      toast.update(id, {
        render: "Transaction Failed",
        type: "error",
        isLoading: false,
        autoClose: 1000, closeButton: true, closeOnClick: true
      });
      SetMintbtn("try");
    }
  };

  const DateSelection = (e, data) => {
    console.log('datttteeeee', moment(new Date()).format("YYYY-MM-DD h:mm:ss a"))
    SetBtnData('start')
    if (data == "start") {
      if (e.value == "List Immediately")
        SetFormValue({
          ...FormValue,
          ...{
            ["ClockTime"]: new Date(),
          },
        });
      // else if (e.value == "Scheduled Listing") SetOpenPopup("ClockTime");
    } else {
      if (e.value == "1 day") {
        console.log('dateeeee', new Date(new Date(FormValue.ClockTime).setDate(new Date(FormValue.ClockTime).getDate() + 1)))
        if (FormValue.ClockTime === "") {
          SetFormValue({
            ...FormValue,
            ...{
              ["EndClockTime"]:
                // moment(
                new Date(new Date().setDate(new Date().getDate() + 1))
              // ).format("YYYY-MM-DD h:mm:ss a"),
            },
          });
        }
        else {
          SetFormValue({
            ...FormValue,
            ...{
              ["EndClockTime"]:
                //  moment(
                new Date(new Date(FormValue.ClockTime).setDate(new Date(FormValue.ClockTime).getDate() + 1))
              // ).format("YYYY-MM-DD h:mm:ss a"),
            },
          });
        }
      } else if (e.value == "2 days") {

        if (FormValue.ClockTime === "") {
          SetFormValue({
            ...FormValue,
            ...{
              ["EndClockTime"]:
                //  moment(
                new Date(new Date().setDate(new Date().getDate() + 2))
              // ).format("YYYY-MM-DD h:mm:ss a"),
            },
          });
        }
        else {
          SetFormValue({
            ...FormValue,
            ...{
              ["EndClockTime"]:
                // moment(
                new Date(new Date(FormValue.ClockTime).setDate(new Date(FormValue.ClockTime).getDate() + 2))
              // ).format("YYYY-MM-DD h:mm:ss a"),
            },
          });
        }
      }
      else if (e.value == "Scheduled Listing") setCal(true);
    }
  };

  var validStart = function (current) {
    var yesterday = moment().subtract(1, 'day')
    //return current.isAfter(new Date())&&current.isBefore(new Date(EndClocktime));
    return current.isAfter(yesterday);
  }
  var validEnd = function (current) {
    return current.isAfter(FormValue.ClockTime ? new Date(FormValue.ClockTime) : undefined);
  }

  const setClockValue = (data, date) => {
    console.log("DDATE,Data", data, date)
    SetFormValue({
      ...FormValue,
      ...{ [data]: new Date(date) }
      // moment(date).format("YYYY-MM-DD HH:mm:ss") },
    });
  };

  const TokenApproveCall = async () => {
    SetTokenBtn("process");
    const id = toast.loading("Approve Processing");
    const cont = await ContractCall.SetApproveStatus(
      FormValue.ContractType == 721 || FormValue.ContractType == "721"
        ? "Single"
        : "Multiple",
      FormValue.ContractAddress
    );
    toast.update(id, {
      render: cont ? "Approved Successfully" : "Approved Failed",
      type: cont ? "success" : "error",
      isLoading: false,
      autoClose: 1000,
      closeButton: true,
      closeOnClick: true
    });
    if (cont.status) {
      SetTokenBtn("done");
      SetBtnData("process");
    } else SetTokenBtn("try");
  };

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
            <p className='modal_title text-center'>{text}</p>
            <img src={require('../assets/images/close.svg').default} id='redCloser' onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt_2'>

            {console.log("FormValueFormValueFormValue", FormValue)}
            <div className='mt_2'>
              <p className='modal_summaryLabel'>  </p>
              {<div className='modal_listitem_tab mt_3'>
                <p className={FormValue.PutOnSaleType == 'FixedPrice' ? 'active modal_listitem_tabsingle' : 'modal_listitem_tabsingle'} onClick={() => { SetFormValue({ ...FormValue, PutOnSaleType: "FixedPrice" }) }}>Fixed Price</p>
                {text != "Change Price" &&
                  <p className={FormValue.PutOnSaleType == 'TimedAuction' ? 'active modal_listitem_tabsingle' : 'modal_listitem_tabsingle'}
                    onClick={() => { SetFormValue({ ...FormValue, ...{ PutOnSaleType: "TimedAuction", ClockTime: new Date(), CoinName: currency?.filter(val => val.address != config?.DEADADDRESS)?.[0]?.label } }) }}>
                    Auction
                  </p>}
              </div>}

              {FormValue.PutOnSaleType == 'TimedAuction' ?
                <div className='d-block d-sm-flex gap_2 mt_3'>
                  <div  className='mb_2 mb-sm-0'>
                    <p className='modal_summaryLabel'>Minimum Price</p>
                    <div className='modal_inputGroup min_pad mt_1'>
                      <input type="number" className='modal_input listitem_modalinput cmnInput_scrollerHider min_width' placeholder='' value={FormValue?.NFTPrice} onChange={(e) => { SetFormValue({ ...FormValue, "NFTPrice": e.target.value }) }} />
                      <Select
                        className="border_select"
                        classNamePrefix={"react_select"}
                        placeholder="Coin"
                        styles={stylesgraybg}
                        defaultValue={selectedOption}
                        value={{ value: FormValue?.CoinName, label: FormValue?.CoinName }}
                        onChange={(e) => SetFormValue({
                          ...FormValue,
                          ...{ ["CoinName"]: e.value },
                        })}
                        // isDisabled={true}
                        options={currency}
                      />

                    </div>
                    <p style={{ color: "red" }} >{Error?.CoinName}</p>
                  </div>
                  <div  className='mb_2 mb-sm-0'>
                    <p className='modal_summaryLabel'>Duration</p>
                    <div className='modal_inputGroup duration mt_1'>
                      {/* <input type="number" className='modal_input listitem_modalinput' placeholder='' /> */}
                      <Select
                        className="border_select side_slect"
                        classNamePrefix={"react_select"}
                        // menuIsOpen={true}
                        placeholder=""
                        styles={stylesgraybgOne}
                        defaultValue={selectedOptionOne}
                        // value={selectedDate}
                        value={{
                          value:
                            FormValue.EndClockTime && moment(FormValue.EndClockTime).format("YYYY-MM-DD h:mm:ss a"),
                          label:
                            FormValue.EndClockTime && moment(FormValue.EndClockTime).format("YYYY-MM-DD h:mm:ss a"),
                        }}
                        onChange={(e) =>
                          DateSelection(e, "end")
                        }
                        // onChange={(e) => {
                        //   if (e.value == "specific") {
                        //     console.log(e, "oiroeiro");
                        //     handleOpenCal();
                        //     handleClose();
                        //   }
                        //   setSelectedOptionOne(selectedOptionOne)
                        // }}
                        options={optionsOne}
                      />
                      {/* <Datetime/> */}
                    </div>
                    <p style={{ color: "red" }} >{Error?.EndClockTime}</p>

                  </div>
                </div>
                :

                <div className='mt_3'>
                  <div>
                    <p className='modal_summaryLabel'>
                      {FormValue.PutOnSaleType ==
                        "FixedPrice"
                        ? "Fixed Price"
                        : "Minimum Bid"}
                    </p>
                    <div className='modal_inputGroup mt_1'>
                      <input type="number" className='modal_input listitem_modalinput cmnInput_scrollerHider fixed_width' placeholder='0' value={FormValue?.NFTPrice} onChange={(e) => { SetFormValue({ ...FormValue, "NFTPrice": String(e.target.value) }) }} />
                      <Select
                        className="border_select"
                        classNamePrefix={"react_select"}
                        placeholder="Coin"
                        styles={stylesgraybg}
                        value={{ value: FormValue?.CoinName, label: FormValue?.CoinName }}
                        onChange={(e) => SetFormValue({
                          ...FormValue,
                          ...{ ["CoinName"]: e.label },
                        })}
                        options={
                          currency?.filter(
                            (item) => (item.deleted != true && item?.address != config.DEADADDRESS)
                          )}
                      />
                    </div>
                    <p  className='modal_summaryLabel mt_1' >{currency?.filter(val => val.label == FormValue?.CoinName)?.[0]?.balance} {FormValue?.CoinName}</p>
                    <p style={{ color: "red",marginBottom:0 }} >{Error?.CoinName}</p>
                  </div>
                </div>
              }
            </div>

            <div>

              {/* {FormValue?.CoinName == "CAKE" && <button className='mint_cnctwallet bodygradientBtn mt-4'
                disabled={
                  TokenBtn == "process" || TokenBtn == "done" ? true : false
                }
                onClick={
                  TokenBtn == "start" || TokenBtn == "try"
                    ? TokenApproveCall
                    : null
                }
                disableRipple
              >

                {TokenBtn == "start" && "Approve"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}

              </button>} */}

              <button className='mint_cnctwallet bodygradientBtn mt_2'
                disabled={
                  Mintbtn == "process" || Mintbtn == "done" ? true : false
                }
                onClick={Mintbtn == "start" || Mintbtn == "try" ? ListCall : ""}>

                {Mintbtn == "start" && "Start"}
                {Mintbtn == "process" && "In-Progress"}
                {Mintbtn == "try" && "Try-Again"}
                {Mintbtn == "done" && "Done"}
                {Mintbtn == "init" && "Start"}

              </button>
            </div>



          </div>

        </Modal.Body>

      </Modal>
      {cal && <Calendar show={cal} handleClose={() => setCal(!cal)} validDate={validEnd} modal={"EndClockTime"} setClockValue={setClockValue} />}

    </>
  )
}

export default ListItem