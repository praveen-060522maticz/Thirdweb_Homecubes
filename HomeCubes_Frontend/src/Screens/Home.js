import React, { useEffect, useState } from "react";
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import { Col, Container, Row } from "react-bootstrap";
import SideTab from "../Components/SideTab";
import BannerLottie from "../assets/lotties/bannercube.json";
import Lottie from "lottie-react";
import Stepper from "../assets/lotties/step.json";
import CompassCube from "../assets/lotties/compasscube.json";
import Inversors from "../assets/lotties/investor.json";
import { nftcard } from "../datas/CardData";
import Footer from "../Components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Roadmap from "../Components/Roadmap";
import PlaceaBid from "../Modals/PlaceaBid";
import Typewriter from "typewriter-effect";
import { useSelector } from "react-redux";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Newsletter } from "../actions/axioss/user.axios";
import { isEmpty } from "../actions/common";
import { toast } from "react-toastify";
import config from "../config/config";
import { getCmsContent } from "../actions/axioss/cms.axios";
import loadable from "@loadable/component";
import YoutubeComp from '../Components/YoutubeComp';
import Iframe from 'react-iframe'
import LazyLoad from 'react-lazyload'
import LazyLoader from "../Components/LazyLoader";
import LottieAnimation from "../Components/LottieAnimar";
import { BiLogoTelegram, BiLogoDiscordAlt, BiLogoFacebook, BiLogoGmail, BiLogoYoutube, BiLogoLinkedin, BiLogoInstagram, BiLogoMediumSquare } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

