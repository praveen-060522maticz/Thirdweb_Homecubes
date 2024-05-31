import React, { useCallback, useEffect, useState } from "react";
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import SideTab from "../Components/SideTab";
import { Container, Row, Col, Accordion, Button } from "react-bootstrap";
import Countdown from "react-countdown";
import ReactApexChart from "react-apexcharts";
import { nftcard } from "../datas/CardData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Keyboard } from "swiper/modules";
import NFTCards from "../Components/NFTCards";
import Footer from "../Components/Footer";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import ListItem from "../Modals/ListItem";
import Calendar from "../Modals/Calendar";
import BreadPath from "../Components/BreadPath";
import DataCard from "../Components/DataCard";
import { useDispatch, useSelector } from "react-redux";
import { BidApprove, Token_Info_Func, getActivitiesByNftId, getGalleryTokens } from "../actions/axioss/nft.axios";
import config from '../config/config'
import { address_showing, getBNBvalue, isEmpty } from "../actions/common";
import ImgAudVideo from "../Components/ImgAudVideo";
import CancelOrder from "../Modals/CancelOrder";
import ChangePrice from "../Modals/ChangePrice";
import PutonSale from "../Modals/PutonSale";
import BNBIcon from "../assets/images/bnbcoin.svg"
import Purchase from "../Modals/Purchase";
import CheckOut from "../Modals/CheckOut";
import PlaceaBid from "../Modals/PlaceaBid";
import CancelBid from "../Modals/CancelBid";
import moment from "moment";
import AcceptBid from "../Modals/AcceptBid";
import useContractProviderHook from "../actions/contractProviderHook";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share';
import useThirdWeb from "../actions/useThirdWeb";
import TransferToken from "../Modals/TransferToken";


