import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import config from '../config/config'

function ProjectCard(props) {

  const location = useLocation();
  const { projectTitle, projectId, mintPrice, _id, isNotMinted, NFTPrice, ProjectThumbnail, floorPrice, coinName, id, projectHint, mintTokenName } = props.data;
  console.log("props.datashow", props);
  const navigate = useNavigate();
  return (
    <>
      <div className="nft_card hc-card__nft"  >
        <div className="projectcard_wrapper_sep">
          <img className="img-fluid projectcard_img" src={`${config.IMG_URL}/projects/ProjectThumbnail/${ProjectThumbnail}`}
            onClick={() => {
              if (props?.market) {
                navigate(`/CollectionNfts/${projectTitle}`, {
                  state: { projectInfo: JSON.stringify(props.data) }
                })
              } else {
                navigate(`/projectInfo/${projectTitle}`, {
                  state: { projectInfo: JSON.stringify(props.data) }
                })
              }

            }}
          />
        </div>
        <div 
        className={location.pathname == "/projects" ? "nftcard_detailwrapper d-flex align-items-start justify-content-between gap-1":"nftcard_detailwrapper"}
        // className="nftcard_detailwrapper"
        >
          <p className={location.pathname == "/projects" ? "nft_name hc-nft__card-title minhset1" : "nft_name hc-nft__card-title minhset"}>{projectTitle}</p>
          {location.pathname == "/projects" ?
          <></> :
          <p className="nft_coinname mt-2">
            Floor price : {NFTPrice}{" "}
            <span className="floor_prize">{mintTokenName}</span>

          </p>}
          {props?.show && <div className={location.pathname == "/projects" ? "projectcard_foot mt-0" : "projectcard_foot mt-2"}>
            {isNotMinted != 0 &&
              <NavLink className="sidetab_link"
                // to={{ pathname: `/projectInfo/${projectTitle}` }}
                // state={{ projectInfo: JSON.stringify(props.data) }}>
                to={{ pathname: `/mint/${_id}` }}
                // to={props?.data?.isAvailable != 0 ? { pathname: `/mintNFTs/${props?.data?._id}` } : { pathname: `/mint/${props?.data?._id}` }}
                state={props?.data}>
                <button className={location.pathname == "/projects"? "nftinfo_gradeientBtn pc_buyBtn widthset" : 'nftinfo_gradeientBtn pc_buyBtn me-3'}>{location.pathname == "/projects" ? "Buy Now" : "Buy" }</button>
              </NavLink>}
             {location.pathname == "/projects" ?
             <></> :
            <NavLink className="sidetab_link"
              to={{ pathname: `/projectInfo/${projectTitle}` }}
              state={{ projectInfo: JSON.stringify(props.data) }}>
              <p className="viewMore" style={{ padding: "8px 10px", width: "100%" }}>View More</p>
            </NavLink>}

          </div>}
        </div>
      </div >
    </>
  );
}

export default ProjectCard;