function Home() {
  useEffect(() => {
    AOS.init({ mirror: "true" });
    AOS.refresh();
    window.scroll(0, 0);
  }, []);

  const [mail, setMail] = useState("");
  const [CMS, SetCMS] = useState({});
  const [commmitArr, setCommitArr] = useState([]);
  const [investArr, setInvestArr] = useState([]);
  const [roadMap, setRoadMap] = useState([]);

  const payload = useSelector((state) => state.LoginReducer.AccountDetails);

  const onSubscribClick = async () => {
    if (isEmpty(mail)) return toast.error("Please enter gmail address");
    if (!config.EMAIL.test(mail))
      return toast.error("Please enter valid mail address");

    const Resp = await Newsletter({ email: mail });
    if (Resp.success == "success") {
      toast.success("Subscriber added successfully");
      setMail("");
      window.scroll(0, 0);
    } else {
      toast.error("Subscribe not added");
    }
  };

  useEffect(() => {
    getCmsContentFunc();
  }, []);

  const getCmsContentFunc = async () => {
    const Resp = await getCmsContent({
      page: [
        "home",
        "HomeCubes Road",
        "home-commitment",
        "home-Investors Benefits",
        "HomeCubes Road Map",
      ],
    });
    console.log("sejhfgeiusf", Resp);
    const obj = {};
    const Arr = [];
    const investArr = [];
    const roadMap = [];

    const valuse = Resp.data.map((val) => {
      if (val.page == "home-commitment") Arr.push(val);
      else if (val.page == "home-Investors Benefits") investArr.push(val);
      else if (val.page == "HomeCubes Road Map") roadMap.push(val);
      else obj[val.key] = val;
    });
    setInvestArr(investArr);
    SetCMS(obj);
    setCommitArr(Arr);
    setRoadMap(roadMap);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* {location.pathname == "/" && */}
      <>
        <BottomBar />
        <Header />
        <Container fluid className="pt-3 home_wrapper">
          <Container className="custom_container ">
            <Row>
              <Col lg={1} md={2} className="sidetab_holder">
                <SideTab />
              </Col>
              <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner">
                <Row>
                  <Col lg={12} sm={12}>
                    <Row className="justify-content-between home_banner_row align-items-center hc-home__banner">
                      <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                        <div className="home_bannerleft">
                          {/* <h3 c">
                            {CMS["Revolution your Home Ownership"]?.title}
                          </h3> */}

                          <div className="home_titled hc-home__title mt-3" dangerouslySetInnerHTML={{ __html: CMS["Revolution your Home Ownership"]?.title }} ></div>

                          <p
                            className="mp_detailbrief hc-home__desc mt-3"
                            dangerouslySetInnerHTML={{
                              __html:
                                CMS["Revolution your Home Ownership"]?.content,
                            }}
                          ></p>
                          <NavLink to="/howitworks">
                            <button className="primary_blueBtn home_bannerPrimay hc-home__button-gradient mt-4">
                              Buy now on initial sales
                            </button>
                          </NavLink>
                        </div>
                      </Col>
                      <Col
                        lg={5}
                        md={5}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-center mb-3"
                      >
                        {/* <Lottie
                        animationData={BannerLottie}
                        className="banner_lottie"
                        loop={true}
                      /> */}
                        {/* <LazyLoad height={200} placeholder={<LazyLoader />} offset={[-200, 0]} debounce={500}> */}
                        {/* <img
                              className="img-fluid max_wid_aligner"
                              src={`${config.IMG_URL}/cmsimg/${CMS["Revolution your Home Ownership"]?.img}`}
                            /> */}
                        {CMS["Revolution your Home Ownership"]?.img &&
                          <div className="anim_div" data-aos="fade-up"
                            data-aos-offset="50"
                            data-aos-duration="800">

                            <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["Revolution your Home Ownership"]?.img}`} className="banner_lottie" />
                          </div>}
                        {/* </LazyLoad> */}
                      </Col>
                    </Row>

                    <Row className="position-relative pi_higherTop home_inversecol">
                      <div className="cloudcubes_holder">
                        {/* <img
                            className="cloud_cubics"
                            src={`${config.IMG_URL}/cmsimg/${CMS["About Home Cubes"]?.img}`}
                          /> */}
                        {CMS["About Home Cubes"]?.img &&
                          <div className="anim_div" data-aos="fade-left"
                            data-aos-offset="50"
                            data-aos-duration="800">


                            <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["About Home Cubes"]?.img}`} className="cloud_cubics"
                            />
                          </div>}
                      </div>

                      {/* <img className="cloud_cubics" src={`${config.IMG_URL}/cmsimg/${CMS["About Home Cubes"]?.img}`} /> */}
                      <Col
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        className="mob_homecloud d-flex justify-content-center"
                      >
                        {/* <img
                            className="img-fluid"
                            src={`${config.IMG_URL}/cmsimg/${CMS["About Home Cubes"]?.img}`}
                          /> */}
                        {CMS["About Home Cubes"]?.img &&
                          <div className="anim_div" data-aos="fade-up"
                            data-aos-offset="100"
                            data-aos-duration="800">

                            <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["About Home Cubes"]?.img}`} className="img-fluid" />
                          </div>}
                        {/* <img className="img-fluid" src={`${config.IMG_URL}/cmsimg/${CMS["About Home Cubes"]?.img}`} /> */}
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={12}></Col>
                      <Col lg={6} md={6} sm={12} xs={12} className="mb-5 mb-md-0">
                        <div
                          className="cloud_hideCont"
                        >
                          <h3 className="home_titled hc-home__title mt-3" data-aos="fade-up"
                            data-aos-offset="100"
                            data-aos-duration="800">

                            {/* {CMS["About Home Cubes"]?.title} */}
                            About  <strong>Home <b>cubes</b> </strong>
                          </h3>
                          <p
                            className="mp_detailbrief hc-home__desc mt-3"
                            dangerouslySetInnerHTML={{
                              __html: CMS["About Home Cubes"]?.content,
                            }}
                          ></p>
                          <NavLink to="/howitworks">
                            <button className="primary_blueBtn mt-5">
                              About our Team
                            </button>
                          </NavLink>
                        </div>
                      </Col>
                    </Row>

                    <Row className="pi_higherTop align-items-center">
                      <Col lg={6} md={6} xs={12}>
                        <Typewriter
                          options={{
                            strings: ["We Are Getting Regulated"],
                            autoStart: true,
                            loop: true,
                          }}
                        />
                        <h3
                          className="home_titled hc-home__title mt-3"
                          data-aos="fade-up"
                          data-aos-offset="100"
                          data-aos-duration="800"
                        >
                          {CMS["CountDown to Our Next Launch"]?.title}
                        </h3>
                        <p
                          className="mp_detailbrief hc-home__desc mt-3"
                          dangerouslySetInnerHTML={{
                            __html: CMS["CountDown to Our Next Launch"]?.content,
                          }}
                        ></p>

                        <button className="primary_blueBtn mt-5">
                          About our Team
                        </button>
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        xs={12}
                        className="d-flex justify-content-center"
                      >
                        {/* <Lottie
                        animationData={Stepper}
                        className="stepper_lottie"
                        loop={true}
                      /> */}
                        {CMS["CountDown to Our Next Launch"]?.img && <div className="anim_div">

                          <LottieAnimation className='stepper_lottie' url={`${config.IMG_URL}/cmsimg/${CMS["CountDown to Our Next Launch"]?.img}`} />
                        </div>}
                        {/* <img
                            className="img-fluid"
                            src={`${config.IMG_URL}/cmsimg/${CMS["CountDown to Our Next Launch"]?.img}`}
                          /> */}
                      </Col>
                    </Row>
                    {/* <LazyLoad height={200} placeholder={<LazyLoader />} offset={[-200, 0]} debounce={500}> */}
                    {CMS?.youtube?.link && (
                      <Row className="mt-4 justify-content-center">
                        <Col lg={5}>
                          <Iframe
                            width="100%"
                            height="350"
                            src={CMS?.youtube?.link}
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                            loading="lazy"
                          />
                        </Col>
                      </Row>
                    )}
                    {/* </LazyLoad> */}
                    <Row className="pi_higherTop">
                      <Col lg={6} md={6} sm={6} xs={12} className="d-flex justify-content-center align-items-center">
                        {/* <Lottie
                        animationData={CompassCube}
                        className="stepper_lottie spider_lottie"
                        loop={true}
                      /> */}
                        {CMS["In addition to the product launch, we will also establish a marketplace."]?.img &&
                          <div className="anim_div">
                            <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["In addition to the product launch, we will also establish a marketplace."]?.img}`} />
                          </div>}
                        {/* <img
                            className="img-fluid width_seven howit_giffer"
                            src={`${config.IMG_URL}/cmsimg/${CMS["In addition to the product launch, we will also establish a marketplace."]?.img}`}
                          /> */}
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        xs={12}
                        className="d-flex align-items-center"
                      >
                        <div>
                          <Typewriter
                            options={{
                              strings: ["Marketplace"],
                              autoStart: true,
                              loop: true,
                            }}
                          />
                          <h3
                            className="home_titled hc-home__title mt-3"
                            data-aos="fade-up"
                            data-aos-offset="100"
                            data-aos-duration="800"
                          >
                            {
                              CMS[
                                "In addition to the product launch, we will also establish a marketplace."
                              ]?.title
                            }
                          </h3>
                          <p
                            className="mp_detailbrief hc-home__desc mt-3"
                            dangerouslySetInnerHTML={{
                              __html:
                                CMS[
                                  "In addition to the product launch, we will also establish a marketplace."
                                ]?.content,
                            }}
                          ></p>
                          <NavLink to="/marketplace" className="sidetab_link">
                            <button className="primary_blueBtn mt-5">
                              Marketplace
                            </button>
                          </NavLink>
                        </div>
                      </Col>
                    </Row>

                    <Row className="align-items-center mt-5">
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Typewriter
                          options={{
                            strings: ["Passive Income"],
                            autoStart: true,
                            loop: true,
                          }}
                        />
                        <h3
                          className="home_titled hc-home__title mt-3"
                          data-aos="fade-up"
                          data-aos-offset="100"
                          data-aos-duration="800"
                        >
                          Investors Benefits
                        </h3>
                        <ul className="home_investorList mt-4">
                          {investArr.length != 0 && investArr.map((val) => {

                            return (
                              <li>
                                {" "}
                                <img
                                  className="home_threecube"
                                  src={
                                    require("../assets/images/threecube.svg").default
                                  }
                                />
                                <p className="home_investorli" dangerouslySetInnerHTML={{ __html: val?.content }} >

                                </p>
                              </li>
                            )
                          })}
                          {/* <li>
                          {" "}
                          <img
                            className="home_threecube"
                            src={
                              require("../assets/images/threecube.svg").default
                            }
                          />
                          <p className="home_investorli">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy
                          </p>
                        </li>
                        <li>
                          {" "}
                          <img
                            className="home_threecube"
                            src={
                              require("../assets/images/threecube.svg").default
                            }
                          />
                          <p className="home_investorli">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy
                          </p>
                        </li>
                        <li>
                          {" "}
                          <img
                            className="home_threecube"
                            src={
                              require("../assets/images/threecube.svg").default
                            }
                          />
                          <p className="home_investorli">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy
                          </p>
                        </li>
                        <li>
                          {" "}
                          <img
                            className="home_threecube"
                            src={
                              require("../assets/images/threecube.svg").default
                            }
                          />
                          <p className="home_investorli">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy
                          </p>
                        </li> */}
                        </ul>

                        <button className="primary_blueBtn mt-5">
                          Marketplace
                        </button>
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-center"
                      >
                        {/* <Lottie
                        animationData={Inversors}
                        className="investor_lottie investLotte"
                        loop={true}
                      /> */}
                        {console.log("filterImage", investArr?.filter(val => val?.img))}
                        {investArr?.length != 0 && investArr?.filter(val => val?.img)[0]?.img &&
                          // <img
                          //   className="img-fluid width_seven howit_giffer"
                          //   src={`${config.IMG_URL}/cmsimg/${investArr?.filter(val => val?.img)[0]?.img}`}
                          // />
                          <div className="anim_div">

                            <LottieAnimation url={`${config.IMG_URL}/cmsimg/${investArr?.filter(val => val?.img)[0]?.img}`} />
                          </div>
                        }
                      </Col>
                    </Row>

                    <Row className="align-items-center pi_higherTop">
                      <h3
                        className="home_titled hc-home__title text-center mb-5"
                        data-aos="fade-up"
                        data-aos-offset="50"
                        data-aos-duration="800"
                      >
                        Our Commitment
                      </h3>
                      {commmitArr?.length != 0 &&
                        commmitArr?.map((i) => (
                          <Col lg={4} md={6} sm={6} xs={12} className="mb-3">
                            <div
                              className="home_commitemtnCard"
                              data-aos="fade-up"
                              data-aos-offset="100"
                              data-aos-duration="800"
                            >
                              <div className="home_singleCommit">
                                <img
                                  className="home_commitCube"
                                  // className="home_commitCube"
                                  src={
                                    require("../assets/images/threecube.svg")
                                      .default
                                  }
                                />
                                <p className="home_singleCmtmnt">{i.title}</p>
                              </div>
                              <p
                                className="home_investorli mt-3 hc-home_li--p "
                                dangerouslySetInnerHTML={{ __html: i.content }}
                              ></p>
                            </div>
                          </Col>
                        ))}
                    </Row>

                    <Row className="mt-5">
                      <h3
                        className="home_titled hc-home__title text-center"
                        data-aos="fade-up"
                        data-aos-offset="100"
                        data-aos-duration="800"
                      >
                        Road Map
                      </h3>

                      <Roadmap data={roadMap} />
                    </Row>

                    {/* <Row className="justify-content-center pi_higherTop">
                    <Col lg={10} className="home_mailer">
                      <Row className="justify-content-center">
                        <Col lg={6} md={8} sm={10} xs={11} className="my-5">
                          <h3
                            className="home_titled text-center"
                            data-aos="fade-up"
                            data-aos-offset="100"
                            data-aos-duration="500"
                          >
                            Join the Channel
                          </h3>
                          <div className="home_mailerBox mt-4">
                            <input
                              type="text"
                              className="home_mailInput"
                              placeholder="Enter your mail id"
                              value={mail}
                              onChange={(e) => setMail(e.target.value)}
                            />
                            <button
                              className="primary_blueBtn mt-4"
                              onClick={() => onSubscribClick()}
                            >
                              Send
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row> */}

                    {/* <Link
                    to="https://linktr.ee/homecubes"
                    className="home__linktreeNav"
                    target="_blank"
                  > */}
                    <Row className="justify-content-center pi_higherTop">
                      <Col lg={8} className="home_mailer">
                        <Row className="justify-content-center">
                          <Col
                            lg={8}
                            md={8}
                            sm={10}
                            xs={11}
                            className="my-5 d-flex flex-column justify-content-center align-items-center gap-3"
                          >
                            <h3
                              className="home_titled text-center"
                              data-aos="fade-up"
                              data-aos-offset="100"
                              data-aos-duration="500"
                            >
                              Join Our Link Tree
                            </h3>

                            <div className="home__channelLinkHolder d-flex justify-content-center align-items-center gap-2 gap-sm-3">
                              <a href="https://t.me/HomeCubes_io" target="__blank" className="home__channelBtn rounded-5" ><BiLogoTelegram /></a>
                              <a href="https://twitter.com/HomeCubes" target="__blank" className="home__channelBtn rounded-5" ><FaXTwitter /></a>
                              <a href="https://discord.gg/y6mrj5E3" target="__blank" className="home__channelBtn rounded-5" ><BiLogoDiscordAlt /></a>
                              <a href="https://medium.com/@HomeCubes" target="__blank" className="home__channelBtn rounded-5" ><BiLogoMediumSquare /></a>
                              <a href="https://www.facebook.com/people/homecubesio/100090571700233/" target="__blank" className="home__channelBtn rounded-5" ><BiLogoFacebook /></a>
                              <a href="https://www.instagram.com/homecubes.io?igsh=MzRlODBiNWFlZA==" target="__blank" className="home__channelBtn rounded-5" ><BiLogoInstagram /></a>
                              {/* <button className="home__channelBtn rounded-5" data-aos="fade-left"
                              data-aos-offset="100"
                              data-aos-duration="500"><BiLogoGmail /></button> */}
                              <a href="https://www.youtube.com/@homecubes6047" target="__blank" className="home__channelBtn rounded-5"
                              ><BiLogoYoutube /></a>
                              <a href="https://www.linkedin.com/company/homecubes/" target="__blank" className="home__channelBtn rounded-5" ><BiLogoLinkedin /></a>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {/* </Link> */}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container >
          <Footer />
        </Container >

        <div className="gradient_holder staking_gradholder"></div>
      </>
      {/* }

      <Outlet /> */}
    </div >
  );
}

export default Home;
