import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'

function BottomBar() {

    const location = useLocation().pathname;

    const isHome = location == "/"
    const isInitialSale = location == '/minting' || location.includes("/mint/")
    const isMarketPlace = location == "/marketplace" || location.includes("/CollectionNfts/") || location.includes("/nftInfo/")
    const isStake = location.includes("/staking")
    const isProject = location == "/projects" || location.includes("/projectInfo/") || location.includes("/collectionInfo")

    return (
        <>
            <div className='bottomBar'>
                <Container >
                    <div className='d-flex justify-content-between align-items-center'>
                        {/* <NavLink to="/" className="sidetab_link">
                            <div className='bottombar_single'>
                                <img className='bottombar_img' src={require('../assets/images/home.svg').default} />
                                <p className='bottombar_label bottombar_alignlabel'>App</p>
                            </div>
                        </NavLink> */}
                        <NavLink to="/minting" className={`sidetab_link ${isInitialSale ? "active" : ""}`}>
                            <div className='bottombar_single'>
                                <img className='bottombar_img' src={isInitialSale ? require('../assets/images/initial_white.svg').default : require('../assets/images/initial_green.svg').default} />
                                <p className={isInitialSale ? "bottombar_label whites mt-1 bottombar_alignlabel" : 'bottombar_label mt-1 bottombar_alignlabel'}>Initial Sales</p>
                            </div>
                        </NavLink>
                        <NavLink to="/marketplace" className={`sidetab_link ${isMarketPlace ? "active" : ""}`}>
                            <div className='bottombar_single'>
                                <img className='bottombar_img' src={isMarketPlace ? require('../assets/images/marketplace_active.svg').default : require('../assets/images/marketplace_greens.svg').default} />
                                <p className={isMarketPlace ? "bottombar_label whites mt-1 bottombar_alignlabel" : 'bottombar_label mt-1 bottombar_alignlabel'}>Marketplace</p>
                            </div>
                        </NavLink>
                        <NavLink to="/staking" className={`sidetab_link ${(isStake ? "active" : "")}`}>
                            <div className='bottombar_single'>
                                <img className='bottombar_img' src={isStake ? require('../assets/images/claimincome_active.svg').default : require('../assets/images/claim_green.svg').default} />
                                <p className={isStake ? "bottombar_label whites mt-1 bottombar_alignlabel" : 'bottombar_label mt-1 bottombar_alignlabel'}>Claim Income</p>

                            </div>
                        </NavLink>
                        <NavLink to="/projects" className={`sidetab_link ${isProject ? "active" : ""}`}>
                            <div className='bottombar_single'>
                                <img className='bottombar_img' src={isProject ? require('../assets/images/property_white.svg').default : require('../assets/images/property_green.svg').default} />
                                <p className={isProject ? "bottombar_label whites mt-1 bottombar_alignlabel" : 'bottombar_label mt-1 bottombar_alignlabel'}>Properties</p>
                            </div>
                        </NavLink>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default BottomBar