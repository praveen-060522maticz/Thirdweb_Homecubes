import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Accordion, Form } from "react-bootstrap";
import SideTab from "../Components/SideTab";
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Keyboard } from "swiper/modules";
import CollectionCard from "../Components/CollectionCard";
import { nftcard } from "../datas/CardData";
import NFTCards from "../Components/NFTCards";
import ReactSearchBox from "react-search-box";
import Select from "react-select";
import Footer from "../Components/Footer";
import BreadPath from "../Components/BreadPath";
import DataCard from "../Components/DataCard";
import { getCurrentProject, getGallery, getGalleryTokens } from "../actions/axioss/nft.axios";
import { getBNBvalue, isEmpty } from "../actions/common";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify'
import ProjectCard from "../Components/ProjectCard";
import { getCmsContent } from "../actions/axioss/cms.axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";


function Marketplace() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [priceTab, setPriceTab] = useState("BNB");
  const [mobSearch, setMobSearch] = useState(false);
  console.log(selectedOption, "kiiuiui");
  const [minvalue, setMinValue] = useState(0)
  const [maxvalue, setMaxValue] = useState(0)
  const [inputFilter, setInputFilter] = useState([])
  const [collection, setCollection] = useState([])

  const [nftcardData, setNftcardData] = useState([])
  console.log(nftcardData, "iwruowieru");
  const [project, setProject] = useState([])
  const [searchVal, setSearchVal] = useState('')
  const [filters, setFilters] = useState([])
  const [priceCal, setPriceCal] = useState({})
  const swiperRef = useRef(null);

  const { BNBUSDT } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );

  console.log("priceCal", priceCal);
  useEffect(() => {
    getCollectionTokens()

  }, [])


  const getCollectionTokens = async (fill, action) => {


    var params = { limit: 6, skip: fill ? 0 : nftcardData.length, filters: fill ? fill : filters, priceCal, action: action ? action : "" }
    console.log("RespRespawfawfw", params, fill);
    const Resp = await getGalleryTokens(params)
    console.log("RespRespdad", Resp);

    if (Resp.success == "success") {

      if (fill) setNftcardData(Resp?.data)
      else setNftcardData([...nftcardData, ...Resp?.data ?? []]);

    } else {
      toast.error(Resp?.msg)
    }
  }

  const filterData = searchVal == "" ? nftcardData : nftcardData?.filter(val => val.NFTName.toLowerCase().includes(searchVal.toLowerCase()))

  const onCheckChange = (data) => {
    console.log("RespRespRespResp", data);
    var saveData

    if (filters.includes(data)) saveData = filters.filter(e => e !== data)
    else saveData = [...filters, data]

    setFilters(saveData)
    getCollectionTokens(saveData)
  }

  useEffect(() => {
    window.scroll(0, 0);
  }, [])

  useEffect(() => {
    getLatestGallery()
    getProjects()
  }, [])

  const getLatestGallery = async () => {
    try {
      const Resp = await getGallery({});
      setCollection(Resp?.data)
      console.log("resp getLatestGallery", Resp);


    } catch (error) {
      console.log("err or ongetLatestGallery ", error);
    }
  }


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
      border: "1px solid #16ebc3",
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

  const handleValueFilter = () => {
    try {
      console.log('minvalue <= 0 || maxvalue <= 0', minvalue <= 0 && maxvalue <= 0, minvalue, maxvalue);
      const inputFilter =
        Number(minvalue) <= 0 && Number(maxvalue) <= 0
          ? setInputFilter(nftcardData)
          :
          setInputFilter(
            nftcardData.filter(
              (i) =>
                i.coinValue > (minvalue ? minvalue : 0) &&
                i.coinValue < (maxvalue ? maxvalue : parseInt(99999999999999))
            )
          );
    } catch (error) {
      console.log("handleValueFilter_filter_error", error);
    }
  };

  const getProjects = async () => {

    const getPro = await getCurrentProject({ action: "all" })
    console.log("getCurrentProject", getPro);

    if (getPro.success == "success") {
      setProject(getPro.data)

    }
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

  useEffect(() => {
    getCmsList()
  }, [])

  const [coll, setcoll] = useState({})

  const getCmsList = async () => {
    const Resp = await getCmsContent({
      page: ["market place"],
    });
    console.log("sejhfgeiusf", Resp);
    setcoll(Resp?.data?.[0] ?? {})
  }
  console.log("coll", coll);

  return (
    <>
      <BottomBar />
      <Header />
      <Container fluid className="pt-3 home_wrapper hc-marketplace">
        <Container className="custom_container">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner  mt-4">
              {/* <BreadPath/> */}
              <h3 className="hc-home__title home_titled">Our <strong>Unique</strong> Marketplace</h3>
              <p className="mp_detailbrief hc-home__desc mt-3" dangerouslySetInnerHTML={{ __html: coll?.content }} >
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
                <Swiper
                  className="mySwiper bottomnav_colswiper collection_swiper mt-4 pt-3"
                  spaceBetween={30}
                  navigation={{
                    nextEl: ".swiper-button-next1",
                    prevEl: ".swiper-button-prev1",
                  }}
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
                      slidesPerView: 1.5,
                      spaceBetween: 20,
                    },
                    576: {
                      slidesPerView: 1.6,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 2.1,
                      spaceBetween: 20,
                    },
                    992: {
                      slidesPerView: 3.1,
                      spaceBetween: 20,
                    },
                    1200: {
                      slidesPerView: 3.7,
                      spaceBetween: 20,
                    },
                    1500: {
                      slidesPerView: 4.2,
                      spaceBetween: 20,
                    },
                    1900: {
                      slidesPerView: 4.2,
                      spaceBetween: 20,
                    },
                  }}
                  modules={[Navigation, Keyboard]}
                >
                  {/* {collection.map((val) => (
                  <SwiperSlide>
                    <CollectionCard data={val} />
                  </SwiperSlide>
                ))} */}

                  {project.length != 0 && project.map((i) =>
                    <SwiperSlide>
                      <ProjectCard data={i} show={false} market={true} />
                    </SwiperSlide>
                  )}
                </Swiper>
                {/* <div className="greenarrow_boxHolder position-relative">
                <div className="greenarrow_box"></div>
              </div> */}
                {/* <div className='swiper_buttons'>
      </div> */}
              </div>

              <Row className="justify-content-between mt-5">
                <h3 className="hc-home__title home_titled">
                  Top Trending <strong>NFT's</strong>
                </h3>
                <Col lg={4} md={6} sm={6} xs={12} className="mb-3">


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
                    classNamePrefix={"react_select"}
                    placeholder="Select Order"
                    styles={stylesgraybg}
                    defaultValue={selectedOption}
                    onChange={(e) => {
                      console.log(e.value, "selectedOption")
                      if (e.value == "hightolow") {
                        setNftcardData(nftcardData.sort((a, b) => parseFloat(isEmpty(b.NFTPrice) ? 0 : b.NFTPrice) - parseFloat(isEmpty(a.NFTPrice) ? 0 : a.NFTPrice)))
                      }
                      else if (e.value == "lowtohigh") {
                        setNftcardData(nftcardData.sort((a, b) => parseFloat(isEmpty(a.NFTPrice) ? 0 : a.NFTPrice) - parseFloat(isEmpty(b.NFTPrice) ? 0 : b.NFTPrice)))
                      }
                      else {
                        getCollectionTokens(true, "onSale")
                      }
                      setSelectedOption(e)
                    }}
                    options={options}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xl={3} lg={4} md={5} sm={6} xs={12} className=" mb-3">
                  <div
                    className={
                      ` mb-4 ${mobSearch
                        ? "stack_searchbar"
                        : " stack_searchbar stack_searchbarhider"}`
                    }
                  >
                    <div className="d-flex justify-content-start align-items-center">
                      <img
                        className="searchglass"
                        src={
                          require("../assets/images/searchglass.svg").default
                        }
                      />
                      {/* <input type='text' className='stack_search' placeholder='Search...' /> */}
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
                  <div className="mp_accord_holder mb-4">
                    <Accordion
                      className="mp_accordion"
                      defaultActiveKey={["0"]}
                      flush
                    >
                      <Accordion.Item eventKey="0" className="">
                        <Accordion.Header className="" onClick={() => setPriceCal({})} >
                          Status <i class="fa-solid fa-angle-down" />
                        </Accordion.Header>
                        <Accordion.Body className="mt-3">
                          <div className="mp_status">
                            <p className="mp_statusLabel">Buy Now</p>
                            <Form>
                              <Form.Check
                                type="checkbox"
                                className="mp_customCheck"
                                id="buynow"
                              >
                                <Form.Check.Input type="checkbox" isValid onChange={(e) => onCheckChange("FixedPrice")} />
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
                                <Form.Check.Input type="checkbox" isValid onChange={() => onCheckChange("TimedAuction")} />
                                <Form.Check.Label></Form.Check.Label>
                              </Form.Check>
                            </Form>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                  <div className="mp_accord_holder">
                    <Accordion
                      className="mp_accordion"
                    >

                      <Accordion.Item eventKey="1">
                        <Accordion.Header className="">
                          Price <i class="fa-solid fa-angle-down" />
                        </Accordion.Header>
                        <Accordion.Body className="mt-3">
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
                                // value={priceCal?.Min}
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
                                // value={priceCal?.Max}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setPriceCal({ ...priceCal, ...{ "Max": priceTab == "BNB" ? value : String(value / BNBUSDT) } })
                                }}
                              />
                            </Col>
                          </Row>
                          <button className="seconday_btn" onClick={() => getCollectionTokens([])}>Apply</button>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Col>
                <Col xl={9} lg={8} md={7} sm={6} xs={12}>
                  <Row>
                    {filterData.length != 0 && filterData.map((i) => (
                      <>
                        {/* {
                        (i?.coinValue > (min? min : 0) && i?.coinValue < (max?max:99999999999999999))  && */}
                        <Col
                          xl={4}
                          lg={6}
                          md={12}
                          sm={12}
                          xs={12}
                          className="mb-3"
                        >
                          {console.log("sdffadasdf", i)}
                          <DataCard data={i} />
                        </Col>
                        {/* } */}
                      </>
                    ))
                    }
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <Footer />
      </Container >

      <div className='gradient_holder staking_gradholder'></div>
    </>
  );
}

export default Marketplace;
