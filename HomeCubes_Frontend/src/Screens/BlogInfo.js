import React, { useEffect, useState } from "react";
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import SideTab from "../Components/SideTab";
import { Container, Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Keyboard, Pagination } from "swiper/modules";
import { nftcard } from "../datas/CardData";
import BlogsCard from "../Components/BlogsCard";
import Footer from "../Components/Footer";
import { NavLink, useParams } from "react-router-dom";
import BreadPath from "../Components/BreadPath";
import { isEmpty, parseHtmlString } from "../actions/common";
import config from "../config/config";
import { blogsFunction, getblogCategories } from "../actions/axioss/cms.axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import { LinkedinShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";

function BlogInfo() {
  const scrollToComment = () => {
    const commentTopOffset = document.getElementById("commentSec_id").offsetTop;
    console.log(commentTopOffset, "commentTopOffset");
    window.scrollTo(0, commentTopOffset);
  };

  const scrollToRelatedPost = () => {
    const relatedPostTopOffset =
      document.getElementById("relatedPost_top").offsetTop;
    window.scrollTo(0, relatedPostTopOffset);
  };
  const [description, setDescription] = useState(false);
  const location = useLocation();

  const { slug } = useParams();
  const { accountAddress } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );

  const blogData = location?.state;
  console.log(blogData, "989898");
  const [recentBlog, setRecentBlog] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [Error, setError] = useState({});
  const [allComments, setAllcomments] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
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

  useEffect(() => {
    getRelatedPost();
    getComments();
  }, []);

  const getComments = async () => {
    const Resp = await blogsFunction({
      action: "getComment",
      _id: blogData?._id,
    });
    console.log("adssdsdsResp", Resp);
    setAllcomments(Resp?.data?.comments ?? []);
  };

  const getRelatedPost = async () => {
    const Resp = await blogsFunction({
      action: "getRecent",
      blog_category: blogData?.blog_category,
    });
    setRecentBlog(Resp?.data ?? []);
    console.log("RespRawdesp", Resp);
  };

  const validation = () => {
    const error = {};

    console.log("config.EMAIL(email)", config.EMAIL.test(email));
    if (!name) error.name = "Name can't be emppty";
    if (!comment) error.comment = "Comment can't be emppty";
    if (!email) error.email = "Email can't be emppty";
    if (email && !config.EMAIL.test(email))
      error.email = "Please enter correct format";

    return error;
  };

  const onAddComment = async () => {
    const valid = validation();
    console.log("valid", valid);
    if (!isEmpty(valid)) return setError(valid);
    const Resp = await blogsFunction({
      action: "addComment",
      _id: blogData._id,
      name,
      email,
      comment,
      walletAddress: accountAddress,
    });
    console.log("resesesefse", Resp);
    if (Resp?.success == "success") {
      toast.success("Comment Added");
      setEmail("");
      setComment("");
      setName("");
      getComments();
    } else {
      toast.error("Comment Not Added");
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const navigate = useNavigate()

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
            <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner">
              <BreadPath />
              <div className="cus-back-btn mb-3">
                <Button className="" onClick={() => navigate(-1)} >
                  <i className="fa-solid fa-chevron-left"></i>
                  Back
                </Button>
              </div>
              <>
                <h3 className="inhowit_title mt-5">{blogData?.title}</h3>
                {description ? (
                  <p className="mp_detailbrief mt-4">
                    {parseHtmlString(blogData?.content)}
                  </p>
                ) : (
                  <p className="mp_detailbrief mt-4">
                    {blogData?.content?.length > 300
                      ? parseHtmlString(blogData?.content?.slice(0, 300))
                      : parseHtmlString(blogData?.content)}
                  </p>
                )}
                {blogData?.blogHint?.length > 300 ? (
                  <button
                    className="mp_readmoreBtn mt-3"
                    onClick={() => setDescription(!description)}
                  >
                    {description ? "Read Less" : "Read More"}
                  </button>
                ) : (
                  <></>
                )}
              </>

              {/* <Row className="mt-4">
                <Col lg={2} md={3} sm={4} xs={8}>
                  <Select
                    className="border_select"
                    placeholder="Blog"
                    styles={stylesgraybg}
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={options}
                  />
                </Col>
              </Row> */}

              {/* <Row className="mt-5">
                <Col lg={6} md={8} sm={12} xs={12}>
                  <Row>
                    <Col lg={6} md={8} sm={9} xs={8}>
                      <input
                        type="text"
                        className="blog_input"
                        placeholder="Search a Blog..."
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={8}
                      sm={3}
                      xs={4}
                      className="d-flex justify-content-end"
                    >
                      <button className="primary_blueBtn home_bannerPrimay">
                        Search
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row> */}

              <Row className="mt-5">
                <Col lg={8} md={8} sm={12} xs={12} className="mb-3">
                  <img
                    src={`${config.IMG_URL}/blogImg/${blogData.image}`}
                    className="img-fluid blogCard_infoimg"
                  />

                  <div className="blogInfo_namedate mt-2">
                    <div className="blogINfo_namesocial">
                      {/* <p className='blogCard_title'>{blogData.blogName}</p> */}
                      <div className="blogInfo_iconsHolder mt-3">
                        <img
                          className="nftInfo_socials"
                          src={require("../assets/images/share.svg").default}
                        />
                        <div className="nftinfo_imgsep"></div>

                        <LinkedinShareButton
                          title="LinkedIn"
                          url={`${config?.FRONT_URL}/blogInfo/${blogData?.slug}`}
                        >
                          <img
                            className="nftInfo_socials"
                            src={
                              require("../assets/images/whitelinkedin.svg")
                                .default
                            }
                          />
                        </LinkedinShareButton>
                        <WhatsappShareButton
                          title={'Whatsapp'}
                          url={`${config?.FRONT_URL}/blogInfo/${blogData?.slug}`}
                        >
                          <img
                            className="nftInfo_socials"
                            src={
                              require("../assets/images/whitewhatsapp.svg")
                                .default
                            }
                          />
                        </WhatsappShareButton>
                        <TwitterShareButton
                          url={`${config?.FRONT_URL}/blogInfo/${blogData?.slug}`}
                          title="Twitter Share"
                        >
                          <img
                            className="nftInfo_socials"
                            src={
                              require("../assets/images/whitetwitter.svg").default
                            }
                          />
                        </TwitterShareButton>

                        <TelegramShareButton
                          title={"Telegram"}
                          url={`${config?.FRONT_URL}/blogInfo/${blogData?.slug}`}
                        >
                          <img
                            className="nftInfo_socials"
                            src={
                              require("../assets/images/whitetelegram.svg")
                                .default
                            }
                          />
                        </TelegramShareButton>
                        {/* <img
                      className="nftInfo_socials"
                      src={require("../assets/images/whiteinsta.svg").default}
                    />
                    <img
                      className="nftInfo_socials"
                      src={require("../assets/images/whitediscard.svg").default}
                    /> */}
                        <CopyToClipboard
                          onCopy={() => toast.success("Copied successfully")}
                          text={`${config?.FRONT_URL}/blogInfo/${blogData?.slug}`}
                        >
                          <img
                            className="nftInfo_socials"
                            src={
                              require("../assets/images/whitecopy.svg").default
                            }
                          />
                        </CopyToClipboard>
                      </div>
                    </div>
                    <div className="stack_pendingholder blogCard_date">
                      <p className="stack_pendinghint">
                        {new Date(blogData.createdAt).toDateString()}
                      </p>
                    </div>
                  </div>
                </Col>

                <Col lg={4} md={4} sm={12} xs={12} className="mb-3">
                  <div className="blogInfo_rightBtns">
                    <button
                      className="primary_blueBtn blogInfoBtns home_bannerPrimay"
                      onClick={() => scrollToRelatedPost()}
                    >
                      Related Post
                    </button>
                    <button
                      className="primary_greenBtn"
                      onClick={() => scrollToComment()}
                    >
                      Comments
                    </button>
                  </div>
                </Col>
              </Row>

              <Row className="mt-5">
                <Col lg={8}>
                  <div
                    className="blog_dangerous_cont"
                    dangerouslySetInnerHTML={{ __html: blogData.content }}
                  ></div>
                </Col>
              </Row>

              <Row className="pi_higherTop" id="relatedPost_top">
                <Col lg={12}>
                  <h3 className="inhowit_title  text-center">Related Posts</h3>
                  <p className="markeplace_hint text-center mt-3">
                    Relaed blog
                  </p>
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
                        320: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        450: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        576: {
                          slidesPerView: 1,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        850: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        992: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1100: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        1200: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        1500: {
                          slidesPerView: 4,
                          spaceBetween: 20,
                        },
                        1700: {
                          slidesPerView: 4,
                          spaceBetween: 20,
                        },
                      }}
                      modules={[Navigation, Keyboard, Pagination]}
                    >
                      {recentBlog.length != 0 &&
                        recentBlog?.map((data) => (
                          <SwiperSlide>
                            <BlogsCard data={data} />
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </div>
                </Col>
              </Row>

              <Row className="mt-5 justify-content-center" id="commentSec_id">
                <h3 className="inhowit_title  text-center">Comments</h3>
                <Col lg={8} className="mt-5">
                  <div className="wholeComments_holder">
                    {allComments?.length != 0 ? (
                      allComments?.map((item) => (
                        <div className="bi_comments_holder mb-4">
                          {/* <img
                          className='profile_img img-fluid'
                          accept="image/*"
                          src={
                            isEmpty(userProfile?.Profile) ?
                              require('../assets/images/collections/shapeEight.jpg') :
                              `${config?.IMG_URL}/user/${userProfile?.WalletAddress}/profile/${userProfile?.Profile}`}
                        /> */}

                          <img
                            src={
                              isEmpty(item?.walletAddress?.Profile)
                                ? require("../assets/images/collections/shapeEight.jpg")
                                : `${config?.IMG_URL}/user/${item?.walletAddress?.WalletAddress}/profile/${item?.walletAddress?.Profile}`
                            }
                            className="bi_userImg"
                          />
                          <div className="bi_commentsCont_holder">
                            <p className="bi_username">
                              {item.name}{" "}
                              <span className="bi_commentTime">
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
                            </p>
                            <p className="bi_commentCont">{item.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>
                        <p className="bi_no_comment_text text-center" >No comments found</p>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row className="justify-content-center pi_higherTop">
                <Col lg={8}>
                  <Row className="">
                    <div className="blogInfo_placecomment blogInfo_padbox">
                      <p className="blogINfo_usercomment text-center">
                        User Comments
                      </p>

                      <Row className="justify-content-between mt-5">
                        <Col lg={5} md={6} sm={6} xs={12} className="mb-3">
                          <p className="blogInfo_inplabel">Full Name</p>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                              setError("");
                              setName(e.target.value);
                            }}
                            className="blogInfo_input mt-2"
                            placeholder=""
                          />
                          <p style={{ color: "red" }}>{Error?.name}</p>
                        </Col>
                        <Col lg={5} md={6} sm={6} xs={12} className="mb-3">
                          <p className="blogInfo_inplabel">Email address</p>
                          <input
                            type="text"
                            value={email}
                            onChange={(e) => {
                              setError("");
                              setEmail(e.target.value);
                            }}
                            className="blogInfo_input mt-2"
                            placeholder=""
                          />
                          <p style={{ color: "red" }}>{Error?.email}</p>
                        </Col>
                        <Col lg={12} xs={12} className="mt-3 mt-sm-5">
                          <p className="blogInfo_inplabel">Comment</p>
                          <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => {
                              setError("");
                              setComment(e.target.value);
                            }}
                            className="blogInfo_textarea mt-2"
                            name="comment"
                            rows="4"
                            cols="50"
                          />
                          <p style={{ color: "red" }}>{Error?.comment}</p>
                        </Col>

                        <div className="text-center mt-5">
                          <button
                            className="bodygradientBtn"
                            onClick={onAddComment}
                          >
                            Send
                          </button>
                        </div>
                      </Row>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <Footer />
      </Container>
    </>
  );
}

export default BlogInfo;
