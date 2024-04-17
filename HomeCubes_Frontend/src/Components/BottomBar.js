import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function BottomBar() {
  return (
    <>
    <Container fluid className='bottomBar'>
        <Container className='custom_container'>
        <Row>
            <Col xs={3}>
            <NavLink to="/minting" className="sidetab_link">
                <div className='bottombar_single'>
                    <img className='bottombar_img' src={require('../assets/images/minting.svg').default}/>
                    <p className='bottombar_label bottombar_alignlabel'>Minting</p>
                </div>
                </NavLink>
            </Col>
            <Col xs={3}>
            <NavLink to="/staking" className="sidetab_link">
                <div className='bottombar_single'>
                    <img className='bottombar_img' src={require('../assets/images/staking.svg').default}/>
                    <p className='bottombar_label'>Staking & Rewards</p>
                </div>
                </NavLink>
            </Col>
            <Col xs={3}>
            <NavLink to="/projects" className="sidetab_link">
                <div className='bottombar_single'>
                    <img className='bottombar_img' src={require('../assets/images/projects.svg').default}/>
                    <p className='bottombar_label bottombar_alignlabel'>Projects</p>
                </div>
                </NavLink>
            </Col>
            <Col xs={3}>
                <NavLink to="/marketplace" className="sidetab_link">
                <div className='bottombar_single'>
                    <img className='bottombar_img' src={require('../assets/images/marketplace.svg').default}/>
                    <p className='bottombar_label'>Market Place</p>
                </div>
                </NavLink>
            </Col>
        </Row>
        </Container>
    </Container>
    </>
  )
}

export default BottomBar