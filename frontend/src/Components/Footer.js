import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { getCmsContent } from '../actions/axioss/cms.axios';



function Footer() {

    const [footerCon, setFooterCon] = useState({});

    useEffect(() => {
        getCmsContent({
            page: ["footer"],
        }).then((val) => {
            console.log("vallll", val);
            if (val?.status) setFooterCon(val?.data[0] ?? {})
        }).catch((e) => {
            console.log("err o getCmsContent", e);
        })
    }, [])

    return (
        <>
           <div className='footer_all'>
            <div className='footer py-4 py-md-5'>
                <Container>
                    <Row className='footer_row justify-content-between text-center text-md-start'>
                        <Col lg={4} md={6} sm={12} xs={12} className='footer_left mt-3 mt-md-0'>
                            <img className='footer_logo' src={require('../assets/images/logo.svg').default} />
                            <p className='mp_detailbrief hc-home__desc mt-4' dangerouslySetInnerHTML={{ __html: footerCon?.content }} ></p>
                            <div className='footer_social mt-4'>
                                <img className='footer_sociallinks' src={require('../assets/images/vtele.svg').default} />
                                <img className='footer_sociallinks' src={require('../assets/images/vtwitter.svg').default} />
                                <img className='footer_sociallinks' src={require('../assets/images/vinsta.svg').default} />
                                <img className='footer_sociallinks' src={require('../assets/images/footer_youtube.svg').default} />
                            </div>
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12} className='footer_right mt-4 mt-md-0 pe-md-5'>
                            <div className='footer_right_detail'>
                                <h3 className='footer_right_title'>Quick Access</h3>
                                <div className='footer_linkwrapper'>
                                    <ul>
                                        <NavLink className="sidetab_link" to='/minting'>
                                            <li className='footer_links'>Initial Sales</li>
                                        </NavLink>
                                        <NavLink className="sidetab_link" to='/marketplace'>
                                            <li className='footer_links'>Marketplace</li>
                                        </NavLink>
                                        <NavLink className="sidetab_link" to='/staking'>
                                            <li className='footer_links'>Claim Income</li>
                                        </NavLink>
                                        <NavLink className="sidetab_link" to='/projects'>
                                            <li className='footer_links'>All Properties</li>
                                        </NavLink>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    </Row>                 
                </Container>
                </div>
                <Container className='py-4 hc-footer__bottom'>
                <div className='d-flex flex-column flex-md-row align-items-center align-items-center gap-3 justify-content-between'>
                    <p className='mp_detailbrief hc-home__desc'>
                        All rights reserved by Homecubes FZE
                    </p>
                    <div className='d-flex align-items-center gap-4'>
                        <NavLink className="sidetab_link" to='/staking'>
                            <li className='footer_links'>Privacy Policy</li>
                        </NavLink>
                        <NavLink className="sidetab_link" to='/projects'>
                            <li className='footer_links'>Terms of Service</li>
                        </NavLink>
                    </div>
                </div>
            </Container>

            </div>






        </>
    )
}

export default Footer