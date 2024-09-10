import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { getCmsContent } from '../actions/axioss/cms.axios'

function Footer() {
    const [footerCon, setFooterCon] = useState({})

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
            <Container fluid className='footer pi_higherTop'>
                <Container className='custom_container footer_topborder'>
                    <img className='footer_backbg' src={require('../assets/images/footerbg.svg').default} />
                    <Row className='footer_row'>
                        <Col lg={6} md={6} sm={12} xs={12} className='footer_left'>

                            <img className='footer_logo' src={require('../assets/images/logo.svg').default} />
                            <p className='footer_brief' dangerouslySetInnerHTML={{ __html: footerCon?.content }} ></p>
                            <div className='footer_social mt-4'>
                                <img className='footer_sociallinks' src={require('../assets/images/vtele.svg').default} />
                                <img className='footer_sociallinks' src={require('../assets/images/vtwitter.svg').default} />
                                <img className='footer_sociallinks' src={require('../assets/images/vinsta.svg').default} />
                                <img className='footer_sociallinks' src={require('../assets/images/vdiscard.svg').default} />
                            </div>

                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12} className='footer_right'>
                            <div className='footer_right_detail'>
                                <h3 className='footer_right_title'>Quick Access</h3>
                                <div className='footer_linkwrapper'>
                                    <ul>
                                        <NavLink className="sidetab_link" to='/'>
                                            <li className='footer_links'>Launch App</li>
                                        </NavLink>
                                        <NavLink className="sidetab_link" to='/howitworks'>
                                            <li className='footer_links'>How it works ?</li>
                                        </NavLink>
                                        <NavLink className="sidetab_link" to='/roadmap'>
                                            <li className='footer_links'>Road Map</li>
                                        </NavLink>
                                        <NavLink className="sidetab_link" to='/'>
                                            <li className='footer_links'>Learning Center</li>
                                        </NavLink>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    )
}

export default Footer