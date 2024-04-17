import React from 'react'
import { NavLink } from "react-router-dom";
import config from '../config/config'

function GalleryCard(props) {
  const { coinName, collectionImg, galleryTitle, projectId, galleryThumbImage, id } = props.data;
  return (
    <>
      <div className="nft_card new">
        <div className="nftcard_imgwrapper">
          <NavLink to={{ pathname: `/collectionInfo` }}
            state={props.data}
          >
            <img className="img-fluid gallerImg" src={`${config.IMG_URL}/collection/${projectId?._id ?? projectId}/${galleryThumbImage}`} />
          </NavLink>
        </div>
        <div className="nftcard_detailwrapper">
          <p className="nft_name text-center">{galleryTitle}</p>

        </div>
      </div>
    </>
  )
}

export default GalleryCard