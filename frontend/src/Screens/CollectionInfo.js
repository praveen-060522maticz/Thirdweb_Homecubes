import React, { useState, useEffect, useRef } from "react";
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import {
  Container,
  Row,
  Col,
  Accordion,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import SideTab from "../Components/SideTab";
import ReactSearchBox from "react-search-box";
import Select from "react-select";
import { nftcard } from "../datas/CardData";
import NFTCards from "../Components/NFTCards";
import Footer from "../Components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import BreadPath from "../Components/BreadPath";
import DataCard from "../Components/DataCard";
import config from "../config/config";
import { getGalleryTokens } from "../actions/axioss/nft.axios";
import { getBNBvalue, isEmpty, videoFileFormats } from "../actions/common";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ImageWithLoader from "../Components/ImageWithLoader";


function CollectionInfo() {
  const location = useLocation();
  const collectionData = location?.state;
  console.log(location, "location?.statecolllection");
  const [like, setLike] = useState(false);
  const [mobSearch, setMobSearch] = useState(false);
  const [description, setDescription] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [priceTab, setPriceTab] = useState("BNB");
  const [nftcardData, setNftcardData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [filters, setFilters] = useState([]);
  const [priceCal, setPriceCal] = useState({});
  const [Loadmore, setLoadMore] = useState(true);
  const galleryData = [...collectionData?.galleryImages || []]
  const [arrData, setArrData] = useState([])
  const [isFixed, setIsFixed] = useState(true);
  const footerRef = useRef(null);

  const [videoShow, setVideoShow] = useState("");

  const handleCloseVideo = () => setVideoShow("");
  const handleShowVideo = (e) => setVideoShow(e);

  console.log("priceCal", priceCal);
  console.log("nftcardData", nftcardData);
  console.log('collectionData---->', collectionData);

  const navigate = useNavigate();

  const { BNBUSDT } = useSelector((state) => state.LoginReducer.AccountDetails);

  const loadData = () => {
    const getArr = galleryData?.slice(arrData.length, arrData.length + 8);
    console.log('getArr---->', getArr);
    setArrData([...arrData, ...getArr]);

    if (getArr?.length < 8) setLoadMore(false)
  }

  useEffect(() => {
    getCollectionTokens();
    loadData()
  }, []);

  const getCollectionTokens = async (fill) => {
    var params = {
      galleryId: collectionData._id,
      limit: 4,
      skip: fill ? 0 : nftcardData.length,
      filters: fill ? fill : filters,
      priceCal,
    };
    console.log("RespRespawfawfw", params, fill);
    const Resp = await getGalleryTokens(params);
    console.log("RespRespdad", Resp);

    if (Resp.success == "success") {
      // if (Resp?.data.length == 0) setLoadMore(false);

      if (fill) setNftcardData(Resp?.data);
      else setNftcardData([...nftcardData, ...(Resp?.data ?? [])]);
    } else {
      toast.error(Resp?.msg);
    }
  };

  const filterData =
    searchVal == ""
      ? nftcardData
      : nftcardData?.filter((val) =>
        val.NFTName.toLowerCase().includes(searchVal.toLowerCase())
      );

  const onCheckChange = (data) => {
    var saveData;

    if (filters.includes(data)) saveData = filters.filter((e) => e !== data);
    else saveData = [...filters, data];

    setFilters(saveData);
    getCollectionTokens(saveData);
  };

  const options = [
    { value: "hightolow", label: "Highest to Lowest" },
    { value: "lowtohigh", label: "Lowest to Highest" },
    { value: "lastsold", label: "Last Sold" },
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
      width: "200px",
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
      position: "absolute",
      right: 0,
      top: 0,
      color: "#6C6A81",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff",
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <>
      <BottomBar />
      <Header />
      <div className="innercontent">
        <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
          <SideTab />
        </div>
        <div className="banner_section banner_section_content claim-section">
          <div className='px-0 inner-container__width'>
            <div>
              <div className="cus-back-btn mb_2">
                <Button className="px-0" onClick={() => navigate(-1)} >
                  <i className="fa-solid fa-chevron-left"></i>
                  Back
                </Button>
              </div>
              <div className="d-flex align-items-start collection-info__header collectphotos">
                <div>
                  <div className="collection-info__profile-image">
                    <img
                      className=""
                      src={`${config.IMG_URL}/collection/${collectionData?.projectId?._id
                        ? collectionData?.projectId?._id
                        : collectionData?.projectId
                        }/${collectionData?.galleryThumbImage}`}
                    />
                  </div>

                </div>
                <div className="mp_likeshare ">
                  <img
                    className="img-fluid1"
                    src={require("../assets/images/share.svg").default}
                  />
                </div>
              </div>

              <div className="bblist">
                <h3 className="collection-info__profile-name">
                  {collectionData?.galleryTitle}
                </h3>
                {/* {description ? (
                        <p className="mp_detailbrief hc-home__desc mt_1">
                          {collectionData?.galleryDescription}
                        </p>
                      ) : (
                        <p className="mp_detailbrief hc-home__desc mt_1">
                          {collectionData?.galleryDescription?.length > 300
                            ? collectionData?.galleryDescription
                              .slice(0, 300)
                              .concat("...")
                            : collectionData?.galleryDescription}{" "}
                        </p>
                      )}
                  {collectionData?.galleryDescription?.length > 300 ? (
                    <button
                      className="mp_readmoreBtn mb_2"
                      onClick={() => setDescription(!description)}
                    >
                      {description ? "Read Less" : "Read More"}
                    </button>
                  ) : (
                    <></>
                  )} */}
              </div>



              <div className=" mt_3 pb_3">
                <h3 className="collection-info__grid-title">Photos</h3>
                {collectionData && arrData.length > 0 ?
                  <div className="collection-grid">
                    {collectionData &&
                      arrData?.length != 0 &&
                      arrData?.map((val) => {
                        return (


                          <div className="collection__image-card d-flex flex-column align-items-center">

                            <div className="collection__image-wrapper" >
                              {videoFileFormats.includes(val.split(".")[1]) ? (
                                <div
                                  className="position-relative"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleShowVideo(val)}
                                >
                                  <div className="blur_thumbnailer">
                                    <div className="playBtn_fitter">
                                      <i class="fa-regular fa-circle-play" />
                                    </div>
                                  </div>
                                  <video
                                    className="img-fluid collectionss_img"
                                    src={`${config.IMG_URL}/collection/${collectionData?._id}/${val}`}
                                  />
                                </div>
                              ) : (
                                <ImageWithLoader
                                  className="collection-width-fit"
                                  style={{ cursor: "pointer" }}
                                  src={`${config.IMG_URL}/collection/${collectionData?._id}/${val}`}
                                  onClick={() => handleShowVideo(val)}
                                />
                                // <img
                                //   className="collection-width-fit"
                                //   style={{ cursor: "pointer" }}
                                //   src={`${config.IMG_URL}/collection/${collectionData?._id}/${val}`}
                                //   onClick={() => handleShowVideo(val)}
                                // />
                              )}

                            </div>
                            <h3 className="collection__image-wrapper--name  text-center">
                              Image name
                            </h3>
                          </div>
                        );
                      })}
                  </div> : <div className="nodata_found ">No Data Found</div>}
              </div>

              {/* {Loadmore && <div className='mp-margin d-flex justify-content-center'>
                <button className="button-loadMore" onClick={() => loadData()}>Load More</button>
              </div>} */}

              {Loadmore &&
                <div className='mp-margin d-flex justify-content-center'>
                  <button className="button-loadMore" onClick={() => loadData()}>Load More</button>
                </div>}
            </div>
          </div>
        </div>
      </div>
      {/* <Container fluid className="home_wrapper">
        <Container className="custom_container">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
            </Col>
            <Col
              lg={11}
              md={10}
              sm={12}
              xs={12}
              className="res_pad_aligner ci_highertop"
            > */}


      {/* <BreadPath/> */}
      {/* <Row>
                <Col lg={12} md={10} sm={12} xs={12} className="hc-galler__col-top" > */}



      {/* <Row className="mp_bottomal"> */}
      {/* <Col lg={4} md={6} sm={12} xs={12} className="mb-3">

                    </Col> */}
      {/* <Col lg={8} md={6} sm={12} xs={12} className="mb-3"> */}

      {/* <div className="mp_likeshare">
                        {like ? (
                          <img
                            className="img-fluid me-3"
                            onClick={() => setLike(false)}
                            src={require("../assets/images/liked.svg").default}
                          />
                        ) : (
                          <img
                            className="img-fluid me-3"
                            onClick={() => setLike(true)}
                            src={require("../assets/images/like.svg").default}
                          />
                        )}
                        <img
                          className="img-fluid"
                          src={require("../assets/images/share.svg").default}
                        />
                      </div> */}

      {/* <Row className="mt-3">
                        <Col lg={3} md={6} sm={12} xs={12} className="">
                          <div className="mp_collectionDetail">
                            <p className="mp_collectionLabel">Items :</p>
                            <p className="mp_collectionValue">
                              {nftcardData?.length}
                            </p>
                          </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} xs={12} className="">
                          <div className="mp_collectionDetail">
                            <p className="mp_collectionLabel">Created :</p>
                            <p className="mp_collectionValue">{nftcardData?.length}</p>
                          </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} xs={12} className="">
                          <div className="mp_collectionDetail">
                            <p className="mp_collectionLabel">Chain :</p>
                            <p className="mp_collectionValue">BNB</p>
                          </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} xs={12} className="">
                          <div className="mp_collectionDetail">
                            <p className="mp_collectionLabel">
                              Creator Fee :
                            </p>
                            <p className="mp_collectionValue">
                              {collectionData?.projectId?.NFTRoyalty}%
                            </p>
                          </div>
                        </Col>
                      </Row> */}
      {/* </Col> */}
      {/* </Row> */}
      {/* <Row className="mt-1"> */}
      {/* <Col lg={10} md={12} sm={12} xs={12}> */}

      {/* <ReadMoreReact text={""}
              min={100}
              ideal={200}
              max={500}
              readMoreText="Read more"/> */}
      {/* </Col>

              </Row> */}




      {/* vide modal */}

      <Modal
        size="lg"
        className="common_modal collection_info_modal"
        centered
        show={videoShow != ""}
        onHide={handleCloseVideo}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div className="modal_top">
            <p className="modal_title text-center">Preview</p>
            <img
              src={require("../assets/images/close.svg").default}
              onClick={() => handleCloseVideo()}
              className="modal_closer"
            />
          </div>

          <div className="modal_body mt_2 hc-collection__modal--body">
            <div className="hc-collection__modal-imageWrapper ">
              {videoFileFormats.includes(videoShow.split(".")[1]) ? (
                <video
                  controls
                  className="hc-collection__imageFit"
                  src={`${config.IMG_URL}/collection/${collectionData?._id}/${videoShow}`}
                />
              ) : (
                < img
                  className="hc-collection__imageFit"
                  src={`${config.IMG_URL}/collection/${collectionData?._id}/${videoShow}`}
                />
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* end of video modal */}

      {/* <Row className="justify-content-between mt-5">
                <Col lg={4} md={6} sm={6} xs={12} className="mb-3">
                  <div
                    className={
                      mobSearch
                        ? "stack_searchbar"
                        : " stack_searchbar stack_searchbarhider"
                    }
                  >
                    <div className="d-flex justify-content-start align-items-center">
                      <img
                        className="searchglass"
                        src={
                          require("../assets/images/searchglass.svg").default
                        }
                      />

                      <ReactSearchBox
                        placeholder="Search..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e)}
                        data={nftcardData}
                        callback={(record) => console.log("Searchinggggggg", record)}
                      />
                    </div>
                    <i
                      class="fa-solid fa-xmark search_closer"
                      onClick={() => setMobSearch(false)}
                    />
                  </div>

                  <div
                    className={mobSearch ? "d-none" : " stack_searchbarmob"}
                    onClick={() => setMobSearch(true)}
                  >
                    <img
                      className="searchglass"
                      src={require("../assets/images/searchglass.svg").default}
                    />
                  </div>
                </Col>
                <Col
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  className="mb_select_holder mb-3"
                >
                  <Select
                    className="border_select"
                    placeholder="Select Order"
                    styles={stylesgraybg}
                    defaultValue={selectedOption}
                    onChange={(e) => {
                      if (e.value == "hightolow") {
                        setNftcardData(nftcardData.sort((a, b) => parseFloat(isEmpty(b.NFTPrice) ? 0 : b.NFTPrice) - parseFloat(isEmpty(a.NFTPrice) ? 0 : a.NFTPrice)))
                      }
                      else if (e.value == "lowtohigh") {
                        setNftcardData(nftcardData.sort((a, b) => parseFloat(isEmpty(a.NFTPrice) ? 0 : a.NFTPrice) - parseFloat(isEmpty(b.NFTPrice) ? 0 : b.NFTPrice)))
                      }
                      else {
                        setNftcardData(nftcardData)
                      }
                      setSelectedOption(e)
                    }}

                    options={options}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xl={3} lg={4} md={5} sm={6} xs={12} className=" mb-3">
                  <div className="mp_accord_holder">
                    <Accordion
                      className="mp_accordion"
                      defaultActiveKey={["0"]}
                      flush
                    >
                      <Accordion.Item eventKey="0" >
                        <Accordion.Header className="mb-3">
                          Status <i class="fa-solid fa-angle-down" />
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="mp_status">
                            <p className="mp_statusLabel">Buy Now</p>
                            <Form>
                              <Form.Check
                                type="checkbox"
                                className="mp_customCheck"
                                id="buynow"
                              >
                                <Form.Check.Input type="checkbox" isValid id="FixedPrice" onChange={(e) => onCheckChange("FixedPrice")} />
                                <Form.Check.Label></Form.Check.Label>
                              </Form.Check>
                            </Form>
                          </div>
                          <div className="mp_status">
                            <p className="mp_statusLabel">On Auction</p>
                            <Form>
                              <Form.Check
                                type="checkbox"
                                className="mp_customCheck"
                                id="auction"
                              >
                                <Form.Check.Input type="checkbox" isValid id="TimedAuction" onChange={() => onCheckChange("TimedAuction")} />
                                <Form.Check.Label></Form.Check.Label>
                              </Form.Check>
                            </Form>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1" >
                        <Accordion.Header className="mb-3">
                          Price <i class="fa-solid fa-angle-down" />
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="mb_pricetab_holder">
                            <button
                              className={
                                priceTab == "BNB"
                                  ? "mb_pricetab me-2 active"
                                  : "mb_pricetab me-2"
                              }
                              onClick={() => setPriceTab("BNB")}
                            >
                              BNB
                            </button>
                            <button
                              className={
                                priceTab == "USD"
                                  ? "mb_pricetab me-2 active"
                                  : "mb_pricetab me-2"
                              }
                              onClick={() => setPriceTab("USD")}
                            >
                              USD
                            </button>
                          </div>

                          <Row className="justify-content-between mt-3">
                            <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                              <input
                                className="mb_priceInp cmnInput_scrollerHider"
                                type="number"
                                placeholder="Min"
                                onChange={(e) => {
                                  const value = e.target.value
                                  setPriceCal({ ...priceCal, ...{ "Min": priceTab == "BNB" ? value : String(value / BNBUSDT) } })
                                }}
                              />
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6} className="mb-3">
                              <input
                                className="mb_priceInp cmnInput_scrollerHider"
                                type="number"
                                placeholder="Max"
                                onChange={(e) => {
                                  const value = e.target.value
                                  setPriceCal({ ...priceCal, ...{ "Max": priceTab == "BNB" ? value : String(value / BNBUSDT) } })
                                }}
                              />
                            </Col>
                          </Row>
                          <button className="seconday_btn" onClick={() => getCollectionTokens([])} >Apply</button>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Col>
                <Col xl={9} lg={8} md={7} sm={6} xs={12}>
                  <Row>
                    {filterData?.map((val) => (
                      <Col
                        xl={4}
                        lg={4}
                        md={6}
                        sm={12}
                        xs={12}
                        className="mp_topImg_holder mb-3"
                      >
                        {console.log("sdfsdf", val)}
                        <DataCard data={val} />
                      </Col>
                    ))}
                  </Row>
                </Col>
                {Loadmore && <button className="seconday_btn" onClick={() => getCollectionTokens()} >Loadmore</button>}
              </Row> */}
      {/* </Col >
          </Row >
        </Container >
    <Footer />
      </Container > */}
      <div ref={footerRef}>
        <Footer />
      </div>
      {/* <div className="gradient_holder staking_gradholder"></div> */}
      {/* <div className="dualImg_bg"></div> */}
    </>
  );
}

export default CollectionInfo;
