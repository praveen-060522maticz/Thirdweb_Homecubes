import React, { useEffect, useState } from "react";
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

        <>
            <BottomBar />
            <Header />

            <div className="innercontent">
                {/* <div className="side_left"> */}
                <SideTab/>
                {/* </div> */}
  
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
                        <Row>
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
                            <h3 className="home_titled hc-home__title mt-3" data-aos="fade-up"
                              data-aos-offset="100"
                              data-aos-duration="800"
                              dangerouslySetInnerHTML={{ __html: CMS["About Home Cubes"]?.title }}
                            >
                              {console.log("siehgse", CMS["About Home Cubes"]?.title)}
                            </h3>
                            <p
                              className="mp_detailbrief hc-home__desc desc_txt mt-3"
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
                    </Container>
                </div>

            </div>

            <Footer />


        </>
    );
}

export default Home;