import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Lottie from "lottie-react";
import ConceptLottie from '../assets/lotties/concept.json'
import UIUX from '../assets/lotties/uiux.json'
import Development from '../assets/lotties/dev.json'
import MainWebsite from '../assets/lotties/website.json'
import CollectorLottie from '../assets/lotties/collection.json'
import config from '../config/config'

function Roadmap(props) {
    console.log("daatatata", props.data);
    return (
        // <>
        //     <Row className=''>


        //         <Col lg={4} xs={4} className='d-flex'>
        //             <div className='home_roadmapSingle'>
        //                 <h1 className='roadmap_strokeText'>1</h1>
        //                 <div className=''>
        //                     <p className='roadmap_rightText'>Concept Development</p>
        //                     <p className='roadmap_date'>March 2022</p>
        //                 </div>
        //             </div>
        //         </Col>
        //         <Col lg={4} xs={4}>
        //             <img className='img-fluid roadmap_firstimg' src={require('../assets/images/roadmapfirst.svg').default} />
        //         </Col>
        //         <Col lg={4} xs={4}>
        //             <Lottie animationData={ConceptLottie} className='roadmap_lottie search_lottie' loop={true} />
        //         </Col>

        //         <Col lg={4} xs={4} className='d-flex justify-content-center'>
        //             <Lottie animationData={UIUX} className='uiux_lottie roadmap_lottie' loop={true} />
        //         </Col>
        //         <Col lg={4} xs={4}>
        //             <img className='img-fluid roadmap_leftimg' src={require('../assets/images/roadmapleft.svg').default} />
        //         </Col>
        //         <Col lg={4} xs={4} className='d-flex'>
        //             <div className='home_roadmapSingle'>
        //                 <h1 className='roadmap_strokeText'>2</h1>
        //                 <div className=''>
        //                     <p className='roadmap_rightText'>UI'UX Development</p>
        //                     <p className='roadmap_date'>November 2022</p>
        //                 </div>
        //             </div>
        //         </Col>


        //         <Col lg={4} xs={4} className='d-flex'>
        //             <div className='home_roadmapSingle'>
        //                 <h1 className='roadmap_strokeText'>3</h1>
        //                 <div className=''>
        //                     <p className='roadmap_rightText'>Platform Development</p>
        //                     <p className='roadmap_date'>December 2022</p>
        //                 </div>
        //             </div>
        //         </Col>
        //         <Col lg={4} xs={4} className='d-flex justify-content-center'>
        //             <img className='img-fluid roadmap_centerimg' src={require('../assets/images/roadmapcenter.svg').default} />
        //         </Col>
        //         <Col lg={4} xs={4} className='d-flex justify-content-center'>
        //             <Lottie animationData={Development} className='development_Lottie roadmap_lottie' loop={true} />
        //         </Col>


        //         <Col lg={4} xs={4} className='d-flex justify-content-center'>
        //             <Lottie animationData={MainWebsite} className='website_lottie roadmap_lottie' loop={true} />
        //         </Col>
        //         <Col lg={4} xs={4}>
        //             <img className='img-fluid roadmap_leftimg' src={require('../assets/images/roadmapleft.svg').default} />
        //         </Col>
        //         <Col lg={4} xs={4} className='d-flex'>
        //             <div className='home_roadmapSingle'>
        //                 <h1 className='roadmap_strokeText'>4</h1>
        //                 <div className=''>
        //                     <p className='roadmap_rightText'>Main website Launch</p>
        //                     <p className='roadmap_date'>June 2023</p>
        //                 </div>
        //             </div>
        //         </Col>

        //         <Col lg={4} xs={4} className='d-flex'>
        //             <div className='home_roadmapSingle'>
        //                 <h1 className='roadmap_strokeText'>5</h1>
        //                 <div className=''>
        //                     <p className='roadmap_rightText'>First Collection Launch</p>
        //                     <p className='roadmap_date'>January 2022</p>
        //                 </div>
        //             </div>
        //         </Col>
        //         <Col lg={4} xs={4}>
        //             <img className='img-fluid roadmap_lastimg' src={require('../assets/images/roadmaplast.svg').default} />
        //         </Col>
        //         <Col lg={4} xs={4}>
        //             <Lottie animationData={CollectorLottie} className='collection_lottie roadmap_lottie' loop={true} />
        //         </Col>
        //     </Row>
        // </>

        <>
            <Row className=''>

                {props?.data?.length != 0 && props?.data?.map((val, i) => {
                    console.log("lastststindwex", props?.data?.length - 1);
                    const lastIndex = props?.data?.length - 1
                    return (
                        <>
                            {i == 0 && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                                <div className='home_roadmapSingle'>
                                    <h1 className='roadmap_strokeText'>{i + 1}</h1>
                                    <div className=''>
                                        <p className='roadmap_rightText'>{val.stepTitle ?? val.title}</p>
                                        {val.stepDescription ? <p className='roadmap_date'>{val.stepDescription}</p> : <p className='roadmap_date' dangerouslySetInnerHTML={{ __html: val.content }} ></p>}
                                    </div>
                                </div>
                            </Col>}
                            {i == 0 && <Col lg={4} xs={4}>
                                <img className='img-fluid roadmap_firstimg' src={require('../assets/images/roadmapfirst.svg').default} />
                            </Col>}
                            {i == 0 && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                                {val.stepImage ?
                                    <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/projects/steps/${val.stepImage}`} /> :
                                    <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />}
                            </Col>}

                            {(i != 0) && (i % 2 != 0) && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                                {val?.stepImage ?
                                    <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/projects/steps/${val.stepImage}`} /> :
                                    <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />
                                }
                            </Col>}

                            {(i != lastIndex) && (i != 0) && (i % 2 != 0) && <Col lg={4} xs={4}>
                                <img className='img-fluid roadmap_leftimg' src={require('../assets/images/roadmapleft.svg').default} />
                            </Col>}

                            {(lastIndex != 0) && (i == lastIndex) && (i % 2 !== 0) && <Col lg={4} xs={4}>
                                <img className='img-fluid roadmap_lastimg' src={require('../assets/images/roadmaplastleft.svg').default} />
                            </Col>}

                            {(i != 0) && (i % 2 != 0) && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                                <div className='home_roadmapSingle'>
                                    <h1 className='roadmap_strokeText'>{i + 1}</h1>
                                    <div className=''>
                                        <p className='roadmap_rightText'>{val.stepTitle ?? val.title}</p>
                                        {val.stepDescription ? <p className='roadmap_date'>{val.stepDescription}</p> : <p className='roadmap_date' dangerouslySetInnerHTML={{ __html: val.content }} ></p>}
                                    </div>
                                </div>
                            </Col>}


                            {(i != 0) && (i % 2 === 0) && <Col lg={4} xs={4} className='d-flex justify-content-center align-items-center'>
                                <div className='home_roadmapSingle'>
                                    <h1 className='roadmap_strokeText'>{i + 1}</h1>
                                    <div className=''>
                                        <p className='roadmap_rightText'>{val.stepTitle ?? val.title}</p>
                                        {val.stepDescription ? <p className='roadmap_date'>{val.stepDescription}</p> : <p className='roadmap_date' dangerouslySetInnerHTML={{ __html: val.content }} ></p>}

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
                                {val.stepImage ?
                                    <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/projects/steps/${val.stepImage}`} /> :
                                    <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />
                                }
                            </Col>}

                        </>
                    )
                })

                }
            </Row>
        </>
    )
}

export default Roadmap