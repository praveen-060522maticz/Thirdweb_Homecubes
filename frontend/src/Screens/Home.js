import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Roadmap from "../Components/Roadmap";
import Typewriter from "typewriter-effect";
import SideTab from "../Components/SideTab";
import { useSelector } from "react-redux";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Newsletter } from "../actions/axioss/user.axios";
import { isEmpty } from "../actions/common";
import { toast } from "react-toastify";
import config from "../config/config";
import { getCmsContent } from "../actions/axioss/cms.axios";
import loadable from "@loadable/component";
import Iframe from 'react-iframe'
import LazyLoad from 'react-lazyload'
import LottieAnimation from "../Components/LottieAnimar";
import { BiLogoTelegram, BiLogoDiscordAlt, BiLogoFacebook, BiLogoGmail, BiLogoYoutube, BiLogoLinkedin, BiLogoInstagram, BiLogoMediumSquare } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";



function Home() {

    useEffect(() => {
        AOS.init({ mirror: "true" });
        AOS.refresh();
        window.scroll(0, 0);
    }, []);

    const footerRef = useRef(null);
    const [isFixed, setIsFixed] = useState(true);
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

            <div className="innercontent">
                <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
                    <SideTab />
                </div>

                <div className="banner_section">
                    <div className="inner-container__width">
                        <Row className="mx-auto">
                            <Col lg={6} className="px-0">
                                <div className="home_titled hc-home__title head_txt" dangerouslySetInnerHTML={{ __html: CMS["Revolution your Home Ownership"]?.title }} ></div>
                                <p
                                    className="mp_detailbrief hc-home__desc desc_txt"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            CMS["Revolution your Home Ownership"]?.content,
                                    }}
                                ></p>
                                <Link to="/howitworks">
                                    <button className="hc-home__button--linear btn_top">
                                        Buy now on initial sales
                                    </button>
                                </Link>
                            </Col>
                            <Col lg={6} className="px-0">
                                {CMS["Revolution your Home Ownership"]?.img &&
                                    <div className="anim_div first_lottie" >

                                        <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["Revolution your Home Ownership"]?.img}`} className="banner_lottie" />
                                    </div>}
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="bottom_content home_top">
                    <div className="inner-container__width">
                        <Row className="top_bottom align-items-center flexwrapreverse mx-auto">
                            <Col lg={6} className="col_pad">
                                <div className="cloudcubes_holder">
                                    {CMS["About Home Cubes"]?.img &&
                                        <div className="anim_div text-center text-xl-start">
                                            <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["About Home Cubes"]?.img}`} className="img-fluid wauto"
                                            />
                                        </div>}
                                </div>
                            </Col>
                            <Col lg={6} className="col_pad">
                                <div
                                    className="cloud_hideCont"
                                >
                                    <h3 className="home_titled hc-home__title head_txt"
                                        dangerouslySetInnerHTML={{ __html: CMS["About Home Cubes"]?.title }}
                                    >
                                        {console.log("siehgse", CMS["About Home Cubes"]?.title)}
                                    </h3>
                                    <p
                                        className="mp_detailbrief hc-home__desc desc_txt"
                                        dangerouslySetInnerHTML={{
                                            __html: CMS["About Home Cubes"]?.content,
                                        }}
                                    ></p>
                                    <NavLink to="/howitworks">
                                        <button className="primary_blueBtn ">
                                            About our Team
                                        </button>
                                    </NavLink>
                                </div>
                            </Col>
                        </Row>
                        <Row className="top_bottom align-items-center mx-auto">
                            <Col lg={6} className="px-0">
                                <h3
                                    className="home_titled hc-home__title head_txt"

                                    dangerouslySetInnerHTML={{ __html: CMS["CountDown to Our Next Launch"]?.title }}
                                >

                                </h3>
                                <p
                                    className="mp_detailbrief hc-home__desc desc_txt"
                                    dangerouslySetInnerHTML={{
                                        __html: CMS["CountDown to Our Next Launch"]?.content,
                                    }}
                                ></p>

                                <button className="primary_blueBtn">
                                    Initial Sales
                                </button>
                            </Col>
                            <Col lg={6}>

                                {CMS["CountDown to Our Next Launch"]?.img && <div className="anim_div">

                                    <LottieAnimation className='stepper_lottie' url={`${config.IMG_URL}/cmsimg/${CMS["CountDown to Our Next Launch"]?.img}`} />
                                </div>}
                            </Col>
                        </Row>
                        <Row className="top_bottom align-items-center flexwrapreverse mx-auto">
                            <Col lg={6} className="px-0">
                                {CMS["In addition to the product launch, we will also establish a marketplace."]?.img &&
                                    <div className="anim_div">
                                        <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["In addition to the product launch, we will also establish a marketplace."]?.img}`} />
                                    </div>}
                            </Col>
                            <Col lg={6} className="px-0">
                                <div>
                                    <Typewriter

                                        options={{
                                            strings: ["Marketplace"],
                                            autoStart: true,
                                            loop: true,
                                        }}
                                    />
                                    <h3
                                        className="home_titled hc-home__title head_txt"

                                        dangerouslySetInnerHTML={{
                                            __html:
                                                CMS[
                                                    "In addition to the product launch, we will also establish a marketplace."
                                                ]?.title
                                        }}
                                    >
                                        {/* {
                              CMS[
                                "In addition to the product launch, we will also establish a marketplace."
                              ]?.title
                            } */}
                                    </h3>
                                    <p
                                        className="mp_detailbrief hc-home__desc desc_txt"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                CMS[
                                                    "In addition to the product launch, we will also establish a marketplace."
                                                ]?.content,
                                        }}
                                    ></p>
                                    <NavLink to="/staking" className="sidetab_link">
                                        <button className="primary_blueBtn">
                                            Claim income
                                        </button>
                                    </NavLink>
                                </div>
                            </Col>
                        </Row>
                        {CMS?.youtube?.link && (
                            <Row className="top_bottom justify-content-center">
                                <Col lg={5}>
                                    <Iframe
                                        className="video_set"
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

                        <Row className="top_bottom align-items-center mx-auto">
                            <Col lg={6} className="px-0">
                                <Typewriter

                                    options={{
                                        strings: ["Passive Income"],
                                        autoStart: true,
                                        loop: true,
                                    }}
                                />
                                <h3
                                    className="home_titled hc-home__title head_txt"

                                >
                                    Investors <strong>Benefits</strong>
                                </h3>
                                <ul className="home_investorList">
                                    {investArr.length != 0 && investArr.map((val) => {

                                        return (
                                            <li className="">
                                                {" "}
                                                <img
                                                    className="home_threecube hc-home__threecube"
                                                    src={
                                                        require("../assets/images/threecube.svg").default
                                                    }
                                                />
                                                <p className="mp_detailbrief hc-home__desc" dangerouslySetInnerHTML={{ __html: val?.content }} >

                                                </p>
                                            </li>
                                        )
                                    })}
                                </ul>

                                <button className="primary_blueBtn">
                                    Claim Income
                                </button>
                            </Col>
                            <Col lg={6}>
                                {console.log("filterImage", investArr?.filter(val => val?.img))}
                                {investArr?.length != 0 && investArr?.filter(val => val?.img)[0]?.img &&
                                    // <img
                                    //   className="img-fluid width_seven howit_giffer"
                                    //   src={`${config.IMG_URL}/cmsimg/${investArr?.filter(val => val?.img)[0]?.img}`}
                                    // />
                                    <div className="anim_div first_lottie">

                                        <LottieAnimation url={`${config.IMG_URL}/cmsimg/${investArr?.filter(val => val?.img)[0]?.img}`} />
                                    </div>
                                }
                            </Col>
                        </Row>

                        <Row className="align-items-center top_bottom mx-auto">
                            <h3
                                className="home_titled hc-home__title text-center  mb_5">
                                Our <strong>Commitment</strong>
                            </h3>
                            <div className="home-grid px-0">
                            {commmitArr?.length != 0 &&
                                commmitArr?.map((i) => (
                                    // <Col lg={4} md={6} sm={12} xs={12} className="col_pad commit_pad mt_3">
                                        <div
                                            className="home_commitemtnCard">
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
                                                className="home_investorli hc-home_li--p "
                                                dangerouslySetInnerHTML={{ __html: i.content }}
                                            ></p>
                                        </div>
                                    // </Col>
                                ))}
                                </div>
                        </Row>

                        <Row className="hc-home__roadMap top_bottom mx-auto">
                            <h3
                                className="home_titled hc-home__title text-center head_txt"

                            >
                                <strong>Road</strong> Map
                            </h3>
                            <div className="hc-home__roadmap--content">
                                <Roadmap data={roadMap} />

                            </div>
                        </Row>

                        <Row className="justify-content-center top_bottom mx-auto mb_4">
                            <Col lg={8} xl={6} className="home_mailer">
                                <Row className="justify-content-center">
                                    <Col
                                        lg={8}
                                        md={8}
                                        sm={10}
                                        xs={11}
                                        className="mtb d-flex flex-column justify-content-center align-items-center"
                                    >
                                        <h3
                                            className="home_titled text-center mb_1"

                                        >
                                            Join Our Link Tree
                                        </h3>
                                        <div className="home__channelLinkHolder d-flex justify-content-center align-items-center">
                                            <a href="https://t.me/HomeCubes_io" target="__blank" className="home__channelBtn rounded_5" ><BiLogoTelegram /></a>
                                            <a href="https://twitter.com/HomeCubes" target="__blank" className="home__channelBtn rounded_5" ><FaXTwitter /></a>
                                            <a href="https://discord.gg/y6mrj5E3" target="__blank" className="home__channelBtn rounded_5" ><BiLogoDiscordAlt /></a>
                                            <a href="https://medium.com/@HomeCubes" target="__blank" className="home__channelBtn rounded_5" ><BiLogoMediumSquare /></a>
                                            <a href="https://www.facebook.com/people/homecubesio/100090571700233/" target="__blank" className="home__channelBtn rounded_5" ><BiLogoFacebook /></a>
                                            <a href="https://www.instagram.com/homecubes.io?igsh=MzRlODBiNWFlZA==" target="__blank" className="home__channelBtn rounded_5" ><BiLogoInstagram /></a>
                                            {/* <button className="home__channelBtn rounded_5" data-aos="fade-left"
                              data-aos-offset="100"
                              data-aos-duration="500"><BiLogoGmail /></button> */}
                                            <a href="https://www.youtube.com/@homecubes6047" target="__blank" className="home__channelBtn rounded_5"
                                            ><BiLogoYoutube /></a>
                                            <a href="https://www.linkedin.com/company/homecubes/" target="__blank" className="home__channelBtn rounded_5" ><BiLogoLinkedin /></a>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </div>
                </div>

            </div>
            <div ref={footerRef}>
                <Footer />
            </div>
        </ >

    )
}

export default Home