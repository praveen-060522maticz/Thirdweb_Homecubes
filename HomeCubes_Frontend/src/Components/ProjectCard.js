import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import config from '../config/config'

function ProjectCard(props) {
  const { projectTitle, projectId, mintPrice, _id, isNotMinted, NFTPrice, ProjectThumbnail, floorPrice, coinName, id, projectHint,mintTokenName  } = props.data;
  console.log("props.datashow", props);
  const navigate = useNavigate();
  return (
    <>
      <div className="nft_card"  >
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
        <div className="nftcard_detailwrapper">
          <p className="nft_name">{projectTitle}</p>
          <p className="nft_coinname mt-3">
            floor price : {NFTPrice}{" "}
            <span className="floor_prize">{mintTokenName}</span>

          </p>
          {props?.show && <div className="projectcard_foot mt-2">
            {isNotMinted != 0 &&
              <NavLink className="sidetab_link"
                // to={{ pathname: `/projectInfo/${projectTitle}` }}
                // state={{ projectInfo: JSON.stringify(props.data) }}>
                to={{ pathname: `/mint/${_id}` }}
                // to={props?.data?.isAvailable != 0 ? { pathname: `/mintNFTs/${props?.data?._id}` } : { pathname: `/mint/${props?.data?._id}` }}
                state={props?.data}>
                <button className='nftinfo_gradeientBtn pc_buyBtn me-3'>Buy</button>
              </NavLink>}
            <NavLink className="sidetab_link"
              to={{ pathname: `/projectInfo/${projectTitle}` }}
              state={{ projectInfo: JSON.stringify(props.data) }}>
              <p className="viewMore" style={{ padding: "8px 10px", width: "100%" }}>View More</p>
            </NavLink>
          </div>}
        </div>
      </div >
    </>
  );
}

export default ProjectCard;
