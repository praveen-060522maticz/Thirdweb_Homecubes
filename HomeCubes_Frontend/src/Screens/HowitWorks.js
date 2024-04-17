import React, { useEffect, useState } from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import { Container, Row, Col } from 'react-bootstrap'
import SideTab from '../Components/SideTab'
import Lottie from "lottie-react";
import NftBuy from '../assets/lotties/nftbuy.json'
import StakeNFT from '../assets/lotties/stakenft.json'
import Rewards from '../assets/lotties/rewards1.json'
import Acquire from '../assets/lotties/dfsdf.json'
import User from '../assets/lotties/user.json'
import Inversors from '../assets/lotties/investor.json'
import Footer from '../Components/Footer'
import BreadPath from '../Components/BreadPath'
import { getCmsContent } from '../actions/axioss/cms.axios'
import config from '../config/config'
import LottieAnimation from '../Components/LottieAnimar'

function HowitWorks() {
  const [description, setDescription] = useState(false);
  const [CMS, SetCMS] = useState({});
  const [stepArr, setStepArr] = useState([]);
  const desc = [
    {
      descText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
  ];
  console.log("stepArr", stepArr);

  useEffect(() => {
    getCmsContentFunc()
  }, [])

  const getCmsContentFunc = async () => {
    const Resp = await getCmsContent({ page: ["How it works", "How it works - step"] });
    console.log("sfesfesfsef", Resp);
    const obj = {};
    const Arr = []

    const valuse = Resp.data.map((val) => {
      if (val.page == "How it works - step")
        Arr.push(val);
      else
        obj[val.key] = val;
    })
    SetCMS(obj);
    setStepArr(Arr)
  }
  console.log("CMSCMSCMS", CMS);

  useEffect(() => {
    window.scroll(0, 0);
  }, [])
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
              <h3 className="inhowit_title mb-2 text-center">How it works</h3>
              <p className="markeplace_hint text-center">Step by step</p>
              <Row className='mt-5 justify-content-center'>
                {stepArr?.length != 0 && stepArr?.map((val) => {

                  return (
                    <Col lg={4} md={6} sm={6} xs={12} className='mb-3 d-flex justify-content-center'>
                      <div className='inhowit_stepcard'>
                        {/* <Lottie animationData={NftBuy} className='stepcard_lottie' loop={true} /> */}
                        <div className='step_img_center_dev' >
                          <LottieAnimation url={`${config.IMG_URL}/cmsimg/${val.img}`} className={"step_img"} />

                          {/* <img className='step_img' src={`${config.IMG_URL}/cmsimg/${val.img}`} /> */}
                        </div>
                        <p className='stepcard_title mt-4'>{val.title}</p>
                        {/* {desc.map((i) => (
                          <>
                            {description ? ( */}
                        <p className="mp_detailbrief howit_scrollText mt-3" dangerouslySetInnerHTML={{ __html: val.content }} >
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
                })}

              </Row>

              <Row className='mt-5'>
                {/* <h3 className="inhowit_title mb-5 text-center">You are buying share of the real property</h3> */}

                <Col lg={6} md={12} sm={12} xs={12} className='mb-3'>
                  <div className='howit_stepHolder mb-4'>
                    <h1 className='howit_strokeText'>1</h1>
                    <h3 className="inhowit_title">{CMS["Acquire NFTs to Start Investing"]?.title}</h3>
                  </div>

                  <p className='howit_stepsText' dangerouslySetInnerHTML={{ __html: CMS["Acquire NFTs to Start Investing"]?.content }} ></p>

                  {/* <p className='howit_stepsText'>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>

                  <p className='howit_stepsText'>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p> */}

                  <div className='howit_dualBtns mt-5'>
                    <button className='primary_blueBtn howit_primaryBtn home_bannerPrimay'>How to mint NFTs</button>
                    <button className='additional_btn home_bannerPrimay'>How to buy NFTs from market place</button>
                  </div>
                </Col>
                <Col lg={6} md={12} sm={12} xs={12} className='mb-3 d-flex justify-content-center align-items-center'>
                  {/* <Lottie animationData={Acquire} loop={true} /> */}
                  {CMS["Acquire NFTs to Start Investing"]?.img && <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["Acquire NFTs to Start Investing"]?.img}`} className={"img-fluid howit_giffer"} />}

                  {/* <img src={`${config.IMG_URL}/cmsimg/${CMS["Acquire NFTs to Start Investing"]?.img}`} className='img-fluid howit_giffer' /> */}
                </Col>
              </Row>

              <Row className='mt-5 howit_inverscol'>
                <Col lg={6} className='mb-3 d-flex justify-content-center'>
                  {/* <Lottie animationData={User} loop={true} /> */}
                  {/* <img src={`${config.IMG_URL}/cmsimg/${CMS["Stake Your NFTs to Unlock Rewards"]?.img}`} className='img-fluid howit_giffer' /> */}
                  {CMS["Stake Your NFTs to Unlock Rewards"]?.img && <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["Stake Your NFTs to Unlock Rewards"]?.img}`} className={"img-fluid howit_giffer"} />}

                </Col>

                {CMS["Stake Your NFTs to Unlock Rewards"]?.content &&
                  <Col lg={6} className='mb-3'>
                    <>
                      <div className='howit_stepHolder mb-4'>
                        <h1 className='howit_strokeText'>2</h1>
                        <h3 className="inhowit_title">{CMS["Stake Your NFTs to Unlock Rewards"]?.title}</h3>
                      </div>
                      <p className='howit_stepsText' dangerouslySetInnerHTML={{ __html: CMS["Stake Your NFTs to Unlock Rewards"]?.content }} ></p>

                      <div className='howit_dualBtns mt-5'>
                        <button className='primary_blueBtn howit_primaryBtn home_bannerPrimay'>How to Stake my NFTs</button>
                        <button className='additional_btn home_bannerPrimay'>How to Unstake my NFTs</button>
                      </div>
                    </>
                  </Col>}
              </Row>

              <Row className='mt-5'>
                {/* <h3 className="inhowit_title mb-5 text-center">You are buying share of the real property</h3> */}

                <Col lg={6} className='mb-3'>
                  <div className='howit_stepHolder mb-4'>
                    <h1 className='howit_strokeText'>3</h1>
                    {CMS["Acquire NFTs to Start Investing."]?.title && <h3 className="inhowit_title">{CMS["Acquire NFTs to Start Investing."]?.title}</h3>}
                  </div>
                  <p className='howit_stepsText' dangerouslySetInnerHTML={{ __html: CMS["Acquire NFTs to Start Investing."]?.content }} ></p>

                  {/* <p className='howit_stepsText'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </p>

                  <p className='howit_stepsText'>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p>

                  <p className='howit_stepsText'>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p> */}

                  <div className='howit_dualBtns mt-5'>
                    <button className='primary_blueBtn howit_primaryBtn home_bannerPrimay'>How to claim my rewards ?</button>
                    <button className='additional_btn home_bannerPrimay'>How to add polygon / Matic network to my wallet</button>
                  </div>
                </Col>
                <Col lg={6} className='mb-3 d-flex justify-content-center'>
                  {/* <img src={`${config.IMG_URL}/cmsimg/${CMS["Acquire NFTs to Start Investing."]?.img}`} /> */}
                  {CMS["Acquire NFTs to Start Investing."]?.img && <LottieAnimation url={`${config.IMG_URL}/cmsimg/${CMS["Acquire NFTs to Start Investing."]?.img}`} />}

                  {/* <Lottie animationData={Inversors} className='investor_lottie investLotte' loop={true} /> */}
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

export default HowitWorks