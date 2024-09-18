import React from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import { Container, Row, Col } from 'react-bootstrap'
import SideTab from '../Components/SideTab'
import { NavLink } from 'react-router-dom'
import Footer from '../Components/Footer'
import { getCurrentProject } from '../actions/axioss/nft.axios'
import { useState } from 'react'
import { useEffect } from 'react';
import config from '../config/config';
import Countdown from "react-countdown";
import LottieAnimation from '../Components/LottieAnimar'
import cartIcon from '../assets/images/cart.svg'

function MintProjects() {

  const [project, setProject] = useState([])

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

  return (
    <div className='mintpage'>
      <BottomBar />
      <Header />
      <Container fluid className="pt-3 home_wrapper over_hidercon hc-section">
        <Container className="custom_container ">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />

            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner">
              {/* initialsaletop */}
              <Row className="justify-content-between align-items-center hc-banner__top">
                <Col lg={6} md={6} sm={12} xs={12} className="mb-3">
                  <div className="home_bannerleft">
                    <div className="home_titled hc-home__title mt-3" >
                      <p>Initial <strong>Sales</strong></p>
                    </div>
                    <p className="mp_detailbrief hc-home__desc mt-3">
                      During our initial sales phase, you have the unique opportunity
                      to choose how many shares of a specific property you want to buy.
                      But don't wait too long—these shares are limited, and demand is high.
                      Secure your stake now before others claim the best opportunities!
                    </p>

                  </div>
                </Col>
                <Col
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-center mb-3"
                >


                  {/* <div className="anim_div" data-aos="fade-up"
                    data-aos-offset="100"
                    data-aos-duration="800">

                    <LottieAnimation url="https://api-homecubes.maticz.in/cmsimg/1710487245765.json" className="banner_lottie" />
                  </div> */}
                </Col>
              </Row>
              <div className='mintProject_holder mt-5'>
                <div className="home_titled hc-home__title hc-position__center mt-3">
                  <p>Buy Now on Initial <strong>Sales !</strong></p>
                </div>
                <Row className='hc-margin__top-50px'>
                  {project?.length != 0 ? project?.map((val) => {
                    return (
                      <Col xl={3} lg={4} md={6} sm={6} xs={12} className='mb-4 d-flex justify-content-center justify-content-sm-start'>
                        <div className="nft_card hc-card__nft">
                          <div className={"projectcard_wrapper_sep"}>
                            <NavLink
                              className="sidetab_link"
                              to={{ pathname: `/mint/${val._id}` }}

                              // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                              // to={((new Date(val.unlockAt) < new Date()) && (val.isAvailable != 0)) ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                              state={val}>
                              <img className="img-fluid projectcard_img" src={`${config.IMG_URL}/projects/ProjectThumbnail/${val.ProjectThumbnail}`} />
                            </NavLink>
                            {/* {new Date() < new Date(val.unlockAt) ?
                              <div className="timerrr_counter">

                                <Countdown
                                  date={val.duration}
                                />
                              </div> : <></>} */}
                          </div>
                          <div className="nftcard_detailwrapper">
                            <p className="nft_name  hc-nft__card-title minhset">
                              {val.projectTitle}
                            </p>
                            <div className='row mt-2'>
                              <div className='col-6'>
                                <p className="nft_name mons hc-nft__card-details">
                                  Total Supply : {val.maxNFTs}
                                </p>
                              </div>
                              <div className='col-6'>
                                <p className="nft_name mons hc-nft__card-details text-end">
                                  Minted NFT's : {val.isMinted}
                                </p>
                              </div>
                            </div>

                            {/* <p className="nft_name">
                              Locked NFT : {val.locked}
                            </p> */}

                            <div className='counter_aligner mt-2'>
                              <p className="nft_coinname mons hc-nft__card-details">
                                {val.NFTPrice} {"  "}
                                <span className="floor_prize">
                                  {val.mintTokenName}
                                </span>
                              </p>

                            </div>

                            <div className="projectcard_foot mt-3 ">

                              {new Date() < new Date(val.unlockAt) ?
                                // <div className="timerrr_counter">
                                <button className='hc-nft__card-timer'>
                                  <Countdown
                                    date={val.duration}
                                  />
                                </button>

                                // </div>
                                :
                                <NavLink
                                  className="sidetab_link w-100"
                                  // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                  to={{ pathname: `/mint/${val._id}` }}
                                  // to={val.isAvailable != 0 ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                  state={val}>
                                  <button className='nftinfo_gradeientBtn pc_buyBtn hc-button___gradient'><p>Buy now on initial sales</p> <div className='hc-border__left'>
                                    <img src={cartIcon} className='img-fluid' /></div></button>
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
                        </div>
                      </Col>
                    )
                  })
                    : <div>
                      <p className='text-white text-center'>No data Found</p>
                    </div>
                  }

                  {/* <div className='loadmore_holder mt-5'>
                    <button className="seconday_btn width_fitter" >Loadmore</button>
                  </div> */}
                </Row>
              </div>

            </Col>
          </Row>
        </Container>
        <Footer />
      </Container>
      <div className="gradient_holder staking_gradholder mintgrad"></div>
    </div>
  )
}

export default MintProjects