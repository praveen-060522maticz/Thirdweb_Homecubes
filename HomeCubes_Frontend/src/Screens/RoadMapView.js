import React, { useEffect, useState } from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import SideTab from '../Components/SideTab'
import { Container, Row, Col } from 'react-bootstrap'
import Roadmap from '../Components/Roadmap'
import AOS from "aos";
import Footer from '../Components/Footer'
import BreadPath from '../Components/BreadPath'
import { getCmsContent } from '../actions/axioss/cms.axios';
import config from '../config/config'

function RoadMapView() {
  useEffect(() => {
    AOS.init({ mirror: "true" });
    AOS.refresh();
    window.scroll(0, 0)
  }, [])
  const [roadMap, setRoadMap] = useState([]);
  const [description, setDescription] = useState("")

  useEffect(() => {
    getCmsContentFunc()
  }, [])

  const getCmsContentFunc = async () => {
    const Resp = await getCmsContent({ page: ["HomeCubes Road Map"] });
    console.log("sejhfgeiusf", Resp);
    setRoadMap(Resp?.data?.filter((val) => val.title != "description") ?? [])
    setDescription(Resp?.data?.filter((val) => val.title == "description")?.[0]?.content)
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
              <h3 className="inhowit_title mt-5">HomeCubes Road Map</h3>
              <p className="markeplace_hint mt-3" dangerouslySetInnerHTML={{ __html: description }} ></p>

              <Row className='pi_higherTop'>
                <h3 className="home_titled text-center" data-aos="fade-up" data-aos-offset="100" data-aos-duration="800">Road Map</h3>
                <div className="hc-home__roadmap--content">
                  <Roadmap data={roadMap} />
                </div>
                {/* {roadMap?.length != 0 && roadMap?.map((val, i) => {
                  console.log("vaalalalalalalalal", val, i, (i != 0), (i % 2 != 0));
                  console.log("lastststindwex", roadMap?.length - 1);
                  const lastIndex = roadMap?.length - 1
                  return (
                    <>
                      {i == 0 && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                        <div className='home_roadmapSingle'>
                          <h1 className='roadmap_strokeText'>{val.position}</h1>
                          <div className=''>
                            <p className='roadmap_rightText'>{val.title}</p>
                            <p className='roadmap_date' dangerouslySetInnerHTML={{ __html: val.content }} ></p>
                          </div>
                        </div>
                      </Col>}
                      {i == 0 && <Col lg={4} xs={4}>
                        <img className='img-fluid roadmap_firstimg' src={require('../assets/images/roadmapfirst.svg').default} />
                      </Col>}
                      {i == 0 && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                        <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />
                      </Col>}

                      {(i != 0) && (i % 2 != 0) && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                        <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />
                      </Col>}

                      {(i != lastIndex) && (i != 0) && (i % 2 != 0) && <Col lg={4} xs={4}>
                        <img className='img-fluid roadmap_leftimg' src={require('../assets/images/roadmapleft.svg').default} />
                      </Col>}

                      {(lastIndex != 0) && (i == lastIndex) && (i % 2 !== 0) && <Col lg={4} xs={4}>
                        <img className='img-fluid roadmap_lastimg' src={require('../assets/images/roadmaplastleft.svg').default} />
                      </Col>}

                      {(i != 0) && (i % 2 != 0) && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                        <div className='home_roadmapSingle'>
                          <h1 className='roadmap_strokeText'>{val.position}</h1>
                          <div className=''>
                            <p className='roadmap_rightText'>{val.title}</p>
                            <p className='roadmap_date' dangerouslySetInnerHTML={{ __html: val.content }} ></p>
                          </div>
                        </div>
                      </Col>}


                      {(i != 0) && (i % 2 === 0) && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                      <div className='home_roadmapSingle'>
                          <h1 className='roadmap_strokeText'>{val.position}</h1>
                          <div className=''>
                            <p className='roadmap_rightText'>{val.title}</p>
                            <p className='roadmap_date' dangerouslySetInnerHTML={{ __html: val.content }} ></p>
                          </div>
                        </div>
                      </Col>}
                      {(i != lastIndex) && (i != 0) && (i % 2 === 0) && <Col lg={4} xs={4} className='d-flex justify-content-center'>
                        <img className='img-fluid roadmap_centerimg' src={require('../assets/images/roadmapcenter.svg').default} />
                      </Col>}

                      {(lastIndex != 0) && (i == lastIndex) && (i % 2 === 0) && <Col lg={4} xs={4}>
                        <img className='img-fluid roadmap_lastimg' src={require('../assets/images/roadmaplast.svg').default} />
                      </Col>}



                      {(i != 0) && (i % 2 === 0) && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                        <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />
                      </Col>}

                    </>
                  )
                })

                } */}
              </Row>
            </Col>
          </Row>
        </Container>
        <Footer />
      </Container>
    </>
  )
}

export default RoadMapView