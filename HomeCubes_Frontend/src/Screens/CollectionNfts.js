import React, { useState, useEffect } from "react";
import BottomBar from "../Components/BottomBar";
import Header from "../Components/Header";
import {
    Container,
    Row,
    Col,
    Accordion,
    Form,
    Modal,
    Button,
} from "react-bootstrap";
import SideTab from "../Components/SideTab";
import ReactSearchBox from "react-search-box";
import Select from "react-select";
import { nftcard } from "../datas/CardData";
import NFTCards from "../Components/NFTCards";
import Footer from "../Components/Footer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BreadPath from "../Components/BreadPath";
import DataCard from "../Components/DataCard";
import config from "../config/config";
import { getGalleryTokens, getProjects } from "../actions/axioss/nft.axios";
import { getBNBvalue, isEmpty, videoFileFormats } from "../actions/common";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";


function CollectionNfts() {
    const location = useLocation();
    console.log(location, "location?.statecolllection");
    const [tokens, setTokens] = useState([]);
    const [nftLength, setnftLength] = useState(0);
    const [staked, setstaked] = useState(0);
    const [unStaked, setunStaked] = useState(0);
    const [Loadmore, setLoadMore] = useState(true);

    const [projectDetail, setProjectDetail] = useState({})
    const { projectTitle } = useParams();

    const navigate = useNavigate();

    const { BNBUSDT } = useSelector((state) => state.LoginReducer.AccountDetails);

    const projectData = JSON.parse(location?.state?.projectInfo)
    console.log(projectData, "oerwerhw");

    useEffect(() => {
        fetchGallery();
        fetchProject()
    }, []);
    const fetchGallery = async () => {

        const param = { action: "getNfts", projectId: projectDetail?._id ?? projectData?._id, limit: 10, skip: tokens.length }
        console.log("paramparam", param);
        const getTokends = await getProjects(param);
        console.log('getTokends', getTokends);
        if (getTokends?.data?.length == 0 || getTokends?.data?.length < 10) setLoadMore(false);
        setTokens([...tokens, ...getTokends?.data ?? []])

    }


    const fetchProject = async () => {
        const Resp = await getProjects({ action: "getOne", title: projectTitle });
        console.log("Respsppss", Resp);
        setProjectDetail(Resp?.data ?? {})
        setnftLength(Resp?.nftLength ?? 0)
        setstaked(Resp?.staked ?? 0)
        setunStaked(Resp?.unStaked ?? 0)
    }


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <BottomBar />
            <Header />
            <Container fluid className="home_wrapper">
                <Container className="custom_container">
                    <Row>
                        <Col lg={1} md={2} className="sidetab_holder">
                            <SideTab />
                        </Col>
                        <Col
                            lg={11}
                            md={10}
                            sm={12}
                            xs={12}
                            className="res_pad_aligner ci_highertop"
                        >
                            <div className="cus-back-btn mb-3">
                                <Button className="" onClick={() => navigate(-1)} >
                                    <i className="fa-solid fa-chevron-left"></i>
                                    Back
                                </Button>
                            </div>
                            <hr className="projects_hr" />

                            <Row>
                                <Col lg={5} md={6} sm={6} xs={12}>
                                    <div className="">
                                        <div className="mp_collectionDetail mb-2">
                                            <p className="mp_collectionLabel">Number of NFTs :</p>
                                            <p className="mp_collectionValue">
                                                {projectDetail?.maxNFTs}
                                            </p>
                                        </div>
                                        <div className="mp_collectionDetail mb-2">
                                            <p className="mp_collectionLabel">
                                                Number of Minted NFTs :
                                            </p>
                                            <p className="mp_collectionValue">
                                                {nftLength}
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={5} md={6} sm={6} xs={12}>
                                    <div className="mp_collectionDetail mb-2">
                                        <p className="mp_collectionLabel">
                                            Number of Staked NFTs :
                                        </p>
                                        <p className="mp_collectionValue">
                                            {staked}
                                        </p>
                                    </div>
                                    <div className="mp_collectionDetail mb-2">
                                        <p className="mp_collectionLabel">
                                            Number of Non-Staked NFTs :
                                        </p>
                                        <p className="mp_collectionValue">
                                            {unStaked}
                                        </p>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="justify-content-start mt-5">
                                {tokens?.length != 0 && tokens?.map((i) =>
                                    <Col lg={4} className="mb-3 ">
                                        <DataCard data={i} />
                                    </Col>
                                )}

                            </Row>
                            {Loadmore && <button className="seconday_btn" onClick={() => fetchGallery()} >Loadmore</button>}

                        </Col>

                    </Row>
                </Container>
                <Footer />
            </Container>

            <div className="gradient_holder staking_gradholder"></div>
            <div className="dualImg_bg"></div>
        </>
    );
}

export default CollectionNfts;
