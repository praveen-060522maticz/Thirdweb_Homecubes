import React, { useState, useEffect, useRef } from "react";
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import { Button, Col, Container, Row } from "react-bootstrap";
import SideTab from "../Components/SideTab";
import { nftcard } from "../datas/CardData";
import CollectionCard from "../Components/CollectionCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Keyboard, Pagination } from "swiper/modules";
import RewardsCard from "../Components/RewardsCard";
import NFTCards from "../Components/NFTCards";
import Footer from "../Components/Footer";
import { useLocation, NavLink, useParams, useNavigate } from "react-router-dom";
import Roadmap from "../Components/Roadmap";
import BreadPath from "../Components/BreadPath";
import GallerCardOne from "../Components/GallerCardOne";
import DataCard from "../Components/DataCard";
import { getGallery, getProjects, stackFunction } from "../actions/axioss/nft.axios";
import config from '../config/config';
import { getNewsFeedsFunc } from "../actions/axioss/cms.axios";
import { getDaysOfDesiredMonth } from "../actions/common";
import { FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import mintBg from '../assets/images/mintBg.png'
import { ReadMore } from "../Components/ReadMore";
import ImgAudVideo from "../Components/ImgAudVideo";

function ProjectInfo() {
  const location = useLocation();

  const projectData = JSON.parse(location?.state?.projectInfo)
  console.log(projectData, "oerwerhw");
  const [description, setDescription] = useState(false);
  const { projectTitle } = useParams()
  const swiperRef = useRef(null);

  const [projectDetail, setProjectDetail] = useState({})
  const [galleryArr, setGalleryArr] = useState([])
  const [tokens, setTokens] = useState([])
  const [nftLength, setnftLength] = useState(0);
  const [staked, setstaked] = useState(0);
  const [unStaked, setunStaked] = useState(0);
  const [feedArr, setFeedArr] = useState([]);
  const [totalReward, setTotalReward] = useState(0)

  console.log("projectDetail", projectDetail);

  const desc = [
    {
      descText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
  ];

  useEffect(() => {
    window.scroll(0, 0)
  }, []);

  useEffect(() => {
    fetchProject()
  }, [])

  useEffect(() => {
    if (projectDetail) {
      fetchGallery(); getNewsFeeds();
    }
  }, [projectDetail])

  const fetchProject = async () => {
    const Resp = await getProjects({ action: "getOne", title: projectTitle });
    console.log("Respsppss", Resp);
    setProjectDetail(Resp?.data ?? {})
    setnftLength(Resp?.nftLength ?? 0)
    setstaked(Resp?.staked ?? 0)
    setunStaked(Resp?.unStaked ?? 0)
  }

  const fetchGallery = async () => {
    const Resp = await getGallery({ action: "getOneProjects", projectId: projectDetail?._id ?? projectData?._id })
    setGalleryArr(Resp?.data)

    const param = { action: "getNfts", projectId: projectDetail?._id ?? projectData?._id, limit: 15, skip: 0 }
    console.log("paramparam", param);
    const getTokends = await getProjects(param);
    console.log('getTokends', getTokends);
    setTokens(getTokends?.data ?? [])

  }

  const getNewsFeeds = async () => {
    const Resp = await getNewsFeedsFunc({ action: "getFront", projectId: projectDetail?._id });
    console.log("kkkkkkkkk", Resp);
    setFeedArr(Resp?.data ?? {})
  }

  const [rewardDetail, setRewardDetail] = useState({});

  useEffect(() => {
    const getData = [
      { label: "90 days", value: "Season 1", poolId: 1, daysDifference: getDaysOfDesiredMonth(3).days, endDateFormat: getDaysOfDesiredMonth(3).dateFormat, startDate: getDaysOfDesiredMonth(3).startDate, poolDay: getDaysOfDesiredMonth(3).newStartDate },
      { label: "190 days", value: "Season 2", poolId: 2, daysDifference: getDaysOfDesiredMonth(6).days, endDateFormat: getDaysOfDesiredMonth(6).dateFormat, startDate: getDaysOfDesiredMonth(6).startDate, poolDay: getDaysOfDesiredMonth(6).newStartDate },
      { label: "360 days", value: "Season 3", poolId: 3, daysDifference: getDaysOfDesiredMonth(12).days, endDateFormat: getDaysOfDesiredMonth(12).dateFormat, startDate: getDaysOfDesiredMonth(12).startDate, poolDay: getDaysOfDesiredMonth(12).newStartDate }
    ]
    const set = getData.filter((val) => val.daysDifference)[0]
    console.log("seifuhseoif", set);
    setRewardDetail(set)
    getRewardMoney()
  }, [])

  const getRewardMoney = async () => {
    const getData = await stackFunction({ action: "getRewards", projectId: projectDetail?._id ?? projectData?._id })
    setTotalReward((getData?.data?.totalprice)?.toFixed(6) ?? 0)
  }
  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <BottomBar />
      <Header />
      <div className="hc-mint__banner">
        {/* <img src={mintBg} className="hc-mint__banner-image" /> */}
        <ImgAudVideo
          file={`${config.IMG_URL}/projects/ProjectBanner/${projectDetail?.ProjectBanner}`}
          origFile={mintBg}
          classname={"hc-mint__banner-image"}
          noimg={mintBg}
        />
        <div className="hc-mint__banner-content">
          <div className="row mx-auto">
            <div className="custom_container  container">
              <div className="row">
                <div className="col-md-2 col-lg-1">
                </div>
                <div className="col-md-10 col-lg-11 hc-mint__banner-col--right">
                  <div className="row align-items-end mb-3 mx-auto">
                    <div className="col-12 mt-4 mt-lg-0  col-lg-6">
                      <div className="hc-mint__bannerInner-col--left">
                        <div className="cus-back-btn mb-3">
                          <Button className="px-0" onClick={() => navigate(-1)} >
                            <i className="fa-solid fa-chevron-left"></i>
                            Back
                          </Button>
                        </div>
                        <div className="hc-mint__banner--wrapper mt-2">
                          <img lazy
                            src={`${config.IMG_URL}/projects/ProjectThumbnail/${projectDetail?.ProjectThumbnail}`}
                          />
                        </div>
                        <p className="hc-mint__banner--title mt-3">
                          {projectDetail?.projectTitle}
                        </p>
                        {/* <p className="hc-mint__banner--desc mt-3 mb-0">
                          {projectDetail?.aboutDescription?.length > 300
                            ? projectDetail?.aboutDescription?.slice(0, 300).concat("...")
                            : projectDetail?.aboutDescription}
                        </p> */}
                        {
                          projectDetail?.projectDescription && description ? (
                            <p className="hc-mint__banner--desc mt-3 mb-0">{projectDetail?.projectDescription}</p>
                          ) : (
                            <p className="hc-mint__banner--desc mt-3 mb-0">
                              {projectDetail?.projectDescription?.length > 300
                                ? projectDetail?.projectDescription?.slice(0, 300).concat("...")
                                : projectDetail?.projectDescription}
                            </p>
                          )}

                      </div>

                    </div>
                    {/* {mint == "minted" ? <div className="col-12 order-1 order-lg-2 col-lg-6 d-flex justify-content-end">
                      <div className="hc-mint__bannerInner-col--right">
                        <div className="hc-mint__card-initialSales">
                          <p className="title text-center">Initial Sales</p>
                          <div className="row align-items-center mt-3">
                            <div className="col-12 col-sm-3">
                              <p className="label text-center text-sm-end">
                                3 Minted
                              </p>
                            </div>
                            <div className="col-12 col-sm-6 d-flex justify-content-center mt-2 mt-sm-0">
                              <div className="hc-mint__initialSales--border">
                                <div className="hc-mint__initialSales--progress" style={{ width: "10%" }}>
                                  3
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-3 d-flex justify-content-center mt-2 mt-sm-0">
                              <p className="label">
                                From 100
                              </p>
                            </div>
                          </div>
                          <p className="hc-mint__initialSales--themeText my-2 text-center">
                            Available 97
                          </p>
                          <div className="row align-items-center">
                            <div className="col-12 col-sm-3">
                              <p className="label  text-center text-sm-end">
                                No of NFT's
                              </p>
                            </div>
                            <div className="col-12 col-sm-6 d-flex justify-content-center mt-2 mt-sm-0">
                              <div className="hc-mint__initialSales--border">
                                <input type="number" />
                              </div>
                            </div>
                            <div className="col-12 col-sm-3 d-flex justify-content-center justify-content-sm-start mt-2 mt-sm-0">
                              <p className="label text-center">
                                1.0000000 USDT
                              </p>
                            </div>
                          </div>
                          <div className="row justify-content-center">

                            <div className="col-12 col-sm-6 d-flex justify-content-center">

                              <button className="mint_mintBtn d-flex justify-content-center mt-3 w-100 hc-mint__button-mint" disabled={loading} onClick={() => onMint()} >
                                <img
                                  className="header_wallet"
                                  src={
                                    require("../assets/images/whiteminting.svg").default
                                  }
                                />
                                Mint
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div> : <></>}

                    {mint == "minting" ? <div className="col-12 order-1 order-lg-2 col-lg-6 d-flex justify-content-end">
                      <div className="hc-mint__bannerInner-col--right">
                        <div className="hc-mint__card-initialSales">
                          <p className="title text-center">Tic Tock</p>
                          <p className="title text-center">Your Opportunity Awaits!</p>
                          <div className="hc-mint__card-timerWraper mt-3 mb-2">
                            {project.unlockAt && <Countdown date={new Date(project.unlockAt)} onComplete={() => window.location.reload()} />}
                          </div>

                        </div>
                      </div>
                    </div> : <></>} */}
                    <div className="col-12">
                      <div>
                        <hr className="projects_hr" />
                        <div className="d-flex flex-wrap align-items-center gap-3 gap-xl-5">
                          <div className="mp_collectionDetail mb-2">
                            <p className="mp_collectionLabel">Number of NFTs :</p>
                            <p className="mp_collectionValue">
                              {projectDetail?.maxNFTs}
                            </p>
                          </div>
                          <div className="mp_collectionDetail mb-2">
                            <p className="mp_collectionLabel">
                              Number of Staked NFTs :
                            </p>
                            <p className="mp_collectionValue">
                              {staked}
                            </p>
                          </div>
                          <div className="mp_collectionDetail mb-2">
                            <p className="mp_collectionLabel">
                              Number of Non-Staked NFTs :
                            </p>
                            <p className="mp_collectionValue">
                              {unStaked}
                            </p>
                          </div>
                          <div className="mp_collectionDetail mb-2">
                            <p className="mp_collectionLabel">
                              Next Rewards Distribution :
                            </p>
                            <p className="mp_collectionValue">
                              {new Date(rewardDetail?.endDateFormat).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mp_collectionDetail mb-2">
                            <p className="mp_collectionLabel">Total reward distrubuted :</p>
                            <p className="mp_collectionValue">
                              {totalReward}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
      <Container fluid className="home_wrapper">
        <Container className="custom_container">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner ">
              {/* <div className="cus-back-btn mb-3">
                <Button className="" onClick={() => navigate(-1)} >
                  <i className="fa-solid fa-chevron-left"></i>
                  Back
                </Button>
              </div> */}
              {/* <BreadPath/> */}
              {/* <h3 className="projects_title">{projectDetail?.projectTitle}</h3>
              <p className="mp_detailbrief widthen_text">
                {projectDetail?.projectDescription}
              </p>
              <hr className="projects_hr" />
              <div className="d-flex flex-wrap gap-4 gap-xl-5">
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">Number of NFTs :</p>
                  <p className="mp_collectionValue">
                    {projectDetail?.maxNFTs}
                  </p>
                </div>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">
                    Number of Staked NFTs :
                  </p>
                  <p className="mp_collectionValue">
                    {staked}
                  </p>
                </div>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">
                    Number of Non-Staked NFTs :
                  </p>
                  <p className="mp_collectionValue">
                    {unStaked}
                  </p>
                </div>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">
                    Next Rewards Distribution :
                  </p>
                  <p className="mp_collectionValue">
                    {new Date(rewardDetail?.endDateFormat).toLocaleDateString()}
                  </p>
                </div>
                <div className="mp_collectionDetail mb-2">
                  <p className="mp_collectionLabel">Total reward distrubuted :</p>
                  <p className="mp_collectionValue">
                    {totalReward}
                  </p>
                </div>
              </div> */}

              {/* <Row>
                <Col lg={5} md={6} sm={6} xs={12}>
                  <div className="">

                  </div>
                </Col>
                <Col lg={7} md={6} sm={6} xs={12}>
                  <div className="">

                  </div>
                </Col>
              </Row>
              <Row className="pi_higherTop">
                <Col lg={4} md={6} sm={12} xs={12} className="mb-3">
                  <img
                    className="img-fluid rounded-3"
                    src={`${config.IMG_URL}/projects/ProjectThumbnail/${projectDetail?.ProjectThumbnail}`}
                  />
                </Col>
                <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                  <h3 className="projects_title">About {projectDetail?.projectTitle}</h3>
                  <>
                    {
                      projectDetail?.aboutDescription && description ? (
                        <p className="mp_detailbrief pi_scrollText">{projectDetail?.aboutDescription}</p>
                      ) : (
                        <p className="mp_detailbrief pi_scrollText">
                          {projectDetail?.aboutDescription?.length > 300
                            ? projectDetail?.aboutDescription?.slice(0, 300).concat("...")
                            : projectDetail?.aboutDescription}
                        </p>
                      )}
                  </>
                  <button
                    className="mp_readmoreBtn readmore_left mt-2"
                    onClick={() => setDescription(!description)}
                  >
                    {description ? "Read Less" : "Read More"}
                  </button>
                </Col>
              </Row> */}

              <Row className="mt-5">
                <h3 className="minting_detail mint_secondaryTitle text-center mb-3 hc-mint__content-title">Gallery</h3>
                <p className="hc-mint__banner--desc  mb-0 text-center w-75 mx-auto ">
                  {projectDetail?.CMS?.filter((val) => val.stepTitle == "Photo Galleries")?.[0]?.stepDescription}
                </p>
                <div className="hc-mint__swiper-wrap">

                  <button
                    className="swiper-button-prev1 border-0 outline-0 bg-transparent hc-swiper__arrow--left"
                    onClick={() => goPrev()}
                  >
                    <FaChevronLeft fill="#fff" fontSize={38} className="me-2" />
                  </button>


                  <button
                    className="swiper-button-next1 border-0 outline-0 bg-transparent hc-swiper__arrow--right"
                    onClick={() => goNext()}
                  >

                    <FaChevronRight fill="#fff" fontSize={38} className="ms-2" />
                  </button>
                  <div className="projects_swiper">
                    <Swiper
                      className="mySwiper pt-3 mt-4"
                      slidesPerView={3}
                      spaceBetween={30}
                      navigation={{
                        nextEl: ".swiper-button-next1",
                        prevEl: ".swiper-button-prev1",
                      }}
                      ref={swiperRef}
                      keyboard={true}
                      // pagination={{
                      //   clickable: true,
                      // }}
                      breakpoints={{
                        0: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        320: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        450: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        576: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        850: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        992: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        1100: {
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
                      modules={[Navigation, Keyboard, Pagination]}
                    >
                      {galleryArr && galleryArr.map((i) => (
                        <SwiperSlide className="dff_colcard">
                          <GallerCardOne data={i} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </Row>
              <Row className="mt-5">
                <h3 className="minting_detail mint_secondaryTitle text-center mb-3 hc-mint__content-title">
                  Estimated Property Value <span className="hc-mint__span-gradient"> {projectDetail?.propertyValue?.toUpperCase?.() ?? "1M"}$</span>
                </h3>
                <h5 className="hc-mint__content-subtitle mt-5">
                  Property <strong>Description</strong>
                </h5>
                <p className="hc-mint__banner--desc mt-3 mb-0">
                  {projectDetail?.aboutDescription}
                </p>
                {/* <Col lg={6} md={6} xs={12} className="mt-4">
                  <Row>
                    <Col lg={10} md={12} xs={12}>
                      <h5 className="hc-mint__content-subtitle mt-3 mt-lg-5">
                        Title
                      </h5>
                      <ReadMore descText={"How to Mint out NFT ?"} />
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} xs={12} className="mt-4">
                  <Row>
                    <Col lg={8} md={12} xs={12}>
                      <h5 className="hc-mint__content-subtitle mt-3 mt-lg-5">
                        Title
                      </h5>
                      <ReadMore descText={"How to Mint out NFT ?"} />
                    </Col>
                  </Row>
                </Col> */}
                {/* <Row className="pi_higherTop align-items-center">
                        <Col lg={4}>
                          <h1 className="mint_gradValue new">{project?.propertyValue?.toUpperCase?.() ?? "1M"}$</h1>
                        </Col>
                        <Col lg={8}>
                          <h3 className="minting_detail">Property Value</h3>
                          <p className="mp_detailbrief">
                            {project?.CMS?.filter((val) => val.stepTitle == "PROPERTY VALUE")?.[0]?.stepDescription}
                          </p>
                        </Col>
                      </Row> */}
              </Row>
              <Row className="mt-5">
                <Col lg={6} md={8} sm={12} xs={12} className="mb-3">
                  {/* <h5 className="hc-mint__content-subtitle mt-5">News Feed and Updates</h5> */}
                  <h5 className="hc-mint__content-subtitle mt-5">News & Updates</h5>
                  <p className="mp_detailbrief" >
                    {projectDetail?.CMS?.filter((val) => val.stepTitle == "News Feed and Updates")?.[0]?.stepDescription}
                  </p>
                </Col>
                {/* <Col lg={6} md={4} sm={12} xs={12} className="greenbox_cornerer">
                  <div className="pi_markeplaceLink">
                    <p className="pi_marketplace">See more</p>
                    <div className="green_box">
                      <img className="green_longright" src={require('../assets/images/rightlong.svg').default} />
                    </div>
                  </div>
                </Col> */}


                <div className="rewardscard_swiper">
                  <Swiper
                    className="mySwiper  mt-4"
                    slidesPerView={3}
                    spaceBetween={30}
                    navigation={false}
                    keyboard={true}
                    pagination={{
                      clickable: true,
                    }}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                      },
                      320: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                      },
                      576: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                      },
                      700: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      992: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1200: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                      1500: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                    }}
                    modules={[Navigation, Keyboard, Pagination]}
                  >
                    {feedArr.length != 0 && feedArr.map((i) =>
                      <SwiperSlide>
                        <RewardsCard data={i} />
                      </SwiperSlide>
                    )}
                  </Swiper>
                </div>

              </Row>

              <Row className="mt-5">
                <h3 className="hc-mint__content-subtitle mt-5 text-center"> <strong>Road</strong> Map</h3>
                <p className="mp_detailbrief text-center">
                  {projectDetail?.CMS?.filter((val) => val.stepTitle == "Road map")?.[0]?.stepDescription}
                </p>
                <div className="hc-home__roadmap--content">
                  <Roadmap data={projectDetail?.roadMap} />
                </div>
              </Row>

              <Row className="mt-5">
                <Col lg={6} md={8} sm={12} xs={12} className="mb-3">
                  <h5 className="hc-mint__content-subtitle mt-5">{projectData.name} Go to <strong>Marketplace</strong></h5>
                  <p className="mp_detailbrief">
                    {projectDetail?.CMS?.filter((val) => val.stepTitle == "NFTs")?.[0]?.stepDescription}
                  </p>
                </Col>
                {/* <Col lg={6} md={4} sm={12} xs={12} className="greenbox_cornerer">
                  <NavLink className="sidetab_link" to='/marketplace'>
                    <div className="pi_markeplaceLink">
                      <p className="pi_marketplace">Check the Marketplace</p>
                      <div className="green_box">
                        <img className="green_longright" src={require('../assets/images/rightlong.svg').default} />
                      </div>
                    </div>
                  </NavLink>
                </Col> */}

                <Swiper
                  className="mySwiper bottomnav_swiper mt-3"
                  spaceBetween={30}
                  navigation={true}
                  keyboard={true}
                  pagination={{
                    clickable: true,
                  }}
                  breakpoints={{
                    320: {
                      slidesPerView: 1.3,
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
                      slidesPerView: 2,
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
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                  }}
                  modules={[Navigation, Keyboard]}
                >
                  {tokens?.length != 0 && tokens?.map((i) =>
                    <SwiperSlide>
                      <DataCard data={i} />
                    </SwiperSlide>
                  )}

                </Swiper>

                {/* <div className="greenarrow_boxHolder position-relative">
                  <div className="greenarrow_box"></div>
                </div> */}

              </Row>
            </Col>
          </Row>
        </Container>
        {/* <div className='gradient_holder'></div> */}
        <Footer />
      </Container>

      {/* <div className="dualImg_bg"></div> */}
    </>
  );
}

export default ProjectInfo;
