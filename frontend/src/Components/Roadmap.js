import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Lottie from "lottie-react";
import ConceptLottie from '../assets/lotties/concept.json'
import UIUX from '../assets/lotties/uiux.json'
import Development from '../assets/lotties/dev.json'
import MainWebsite from '../assets/lotties/website.json'
import CollectorLottie from '../assets/lotties/collection.json'
import config from '../config/config'
import LottieAnimation from './LottieAnimar';

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
            {/* <Row className='hc-roadmap'>

                {props?.data?.length != 0 && props?.data?.map((val, i) => {
                    console.log("lastststindwex", props?.data?.length - 1);
                    const lastIndex = props?.data?.length - 1
                    return (
                        <>
                            {i == 0 && <Col lg={5} xs={4} className='d-flex justify-content-center align-items-center'>
                                <div className='home_roadmapSingle'>
                                    <h1 className='roadmap_strokeText'>{i + 1}</h1>
                                    <div className=''>
                                        <p className='roadmap_rightText'>{val.stepTitle ?? val.title}</p>
                                        {val.stepDescription ? <p className='roadmap_date'>{val.stepDescription}</p> : <p className='roadmap_date' dangerouslySetInnerHTML={{ __html: val.content }} ></p>}
                                    </div>
                                </div>
                            </Col>}
                            {i == 0 && <Col lg={2} xs={4}>
                                <img className='img-fluid roadmap_firstimg' src={require('../assets/images/roadmapfirst.svg').default} />
                            </Col>}
                            {i == 0 && <Col lg={5} xs={4} className='d-flex justify-content-center align-items-center'>
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
            </Row> */}
{props.length > 0 ?
            <div className='hc-roadmap__new row'>
                {props?.data?.length != 0 && props?.data?.map((val, i) => {
                    console.log("lastststindwex", props?.data?.length - 1);
                    const lastIndex = props?.data?.length - 1
                    return (
                        <>

                            {/* row - 1 */}

                            {i == 0 && <div className='col-5 colpad'>
                                <div className='hc-roadmap__new-col--left roadmap_flex'>
                                    <p className='roadmap_strokeText'>{i + 1}</p>
                                    <div className=''>
                                        <p className='hc-roadmap__new--themeText text-end' dangerouslySetInnerHTML={{ __html: val.stepTitle ?? val.title }} ></p>
                                        {val.stepDescription ? <p className='text-end hc-roadmap__new--whiteText'>{val.stepDescription}</p> : <p className='text-end hc-roadmap__new--whiteText' dangerouslySetInnerHTML={{ __html: val.content }} ></p>}
                                    </div>
                                </div>
                            </div>
                            }
                            {i == 0 &&
                                <div className='col-2 colpad'>
                                    <div className='hc-roadmap__new-col--center'>
                                        <img src={require('../assets/images/threecube.svg').default} />
                                    </div>
                                </div>
                            }
                            {i == 0 &&
                                <div className='col-5 colpad'>
                                    <div className='hc-roadmap__new-col--right'>
                                        {val.stepImage ?
                                            // <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/projects/steps/${val.stepImage}`} /> :
                                            // <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />
                                            <LottieAnimation url={`${config.IMG_URL}/projects/steps/${val.stepImage}`} className="img-fluid gif_aligner" /> :
                                            <LottieAnimation url={`${config.IMG_URL}/cmsimg/${val.img}`} className="img-fluid gif_aligner" />
                                        }
                                    </div>
                                </div>
                            }

                            {/* row-2  */}

                            {(i != 0) && (i % 2 != 0) && <div className='col-5 colpad hc-roadmap__new-padding--top'>
                                <div className='hc-roadmap__new-col--left roadmap_flex'>
                                    {val.stepImage ?
                                        // <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/projects/steps/${val.stepImage}`} /> :
                                        // <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />
                                        <LottieAnimation url={`${config.IMG_URL}/projects/steps/${val.stepImage}`} className="img-fluid gif_aligner" /> :
                                        <LottieAnimation url={`${config.IMG_URL}/cmsimg/${val.img}`} className="img-fluid gif_aligner" />
                                    }
                                </div>
                            </div>}

                            {(i != lastIndex) && (i != 0) && (i % 2 != 0) && <div className='col-2 colpad hc-roadmap__new-padding--top'>
                                <div className='hc-roadmap__new-col--center'>
                                    <img src={require('../assets/images/threecube.svg').default} />
                                </div>
                            </div>}

                            {(lastIndex != 0) && (i == lastIndex) && (i % 2 !== 0) &&
                                //  <div className='col-5 hc-roadmap__new-padding--top'>
                                //     <img className='img-fluid roadmap_lastimg' src={require('../assets/images/roadmaplastleft.svg').default} />
                                // </div>
                                <div className='col-2 colpad hc-roadmap__new-padding--top'>
                                    <div className='hc-roadmap__new-col--center'>
                                        <img src={require('../assets/images/threecube.svg').default} />
                                    </div>
                                </div>
                            }


                            {/* row -3  */}
                            {(i != 0) && (i % 2 != 0) && <div className='col-5 colpad hc-roadmap__new-padding--top'>
                                <div className='hc-roadmap__new-col--left d-flex'>
                                    <div className=''>
                                        <p className='hc-roadmap__new--themeText text-start' dangerouslySetInnerHTML={{ __html: val.stepTitle ?? val.title }} ></p>
                                        {val.stepDescription ? <p className='text-start hc-roadmap__new--whiteText'>{val.stepDescription}</p> : <p className='text-start hc-roadmap__new--whiteText' dangerouslySetInnerHTML={{ __html: val.content }} ></p>}
                                    </div>
                                    <h1 className='roadmap_strokeText'>{i + 1}</h1>
                                </div>
                            </div>}
                            {(i != 0) && (i % 2 === 0) && <div className='col-5 colpad hc-roadmap__new-padding--top'>
                                <div className='hc-roadmap__new-col--left roadmap_flex'>
                                    <p className='roadmap_strokeText'>{i + 1}</p>
                                    <div className=''>
                                        <p className='hc-roadmap__new--themeText text-end' dangerouslySetInnerHTML={{ __html: val.stepTitle ?? val.title }} ></p>
                                        {val.stepDescription ? <p className='text-end hc-roadmap__new--whiteText'>{val.stepDescription}</p> : <p className='text-end hc-roadmap__new--whiteText' dangerouslySetInnerHTML={{ __html: val.content }} ></p>}
                                    </div>
                                </div>
                            </div>}
                            {(i != lastIndex) && (i != 0) && (i % 2 === 0) &&
                                <div className='col-2 colpad hc-roadmap__new-padding--top'>
                                    <div className='hc-roadmap__new-col--center'>
                                        <img src={require('../assets/images/threecube.svg').default} />
                                    </div>
                                </div>
                            }


                            {/* row- 4 */}


                            {(lastIndex != 0) && (i == lastIndex) && (i % 2 === 0) && <div className='col-2 colpad hc-roadmap__new-padding--top'>
                                <div className='hc-roadmap__new-col--center'>
                                    <img src={require('../assets/images/threecube.svg').default} />
                                </div>
                            </div>}
                            {(i != 0) && (i % 2 === 0) && <div className='col-5 colpad hc-roadmap__new-padding--top'>
                                <div className='hc-roadmap__new-col--right'>
                                    {val.stepImage ?
                                        // <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/projects/steps/${val.stepImage}`} /> :
                                        // <img className='img-fluid gif_aligner' src={`${config.IMG_URL}/cmsimg/${val.img}`} />
                                        <LottieAnimation url={`${config.IMG_URL}/projects/steps/${val.stepImage}`} className="img-fluid gif_aligner" /> :
                                        <LottieAnimation url={`${config.IMG_URL}/cmsimg/${val.img}`} className="img-fluid gif_aligner" />
                                    }
                                </div>
                            </div>}
                        </>
                    )
                })

                }

            </div >:
            <div className="nodata_found ">No Data Found</div>
}
        </>
    )
}

export default Roadmap