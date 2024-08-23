import React, { useState, useEffect } from "react";
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import SideTab from "../Components/SideTab";
import { Container, Row, Col, Button } from "react-bootstrap";
import { nftcard } from "../datas/CardData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Keyboard } from "swiper/modules";
import NFTCards from "../Components/NFTCards";
import Footer from "../Components/Footer";
import Countdown from "react-countdown";
import CollectionCard from "../Components/CollectionCard";
import BreadPath from "../Components/BreadPath";
import GalleryCard from "../Components/GalleryCard";
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import DataCard from "../Components/DataCard";
import Typewriter from "typewriter-effect";
import { Buymint, getCurrentProject, getGallery, getGalleryTokens, onInitialMint, setPendingTransaction, setTokenStatus } from "../actions/axioss/nft.axios";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import useContractProviderHook from "../actions/contractProviderHook";
import config from '../config/config'
import { isEmpty } from "../actions/common";
import ProjectCard from "../Components/ProjectCard";
import ImgAudVideo from "../Components/ImgAudVideo";
import { getCmsContent } from "../actions/axioss/cms.axios";
import { ReadMore } from "../Components/ReadMore";
import ConnectWallet from "../Modals/ConnectWallet";
import Roadmap from "../Components/Roadmap";
import PropertyDes from '../assets/images/nftimageOne.png'
import web3Utils from 'web3-utils';
import { useWallets } from "@privy-io/react-auth";
import DETH from '../Abi/token.json';
function Minting() {
  const [mint, setMint] = useState("minting");
  const [description, setDescription] = useState(false);
  const { _id } = useParams()

  const navigate = useNavigate()

  const desc = [
    {
      descText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
  ];

  const ContractCall = useContractProviderHook();

  const wallet = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );
  const { payload, token, gasFee } = useSelector((state) => state.LoginReducer.User);
  const { accountAddress, web3, web3p, coinBalance, BNBUSDT, USDTaddress } = useSelector(state => state.LoginReducer.AccountDetails);
  console.log('BNBUSDTgasFee---->', gasFee, BNBUSDT);
  const completed = 10000;
  const [inprogress, setInprogress] = useState(576);
  const [isAvailable, setIsAvailable] = useState(0);
  const [minted, setMinted] = useState(0)
  const [notMinted, setNotMinted] = useState(0)
  const [TotalToken, setTotalToken] = useState(0)
  const [project, setProject] = useState({})
  const [mintCount, setMintcount] = useState(1)
  const [collection, setCollection] = useState([])
  const [nftcardData, setNftcardData] = useState([])
  const [loading, setLoading] = useState(false);
  const [showWallet, setShowWallet] = useState(false)
  console.log("-----------project", project);
  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1];
  console.log("pathname,stae", pathname, state, path);

  const [tokenDetails, setTokenDetails] = useState(state)

  const [canReload, setCanReload] = useState(true);
  const { wallets } = useWallets()

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

  useEffect(() => {
    getProjects()
    getCollectionTokens()
    getLatestGallery()
    getToken()
  }, [])

  const getToken = async () => {

    const getPro = await getCurrentProject({ action: "getNfts", _id, skip: 0, limit: 1 })
    console.log("getNftsss", getPro);

    if (getPro.success == "success") {
      setTokenDetails(getPro?.data?.[0])
    }
  }


  const getLatestGallery = async () => {
    try {
      const Resp = await getGallery({ action: "getOneProjects", projectId: tokenDetails._id });
      setCollection(Resp?.data)
      console.log("resp getLatestGallery", Resp);
    } catch (error) {
      console.log("err or ongetLatestGallery ", error);
    }
  }


  const getCollectionTokens = async (fill) => {
    var params = { limit: 10, skip: fill ? 0 : nftcardData.length }

    console.log("RespRespawfawfw", params, fill);
    const Resp = await getGalleryTokens(params)
    console.log("RespResp", Resp);
    if (fill) setNftcardData(Resp?.data)
    else setNftcardData([...nftcardData, ...Resp?.data ?? []]);
  }

  const getProjects = async () => {

    const getPro = await getCurrentProject({ _id })
    console.log("getCurrentProject", getPro);

    if (getPro.success == "success") {
      const Project = getPro.data[0]
      console.log("aaaaaaaaaa", new Date() < new Date(Project.unlockAt), Project?.isNotMinted == 0);
      if (new Date() < new Date(Project.unlockAt)) setMint("minting");
      else if (Project?.isNotMinted == 0) setMint("beforeMint");
      else setMint("minted");

      setProject(Project ?? {})
      setMinted(Project?.isMinted ?? 0)
      setNotMinted(Project?.isNotMinted ?? 0)
      setTotalToken(Project?.totalMinted ?? 0)
      setIsAvailable(Project?.isAvailable ?? 0)
    } else if (getPro.success == "error") {
      setMint("beforeMint")
    } else {
      setMint("beforeMint")
    }
  }

  const onMint = async () => {

    if (!wallet?.accountAddress) return toast.error("Please Connect wallet");
    if (mintCount > notMinted) return toast.error("Please enter valid count");
    if (isEmpty(mintCount)) return toast.error("Mint count can't be empty");
    if (mintCount > isAvailable) return toast.error("Mint count not available");

    if (project?.mintTokenName != "BNB") {
      const checkApprove = await ContractCall.validateApproveforUSDT(mintCount * project?.NFTPrice, false, wallets[0], project?.mintToken)
      if (!checkApprove) return;
    }
    setLoading(true)
    setCanReload(false)
    // const id = toast.loading('Purchasing Token on processing...\n Do not refresh!')
    const id = toast.loading(
      <div>
        <p className="mb-0">Purchasing Token on processing...</p>
        <p className="mb-0">Do not refresh!</p>
      </div>
    )

    const params = {
      mintCount, _id
    }

    const initialMint = await onInitialMint(params)
    console.log("initial min", initialMint);

    if (initialMint.status) {

      const firstNft = initialMint.data[0]
      let TStamp = Date.now();
      var value = parseFloat(mintCount * project?.NFTPrice).toFixed(8)
      console.log("valuevalue",
        mintCount,
        721,
        "BNB",
        web3Utils.toWei(String(value)),
        initialMint.MetaData,
        [
          mintCount,
          web3Utils.toWei(String(firstNft?.NFTRoyalty)),
          firstNft.Nonce,
          web3Utils.toWei(String(firstNft?.NFTPrice)),
        ],
        [firstNft?.Randomname, "Coin"],
        firstNft?.Hash,
        firstNft?.ContractAddress,);
      const getUSDT = ((mintCount * parseFloat(project?.NFTPrice)) * BNBUSDT).toFixed(7);

      console.log("valll", value, web3Utils.toWei(String(getUSDT)), getUSDT);
      // console.log('GAGAGAGAGAG---->', "lazyMinting",
      //   0,
      //   mintCount,
      //   initialMint.MetaData,
      //   [
      //     mintCount,
      //     web3?.utils.toWei(firstNft?.NFTRoyalty),
      //     firstNft.Nonce,
      //     web3.utils.toWei(firstNft?.NFTPrice.toString())
      //   ],
      //   [firstNft?.Randomname, "Coin"],
      //   firstNft?.Hash,
      //   firstNft?.ContractAddress,
      //   web3.utils.toWei(value.toString()),
      //   "2500000000000000000"
      // );
      // try {
      //   let CONTRACT = await ContractCall.contrat_connection(wallets[0], DETH, USDTaddress);
      //   console.log('CONTRACafwTCONTRACT---->',CONTRACT);
      //   var contractobj = await
      //     CONTRACT
      //       .methods
      //       .approve("0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208", "1000000000000000000000000000000000000000000000000")
      //       .send({
      //         from: wallets[0].address
      //       }).on('transactionHash', (transactionHash) => {
      //         return transactionHash
      //       })
      //       .on('error', (e) => {
      //         console.log('returnofoawfoaw---->',e);
      //       });
      // } catch (e) {
      //   console.log('Eseigjse---->',e);
      // }


      var hash = await ContractCall.gasLessTransaction(
        "lazyMinting",
        project?.mintTokenName == "BNB" ? web3Utils.toWei(value.toString()) : 0,
        mintCount,
        wallets[0],
        initialMint.MetaData,
        [
          mintCount,
          web3Utils.toWei(firstNft?.NFTRoyalty),
          firstNft.Nonce,
          web3Utils.toWei(firstNft?.NFTPrice.toString()),
          web3Utils.toWei(String(getUSDT))
        ],
        [firstNft?.Randomname, project?.mintTokenName == "BNB" ? "COIN" : project?.mintTokenName],
        firstNft?.Hash,
        TStamp,
        firstNft?.ContractAddress,
        web3Utils.toWei(value.toString()),
        gasFee?.collectAddress,
        "2500000000000000000"
      )

      console.log("hash", hash);

      // var hash = await getThirdweb.useContractCall(
      //   "lazyMinting",
      //   0,
      //   mintCount,
      //   initialMint.MetaData,
      //   [
      //     mintCount,
      //     web3?.utils.toWei(firstNft?.NFTRoyalty),
      //     firstNft.Nonce,
      //     web3.utils.toWei(firstNft?.NFTPrice.toString())
      //   ],
      //   [firstNft?.Randomname, "Coin"],
      //   firstNft?.Hash,
      //   firstNft?.ContractAddress,
      //   web3.utils.toWei(value.toString()),
      //   gasFee?.collectAddress,
      //   "2500000000000000000"
      // )

      // console.log('ssssssssss---->',getThirdweb.useContractCall("lazyMinting",));

      console.log('hashawdawdawdaw--->', hash);
      if (hash) {

        const changedToken = await Promise.all(initialMint?.data.map((val, i) => {

          val.NFTId = hash?.Tokenid?.[i]
          val.Hash = hash?.HashValue
          val.isMinted = true

          return val
        }))

        console.log("changedToken", changedToken);
        let update = {
          NFTOwner: accountAddress,
          HashValue: hash.HashValue,
          changedToken,
          NFTPrice: project?.NFTPrice,
          CoinName: project?.mintTokenName,
          isWhiteList: false

        }
        console.log("update", update);
        let pendingObj = {
          From: accountAddress,
          method: "lazyMinting",
          params: [update],
          TimeStamp: TStamp
        }

        let Resp = hash?.status == 'pending' ? await setPendingTransaction(pendingObj) : await Buymint(update)
        console.log("Resppppppsppsps dta", Resp);
        if (hash?.status == 'pending') {
          toast.update(id, {
            render:
              <div>
                <p className="mb-0">Token purchase pending...</p>
                <p className="mb-0">Please check after some time!</p>
              </div>,
            type: 'warning', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true
          })
          setTimeout(() => {
            navigate("/minting")
          }, 1000)
        } else if (Resp.status) {
          toast.update(id, { render: 'Token Purchased Successfully', type: 'success', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          setTimeout(() => {
            navigate("/minting")
          }, 1000)
        }
        else {
          setTokenStatus({ arrData: initialMint, stauts: "available" })
          toast.update(id, { render: 'Token Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        }
      }
      else {
        setTokenStatus({ arrData: initialMint?.data, status: "available" })
        toast.update(id, { render: 'Token Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
      }

    }
    setLoading(false)
    setCanReload(true)
  }

  console.log("projecttststst", project);


  useEffect(() => {
    getCmsList()
  }, [])

  const [cmsCon, setCmsCon] = useState([])

  const getCmsList = async () => {
    const Resp = await getCmsContent({
      page: ["minting"],
    });
    console.log("sejhfgeiussgsegesgegf", Resp);
    setCmsCon(Resp?.data ?? [])
  }
  console.log("cmsCon", cmsCon);


  return (
    <>
      <BottomBar />
      <Header />
      <Container fluid className="pt-3 home_wrapper over_hidercon">
        <Container className="custom_container ">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
            </Col>

            <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner">
              <div className="cus-back-btn mb-3">
                <Button className="" onClick={() => navigate(-1)} >
                  <i className="fa-solid fa-chevron-left"></i>
                  Back
                </Button>
              </div>
              {/* <BreadPath/> */}
              {mint == "beforeMint" ? (
                <>
                  {/* <p className="mint_violetText">
                    There Is No Minting Scheduled Now
                  </p> */}
                  <div className="pink_typeletter mt-3">
                    <Typewriter
                      options={{
                        strings: ["There Is No Minting Scheduled Now"],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </div>

                  <Row className="mt-4 position-relative">
                    <Col lg={6}>
                      <h3 className="minting_detail lh_aligner">
                        But you can buy away from our market place
                      </h3>
                      <img src={require('../assets/images/violetwaste.png')} className="mint_viopat" />
                      <img src={require('../assets/images/pinkwaste.png')} className="mint_pinkpat" />
                      <img src={require('../assets/images/greenwaste.png')} className="mint_greenpat" />
                    </Col>
                    <Row className="mt-4">
                      <Col lg={6} sm={8} xs={12} className="mb-3">
                        <p className="mp_detailbrief" dangerouslySetInnerHTML={{ __html: cmsCon?.filter((val) => val?.key == "coundDown description")?.[0]?.content }}  >
                        </p>
                      </Col>

                      <Col
                        lg={5}
                        sm={4}
                        xs={12}
                        className="greenbox_cornerer mb-3"
                      >
                        <NavLink to='/marketplace' className="sidetab_link">
                          <div className="pi_markeplaceLink">
                            <p className="pi_marketplace">Marketplace</p>
                            <div className="green_box">
                              <img
                                className="green_longright"
                                src={
                                  require("../assets/images/rightlong.svg")
                                    .default
                                }
                              />
                            </div>
                          </div>
                        </NavLink>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Swiper
                        className="mySwiper mt-4 pt-3 bottomnav_swiper"
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
                            slidesPerView: 1.8,
                            spaceBetween: 20,
                          },
                          576: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          768: {
                            slidesPerView: 2.5,
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
                        {nftcardData.length != 0 && nftcardData?.map((i) => (
                          <SwiperSlide>
                            <DataCard data={i} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="greenarrow_boxHolder position-relative">
                        <div className="greenarrow_box"></div>
                      </div>
                    </Row>
                  </Row>
                </>
              ) : (
                <></>
              )}

              {mint == "minting" ? (
                <>
                  <Row className="align-items-center">
                    <Col lg={6} className="position-relative mb-5">
                      <img className="mint_pinkwaste" src={require('../assets/images/pinkwaste.png')} />
                      <h3 className="minting_detail">
                        Can't wait, Buy from
                        Marketplace
                      </h3>

                      <div className="stack_countdown minting_countdown mt-4">
                        {project.unlockAt && <Countdown date={new Date(project.unlockAt)} onComplete={() => window.location.reload()} />}
                      </div>

                      <p className="mp_detailbrief" dangerouslySetInnerHTML={{ __html: cmsCon?.filter((val) => val?.key == "coundDown description")?.[0]?.content }} >
                      </p>
                      <NavLink to='/marketplace' className="sidetab_link">
                        <div className="pi_markeplaceLink mintmarket_lint mt-4">

                          <p className="pi_marketplace">Marketplace</p>
                          <div className="green_box">
                            <img
                              className="green_longright"
                              src={
                                require("../assets/images/rightlong.svg").default
                              }
                            />
                          </div>

                        </div>
                      </NavLink>
                    </Col>

                    <Col lg={6} className="position-relative mb-5">
                      <img className="img-fluid" src={require('../assets/images/minting.png')} />
                      <img className="min_bluewaste" src={require('../assets/images/violetwaste.png')} />
                      <img className="mint_greenwaste" src={require('../assets/images/greenwaste.png')} />
                    </Col>

                    {/* <p className="mint_violetText mt-5">Guideline</p> */}
                    <div className="pink_typeletter">
                      <Typewriter
                        options={{
                          strings: ["Guideline"],
                          autoStart: true,
                          loop: true,
                        }}
                      />
                    </div>
                    <h3 className="minting_detail mint_secondaryTitle mt-4">
                      Property Description
                    </h3>
                    <div className="row">
                      <div className="col-xl-8 col-12 col-sm-8 col-md-8 col-lg-8">
                        <p className="mp_detailbrief mt-4">
                          {project?.projectDescription}
                        </p>
                      </div>
                      <div className="col-xl-4 col-12 col-sm-4 col-md-4 col-lg-4 col-d-flex align-items-center justify-content-center">
                        <div className="property-des-img">

                          <img src={PropertyDes} className="img-fluid" />
                        </div>
                      </div>
                    </div>

                    <Row className="mt-4">
                      <Col lg={6}>
                        <Row>
                          <Col lg={8}>
                            <p className="mint_scrollTitle">
                              {cmsCon.filter((val) => val?.key == "How to buy from Marketplace ?")?.[0]?.title}
                            </p>
                            <ReadMore descText={cmsCon.filter((val) => val?.key == "How to buy from Marketplace ?")?.[0]?.content} />

                          </Col>
                        </Row>
                      </Col>
                      <Col lg={6}>
                        <Row>
                          <Col lg={8}>
                            <p className="mint_scrollTitle">
                              {cmsCon.filter((val) => val?.key == "How to Mint out NFT ?")?.[0]?.title}
                            </p>
                            <ReadMore descText={cmsCon.filter((val) => val?.key == "How to Mint out NFT ?")?.[0]?.content} />
                          </Col>
                        </Row>
                      </Col>
                      <Row className="pi_higherTop">
                        <Col lg={4}>
                          <h1 className="mint_gradValue">1M$</h1>
                        </Col>
                        <Col lg={8}>
                          <h3 className="minting_detail">Property Value</h3>
                          <p className="mp_detailbrief">
                            {project?.CMS?.filter((val) => val.stepTitle == "PROPERTY VALUE")?.[0]?.stepDescription}
                          </p>
                        </Col>
                      </Row>
                    </Row>
                    <Row>
                      <h3 className="minting_detail mint_secondaryTitle mt-4">
                        Gallery
                      </h3>
                      <Swiper
                        className="mySwiper bottomnav_colswiper pt-3 mt-4"
                        slidesPerView={3}
                        spaceBetween={30}
                        navigation={true}
                        keyboard={true}
                        pagination={{
                          clickable: true,
                        }}
                        breakpoints={{
                          320: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                          },
                          576: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                          },
                          992: {
                            slidesPerView: 4,
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
                        {collection.length != 0 && collection.map((i) => (
                          <SwiperSlide>
                            <GalleryCard data={i} />u
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="position-relative">
                        <div className="greenarrow_box"></div>
                      </div>
                    </Row>
                  </Row>
                </>
              ) : (
                <></>
              )}

              {mint == "minted" ? (
                <Row className="minted_top_space position-relative">
                  <img src={require('../assets/images/greenwaste.png')} className="mint_afgreenwaste" />
                  <img src={require('../assets/images/violetwaste.png')} className="mint_afviowaste" />
                  <Col lg={12} className="minted_bgset">
                    <h3 className="minting_detail text-center">
                      Buy a Piece of This Property RIGHT NOW!
                    </h3>

                    <p className="mp_detailbrief text-center mt-4">
                      {project?.aboutDescription}
                    </p>

                    <div className="mint_gameProgress d-flex justify-content-center align-items-center flex-column flex-sm-row gap-3 mt-4">
                      <p className="minted_values">{minted} Minted</p>
                      <div className="mint_progresBar">


                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${(minted / TotalToken) * 100}%` }}>
                            {minted}
                          </div>
                        </div>
                      </div>
                      <p className="minted_values">From {TotalToken} </p>

                    </div>
                    <p className="minted_values" style={{ justifyContent: "center", display: "flex", marginTop: "10px" }}>Available {isAvailable}</p>
                    {/* <Row className="justify-content-center mt-4">
                      <Col lg={5} md={5} sm={10} xs={10}  >

                        <ImgAudVideo
                          file={tokenDetails?.NFTOrginalImage === undefined || null ? "" : tokenDetails?.NFTOrginalImage.split(':')[0] == 'https' ? tokenDetails?.NFTOrginalImage : `${config.IMG_URL}/nft/${tokenDetails.NFTCreator}/Original/${tokenDetails?.NFTOrginalImage}`}
                          type={
                            tokenDetails.CompressedFile
                              ? tokenDetails.CompressedFile?.includes(".webp") || tokenDetails.CompressedFile?.includes(".png")
                                ? "image"
                                : tokenDetails.CompressedFile.includes(".webm")
                                  ? "video"
                                  : "audio"
                              : tokenDetails.CompressedFile
                          }
                          thumb={`${config.IMG_URL}/nft/${tokenDetails.NFTCreator}/Compressed/${tokenDetails.CompressedThumbFile}`}
                          from="info"
                          origFile={`${config.IMG_URL}/nft/${tokenDetails.NFTCreator}/Original/${tokenDetails.OriginalFile}`}
                          classname={"img-fluid nftInfo_img"}
                        />
                        <h5 className="marketplae_topdata text-center mt-3">{tokenDetails?.NFTName}</h5>
                      </Col>

                    </Row> */}

                    <div className="mint_gameProgress d-flex justify-content-center align-items-center flex-column flex-sm-row  mt-4 gap-3">
                      <p className="mint_countValue">Number of NFTs</p>
                      <input type="number" className="mint_countInput" min={0} value={mintCount}
                        onChange={(e) => {
                          setMintcount(e.target.value);
                        }} />
                      {/* <p className="mint_countValue">{(mintCount * parseFloat(project?.NFTPrice)).toFixed(7)} BNB = {project?.NFTPrice && ((mintCount * parseFloat(project?.NFTPrice)) * BNBUSDT).toFixed(4)} $</p> */}
                      <p className="mint_countValue">{(mintCount * parseFloat(project?.NFTPrice)).toFixed(7)} {project?.mintTokenName}</p>
                    </div>
                    <div className="mint_dualBtns mt-4">
                      {/* {!wallet?.accountAddress && <button onClick={() => setShowWallet(true)} className="bodygradientBtn mint_cnctwallet">
                        <img
                          className="header_wallet"
                          src={require("../assets/images/wallet.svg").default}
                        />
                        Connect-Wallet
                      </button>} */}

                      <button className="mint_mintBtn mt-4" disabled={loading} onClick={() => onMint()} >
                        <img
                          className="header_wallet"
                          src={
                            require("../assets/images/whiteminting.svg").default
                          }
                        />
                        Mint
                      </button>
                    </div>
                  </Col>

                  {/* <p className="mint_violetText minted_middletop_space">
                    Guideline
                  </p> */}
                  <div className="pink_typeletter mt-5">
                    <Typewriter
                      options={{
                        strings: ["Guideline"],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </div>

                  <div className="row mt-4">
                    <div className="col-xl-4 col-12 col-sm-4 col-md-4 col-lg-4 d-flex align-items-center justify-content-center">
                      <img lazy src={`${config.IMG_URL}/nft/${tokenDetails.NFTCreator}/Original/${tokenDetails?.NFTOrginalImage}`} className="img-fluid rounded-3 minting__propertyImg" />
                    </div>
                    <div className="col-xl-8 col-12 col-sm-8 col-md-8 col-lg-8 mb-3 mb-lg-0">
                      <h3 className="mint_scrollTitle inter_font">
                        Property Description
                      </h3>
                      <p className="mp_detailbrief mt-3">
                        {project?.projectDescription}
                      </p>
                    </div>
                  </div>

                  <Col xs={12}>
                    <Row className="mt-4">
                      <Col lg={6} md={6} xs={12}>
                        <Row>
                          <Col lg={8} md={12} xs={12}>
                            <p className="mint_scrollTitle">
                              {cmsCon.filter((val) => val?.key == "How to buy from Marketplace ?")?.[0]?.title}
                            </p>
                            <ReadMore descText={cmsCon.filter((val) => val?.key == "How to buy from Marketplace ?")?.[0]?.content} />

                          </Col>
                        </Row>
                      </Col>
                      <Col lg={6} md={6} xs={12}>
                        <Row>
                          <Col lg={8} md={12} xs={12}>
                            <p className="mint_scrollTitle">
                              {cmsCon.filter((val) => val?.key == "How to Mint out NFT ?")?.[0]?.title}
                            </p>
                            <ReadMore descText={cmsCon.filter((val) => val?.key == "How to Mint out NFT ?")?.[0]?.content} />
                          </Col>
                        </Row>
                      </Col>
                      <Row className="pi_higherTop align-items-center">
                        <Col lg={4}>
                          <h1 className="mint_gradValue new">{project?.propertyValue?.toUpperCase?.() ?? "1M"}$</h1>
                        </Col>
                        <Col lg={8}>
                          <h3 className="minting_detail">Property Value</h3>
                          <p className="mp_detailbrief">
                            {project?.CMS?.filter((val) => val.stepTitle == "PROPERTY VALUE")?.[0]?.stepDescription}
                          </p>
                        </Col>
                      </Row>
                    </Row>

                    <Row className="mt-5">
                      {/* <h3 className="minting_detail">{project.name} Road map</h3> */}
                      <h3 className="projects_title text-center">{project.name} Road map</h3>
                      <p className="mp_detailbrief text-center">
                        {project?.CMS?.filter((val) => val.stepTitle == "Road map")?.[0]?.stepDescription}
                      </p>

                      <Roadmap data={project?.roadMap} />
                    </Row>

                    <Row className="mt-5">
                      <h3 className="minting_detail mint_secondaryTitle pt-3 mt-4 mb-3">
                        Gallery
                      </h3>
                      <Swiper
                        className="mySwiper bottomnav_colswiper pt-4"
                        slidesPerView={3}
                        spaceBetween={30}
                        navigation={true}
                        keyboard={true}
                        pagination={{
                          clickable: true,
                        }}
                        breakpoints={{
                          320: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                          },
                          576: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                          },
                          992: {
                            slidesPerView: 4,
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
                        {collection.length != 0 && collection.map((i) => (
                          <SwiperSlide>
                            <GalleryCard data={i} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="position-relative">
                        <div className="greenarrow_box"></div>
                      </div>
                    </Row>
                  </Col>
                </Row>
              ) : (
                <></>
              )}


            </Col>
          </Row>
        </Container>
        <Footer />
        {mint == "minted" ?
          <div className="five_imgbg">

          </div> :
          <></>
        }
      </Container>
      {showWallet && <ConnectWallet show={showWallet} handleCloseWallet={() => setShowWallet(false)} />}
      <div className='gradient_holder staking_gradholder'></div>
    </>
  );
}

export default Minting;
