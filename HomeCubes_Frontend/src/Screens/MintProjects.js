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
              <div className='mintProject_holder mt-5'>
                <Row>
                  {project?.length != 0 ? project?.map((val) => {
                    return (
                      <Col lg={4} md={6} sm={6} xs={12} className='mb-4'>
                        <div className="nft_card">
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
                            <p className="nft_name">
                              {val.projectTitle}
                            </p>

                            <p className="nft_name">
                              Total suply : {val.maxNFTs}
                            </p>
                            <p className="nft_name">
                              Minted NFT : {val.isMinted}
                            </p>

                            {/* <p className="nft_name">
                              Locked NFT : {val.locked}
                            </p> */}

                            <div className='counter_aligner'>
                              <p className="nft_coinname mt-3">
                                {val.NFTPrice} {"  "}
                                <span className="floor_prize">
                                  {config.COIN_NAME}
                                </span>
                              </p>

                            </div>

                            <div className="projectcard_foot mt-2">
                              {(new Date(val.unlockAt) < new Date()) && <NavLink
                                className="sidetab_link"
                                // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                to={{ pathname: `/mint/${val._id}` }}
                                // to={val.isAvailable != 0 ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                state={val}>
                                <button className='nftinfo_gradeientBtn pc_buyBtn me-3'>Buy</button>
                              </NavLink>

                              }
                              <NavLink className="sidetab_link"
                                // to={{ pathname: `/mintNFTs/${val._id}` }}
                                // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                // to={val.isAvailable != 0 ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                // state={val}
                                to={{ pathname: `/projectInfo/${val.projectTitle}` }}
                                state={{ projectInfo: JSON.stringify(val) }}
                              >
                                <p style={{ padding: "8px 10px", width: "100%" }} className="viewMore ">View More</p>
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )
                  })
                    : <div>
                      <p>No data Found</p>
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
    </>
  )
}

export default MintProjects