import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function BottomBar() {
    return (
        <>
            <Container fluid className='bottomBar'>
                <Container className='custom_container'>
                    {/* <Row>
                        <Col xs={3}>
                            <NavLink to="/" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/home.svg').default} />
                                    <p className='bottombar_label bottombar_alignlabel'>App</p>
                                </div>
                            </NavLink>
                        </Col>
                        <Col xs={3}>
                            <NavLink to="/minting" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/minting.svg').default} />
                                    <p className='bottombar_label bottombar_alignlabel'>Minting</p>
                                </div>
                            </NavLink>
                        </Col>
                        <Col xs={3}>
                            <NavLink to="/staking" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/staking.svg').default} />
                                    <p className='bottombar_label'>Claim<br />Income</p>
                                </div>
                            </NavLink>
                        </Col>
                        <Col xs={3}>
                            <NavLink to="/projects" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/projects.svg').default} />
                                    <p className='bottombar_label bottombar_alignlabel'>Projects</p>
                                </div>
                            </NavLink>
                        </Col>
                        <Col xs={3}>
                            <NavLink to="/marketplace" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/marketplace.svg').default} />
                                    <p className='bottombar_label'>Market Place</p>
                                </div>
                            </NavLink>
                        </Col>
                    </Row> */}

                    <div className='d-flex justify-content-between align-items-center'>
                    <NavLink to="/" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/home.svg').default} />
                                    <p className='bottombar_label bottombar_alignlabel'>App</p>
                                </div>
                            </NavLink>


                            <NavLink to="/projects" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/projects.svg').default} />
                                    <p className='bottombar_label bottombar_alignlabel'>Properties</p>
                                </div>
                            </NavLink>

                            <NavLink to="/minting" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/minting.svg').default} />
                                    <p className='bottombar_label bottombar_alignlabel'>Initial Sales</p>
                                </div>
                            </NavLink>

                            <NavLink to="/marketplace" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/marketplace.svg').default} />
                                    <p className='bottombar_label'>Marketplace</p>
                                </div>
                            </NavLink>

                            <NavLink to="/staking" className="sidetab_link">
                                <div className='bottombar_single'>
                                    <img className='bottombar_img' src={require('../assets/images/staking.svg').default} />
                                    <p className='bottombar_label'>Claim<br />Income</p>
                                </div>
                            </NavLink>


                    </div>
                </Container>
            </Container>
        </>
    )
}

export default BottomBar