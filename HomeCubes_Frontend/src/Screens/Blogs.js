import React, { useEffect, useState } from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import SideTab from '../Components/SideTab'
import Footer from '../Components/Footer'
import { Container, Row, Col } from 'react-bootstrap'
import Select from "react-select";
import { nftcard } from '../datas/CardData'
import BlogsCard from '../Components/BlogsCard'
import Faq from '../Components/Faq'
import AOS from "aos";
import "aos/dist/aos.css";
import PageCounter from '../Components/PageCounter'
import BreadPath from '../Components/BreadPath'
import { faqFunctions } from '../actions/axioss/user.axios'
import { blogsFunction, getCmsContent, getblogCategories } from '../actions/axioss/cms.axios'
import { parseHtmlString } from '../actions/common'

function Blogs(props) {
  const [description, setDescription] = useState(false);
  const [faqArr, setFaqArr] = useState([]);

  const [options, setOptions] = useState([{ label: "All", value: "All" }])
  const [blogData, setBlogData] = useState([])
  const [blogCon, setBlogCon] = useState([])
  const [blogSearch, setBlogSearch] = useState("")

  useEffect(() => {
    AOS.init({ mirror: "true" });
    AOS.refresh();
    window.scroll(0, 0)
  }, [])

  const [selectedOption, setSelectedOption] = useState({ label: "All", value: "All" });

  useEffect(() => {
    getFaqList()
    getCmsList()
    getCategories()
    getBlogs()
  }, [])

  const getFaqList = async () => {
    const Resp = await faqFunctions({ action: "all" });
    console.log("resserser", Resp);
    setFaqArr(Resp?.data ?? [])
  }

  const getCmsList = async () => {
    const Resp = await getCmsContent({
      page: ["Blogs"],
    });
    console.log("sejhfgeiusf", Resp);
    setBlogCon(Resp?.data[0] ?? {})
  }

  const getCategories = async () => {
    const Resp = await getblogCategories({ action: "getFront" });
    setOptions([...options, ...Resp?.data ?? []])
  }

  const getBlogs = async () => {
    const Resp = await blogsFunction({ action: "getFront" });
    console.log("RespResp", Resp);
    setBlogData(Resp?.data ?? [])
  }

  const onSelect_GetBlogByCategory = async (value) => {
    const Resp = await blogsFunction({ action: "getBlogByCategory", blog_category: value });
    console.log("RespResp", Resp);
    setBlogData(Resp?.data ?? [])
  }

  const onBlogSearch = async () => {
    const Resp = await blogsFunction({ action: "onSearchTitle", keyWord: blogSearch });
    console.log("RespResp", Resp);
    setBlogData(Resp?.data ?? [])
  }

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
    valueContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      padding: "0 20px",
      backgroundColor: "#16EBC3 ",
      // border: "1px solid rgba(34, 34, 34, 0.32)",
      borderRadius: 5,
      fontSize: "13px",
    }),
    control: (provided, state) => ({
      ...provided,
      height: "40px",
      borderRadius: 5,
      // backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      position: "absolute",
      right: 0,
      top: 0,
      color: "#000",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#000",
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  return (
    <>
      <BottomBar />
      <Header />
      <Container fluid className="home_wrapper">
        <Container className="custom_container">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className='res_pad_aligner'>
              <BreadPath />

              <h3 className="inhowit_title mt-5">{blogCon?.title}</h3>
              {description ? <p className='mp_detailbrief mt-4'>{parseHtmlString(blogCon?.content)}</p> :
                <p className='mp_detailbrief mt-4'>{blogCon?.content?.length > 300 ? parseHtmlString(blogCon?.content?.slice(0, 300)) : parseHtmlString(blogCon?.content)}</p>}
              {blogCon?.content?.length > 300 ?
                <button className='mp_readmoreBtn mt-3' onClick={() => setDescription(!description)}>{description ? "Read Less" : "Read More"}</button> :
                <></>}

              <Row className='mt-4'>
                <Col lg={2} md={3} sm={4} xs={8}>
                  <Select
                    className="border_select"
                    placeholder="Blog"
                    styles={stylesgraybg}
                    defaultValue={selectedOption}
                    onChange={(e) => { setSelectedOption(e); onSelect_GetBlogByCategory(e.value) }}
                    options={options}
                  />

                </Col>
              </Row>

              <Row className='mt-5'>
                <Col lg={6} md={6} sm={8} xs={12}>
                  <Row>
                    <Col xs={8}>
                      <input type='text' className='blog_input' value={blogSearch} onChange={(e) => setBlogSearch(e.target.value)} placeholder='Search a Blog...' />
                    </Col>
                    <Col xs={4}>
                      <button className='primary_blueBtn home_bannerPrimay' onClick={onBlogSearch}>Search</button>
                    </Col>
                  </Row>
                  {/* <div className='blogInput_search'>
                        
                        
                        </div> */}
                </Col>
              </Row>

              <Row className='mt-5'>
                <Col xs={12}>

                  <Row className='mb-3'>
                    {blogData?.length != 0 && blogData?.map((data) =>
                      <>
                        <Col lg={6} md={6} sm={12} xs={12}>

                          <BlogsCard data={data} />


                        </Col>
                        {/* <Col lg={6}>
                        <h5 className='blog_rightTitle'>{data.blogPosts}</h5>

                        <ul className='home_investorList mt-3'>
                          {data?.blogPostList?.map((i) =>
                            <li> <img className='home_threecube' src={require('../assets/images/threecube.svg').default} />
                              <p className='home_investorli'>{i.listHint}</p>
                            </li>
                          )}

                        </ul>
                      </Col> */}
                      </>
                    )}
                  </Row>

                </Col>

              </Row>

              <Row className='pi_highertop justify-content-center'>
                <PageCounter />
              </Row>

              <Row className='mt-5'>
                <Col xs={12}>
                  <Faq arrData={faqArr} />
                </Col>
              </Row>

            </Col>
          </Row>
        </Container>
        <Footer />
      </Container>
    </>
  )
}

export default Blogs