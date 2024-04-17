import React from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import { Container, Row, Col } from 'react-bootstrap'
import SideTab from '../Components/SideTab'
import { NavLink, useParams, useLocation } from 'react-router-dom'
import Footer from '../Components/Footer'
import { useEffect } from 'react'
import { getCurrentProject } from '../actions/axioss/nft.axios'
import { useState } from 'react';
import config from '../config/config'
import Countdown from 'react-countdown';
import Typewriter from "typewriter-effect";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from 'swiper/modules'
import DataCard from '../Components/DataCard'

function MintNFTCards() {

  const { _id } = useParams();
  const localtion = useLocation()
  const [project, setProject] = useState([])
  const [disable, setDisable] = useState(false)
  const [nftcardData, setNftcardData] = useState([])


  console.log("_id_id_id", _id);

  const { state, path } = localtion;
  console.log("state_____", state);
  useEffect(() => {
    getProjects()
  }, []);

  const getProjects = async () => {

    const getPro = await getCurrentProject({ action: "getNfts", _id, skip: project?.length, limit: 6 })
    console.log("getNftsss", getPro);

    if (getPro.success == "success") {
      setProject([...project, ...getPro.data ?? []])
      if (getPro.data.length == 0 || getPro.data.length < 6) setDisable(true)
    } else setDisable(true);
  }

  return (
    <>
      <BottomBar />
      <Header />
      <Container fluid className="pt-3 home_wrapper over_hidercon">
        <Container className="custom_container ">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />

            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner">
              <div className=' mt-5'>

                <h3 className="projects_title">{state?.projectTitle}</h3>
                <p className="mp_detailbrief widthen_text">
                  {state?.projectDescription}
                </p>
                <hr className="projects_hr" />

                <Row>
                  <Col lg={5} md={6} sm={6} xs={12}>
                    <div className="">
                      <div className="mp_collectionDetail mb-2">
                        <p className="mp_collectionLabel">Number of NFTs :</p>
                        <p className="mp_collectionValue">
                          {state?.maxNFTs}
                        </p>
                      </div>
                      <div className="mp_collectionDetail mb-2">
                        <p className="mp_collectionLabel">
                          Minted NFTs :
                        </p>
                        <p className="mp_collectionValue">
                          {state?.isMinted}
                        </p>
                      </div>
                      {/* <div className="mp_collectionDetail mb-2">
                        <p className="mp_collectionLabel">
                          Number of Non-Staked NFTs :
                        </p>
                        <p className="mp_collectionValue">
                          24
                        </p>
                      </div> */}
                    </div>
                  </Col>
                  <Col lg={7} md={6} sm={6} xs={12}>
                    <div className="">
                      <div className="mp_collectionDetail mb-2">
                        <p className="mp_collectionLabel">
                          Available NFTs for mint :
                        </p>
                        <p className="mp_collectionValue">
                          {state?.isNotMinted}
                        </p>
                      </div>
                      {/* <div className="mp_collectionDetail mb-2">
                        <p className="mp_collectionLabel">Number of Projects :</p>
                        <p className="mp_collectionValue">
                          {1}
                        </p>
                      </div> */}
                    </div>
                  </Col>
                </Row>
                <Row className='mt-5'>

                  {project?.length != 0 && project.map((val) => {

                    return (
                      <Col lg={4} md={6} sm={6} xs={12} className='mb-4'>
                        <div className="nft_card">
                          <div className={new Date() < new Date(val.UnlockAt) ? "nftcard_imgwrapper" : "nftcard_imgwrapper_sep"}>

                            {new Date() < new Date(val.UnlockAt) ?
                              <div>

                                <img className="img-fluid nftImg" src={`${config.IMG_URL}/nft/${val.NFTCreator}/Original/${val.NFTOrginalImage}`} />
                                {new Date() < new Date(val.UnlockAt) ?
                                  <div className="timerrr_counter">

                                    <Countdown
                                      date={val.UnlockAt}
                                      onComplete={() => window.location.reload()}
                                    />
                                  </div> : <></>}

                              </div>
                              :
                              <NavLink
                                to={`/mint/${val.projectId}`}
                                state={val}
                              >

                                <img className="img-fluid nftImg" src={`${config.IMG_URL}/nft/${val.NFTCreator}/Original/${val.NFTOrginalImage}`} />
                                {new Date() < new Date(val.UnlockAt) ?
                                  <div className="timerrr_counter">

                                    <Countdown
                                      date={val.UnlockAt}
                                      onComplete={() => window.location.reload()}
                                    />
                                  </div> : <></>}

                              </NavLink>
                            }


                          </div>
                          <div className="nftcard_detailwrapper">
                            <p className="nft_name">{val?.NFTName}</p>
                            <div className="nftcard_coin">
                              <img className="nft_coinImg" src={require('../assets/images/bnbcoin.svg').default} />
                              <p className="nft_coinname">
                                {val.NFTPrice}  {val.CollectionNetwork}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )
                  })}

                  {!disable && <div className='loadmore_holder mt-5'>
                    <button className="seconday_btn width_fitter" onClick={() => getProjects()} >Loadmore</button>
                  </div>}
                </Row>
              </div>
            </Col>
          </Row >
        </Container >
        <Footer />
      </Container >

    </>
  )
}

export default MintNFTCards