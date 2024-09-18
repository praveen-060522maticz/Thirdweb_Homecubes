import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
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
                    <Container>
                        <Row>
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
                                    <button className="hc-home__button--linear">
                                        Buy now on initial sales
                                    </button>
                                </Link>
                            </Col>
                            <Col lg={6} className="px-0">
                                {CMS["Revolution your Home Ownership"]?.img &&
                                    <div className="anim_div" data-aos="fade-up"
                                        data-aos-offset="150"
                                        data-aos-duration="800">

                                        <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["Revolution your Home Ownership"]?.img}`} className="banner_lottie" />
                                    </div>}
                            </Col>
                        </Row>
                    </Container>
                </div>

                <div className="bottom_content">
                    <Container>
                        <Row className="top_bottom">
                            <Col lg={6} className="px-0">
                                <div className="cloudcubes_holder">
                                    {CMS["About Home Cubes"]?.img &&
                                        <div className="anim_div d-none d-sm-flex" data-aos="fade-left"
                                            data-aos-offset="50"
                                            data-aos-duration="800">
                                            <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["About Home Cubes"]?.img}`} className="img-fluid w-75" divClassname="d-none d-md-flex justify-content-center"
                                            />
                                        </div>}
                                </div>
                            </Col>
                            <Col lg={6} className="px-0">
                                <div
                                    className="cloud_hideCont"
                                >
                                    <h3 className="home_titled hc-home__title head_txt" data-aos="fade-up"
                                        data-aos-offset="100"
                                        data-aos-duration="800"
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
                        <Row className="top_bottom align-items-center">
                            <Col lg={6} className="px-0">
                                <h3
                                    className="home_titled hc-home__title head_txt"
                                    data-aos="fade-up"
                                    data-aos-offset="100"
                                    data-aos-duration="800"
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
                        <Row className="top_bottom align-items-center">
                            <Col lg={6} className="px-0">
                                {CMS["In addition to the product launch, we will also establish a marketplace."]?.img &&
                                    <div className="anim_div">
                                        <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["In addition to the product launch, we will also establish a marketplace."]?.img}`} />
                                    </div>}
                            </Col>
                            <Col lg={6}>
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

                        <Row className="top_bottom align-items-center">
                            <Col lg={6} className="px-0">
                                <h3
                                    className="home_titled hc-home__title head_txt"
                                    data-aos="fade-up"
                                    data-aos-offset="100"
                                    data-aos-duration="800"
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
                                                <p className=" mp_detailbrief hc-home__desc" dangerouslySetInnerHTML={{ __html: val?.content }} >

                                                </p>
                                            </li>
                                        )
                                    })}
                                </ul>

                                <button className="primary_blueBtn">
                                    Claim Income
                                </button>
                            </Col>
                        </Row>

                    </Container>
                </div>

            </div>
            <div ref={footerRef}>
                <Footer />
            </div>
        </ >

    )
}

export default Home