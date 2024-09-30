
/** npm import */

import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react';
import LottieAnimation from '../Components/LottieAnimar'
import cartIcon from '../assets/images/cart.svg'


/* local file import */

import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import SideTab from '../Components/SideTab'
import { getCurrentProject } from '../actions/axioss/nft.axios'
import config from '../config/config';
import Countdown from "react-countdown";
import Footer from '../Components/Footer';
import { useRef } from 'react';
import { getCmsContent } from '../actions/axioss/cms.axios';


// import Footer from '../Components/Footer'

/* code start */

/* code start */


function MintProjects() {

    const [project, setProject] = useState([])
    const [isFixed, setIsFixed] = useState(true);
    const [CMS, SetCMS] = useState({});
    console.log("CMSCMS", CMS);
    const footerRef = useRef(null);

    useEffect(() => {
        getProjects()
    }, []);

    const getProjects = async () => {

        const getPro = await getCurrentProject({ action: "all" })
        console.log("getCurrentProject", getPro);

        if (getPro.success == "success") {
            const filterData = getPro?.data?.filter(val => val.isNotMinted != 0)
            console.log("filterData", filterData);
            setProject(filterData ?? [])
        }
    }

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
        getCmsContentFunc();
    }, []);

    const getCmsContentFunc = async () => {
        const Resp = await getCmsContent({
            page: [
                "minting"
            ],
        });
        console.log("sejhfgeiusf", Resp);
        const obj = {};
        const valuse = Resp.data.map((val) => {
            obj[val.key] = val;
        });
        SetCMS(obj);
    };

    return (

        <>
            <BottomBar />
            <Header />

            <div className="innercontent">
                <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
                    <SideTab />
                </div>

                <div className="banner_section is_banner_section">
                    <div className='px-0 inner-container__width'>
                        <Row className='mx-auto'>
                            <Col lg={6} className="px-0">
                                {/* <div className="home_titled hc-home__title head_txt" dangerouslySetInnerHTML={{ __html: CMS["Revolution your Home Ownership"]?.title }} >

                                </div> */}
                                {/* <p
                                    className="mp_detailbrief hc-home__desc desc_txt"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            CMS["Revolution your Home Ownership"]?.content,
                                    }}
                                ></p> */}
                                <div className="home_titled hc-home__title inner_title head_txt"  >
                                    Initial <strong>Sales</strong>
                                </div>
                                <p
                                    className="mp_detailbrief hc-home__desc desc_txt"
                                >
                                    During our initial sales phase, you have the unique opportunity to choose how many shares of a specific property you want to buy. But don't wait too long—these shares are limited, and demand is high. Secure your stake now before others claim the best opportunities!
                                </p>
                            </Col>
                            <Col lg={6} className="px-0">
                                {CMS["Initial Sales"]?.img &&
                                    <div className="anim_div first_lottie is-banner__lottie h-100">
                                        <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["Initial Sales"]?.img}`} className="banner_lottie" />
                                    </div>}
                                {/* <div className="anim_div" >

                                    <LottieAnimation url="https://api-homecubes.maticz.in/cmsimg/1710487245765.json" className="banner_lottie" />
                                </div> */}
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className='bottom_content'>
                    <div className='mp_inner--bottom'>
                        <div className='px-0 inner-container__width'>
                            <div className="">
                                <p className='home_titled hc-home__title inner_title head_txt mp_bottom--title'>Buy Now on Initial <strong>Sales !</strong></p>
                            </div>

                            {project?.length != 0 &&
                                <div className='mp-grid'>
                                    {/* <div className='red'>

                                        <div className='red_inner'></div>
                                    </div>

                                    <div className='gree'></div>
                                    <div className='yello'></div>
                                    <div className='blue'></div> */}

                                    {project?.length != 0 && project?.map((val) => {
                                        return (

                                            <div className="nft-card">
                                                <div className='nft-card__a'>
                                                    <NavLink
                                                        className=""
                                                        to={{ pathname: `/mint/${val._id}` }}

                                                        // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                                        // to={((new Date(val.unlockAt) < new Date()) && (val.isAvailable != 0)) ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                                        state={val}>
                                                        <img className="" src={`${config.IMG_URL}/projects/ProjectThumbnail/${val.ProjectThumbnail}`} />
                                                    </NavLink>
                                                </div>

                                                {/* {new Date() < new Date(val.unlockAt) ?
          <div className="timerrr_counter">

            <Countdown
              date={val.duration}
            />
          </div> : <></>} */}

                                                <div className="nft-card__content">
                                                    <p className="nft-card__content-title">
                                                        {val.projectTitle}
                                                    </p>
                                                    <div className='d-flex align-items-center gap-3 justify-content-between nft-card__values-wrapper'>

                                                        <p className="nft-card__content-values">
                                                            Total Supply : {val.maxNFTs}
                                                        </p>
                                                        <p className="nft-card__content-values">
                                                            Minted NFT's : {val.isMinted}
                                                        </p>
                                                    </div>

                                                    {/* <p className="nft_name">
          Locked NFT : {val.locked}
        </p> */}

                                                    <div className='nft-card__content-currency'>
                                                        <p className="nft-card__content-values">
                                                            {val.NFTPrice} {"  "}
                                                            <span className="">
                                                                {val.mintTokenName}
                                                            </span>
                                                        </p>

                                                    </div>

                                                    <div className="nft-card__content-buttons">

                                                        {new Date() < new Date(val.unlockAt) ?
                                                            // <div className="timerrr_counter">
                                                            <button className='nft-card__buttons--countdown'>
                                                                <Countdown
                                                                    date={val.duration}
                                                                />
                                                            </button>

                                                            // </div>
                                                            :
                                                            <NavLink
                                                                className="text-decoration-none"
                                                                // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                                                to={{ pathname: `/mint/${val._id}` }}
                                                                // to={val.isAvailable != 0 ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                                                state={val}>
                                                                <button className='nft-card__buttons--gradient d-flex align-items-center justify-content-between w-100'>
                                                                    <p>Buy now on initial sales</p>
                                                                    <div className='nft-card__buttons-gradientCart'>
                                                                        <img src={cartIcon} className='' />
                                                                    </div>
                                                                </button>
                                                            </NavLink>
                                                        }

                                                        {/* {(new Date(val.unlockAt) < new Date()) && <NavLink
            className="sidetab_link"
            // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
            to={{ pathname: `/mint/${val._id}` }}
            // to={val.isAvailable != 0 ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
            state={val}>
            <button className='nftinfo_gradeientBtn pc_buyBtn me-3'>Buy</button>
          </NavLink>

          } */}
                                                        {/* <NavLink className="sidetab_link"
            // to={{ pathname: `/mintNFTs/${val._id}` }}
            // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
            // to={val.isAvailable != 0 ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
            // state={val}
            to={{ pathname: `/projectInfo/${val.projectTitle}` }}
            state={{ projectInfo: JSON.stringify(val) }}
          >
            <p style={{ padding: "8px 10px", width: "100%" }} className="viewMore ">View More</p>
          </NavLink> */}
                                                    </div>
                                                </div>
                                            </div >

                                        )
                                    })

                                    }

                                    {/* <div className='loadmore_holder mt-5'>
<button className="seconday_btn width_fitter" >Loadmore</button>
</div> */}
                                </div>
                            }
                            {!project?.length != 0 && <div className='d-flex justify-content-center'>
                                <p className='nft-card__noData'>No data Found</p>
                            </div>}

                            <div className='mp-margin d-flex justify-content-center'>
                                <button className='button-loadMore'>Load More</button>
                            </div>

                        </div >
                    </div>
                </div >

            </div >
            <div ref={footerRef}>
                <Footer />
            </div>
        </ >
    )
}

export default MintProjects



