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
import propertyImage from '../assets/images/property.png'
import GalleryCard from "../Components/GalleryCard";
import swiperRightIcon from '../assets/images/swiperrightarrow.svg'
import swiperLeftIcon from '../assets/images/swiperleftarrow.svg'

function ProjectInfo() {
  const location = useLocation();

  const projectData = JSON.parse(location?.state?.projectInfo)
  console.log(projectData, "oerwerhw");
  const [description, setDescription] = useState(false);
  const { projectTitle } = useParams()
  const swiperRef = useRef(null);
  const newsSwiperRef = useRef(null);


  const footerRef = useRef(null);
  const [isFixed, setIsFixed] = useState(true);
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
  const newsGoPrev = () => {
    if (newsSwiperRef.current && newsSwiperRef.current.swiper) {
      newsSwiperRef.current.swiper.slidePrev();
    }
  };
  const newsGoNext = () => {
    if (newsSwiperRef.current && newsSwiperRef.current.swiper) {
      newsSwiperRef.current.swiper.slideNext();
    }
  };


  const navigate = useNavigate();

  const handleScroll = () => {

    const footerTop = footerRef.current.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight) {
      setIsFixed(false);


    } else {
      setIsFixed(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BottomBar />
      <Header />

      {/* for mobile only -start */}

      <div className="hc-min__banner-mobile d-xl-none">
        <ImgAudVideo
          file={`${config.IMG_URL}/projects/ProjectBanner/${projectDetail?.ProjectBanner}`}
          origFile={mintBg}
          classname={"hc-mint__banner-image"}
          noimg={mintBg}
        />

      </div>

      {/* for mobile only -end */}

      <div className="hc-mint__banner">
        {/* <img src={mintBg} className="hc-mint__banner-image" /> */}
        <ImgAudVideo
          file={`${config.IMG_URL}/projects/ProjectBanner/${projectDetail?.ProjectBanner}`}
          origFile={mintBg}
          classname={"hc-mint__banner-image d-none d-xl-block"}
          noimg={mintBg}
        />
        <div className="hc-mint__banner-content w-100">
          <div className="inner-container__width">
            <div className="row mx-auto">
              <div className="custom_container  container px-0">
                <div className="row mx-auto">

                  <div className="col-12 hc-mint__banner-col--right px-0">
                    <div className="row align-items-end mb-3 mx-auto">
                      <div className="col-12 col-xl-6 px-0">
                        <div className="hc-mint__bannerInner-col--left">
                          <div className="cus-back-btn">
                            <Button className="px-0" onClick={() => navigate(-1)} >
                              <i className="fa-solid fa-chevron-left"></i>
                              Back
                            </Button>
                          </div>
                          <div className="hc-mint__banner--wrapper ">
                            <img lazy
                              src={`${config.IMG_URL}/projects/ProjectThumbnail/${projectDetail?.ProjectThumbnail}`}
                            />
                          </div>
                          <p className="hc-mint__banner--title ">
                            {projectDetail?.projectTitle}
                          </p>
                          {/* <p className="hc-mint__banner--desc mt-3 mb-0">
                          {projectDetail?.aboutDescription?.length > 300
                            ? projectDetail?.aboutDescription?.slice(0, 300).concat("...")
                            : projectDetail?.aboutDescription}
                        </p> */}
                          {/* {
                            projectDetail?.aboutDescription && description ? (
                              <p className="hc-mint__banner--desc mb-0">{projectDetail?.aboutDescription}</p>
                            ) : (
                              <p className="hc-mint__banner--desc  mb-0">
                                {projectDetail?.aboutDescription?.length > 300
                                  ? projectDetail?.aboutDescription?.slice(0, 300).concat("...")
                                  : projectDetail?.aboutDescription}
                              </p>
                            )} */}
                          {
                            projectDetail?.aboutDescription && description ? (
                              <p className="hc-mint__banner--desc projectInfo_banner--desc mb-0">{projectDetail?.aboutDescription}</p>
                            ) : (
                              <p className="hc-mint__banner--desc projectInfo_banner--desc  mb-0">
                                {projectDetail?.aboutDescription?.length &&
                                  projectDetail?.aboutDescription
                                }
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
                      <div className="col-12 px-0">
                        <div>
                          <hr className="projects_hr" />
                          <div className="projects__details ">
                            <div className="projects__details-row order-4 order-xl-1">
                              <p className="projects__detatils-row--label">NFTs :</p>
                              <p className="projects__detatils-row--value">
                                {projectDetail?.maxNFTs}
                              </p>
                            </div>
                            <div className="projects__details-row order-1 order-xl-2">
                              <p className="projects__detatils-row--label">
                                Staked NFTs :
                              </p>
                              <p className="projects__detatils-row--value">
                                {staked}
                              </p>
                            </div>
                            <div className="projects__details-row order-2 order-xl-3">
                              <p className="projects__detatils-row--label">
                                Non-Staked NFTs :
                              </p>
                              <p className="projects__detatils-row--value">
                                {unStaked}
                              </p>
                            </div>
                            <div className="projects__details-row order-3 order-xl-4">
                              <p className="projects__detatils-row--label">
                                Next Rewards Distribution :
                              </p>
                              <p className="projects__detatils-row--value">
                                {new Date(rewardDetail?.endDateFormat).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="projects__details-row order-5 order-xl-5">
                              <p className="projects__detatils-row--label">Total reward distrubuted :</p>
                              <p className="projects__detatils-row--value">
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
      </div>


      <div className="innercontent">
        <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
          <SideTab />
        </div>
        <div className="bottom_content">
          <div className="inner-container__width">
            <div className="mint-bottom__content">
              <Row className="mx-auto">
                <h3 className="text-center hc-mint__content-title px-0">Gallery</h3>
                {/* <p className="hc-mint__banner--desc  mb-0 text-center w-75 mx-auto ">
                  {projectDetail?.CMS?.filter((val) => val.stepTitle == "Photo Galleries")?.[0]?.stepDescription}
                </p> */}
                <div className="hc-mint__swiper-wrap gallery-card__swiperWrapper">

                  <button
                    className="swiper-button-prev1 border-0 outline-0 bg-transparent hc-swiper__arrow--left"
                    onClick={() => goPrev()}
                  >
                    {/* <FaChevronLeft fill="#fff" fontSize={38} className="" /> */}
                    <img src={swiperLeftIcon} alt="left" className="img-fluid" />

                  </button>


                  <button
                    className="swiper-button-next1 border-0 outline-0 bg-transparent hc-swiper__arrow--right"
                    onClick={() => goNext()}
                  >

                    {/* <FaChevronRight fill="#fff" fontSize={38} className="" /> */}
                    <img src={swiperRightIcon} alt="right" className="img-fluid" />
                  </button>

                  <Swiper
                    className="mySwiper bottomnav_colswiper hc-mint__swiper gallery-card__swiper"
                    slidesPerView={4}
                    // spaceBetween={30}
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
                      320: {
                        slidesPerView: 2,
                        // spaceBetween: 20,
                      },
                      1200: {
                        slidesPerView: 4,
                        // spaceBetween: 20,
                      },

                    }}
                    modules={[Navigation, Keyboard, Pagination]}
                  >
                    {galleryArr && galleryArr.map((i) => (
                      <SwiperSlide >
                        <GalleryCard data={i} />
                        {/* <GallerCardOne data={i} /> */}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </Row>
              <div className="section-estimateProperty">
                <h3 className="hc-mint__content-title">
                  Estimated Property Value <span className="hc-mint__span-gradient"> {projectDetail?.propertyValue?.toUpperCase?.() ?? "1M"}$</span>
                </h3>
                <div className="row mint-margin__top align-items-center mx-auto">
                  <div className="col-12 col-xl-6 px-0">
                    <div>
                      <h5 className="hc-mint__content-subtitle">
                        Property <strong>Description</strong>
                      </h5>
                      <p className="hc-mint__banner--desc">
                        {projectDetail?.aboutDescription}
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-xl-6 px-0 d-flex justify-content-center">
                    <div className="mint-property__imageWrapper">
                      <img src={propertyImage} className="img-fluid w-75" />
                    </div>
                  </div>
                </div>


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
              </div>
              <div className="news-grid mint-margin__top">
                <div>
                  {/* <h5 className="hc-mint__content-subtitle mt-5">News Feed and Updates</h5> */}
                  <h5 className="hc-mint__content-subtitle ">News & Updates</h5>
                  {/* <p className="mp_detailbrief" >
                    {projectDetail?.CMS?.filter((val) => val.stepTitle == "News Feed and Updates")?.[0]?.stepDescription}
                  </p> */}
                </div>
                {/* <Col lg={6} md={4} sm={12} xs={12} className="greenbox_cornerer">
                  <div className="pi_markeplaceLink">
                    <p className="pi_marketplace">See more</p>
                    <div className="green_box">
                      <img className="green_longright" src={require('../assets/images/rightlong.svg').default} />
                    </div>
                  </div>
                </Col> */}


                {/* for mobile section - start */}

                <div className=" d-xl-none position-relative news-update__swipper-wrapper">

                  <button
                    className="swiper-button-prev1-news border-0 outline-0 bg-transparent hc-swiper__arrow--left"
                    onClick={() => newsGoPrev()}
                  >
                    {/* <FaChevronLeft fill="#fff" fontSize={38} className="" /> */}
                    <img src={swiperLeftIcon} alt="left" className="img-fluid" />
                  </button>


                  <button
                    className="swiper-button-next1-news border-0 outline-0 bg-transparent hc-swiper__arrow--right"
                    onClick={() => newsGoNext()}
                  >

                    {/* <FaChevronRight fill="#fff" fontSize={38} className="" /> */}
                    <img src={swiperRightIcon} alt="right" className="img-fluid" />
                  </button>
                  <Swiper
                    className="mySwiper bottomnav_colswiper  hc-mint__swiper gallery-card__swiper "
                    slidesPerView={1}
                    // spaceBetween={30}

                    ref={newsSwiperRef}
                    keyboard={true}
                    pagination={false}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                        // spaceBetween: 20,
                      },
                    }}
                    navigation={{
                      nextEl: ".swiper-button-next1-news",
                      prevEl: ".swiper-button-prev1-news",
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

                {/* for mobile section - end */}

                {/* for web section - start */}

                <div className="rewardscard_swiper d-none d-xl-block">
                  <div className="new-update-grid">
                    {/* <div className="box">
                      <div className="update-white"></div>
                    </div>
                    <div className="box"></div>
                    <div className="box"></div> */}

                    {feedArr.length != 0 && feedArr.map((i) =>
                      <RewardsCard data={i} />
                    )}
                  </div>


                </div>

                {/* for web section - end */}

              </div>

              <div className="section-roadMap">
                <h3 className="hc-mint__content-subtitle  text-center"> <strong>Road</strong> Map</h3>
                {/* <p className="mp_detailbrief text-center">
                  {projectDetail?.CMS?.filter((val) => val.stepTitle == "Road map")?.[0]?.stepDescription}
                </p> */}
                <div className="hc-home__roadmap--content">
                  <Roadmap data={projectDetail?.roadMap} />
                </div>
              </div>



              <h5 className="hc-mint__content-subtitle ">{projectData.name} Go to <strong>Marketplace</strong></h5>
              {/* <p className="mp_detailbrief">
                    {projectDetail?.CMS?.filter((val) => val.stepTitle == "NFTs")?.[0]?.stepDescription}
                  </p> */}

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

              {/* <Swiper
                  className="mySwiper bottomnav_swiper"
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
                </Swiper> */}

              <div className="mp-grid mp-grid_list marketplace_margin">
                {tokens?.length != 0 && tokens?.map((i) =>
                  <DataCard data={i} />
                )}
              </div>


              {/* <div className="greenarrow_boxHolder position-relative">
                  <div className="greenarrow_box"></div>
                </div> */}


            </div>
          </div>
        </div>
      </div >

      <div ref={footerRef}>
        <Footer />
      </div>

      {/* <div className="dualImg_bg"></div> */}
    </>
  );
}

export default ProjectInfo;
