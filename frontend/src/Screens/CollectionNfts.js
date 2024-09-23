import React, { useState, useEffect, useRef } from "react";
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

    const footerRef = useRef(null);
    const [isFixed, setIsFixed] = useState(true);
    const handleScroll = () => {

        const footerTop = footerRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (footerTop < windowHeight) {
            setIsFixed(false);


        } else {
            setIsFixed(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
            <div className="innercontent">
                <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
                    <SideTab />
                </div>
                <div className="banner_section">
                    <div className="inner-container__width">
                        <div className="cus-back-btn mb_2">
                            <Button className="" onClick={() => navigate(-1)} >
                                <i className="fa-solid fa-chevron-left"></i>
                                Back
                            </Button>
                        </div>
                        <hr className="projects_hr" />
                        <div className="d-flex flex-wrap gap_4 mb_3">
                            <div className="mp_collectionDetail mb_2">
                                <p className="mp_collectionLabel">Number of NFTs :</p>
                                <p className="mp_collectionValue">
                                    {projectDetail?.maxNFTs}
                                </p>
                            </div>
                            <div className="mp_collectionDetail mb_2">
                                <p className="mp_collectionLabel">
                                    Number of Minted NFTs :
                                </p>
                                <p className="mp_collectionValue">
                                    {nftLength}
                                </p>
                            </div>
                            <div className="mp_collectionDetail mb_2">
                                <p className="mp_collectionLabel">
                                    Number of Staked NFTs :
                                </p>
                                <p className="mp_collectionValue">
                                    {staked}
                                </p>
                            </div>
                            <div className="mp_collectionDetail mb_2">
                                <p className="mp_collectionLabel">
                                    Number of Non-Staked NFTs :
                                </p>
                                <p className="mp_collectionValue">
                                    {unStaked}
                                </p>
                            </div>
                        </div>
                      
                    </div>
                </div>
                 <div className="bottom_content collection_top">
                    <div className="inner-container__width">
                        {tokens?.length != 0 && tokens?.map((i) =>
                            <div  className="mp-grid mb_2 ">
                                <DataCard data={i} />
                            </div>
                        )}
                        {Loadmore && <button className="seconday_btn" onClick={() => fetchGallery()} >Loadmore</button>}

                    </div>
                </div> 
            </div>

            <div ref={footerRef}>
                <Footer />
            </div>




        </>
    );
}

export default CollectionNfts;
