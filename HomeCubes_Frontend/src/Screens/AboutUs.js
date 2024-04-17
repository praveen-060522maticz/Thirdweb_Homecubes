import React, { useState, useEffect } from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import { Container, Row, Col } from 'react-bootstrap'
import SideTab from '../Components/SideTab'
import Lottie from "lottie-react";
import StakeNFT from '../assets/lotties/stakenft.json'
import Invest from '../assets/lotties/invest.json'
import Repeat from '../assets/lotties/repeat.json'
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from '../Components/Footer'
import Faq from '../Components/Faq'
import BreadPath from '../Components/BreadPath'
import { aboutFunctions, faqFunctions, getFaqcontentList } from '../actions/axioss/user.axios';
import config from '../config/config'

function AboutUs() {

  const [description, setDescription] = useState(false);
  const [faqArr, setFaqArr] = useState([]);
  const [aboutCon, setAboutCon] = useState({})
  const desc = [
    {
      descText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
  ];

  useEffect(() => {
    AOS.init({ mirror: "true" });
    AOS.refresh();
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    getFaqList()
  }, [])

  const getFaqList = async () => {
    const Resp = await faqFunctions({ action: "all" });
    console.log("resserser", Resp);
    setFaqArr(Resp?.data ?? [])

    const aboutResp = await aboutFunctions({});
    console.log("aboutRespaboutResp", aboutResp);
    setAboutCon(aboutResp?.data[0] ?? {})
  }

  return (
    <>
      <BottomBar />
      <Header />
      <Container fluid className="pt-3 home_wrapper">
        <Container className="custom_container">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className='res_pad_aligner'>
              <BreadPath />
              <h3 className="inhowit_title mt-5">{aboutCon?.title}</h3>
              <p className="markeplace_hint mt-3" dangerouslySetInnerHTML={{ __html: aboutCon?.content }} ></p>
              {/* <p className="markeplace_hint mt-3">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </p>
              <p className="markeplace_hint mt-3">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </p> */}
              <div className='pi_higherTop'>
                <h3 className="inhowit_title  text-center">Three Simple Steps</h3>
                <p className="markeplace_hint text-center mt-3">Invest / Earn / Repeat</p>
              </div>

              <Row className='mt-5 justify-content-center'>
                {aboutCon?.steps && aboutCon?.steps?.length != 0 &&
                  aboutCon?.steps?.map((val) => {

                    return (
                      <Col lg={4} md={6} sm={6} xs={12} className='mb-3'>
                        <div className='inhowit_stepcard'>
                          {/* <Lottie animationData={Invest} className='stepcard_lottie' loop={true} /> */}
                          <div className='step_img_center_dev' >
                            <img className='step_img' src={`${config.IMG_URL}/aboutus/steps/${val.stepImage}`} />
                          </div>
                          <p className='stepcard_title mt-4'>{val.stepTitle}</p>
                          {/* {desc.map((i) => (
                            <>
                              {description ? ( */}
                          <p className="mp_detailbrief howit_scrollText mt-3">
                            {val.stepContent}
                          </p>
                          {/* ) : (
                                <p className="mp_detailbrief howit_scrollText mt-3">
                                  {i.descText.length > 150
                                    ? i.descText.slice(0, 150).concat("...")
                                    : i.descText}
                                </p>
                              )}
                            </>
                          ))} */}
                          {/* <button
                            className="mp_readmoreBtn readmore_left mt-4"
                            onClick={() => setDescription(!description)}
                          >
                            {description ? "Read Less" : "Read More"}
                          </button> */}
                        </div>
                      </Col>
                    )
                  })
                }

                {/* <Col lg={4} md={6} sm={6} xs={12} className='mb-3'>
                  <div className='inhowit_stepcard'>
                    <Lottie animationData={StakeNFT} className='stepcard_lottie' loop={true} />
                    <p className='stepcard_title mt-4'>Earn</p>
                    {desc.map((i) => (
                      <>
                        {description ? (
                          <p className="mp_detailbrief howit_scrollText mt-3">
                            {i.descText}
                          </p>
                        ) : (
                          <p className="mp_detailbrief howit_scrollText mt-3">
                            {i.descText.length > 150
                              ? i.descText.slice(0, 150).concat("...")
                              : i.descText}
                          </p>
                        )}
                      </>
                    ))}
                    <button
                      className="mp_readmoreBtn readmore_left mt-4"
                      onClick={() => setDescription(!description)}
                    >
                      {description ? "Read Less" : "Read More"}
                    </button>
                  </div>
                </Col>


                <Col lg={4} md={6} sm={6} xs={12} className='mb-3'>
                  <div className='inhowit_stepcard'>
                    <Lottie animationData={Repeat} className='stepcard_lottie' loop={true} />
                    <p className='stepcard_title mt-4'>Repeat</p>
                    {desc.map((i) => (
                      <>
                        {description ? (
                          <p className="mp_detailbrief howit_scrollText mt-3">
                            {i.descText}
                          </p>
                        ) : (
                          <p className="mp_detailbrief howit_scrollText mt-3">
                            {i.descText.length > 150
                              ? i.descText.slice(0, 150).concat("...")
                              : i.descText}
                          </p>
                        )}
                      </>
                    ))}
                    <button
                      className="mp_readmoreBtn readmore_left mt-4"
                      onClick={() => setDescription(!description)}
                    >
                      {description ? "Read Less" : "Read More"}
                    </button>
                  </div>
                </Col> */}

              </Row>

              <Row className='mt-5'>
                <Col xs={12}>
                  <h3 className="home_titled about_titled text-center" data-aos="fade-up" data-aos-offset="100" data-aos-duration="800">HomeCubes' Revolutioning Real Estate Investment on the ETH Network</h3>
                  <ul className='home_investorList mt-5'>
                    {aboutCon && aboutCon?.investment && aboutCon?.investment?.length != 0 &&
                      aboutCon?.investment?.map((val) => {
                        console.log("valalallalaa",val);
                        return (
                          <li> <img className='home_threecube' src={require('../assets/images/threecube.svg').default} />
                            <p className='home_investorli about_investorli' dangerouslySetInnerHTML={{ __html: val }} ></p>
                          </li>
                        )
                      })
                    }
                  </ul>
                </Col>
              </Row>

              <Row className='my-5'>
                <Col xs={12}>
                  <Faq arrData={faqArr} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <Footer />
      </Container>
    </>
  )
}

export default AboutUs