function NFTInfo() {
  // console.log(props,"woeiruowier");
  const [shareShow, setShareShow] = useState(false)

  const location = useLocation();
  console.log(location, JSON.parse(location.state.nftInfo), "weioiwhe");
  const { gasFee } = useSelector((state) => state.LoginReducer.User);

  const nftData = JSON.parse(location?.state?.nftInfo);
  const { state } = useLocation();
  // listitem state

  const [showListItem, setShowListItem] = useState(false);
  const [Dates, setDate] = useState('')

  const handleCloseListItem = () => setShowListItem(false);
  const handleShowListItem = () => setShowListItem(true);

  // calendar state

  const [showCalendar, setShowCalendar] = useState(false);

  const handleCloseCalendar = () => setShowCalendar(false);
  const handleShowCalendar = () => setShowCalendar(true);


  const [description, setDescription] = useState(false);
  const [accordionTab, setAccordionTab] = useState("");
  const [showPurchase, setShowPurchase] = useState(false);
  const [inc, setInc] = useState(false)

  const [showCheckout, setShowCheckout] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showChangePrice, setShowChangePrice] = useState(false);
  const [showBid, setShowBid] = useState(false);
  const [showCancelBid, setShowCancelBid] = useState(false);
  const [showAcceptBid, setShowAcceptBid] = useState(false);
  const [showPutSale, setShowPutSale] = useState(false);
  const [SendDet, SetSendDet] = useState({});
  const [BtnData, SetBtnData] = useState('start')
  const [Text, setText] = useState("");
  const [bidArr, setBitArr] = useState([]);
  const [graph, setGraph] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false)

  var datas1 = {
    series: [
      {
        name: "Price",
        data: [],
      }
    ],
    options: {
      chart: {
        type: "bar",
        height: 300,
        width: "100%",
      },
      colors: ["#06038D", "#EE9D26", "#EB5757"],
      legend: {
        position: "top",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "15%",
          //   endingShape: 'rounded',
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: []
      },
      yaxis: {},
      fill: {
        opacity: 1,
      },
      fill: {
        colors: ["#16EBC3", "#16EBC3", "#16EBC3"],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "" + val + " ";
            // return "$ " + val + " thousands"
          },
        },
      },
    },
  };

  const [graphData, setGraphData] = useState(datas1)

  const dispatch = useDispatch()
  const { Owner, Id } = useParams()

  const ContractCall = useContractProviderHook()

  useEffect(() => {
    window.scroll(0, 0);
  }, [inc]);

  const { payload, isAdmin } = useSelector((state) => state.LoginReducer.User);
  const { accountAddress, web3 } = useSelector(state => state.LoginReducer.AccountDetails);

  const [TabName, SetTabName] = useState("All");
  const [Tokens_Detail, SetTokens_Detail] = useState({});
  const [nftcardData, setNftcardData] = useState([]);
  const [activities, setActivities] = useState([])
  const [Explores, SetExplore] = useState([]);
  const [Loader, setLoader] = useState(false);
  var [moreprops, setMoreprops] = useState('');
  const [InfoDetail, SetInfoDetail] = useState({});
  console.log("Tokens_Detail", Tokens_Detail);
  const [Tokens, SetTokens] = useState({
    All: {
      loader: true,
      page: 1,
      list: [],
      owner: {},
      myBid: {},
      highbid: {},
      myowner: {},
    },
  });

  const getThirdweb = useThirdWeb()

  const filterData =
    accordionTab == "" ? activities :
      accordionTab == "Transfer" ? activities.filter(val => val.Activity == ("Buy" || "Accept")) :
        activities.filter(val => val.Activity == accordionTab);

  const getVal = ContractCall.Contract_Base_Validation();
  console.log("bidArr", bidArr);
  useEffect(() => {
    setLoader(true);
    Explore();

  }, [accountAddress, state, Owner, Id]);

  useEffect(() => {
    if (typeof Tokens[TabName] == 'undefined') {
      Tokens[TabName] = { page: 1, list: [], loader: false };
      SetTokens(Tokens);
      Explore(1, TabName);
    }
  }, [TabName])

  useEffect(() => {
    getCollectionTokens()
    getActivity()
  }, [Tokens_Detail])



  const getActivity = async () => {
    setGraph(false)
    const getCakeValue = await getBNBvalue("CAKEBNB");
    const resp = await getActivitiesByNftId({ NFTId: Tokens_Detail?.NFTId });
    console.log("respsgsesef", resp);
    setActivities(resp?.activityData ?? [])
    setBitArr(resp?.bidData ?? [])

    const dateArr = []
    const priceArr = []

    await Promise.all(resp?.activityData.map((val) => {

      if (val.Activity == "Accept" || val.Activity == "Buy") {
        const bnbval = val.CoinName == "BNB" ? val.NFTPrice : parseFloat(val.NFTPrice) * parseFloat(getCakeValue)

        dateArr.push(new Date(val.createdAt).toDateString())
        priceArr.push(parseFloat(Number(bnbval).toFixed(5)))
      }

    }))
    console.log("respefsefaw", dateArr, priceArr);
    graphData.series[0].data = priceArr;
    graphData.options.xaxis.categories = dateArr;

    setGraphData({ ...graphData })
    setTimeout(() => {
      setGraph(true)
    }, 2000)
  }

  const getCollectionTokens = async (fill) => {

    try {
      var params = { galleryId: Tokens_Detail?.CollectionId, limit: 8, skip: 0, }
      console.log("RespRespawfawfw", params, fill);
      const Resp = await getGalleryTokens(params)
      console.log("RespRespdad", Resp);

      if (Resp.success == "success") {
        const arrData = Resp?.data.filter(val => val.NFTId != Tokens_Detail?.NFTId)
        setNftcardData(arrData)
      } else {
        toast.error(Resp?.msg)
      }
    } catch (error) {
      console.log("errr on getCollectionTokens", error);
    }


  }


  const Explore = async (data, tab) => {
    var page = data ? data : Tokens[TabName]?.page;
    var SendDATA = {
      TabName: tab ? tab : TabName,
      limit: 4,
      Owner: Owner,
      page: page ?? 1,
      from: "info",
      Id: Id.toString(),
      MyAdd: accountAddress,
    };
    console.log("Account Address Checing", SendDATA, accountAddress);
    let Resp = await Token_Info_Func(SendDATA);
    console.log("Owners List", Resp);
    if (
      Resp?.token?.success == "success" &&
      Resp?.token?.data[0]?.Current_Owner
    ) {
      console.log("TOKENDATA", Resp.token.data[0]);
      if (TabName == "All") {
        SetTokens_Detail(Resp.token.data[0]);
        SetExplore(Resp.Explore.data);
        setMoreprops(Resp.token.data[0].NFTProperties?.length)
      }
      SetTokens({
        ...Tokens,
        ...{
          [TabName]: {
            list:
              SendDATA.page == 1 ?
                [
                  ...(
                    TabName == "owner"
                      ? Resp.token.data[0].tokenowners_list
                      : TabName == "bid"
                        ? Resp.Bid.data
                        : []
                  )
                ]

                :
                [
                  ...Tokens[TabName].list,
                  ...(
                    TabName == "owner"
                      ? SendDATA.page == 1 ? Resp.token.data[0].tokenowners_list : [Tokens[TabName], ...Resp.token.data[0].tokenowners_list]
                      : TabName == "bid"
                        ? SendDATA.page == 1 ? Resp.Bid.data : [Tokens[TabName], ...Resp.Bid.data]
                        : []
                  )
                  ,
                ],
            loader:
              Resp.token.Count ==
                Tokens[TabName]?.list?.length + Resp.token.data.length
                ? false
                : true,
            page: Tokens[TabName].page,
            owner:
              TabName == "All"
                ? Resp.token.data?.[0]?.Current_Owner
                : Tokens["All"].owner,
            myowner:
              TabName == "All"
                ? Resp.token.data[0].myowner.pop()
                : Tokens["All"].myowner,
            myBid: Resp?.myBid?.data?.pop(),
            highbid: Resp?.highBid?.data[0],
          },
        },
      });
      console.log("kdgfdfad1111", Resp, SendDATA);
    } else {
      SetTokens({ [TabName]: { loader: true, page: 1, list: [] } });
    }
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  };

  console.log("Tokens[TabName]", Tokens);


  let formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  const POPUPACTION = useCallback(
    async (text, data, item) => {
      console.log("Buy is Calling", text, data, item);
      if (accountAddress) {
        if (data == "Accept") {
          (async () => {
            let Statu = await ContractCall.GetApproveStatus(
              Tokens_Detail.ContractType == 721 ||
                Tokens_Detail.ContractType == "721"
                ? "Single"
                : "Multiple",
              Tokens_Detail.ContractAddress
            );
            console.log("StatuStatuStatu", Statu);
            if ((Statu == false) || (Statu == "error")) {
              toast.warn("Need To Approve");
              SetBtnData("open");
              SetSendDet(item)
            } else {
              SetBtnData("error");
              SetSendDet(item)
            }
          })();
        }
        else {
          setText(text)
          SetSendDet(item);
        }
      } else {
        if (data === "Share") {
          setText(text)
          SetSendDet(item);
        } else
          toast.error(" log in to connect to the wallet ", { autoClose: 1000, closeButton: true, closeOnClick: true });
      }

    },

    [accountAddress, Tokens_Detail.ContractAddress]
  );

  const [canReload, setCanReload] = useState(true);

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


  const cancelBidBySeller = async (address) => {
    const id = toast.loading('Canceling order... Do not refresh!');
    console.log('AFFAFAFAAFFAF---->',gasFee);
    // let cont = await ContractCall.BidNFt_Contract(0, "cancelBidBySeller", Tokens_Detail.NFTId, Tokens_Detail.ContractAddress)
    let cont = await getThirdweb.useContractCall("cancelBidBySeller", 0, 0, Tokens_Detail.NFTId, Tokens_Detail.ContractAddress, gasFee?.collectAddress, "2500000000000000000")


    if (cont) {
      var FormValue = {
        TokenBidderAddress: address,
        NFTQuantity: 1,
        NFTId: Tokens_Detail.NFTId,
        ContractAddress: Tokens_Detail.ContractAddress,
        ContractType: Tokens_Detail.ContractType,
        CollectionNetwork: Tokens_Detail.CollectionNetwork,
        from: 'Cancel',
        activity: 'Cancel',
        Category: "",
        EmailId: payload.EmailId,
        click: `${config.FRONT_URL}/info/${Tokens_Detail.CollectionNetwork}/${Tokens_Detail.ContractAddress}/${Tokens["All"]?.owner?.WalletAddress}/${Tokens_Detail.NFTId}`

      }
      setCanReload(false)
      console.log('gsfgsfg', FormValue)
      let Resp = await BidApprove(FormValue)
      setCanReload(true)
      console.log('dksfgsdhkg', Resp)
      if (Resp.success == 'success') {
        toast.update(id, { render: 'Cancelled Bid Successfully', type: 'success', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        // push(`/my-item/${payload?.CustomUrl}`)
      }
      else {
        toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
      }

    } else {
      toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
    }
  }

  const navigate = useNavigate()

  const transferNft = async () => {
    try {
      setCanReload(false)
      const Resp = await getThirdweb.useContractCall("TransferToken", 0, 0, Tokens_Detail.NFTId, payload?.parentAddress, Tokens_Detail.ContractAddress, gasFee?.collectAddress, "2500000000000000000")
      setCanReload(true)
    } catch (e) {
      console.log('Erro on transferNft---->', e);
    }
  }


  return (
    <>
      <BottomBar />
      <Header />
      <Container fluid className="pt-3 home_wrapper">
        <Container className="custom_container">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
              {console.log("datas1", datas1)}
            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner">
              <BreadPath />
              <Row>
                <div className="cus-back-btn mb-3">
                  <Button className="" onClick={() => navigate(-1)} >
                    <i className="fa-solid fa-chevron-left"></i>
                    Back
                  </Button>
                </div>
                <Col lg={4} md={12} sm={12} xs={12}>

                  <div className="nftInfo_topLeft">
                    {!isEmpty(Tokens_Detail) &&
                      <ImgAudVideo
                        file={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Original/${Tokens_Detail?.NFTOrginalImage}`}
                        type={
                          Tokens_Detail.CompressedFile
                            ? Tokens_Detail.CompressedFile?.includes(".webp") || Tokens_Detail.CompressedFile?.includes(".png")
                              ? "image"
                              : Tokens_Detail.CompressedFile.includes(".webm")
                                ? "video"
                                : "audio"
                            : Tokens_Detail.CompressedFile
                        }
                        thumb={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/${Tokens_Detail.CompressedThumbFile}`}
                        from="info"
                        origFile={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Original/${Tokens_Detail.OriginalFile}`}
                        classname={"img-fluid nftInfo_img"}
                      />


                    }
                    {/* <img
                      className="img-fluid nftInfo_img"
                      src={nftData?.nftImg}
                    /> */}
                    {/* <button className="nftinfo_gradeientBtn web_listitemBtn  mt-3" onClick={() => handleShowListItem()}>
                      List Item
                    </button> */}
                    {/* {console.log("Tokens[TabName]", Tokens[TabName])} */}
                    {isEmpty(InfoDetail) && !Tokens_Detail?.isStaked ?
                      // (Tokens_Detail?.ContractType?.toString() ===
                      //   "721"
                      //   ?
                      (
                        Tokens[TabName]?.myowner?.WalletAddress ==
                          accountAddress ? (
                          Tokens[TabName]?.myowner?.PutOnSaleType ==
                            "FixedPrice" ? (
                            <button className="nftinfo_gradeientBtn web_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); SetSendDet(Tokens[TabName]?.myowner); setShowCancel(true) }}>
                              Cancel Now
                            </button>
                          ) : Tokens[TabName]?.myowner?.PutOnSaleType ==
                            "NotForSale" ||
                            Tokens[TabName]?.myowner?.PutOnSaleType ==
                            "UnlimitedAuction" ||
                            (Tokens[TabName]?.myowner?.PutOnSaleType ==
                              "TimedAuction" &&
                              new Date(
                                Tokens[TabName]?.myowner.EndClockTime
                              ).getTime() < Date.now()) ? (
                            <>
                              <button className="nftinfo_gradeientBtn web_listitemBtn  mt-3" onClick={() => {
                                if (getVal != "") return toast.error(getVal);
                                if (Tokens[TabName]?.highbid) return toast.warning("Please accept or cancel Bid")
                                SetSendDet(Tokens[TabName]?.myowner); setText("Put on Sale"); handleShowListItem()
                              }}>
                                List Item
                              </button>
                              <button className="nftinfo_gradeientBtn web_listitemBtn  mt-3"
                                onClick={() => {
                                  setShowTransfer(true)
                                }}>
                                Transfer Token
                              </button>
                            </>
                          ) : (
                            Tokens[TabName]?.myowner?.PutOnSaleType ==
                              "TimedAuction" &&
                              new Date(Tokens[TabName]?.myowner?.ClockTime) > Date.now() ? (

                              <button className="nftinfo_gradeientBtn web_listitemBtn  mt-3">
                                Auction Not Started Yet
                              </button>
                            ) :
                              (new Date(Tokens[TabName]?.myowner?.EndClockTime).getTime() > Date.now()
                                &&
                                <button className="nftinfo_gradeientBtn web_listitemBtn  mt-3">
                                  Auction is Live Now
                                </button>
                              )
                          )
                        ) : (
                          Tokens[TabName]?.owner &&
                          Tokens[TabName]?.owner?.WalletAddress !=
                          accountAddress &&
                          (Tokens[TabName]?.owner?.PutOnSaleType ==
                            "FixedPrice" ? (
                            <button className="nftinfo_gradeientBtn web_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); SetSendDet(Tokens[TabName]?.owner); setShowCheckout(true) }}>
                              Buy Now
                            </button>
                          ) : (
                            Tokens[TabName]?.myBid?.WalletAddress ==
                            accountAddress && (
                              // <button className="nftinfo_gradeientBtn web_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); setShowCancelBid(true); }}>
                              //   Cancel Bid
                              // </button>
                              <></>
                            )
                          ))
                        )
                      )
                      :
                      <button className="nftinfo_gradeientBtn web_listitem_btn mt-3">
                        This token is Staked
                      </button>
                      // :
                      // Tokens[TabName]?.myowner?.WalletAddress ==
                      //   Tokens[TabName]?.owner?.WalletAddress ? (
                      //   <>
                      //     {Tokens[TabName]?.myowner?.PutOnSaleType ==
                      //       "FixedPrice" && (
                      //         // <Button
                      //         //   className="tf-button"
                      //         //   onClick={() =>K
                      //         //     POPUPACTION("dummy",
                      //         //       "Cancel",
                      //         //       Tokens[TabName]?.myowner
                      //         //     )
                      //         //   }
                      //         // >
                      //         //   Cancel Now
                      //         // </Button>
                      //         <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //           Cancel Now
                      //         </button>
                      //       )}
                      //     {Tokens[TabName]?.myBid?.WalletAddress ==
                      //       accountAddress ? (
                      //       // <Button
                      //       //   className="tf-button"
                      //       //   onClick={() =>
                      //       //     POPUPACTION("dummy", "Bid", Tokens[TabName]?.myBid)
                      //       //   }
                      //       // >
                      //       //   Edit Bid
                      //       // </Button>
                      //       <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //         Cancel Now
                      //       </button>
                      //     ) : (
                      //       Tokens[TabName]?.myowner?.WalletAddress !=
                      //       Tokens[TabName]?.owner?.WalletAddress && (
                      //         // <Button
                      //         //   className="tf-button"
                      //         //   onClick={() => POPUPACTION("dummy", "Bid", {})}
                      //         // >
                      //         //   Bid Now
                      //         // </Button>
                      //         <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //           Cancel Now
                      //         </button>
                      //       )
                      //     )}
                      //   </>
                      // ) : Tokens[TabName]?.owner?.PutOnSaleType ===
                      //   "FixedPrice" ? (
                      //   // <Button
                      //   //   className="tf-button"
                      //   //   onClick={() =>
                      //   //     POPUPACTION("dummy", "Buy", Tokens[TabName].owner)
                      //   //   }
                      //   // >
                      //   //   Buy Now
                      //   // </Button>
                      //   <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //     Cancel Now
                      //   </button>
                      // ) : (
                      //   Tokens[TabName]?.myBid?.WalletAddress ==
                      //   accountAddress && (
                      //     // <Button
                      //     //   className="tf-button"
                      //     //   onClick={() => POPUPACTION("dummy", "CancelBid", Tokens[TabName]?.myBid)}
                      //     // >
                      //     //   Cancel Bid
                      //     // </Button>
                      //     <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //       Cancel Now
                      //     </button>
                      //   )
                      // ))
                    }

                    {isEmpty(InfoDetail) && !Tokens_Detail?.isStaked &&
                      // (Tokens_Detail?.ContractType?.toString() ===
                      //   "721" ?
                      (
                        Tokens[TabName]?.myowner?.WalletAddress ==
                          accountAddress ? (
                          Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "FixedPrice" && (
                            <button className="nftinfo_gradeientBtn web_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); SetSendDet(Tokens[TabName]?.myowner); setText("Change Price"); handleShowListItem() }}>
                              Change Price
                            </button>
                          )
                        ) : (
                          Tokens[TabName]?.owner?.WalletAddress !=
                          accountAddress &&
                          (Tokens[TabName]?.owner?.PutOnSaleType ==
                            "TimedAuction" &&
                            (new Date(Tokens[TabName].owner.EndClockTime)?.getTime() < Date.now() ? (
                              <button className="nftinfo_gradeientBtn web_listitem_btn mt-3">
                                Auction Ended
                              </button>
                            ) : Tokens[TabName]?.highbid?.WalletAddress !=
                              accountAddress &&
                              Tokens[TabName]?.owner?.WalletAddress ==
                              accountAddress ? (
                              <button className="nftinfo_gradeientBtn web_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); handleShowListItem() }}>
                                Accept
                              </button>
                            ) : Tokens[TabName]?.myBid?.WalletAddress ==
                              accountAddress ? (
                              <button className="nftinfo_gradeientBtn web_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); setShowBid(true) }}>
                                Edit Bid
                              </button>
                            ) : ((new Date(Tokens["All"]?.owner?.EndClockTime) > Date.now() &&
                              new Date(Tokens["All"]?.owner?.ClockTime) > Date.now()) ?
                              <button className="nftinfo_gradeientBtn web_listitem_btn mt-3">
                                Not Started Yet
                              </button>
                              :
                              <button className="nftinfo_gradeientBtn web_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); setShowBid(true) }}>
                                Bid Now
                              </button>
                            )))
                        )
                      )
                      // : Tokens[TabName]?.myowner?.WalletAddress ==
                      //   Tokens[TabName]?.owner?.WalletAddress ? (
                      //   Tokens[TabName]?.owner?.PutOnSaleType ==
                      //     "FixedPrice" ? (
                      //     // <Button
                      //     //   className="tf-button"
                      //     //   onClick={() =>
                      //     //     POPUPACTION("Change Price",
                      //     //       "createorder",
                      //     //       Tokens[TabName]?.myowner
                      //     //     )
                      //     //   }
                      //     // >
                      //     //   Change Price
                      //     // </Button>
                      //     <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //       Cancel Now
                      //     </button>
                      //   ) : (
                      //     // <Button
                      //     //   className="tf-button"
                      //     //   onClick={() =>
                      //     //     POPUPACTION("dummy",
                      //     //       "createorder",
                      //     //       Tokens[TabName]?.myowner
                      //     //     )
                      //     //   }
                      //     // >
                      //     //   Put on Sale
                      //     // </Button>
                      //     <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //       Cancel Now
                      //     </button>
                      //   )
                      // ) : Tokens[TabName]?.owner?.WalletAddress !=
                      //   accountAddress &&
                      //   Tokens[TabName]?.highbid?.WalletAddress !=
                      //   accountAddress &&
                      //   Tokens[TabName]?.owner?.WalletAddress ==
                      //   accountAddress ? (
                      //   // <Button
                      //   //   className="tf-button"
                      //   //   onClick={() =>
                      //   //     POPUPACTION("dummy",
                      //   //       "Accept",
                      //   //       Tokens[TabName]?.highbid
                      //   //     )
                      //   //   }
                      //   // >
                      //   //   Accept
                      //   // </Button>
                      //   <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //     Cancel Now
                      //   </button>
                      // ) : Tokens[TabName]?.myBid?.WalletAddress ==
                      //   accountAddress ? (
                      //   // <Button
                      //   //   className="tf-button"
                      //   //   onClick={() =>
                      //   //     POPUPACTION("dummy", "Bid", Tokens[TabName]?.myBid)
                      //   //   }
                      //   // >
                      //   //   Edit Bid
                      //   // </Button>
                      //   <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //     Cancel Now
                      //   </button>
                      // ) : (
                      //   // <Button
                      //   //   className="tf-button"
                      //   //   onClick={() => POPUPACTION("dummy", "Bid", {})}
                      //   // >
                      //   //   Bid Now{" "}
                      //   // </Button>
                      //   <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                      //     Cancel Now
                      //   </button>
                      // ))
                    }
                  </div>
                </Col>
                <Col lg={8} md={12} sm={12} xs={12}>
                  <h3 className="marketplae_topdata mt-4">
                    {!isEmpty(InfoDetail)
                      ? InfoDetail?.NFTName?.length > 15 ? <>{InfoDetail?.NFTName.slice(0, 15)}...</> : InfoDetail?.NFTName
                      : Tokens_Detail?.NFTName?.length > 15 ? <>{Tokens_Detail?.NFTName.slice(0, 15)}...</> : Tokens_Detail?.NFTName}
                  </h3>

                  <div className="nftInfo_iconsHolder">
                    <img onClick={() => setShareShow(!shareShow)}
                      className="nftInfo_socials"
                      src={require("../assets/images/share.svg").default}
                    />
                    {shareShow ?

                      <div className="shareOptions_holder">

                        <div className="nftinfo_imgsep"></div>
                        <TelegramShareButton
                          title={"Telegram"}
                          url={`${config.FRONT_URL}/profile/${Tokens[TabName]?.owner?.CustomUrl}`}

                        >
                          <img
                            className="nftInfo_socials"
                            src={
                              require("../assets/images/whitetelegram.svg").default
                            }
                          />
                        </TelegramShareButton>

                        <TwitterShareButton
                          url={`${config.FRONT_URL}/profile/${Tokens[TabName]?.owner?.CustomUrl}`}
                          title="Twitter Share"
                        >
                          <img
                            className="nftInfo_socials"
                            src={require("../assets/images/whitetwitter.svg").default}
                          />
                        </TwitterShareButton>

                        <img
                          className="nftInfo_socials"
                          src={require("../assets/images/whiteinsta.svg").default}
                        />


                        <img
                          className="nftInfo_socials"
                          src={require("../assets/images/whitediscard.svg").default}
                        />

                        <CopyToClipboard
                          onCopy={() => toast.success("Content copied successfully")}
                          text={`${config.FRONT_URL}/profile/${Tokens[TabName]?.owner?.CustomUrl}`}
                        >
                          <img
                            className="nftInfo_socials"
                            src={require("../assets/images/whitecopy.svg").default}
                          />
                        </CopyToClipboard>

                        <WhatsappShareButton
                          title={'Whatsapp'}
                          url={`${config.FRONT_URL}/profile/${Tokens[TabName]?.owner?.CustomUrl}`}
                        >
                          <img
                            className="nftInfo_socials"
                            src={
                              require("../assets/images/whitewhatsapp.svg").default
                            }
                          />

                        </WhatsappShareButton>
                      </div> :
                      <></>}

                  </div>
                  {console.log("asgfsefasfs", Tokens[TabName]?.owner?.CustomUrl)}
                  <p className="nftcard_ownedby mt-3">
                    Owned by :{" "}

                    {InfoDetail && !isEmpty(InfoDetail) ? (
                      <NavLink className="sidetab_link" to={"/profile" + "/" + Tokens[TabName]?.owner?.CustomUrl}>
                        <span className="nft_ownerName">
                          {payload?.DisplayName
                            ? payload?.DisplayName
                            : address_showing(payload?.WalletAddress)}
                        </span>
                      </NavLink>
                    ) : (
                      <NavLink className="sidetab_link" to={Tokens[TabName]?.owner?.CustomUrl ? "/profile" + "/" + Tokens[TabName]?.owner?.CustomUrl : "#"}>
                        <span className="nft_ownerName">
                          {Tokens[TabName]?.owner?.DisplayName
                            ? Tokens[TabName]?.owner?.DisplayName
                            : address_showing(
                              Tokens[TabName]?.owner?.NFTOwner
                            )}
                        </span>
                      </NavLink>
                    )}
                  </p>

                  {/* {Tokens["All"]?.owner?.PutOnSaleType ===
                    "TimedAuction" &&

                    <div className="nftInfo_greenBar">
                      <div className="greenBar_left">
                        <img
                          className="greenClock"
                          src={require("../assets/images/clock.svg").default}
                        />

                        {new Date(Tokens["All"]?.owner?.ClockTime) > Date.now() ? (

                          <p className="greenBar_time">
                            Auction Yet to Start {Math.ceil((new Date(Tokens["All"]?.owner.ClockTime).getTime() - new Date(Date.now()).getTime()) / (1000 * 3600 * 24))}
                          </p>

                        )
                          :
                          ((new Date(Tokens["All"]?.owner?.EndClockTime) > Date.now()) ?
                            <>

                              <div className="greenBar_countdown">
                                {new Date(
                                  Tokens["All"]?.owner?.EndClockTime
                                ) > Date.now() && (
                                    <Countdown
                                      date={Tokens["All"]?.owner?.EndClockTime}
                                      // autoStart={true}
                                      renderer={renderer}
                                    />
                                  )}
                              </div>
                            </>
                            :
                            <span>Auction Ended</span>
                          )}

                      </div>
                    </div>
                  } */}
                  {Tokens["All"]?.owner?.PutOnSaleType ===
                    "TimedAuction" &&

                    <div className="nftInfo_greenBar">
                      <div className="greenBar_left">
                        <img
                          className="greenClock"
                          src={require("../assets/images/clock.svg").default}
                        />
                        <p className="greenBar_time">
                          {new Date(Tokens["All"]?.owner?.EndClockTime) > Date.now() ? `Sale ends ${new Date(Tokens["All"]?.owner?.EndClockTime).toString()}` : "Auction Ended"}
                        </p>
                      </div>
                      <div className="greenBar_countdown">
                        {new Date(
                          Tokens["All"]?.owner?.EndClockTime
                        ) > Date.now() && (
                            <Countdown
                              date={Tokens["All"]?.owner?.EndClockTime}
                              onComplete={() => toast.warn("Auction ended...")}
                            // autoStart={true}
                            // renderer={renderer}
                            />
                          )}
                      </div>
                    </div>}


                  <div className="nftInfo_curPrice">
                    {Tokens[TabName]?.owner?.PutOnSaleType === "FixedPrice" &&
                      // <p className="created">
                      <>
                        <p>Current Price : </p>&nbsp;<p className="dollar_price">
                          <img
                            className="nft_coinImg"
                            src={BNBIcon}
                          />
                          &nbsp;{Tokens[TabName]?.owner?.NFTPrice}&nbsp;{Tokens[TabName]?.owner?.CoinName}
                        </p>
                        {/* </p> */}
                      </>
                    }

                  </div>
                  {/* <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => handleShowListItem()}>
                    List Item
                  </button> */}

                  {isEmpty(InfoDetail) && !Tokens_Detail?.isStaked ?
                    (
                      Tokens[TabName]?.myowner?.WalletAddress ==
                        accountAddress ? (
                        Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "FixedPrice" ? (
                          <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); SetSendDet(Tokens[TabName]?.myowner); setShowCancel(true) }}>
                            Cancel Now
                          </button>
                        ) : Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "NotForSale" ||
                          Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "UnlimitedAuction" ||
                          (Tokens[TabName]?.myowner?.PutOnSaleType ==
                            "TimedAuction" &&
                            new Date(
                              Tokens[TabName]?.myowner.EndClockTime
                            ).getTime() < Date.now()) ? (

                          <>
                            <button className="nftinfo_gradeientBtn mob_listitem_btn  mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); SetSendDet(Tokens[TabName]?.myowner); setText("Put on Sale"); handleShowListItem() }}>
                              List Item
                            </button>
                            <button className="nftinfo_gradeientBtn mob_listitem_btn  mt-3"
                              onClick={() => {
                                setShowTransfer(true)
                              }}>
                              Transfer Token
                            </button>
                          </>

                        ) : (
                          Tokens[TabName]?.myowner?.PutOnSaleType ==
                            "TimedAuction" &&
                            new Date(Tokens[TabName]?.myowner?.ClockTime) > Date.now() ? (

                            <button className="nftinfo_gradeientBtn mob_listitem_btn  mt-3">
                              Auction Not Started Yet
                            </button>
                          ) :
                            (new Date(Tokens[TabName]?.myowner?.EndClockTime).getTime() > Date.now()
                              &&
                              <button className="nftinfo_gradeientBtn mob_listitem_btn  mt-3">
                                Auction is Live Now
                              </button>
                            )
                        )
                      ) : (
                        Tokens[TabName]?.owner &&
                        Tokens[TabName]?.owner?.WalletAddress !=
                        accountAddress &&
                        (Tokens[TabName]?.owner?.PutOnSaleType ==
                          "FixedPrice" ? (
                          <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); SetSendDet(Tokens[TabName]?.owner); setShowCheckout(true) }}>
                            Buy Now
                          </button>
                        ) : (
                          Tokens[TabName]?.myBid?.WalletAddress ==
                          accountAddress && (
                            <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); setShowCancelBid(true); }}>
                              Cancel Bid
                            </button>
                          )
                        ))
                      )
                    )
                    :
                    <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3">
                      This token is Staked
                    </button>
                  }

                  {isEmpty(InfoDetail) && !Tokens_Detail?.isStaked &&
                    (
                      Tokens[TabName]?.myowner?.WalletAddress ==
                        accountAddress ? (
                        Tokens[TabName]?.myowner?.PutOnSaleType ==
                        "FixedPrice" && (
                          <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); SetSendDet(Tokens[TabName]?.myowner); setText("Change Price"); handleShowListItem() }}>
                            Change Price
                          </button>
                        )
                      ) : (
                        Tokens[TabName]?.owner?.WalletAddress !=
                        accountAddress &&
                        (Tokens[TabName]?.owner?.PutOnSaleType ==
                          "TimedAuction" &&
                          (new Date(Tokens[TabName].owner.EndClockTime)?.getTime() < Date.now() ? (
                            <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" >
                              Auction Ended
                            </button>
                          ) : Tokens[TabName]?.highbid?.WalletAddress !=
                            accountAddress &&
                            Tokens[TabName]?.owner?.WalletAddress ==
                            accountAddress ? (
                            <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); handleShowListItem() }}>
                              Accept
                            </button>
                          ) : Tokens[TabName]?.myBid?.WalletAddress ==
                            accountAddress ? (
                            <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); setShowBid(true) }}>
                              Edit Bid
                            </button>
                          ) : ((new Date(Tokens["All"]?.owner?.EndClockTime) > Date.now() &&
                            new Date(Tokens["All"]?.owner?.ClockTime) > Date.now()) ?
                            <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3">
                              Not Started Yet
                            </button>
                            :
                            <button className="nftinfo_gradeientBtn mob_listitem_btn mt-3" onClick={() => { if (getVal != "") return toast.error(getVal); setShowBid(true) }}>
                              Bid Now
                            </button>
                          )))
                      )
                    )
                  }



                  <Accordion
                    defaultActiveKey="0"
                    className="mt-5 nftInfo_accordion"
                    flush
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        Price History <i class="fa-solid fa-angle-down" />
                      </Accordion.Header>
                      {graph && <Accordion.Body>
                        <Row>
                          <Col lg={1} xs={1}>
                            <p className="apexchart_label">Average Price (BNB)</p>

                          </Col>
                          <Col lg={11} xs={11}>
                            <ReactApexChart
                              options={graphData.options}
                              series={graphData.series}
                              type="bar"
                              height={200}
                            />
                          </Col>
                        </Row>

                      </Accordion.Body>}
                    </Accordion.Item>
                    {/* <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        Offers <i class="fa-solid fa-angle-down" />
                      </Accordion.Header>
                      <Accordion.Body></Accordion.Body>
                    </Accordion.Item> */}
                  </Accordion>

                  <h6 className="nftInfo_descTitle">Description</h6>

                  {description ? (
                    <p className="mp_detailbrief">{isEmpty(InfoDetail) ? Tokens_Detail?.NFTDescription : InfoDetail?.NFTDescription}</p>
                  ) : (
                    <p className="mp_detailbrief">
                      {(isEmpty(InfoDetail) ? Tokens_Detail?.NFTDescription : InfoDetail?.NFTDescription)?.length > 300 ?
                        (isEmpty(InfoDetail) ? Tokens_Detail?.NFTDescription : InfoDetail?.NFTDescription)?.slice(0, 300)?.concat("...") :
                        (isEmpty(InfoDetail) ? Tokens_Detail?.NFTDescription : InfoDetail?.NFTDescription)}
                    </p>
                  )}

                  <button
                    className="mp_readmoreBtn readmore_left mt-2"
                    onClick={() => setDescription(!description)}
                  >
                    {(isEmpty(InfoDetail) ? Tokens_Detail?.NFTDescription : InfoDetail?.NFTDescription)?.length > 300 ? description ? "Read Less" : "Read More" : ""}
                  </button>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Accordion
                    defaultActiveKey="0"
                    className="mt-5 nftInfo_accordion"
                    flush
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        Price History <i class="fa-solid fa-angle-down" />
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="nftInfo_acrdTabs pb-3">
                          <div
                            className={
                              accordionTab == ""
                                ? "nftInfo_singleTab active"
                                : "nftInfo_singleTab"
                            }
                            onClick={() => setAccordionTab("")}
                          >
                            <p>All</p>
                          </div>
                          <div
                            className={
                              accordionTab == "Buy"
                                ? "nftInfo_singleTab active"
                                : "nftInfo_singleTab"
                            }
                            onClick={() => setAccordionTab("Buy")}
                          >
                            <p>Sale</p>
                          </div>
                          <div
                            className={
                              accordionTab == "PutOnSale"
                                ? "nftInfo_singleTab active"
                                : "nftInfo_singleTab"
                            }
                            onClick={() => setAccordionTab("PutOnSale")}
                          >
                            <p>List</p>
                          </div>
                          <div
                            className={
                              accordionTab == "Offer"
                                ? "nftInfo_singleTab active"
                                : "nftInfo_singleTab"
                            }
                            onClick={() => { setAccordionTab("Offer"); SetTabName("bid") }}
                          >
                            <p>Offers</p>
                          </div>
                          <div
                            className={
                              accordionTab == "Transfer"
                                ? "nftInfo_singleTab active"
                                : "nftInfo_singleTab"
                            }
                            onClick={() => setAccordionTab("Transfer")}
                          >
                            <p>Transfers</p>
                          </div>
                          <div
                            className={
                              accordionTab == "CollectionOffer"
                                ? "nftInfo_singleTab active"
                                : "nftInfo_singleTab"
                            }
                            onClick={() => setAccordionTab("CollectionOffer")}
                          >
                            <p>Collection Offers</p>
                          </div>
                        </div>
                        <div className="nftInfo_table">
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Event</th>
                                  <th>Price</th>
                                  <th>From</th>
                                  <th>To</th>
                                  <th>Date</th>
                                  {accordionTab == "Offer" && <th>Action</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {/* {filterData?.map((i) => (
                                  <tr>
                                    <td>{i.event}</td>
                                    <td>
                                      {i.price} {i.coinName}
                                    </td>
                                    <td>{i.from}</td>
                                    <td>{i.to}</td>
                                    <td>{i.date}</td>
                                  </tr>
                                ))} */}

                                {accordionTab == "Offer" && TabName == "bid" && (Tokens["bid"]?.list?.length > 0 || Tokens["bid"]?.list?.filter((val) => val.WalletAddress != Tokens[TabName]?.owner?.NFTOwner).length > 0) &&
                                  Tokens["bid"]?.list?.filter((val) => val.WalletAddress != Tokens[TabName]?.owner?.NFTOwner).map((data, key) => {
                                    return (
                                      <>

                                        <tr>
                                          <td>Bid</td>

                                          <td>
                                            {data.TokenBidAmt} {data.CoinName}
                                          </td>

                                          <td>{address_showing(
                                            data?.TokenBidderAddress
                                          )}</td>

                                          <td>{address_showing(
                                            data?.TokenBidderAddress
                                          )}</td>

                                          <td>{moment(data.updatedAt).fromNow()}</td>
                                          <td>
                                            {console.log("Loaojdoa", data, data.WalletAddress,
                                              Tokens["bid"]?.myowner?.WalletAddress,
                                              Tokens["bid"]?.myowner?.WalletAddress,
                                              accountAddress,
                                              new Date(
                                                Tokens[TabName]?.myowner?.EndClockTime
                                              ).getTime(), Date.now())}
                                            {(((data.WalletAddress !=
                                              Tokens["bid"]?.myowner?.WalletAddress) &&
                                              (Tokens["bid"]?.myowner?.WalletAddress ==
                                                accountAddress) &&
                                              new Date(
                                                Tokens[TabName]?.myowner?.EndClockTime
                                              ).getTime() < Date.now() && Tokens[TabName]?.owner?.PutOnSaleType == "TimedAuction")
                                              ||
                                              (data.WalletAddress !=
                                                Tokens["bid"]?.myowner?.WalletAddress) &&
                                              (Tokens["bid"]?.myowner?.WalletAddress ==
                                                accountAddress) && (Tokens[TabName]?.owner?.PutOnSaleType != "TimedAuction"))
                                              &&
                                              <div className="d-flex justify-content-center align-items-center gap-2">
                                                <button
                                                  className="table_btn"
                                                  onClick={() => {
                                                    if (getVal != "") return toast.error(getVal);
                                                    setShowAcceptBid(true);
                                                    POPUPACTION("dummy", "Accept", data)
                                                  }
                                                  }
                                                // onClick={() => setShowAcceptBid(true)}
                                                >
                                                  Accept
                                                </button>
                                                <button
                                                  className="table_btn"
                                                  onClick={() => { if (getVal != "") return toast.error(getVal); cancelBidBySeller(data?.TokenBidderAddress); }}
                                                >
                                                  Cancel
                                                </button>
                                              </div>
                                              // :
                                              // <button
                                              //   className="table_btn"
                                              //   onClick={() => { setShowCancelBid(true); }}
                                              // >
                                              //   Cancel Bid
                                              // </button>
                                              // <button className="nftinfo_gradeientBtn web_listitem_btn mt-3" onClick={() => { setShowCancelBid(true); }}>
                                              //   Cancel Bid
                                              // </button>
                                            }
                                          </td>
                                        </tr >

                                        {/* <li className="mt-4">
                                          <div className="box-bid">

                                            <div className="infor infor_hover_blk">
                                              <div className="image-bid">
                                                <img
                                                  src={
                                                    data?.Profile
                                                      && !isEmpty(data?.Profile) ? `${config.IMG_URL}/user/${data?.WalletAddress}/profile/${data?.Profile}`
                                                      : config.profile
                                                  }
                                                  alt="Image"
                                                />
                                              </div>
                                              <div className="history">
                                                {
                                                  <span className="price">
                                                    {data.TokenBidAmt} {data.CoinName}
                                                    {" "}
                                                    by
                                                  </span>
                                                }{" "}
                                                {console.log("fff", data.WalletAddress !=
                                                  Tokens["bid"]?.myowner?.WalletAddress &&
                                                  Tokens["bid"]?.myowner?.WalletAddress ==
                                                  accountAddress &&
                                                  new Date(
                                                    Tokens[TabName]?.myowner?.EndClockTime
                                                  ).getTime() < Date.now())}
                                                <span className="name">
                                                  {data?.DisplayName
                                                    ? data?.DisplayName
                                                    : address_showing(
                                                      data?.TokenBidderAddress
                                                    )}
                                                  <div className="time">
                                                    Bid for : {data?.Pending} Token
                                                  </div>
                                                  <div className="time">
                                                    {moment(data.updatedAt).fromNow()}
                                                  </div>
                                                </span>
                                              </div>

                                            </div>
                                          </div>
                                          {data.WalletAddress == accountAddress && (
                                            <>
                                              <Button
                                                className="tf-button edit_offer primary"
                                                disableRipple
                                                onClick={() =>
                                                  POPUPACTION("dummy", "Bid", data)
                                                }
                                              >
                                                Edit Offer
                                              </Button>
                                              <Button
                                                className="tf-button edit_offer secondary"
                                                disableRipple
                                                onClick={() =>
                                                  POPUPACTION("dummy", "CancelBid", data)
                                                }
                                              >
                                                Cancel Offer
                                              </Button>
                                            </>
                                          )}
                                          {data.WalletAddress !=
                                            Tokens["bid"]?.myowner?.WalletAddress &&
                                            Tokens["bid"]?.myowner?.WalletAddress ==
                                            accountAddress &&
                                            new Date(
                                              Tokens[TabName]?.myowner?.EndClockTime
                                            ).getTime() < Date.now() &&
                                            (
                                              <Button
                                                className="tf-button edit_offer primary"
                                                disableRipple
                                                onClick={() =>
                                                  POPUPACTION("dummy", "Accept", data)
                                                }
                                              >
                                                Accept Offer
                                              </Button>
                                            )}
                                        </li> */}
                                      </>
                                    );
                                  })}

                                {accordionTab == "Offer" ?
                                  bidArr.length != 0 &&
                                  bidArr.map((val) => (
                                    <tr>
                                      <td>Offers</td>
                                      <td>
                                        {val.TokenBidAmt} {val.CoinName}
                                      </td>
                                      <td>{address_showing(val.TokenBidderAddress)}</td>
                                      <td>{address_showing(val.NFTOwner)}</td>
                                      <td>{moment(val.createdAt).fromNow()}</td>
                                      <td>{val.status}</td>
                                    </tr>
                                  ))
                                  :
                                  filterData.length != 0 &&
                                  filterData?.map((i) => (
                                    <tr>
                                      <td>{i.Activity == "PutOnSale" ? "List" : i.Activity}</td>
                                      <td>
                                        {i.NFTPrice} {i.CoinName}
                                      </td>
                                      <td>{i.From}</td>
                                      <td>{i.To}</td>
                                      <td>{moment(i.createdAt).fromNow()}</td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
              </Row>
              <Row className="mt-5">
                <h3 className="marketplae_topdata">
                  More From this Collection
                </h3>

                <Swiper
                  className="mySwiper bottomnav_colswiper nftcard_swiper pt-3"
                  spaceBetween={30}
                  navigation={true}
                  keyboard={true}
                  pagination={{
                    clickable: true,
                  }}
                  breakpoints={{
                    320: {
                      slidesPerView: 1.2,
                      spaceBetween: 20,
                    },
                    450: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    576: {
                      slidesPerView: 2.3,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    992: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    1200: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                    1500: {
                      slidesPerView: 5,
                      spaceBetween: 20,
                    },
                  }}
                  modules={[Navigation, Keyboard]}
                >
                  {nftcardData?.map((i) => (
                    <SwiperSlide onClick={() => { setInc(!inc) }}>
                      <DataCard data={i} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="greenarrow_boxHolder position-relative">
                  <div className="greenarrow_box"></div>
                </div>
              </Row>
            </Col>
          </Row>
        </Container >
        <Footer />
      </Container >

      <div className='gradient_holder staking_gradholder'></div>


      {/* listItem Modal */}
      {
        showListItem && <ListItem
          show={showListItem}
          Date={Dates}
          handleClose={handleCloseListItem}
          handleOpenCal={handleShowCalendar}
          text={Text}
          owner={SendDet}
          file={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/${Tokens_Detail.CompressedFile}`}
          type={
            Tokens_Detail.CompressedFile
              ? Tokens_Detail.CompressedFile?.includes(".webp")
                ? "image"
                : Tokens_Detail.CompressedFile.includes(".webm")
                  ? "video"
                  : "audio"
              : Tokens_Detail.CompressedFile
          }
          thumb={Tokens_Detail.CompressedThumbFile}
          item={{
            NFTName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            OriginalImage: Tokens_Detail.NFTOrginalImage,
            CompressedFile: Tokens_Detail.CompressedFile,
            CompressedThumbFile: Tokens_Detail.CompressedThumbFile,
            OriginalFile: Tokens_Detail.NFTOrginalImageIpfs,
            NFTCreator: Tokens_Detail.NFTCreator,
            NFTRoyalty: Tokens_Detail.NFTRoyalty,
            NFTQuantity: Tokens_Detail.NFTQuantity,
            Category: Tokens_Detail.Category,
            NFTPrice: Tokens[TabName]?.myowner?.NFTPrice,
            CoinName: Tokens[TabName]?.myowner?.CoinName,
            PutOnSaleType: "FixedPrice",
            PutOnSale: true,
          }}

        />
      }

      {
        showCancel &&
        <CancelOrder
          show={showCancel}
          handleClose={() => setShowCancel(false)}

          owner={SendDet}
          types="Cancel"
          file={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/${Tokens_Detail.CompressedFile}`}
          type={
            Tokens_Detail.CompressedFile
              ? Tokens_Detail.CompressedFile?.includes(".webp")
                ? "image"
                : Tokens_Detail.CompressedFile.includes(".webm")
                  ? "video"
                  : "audio"
              : Tokens_Detail.CompressedFile
          }
          thumb={Tokens_Detail.CompressedThumbFile}
          // noimg={require("../assets/images/No_image.jpg")}
          item={{
            TokenName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            Category: Tokens_Detail.Category,
            NFTPrice: Tokens[TabName]?.myowner?.NFTPrice,
            CoinName: Tokens[TabName]?.myowner?.CoinName,
            NFTCreator: Tokens_Detail?.NFTCreator
          }}
        />
      }


      {showChangePrice && <ChangePrice show={showChangePrice} handleClose={() => setShowChangePrice(false)} />}
      {
        showCheckout &&
        <CheckOut
          show={showCheckout}
          handleClose={() => setShowCheckout(false)}
          owner={SendDet}
          file={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/${Tokens_Detail.CompressedFile}`}
          item={{
            NFTId: Tokens_Detail.NFTId,
            NFTName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            NFTRoyalty: Tokens_Detail.NFTRoyalty,
            NFTCreator: Tokens_Detail.NFTCreator,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            Category: Tokens_Detail.Category,
          }} />
      }
      {
        showPurchase && (
          <Purchase
            owner={SendDet}
            show={showPurchase}
            handleClose={() => setShowPurchase(false)}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
            }}
          />
        )
      }
      {
        showBid &&
        <PlaceaBid
          showBid={showBid}
          handleCloseBid={() => setShowBid(false)}
          owner={Tokens[TabName]?.owner}
          bidder={!isEmpty(SendDet) ? SendDet : Tokens[TabName]?.myBid}
          bid={Tokens[TabName]?.highbid}
          item={{
            _id: Tokens_Detail.Current_Owner._id,
            NFTId: Tokens_Detail.NFTId,
            NFTName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            NFTRoyalty: Tokens_Detail.NFTRoyalty,
            NFTCreator: Tokens_Detail.NFTCreator,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            Category: Tokens_Detail.Category,
            NFTOwner: Tokens["All"]?.owner?.WalletAddress
          }}
        />

      }


      {
        showCancelBid &&
        <CancelBid
          show={showCancelBid}
          handleClose={() => setShowCancelBid(false)}

          bidder={SendDet}
          owner={Tokens[TabName]?.owner}
          item={{
            NFTId: Tokens_Detail.NFTId,
            NFTName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            NFTRoyalty: Tokens_Detail.NFTRoyalty,
            NFTCreator: Tokens_Detail.NFTCreator,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            Category: Tokens_Detail.Category,
          }}
        />
      }

      {showAcceptBid &&
        <AcceptBid
          show={showAcceptBid}
          handleClose={() => setShowAcceptBid(false)}
          owner={Tokens[TabName]?.myowner}
          bidder={SendDet}
          bid={SendDet}
          approvestatus={BtnData}
          item={{
            NFTId: Tokens_Detail.NFTId,
            NFTName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            NFTRoyalty: Tokens_Detail.NFTRoyalty,
            NFTCreator: Tokens_Detail.NFTCreator,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            Category: Tokens_Detail.Category,
            // CompressedFile:Tokens_Detail.CompressedFile,
            // OriginalFile:Tokens_Detail.OriginalFile,
            // CompressedThumbFile:Tokens_Detail.CompressedThumbFile,
            // OriginalThumbFile:Tokens_Detail.OriginalThumbFile,
          }}
        />
      }

      {showTransfer &&
        <TransferToken
          show={showTransfer}
          handleClose={() => setShowTransfer(false)}
          item={{
            NFTId: Tokens_Detail.NFTId,
            NFTName: Tokens_Detail.NFTName,
            ContractAddress: Tokens_Detail.ContractAddress,
            ContractType: Tokens_Detail.ContractType,
            Royalty: Tokens_Detail.NFTRoyalty,
            NFTCreator: Tokens_Detail.NFTCreator,
            CollectionNetwork: Tokens_Detail.CollectionNetwork,
            Category: Tokens_Detail.Category,
            status: Tokens_Detail?.status,
            chainType: Tokens_Detail?.ChainId
          }}
          Tokens_Detail={Tokens_Detail}
        />}

      <Calendar show={showCalendar}
        setDate={(value) => {
          // console.log(value,"valuedfsd");
          setDate(new Date())
        }}
        handleClose={handleCloseCalendar}
        handleOpenList={handleShowListItem} />
    </>
  );
}

export default NFTInfo;
