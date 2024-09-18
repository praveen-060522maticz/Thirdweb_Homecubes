
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


// import Footer from '../Components/Footer'

/* code start */

/* code start */












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

            <div className='innercontent'>
                <SideTab />

                <div className='bottom_content'>
                    <Container>
                        <div className="">
                            <p>Buy Now on Initial <strong>Sales !</strong></p>
                        </div>
                        <Row className=''>
                            {project?.length != 0 ? project?.map((val) => {
                                return (
                                    <Col xl={3} lg={4} md={6} sm={6} xs={12} className=''>
                                        <div className="">
                                            <div className={""}>
                                                <NavLink
                                                    className=""
                                                    to={{ pathname: `/mint/${val._id}` }}

                                                    // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                                    // to={((new Date(val.unlockAt) < new Date()) && (val.isAvailable != 0)) ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                                    state={val}>
                                                    <img className="" src={`${config.IMG_URL}/projects/ProjectThumbnail/${val.ProjectThumbnail}`} />
                                                </NavLink>
                                                {/* {new Date() < new Date(val.unlockAt) ?
                              <div className="timerrr_counter">

                                <Countdown
                                  date={val.duration}
                                />
                              </div> : <></>} */}
                                            </div >
                                            <div className="">
                                                <p className="">
                                                    {val.projectTitle}
                                                </p>
                                                <div className=''>
                                                    <div className=''>
                                                        <p className="">
                                                            Total Supply : {val.maxNFTs}
                                                        </p>
                                                    </div>
                                                    <div className=''>
                                                        <p className="">
                                                            Minted NFT's : {val.isMinted}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* <p className="nft_name">
                              Locked NFT : {val.locked}
                            </p> */}

                                                <div className=''>
                                                    <p className="">
                                                        {val.NFTPrice} {"  "}
                                                        <span className="">
                                                            {val.mintTokenName}
                                                        </span>
                                                    </p>

                                                </div>

                                                <div className=" ">

                                                    {new Date() < new Date(val.unlockAt) ?
                                                        // <div className="timerrr_counter">
                                                        <button className=''>
                                                            <Countdown
                                                                date={val.duration}
                                                            />
                                                        </button>

                                                        // </div>
                                                        :
                                                        <NavLink
                                                            className=""
                                                            // to={new Date(val.unlockAt) < new Date() ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                                            to={{ pathname: `/mint/${val._id}` }}
                                                            // to={val.isAvailable != 0 ? { pathname: `/mintNFTs/${val._id}` } : { pathname: `/mint/${val._id}` }}
                                                            state={val}>
                                                            <button className=''><p>Buy now on initial sales</p> <div className=''>
                                                                <img src={cartIcon} className='' /></div></button>
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
                                    </Col >
                                )
                            })
                                : <div>
                                    <p className=''>No data Found</p>
                                </div>
                            }

                            {/* <div className='loadmore_holder mt-5'>
                    <button className="seconday_btn width_fitter" >Loadmore</button>
                  </div> */}
                        </Row >
                    </Container >
                </div >
            </div >
        </>
    )
}

export default MintProjects