import React from 'react'
import { NavLink } from "react-router-dom";
import config from '../config/config'
import ImageWithLoader from './ImageWithLoader';

function GalleryCard(props) {
  const { coinName, collectionImg, galleryTitle, projectId, galleryThumbImage, id } = props.data;
  return (
    <>

      <div className="card-gallery">
        <div className="card-gallery__image--wrapper">
          <NavLink to={{ pathname: `/collectionInfo` }}
            state={props.data}
          >
            <ImageWithLoader className="" src={`${config.IMG_URL}/collection/${projectId?._id ?? projectId}/${galleryThumbImage}`} />
            {/* <img className="" src={`${config.IMG_URL}/collection/${projectId?._id ?? projectId}/${galleryThumbImage}`} /> */}
          </NavLink>
        </div>
        <div className="card-gallery__title">
          <p className="text-center">{galleryTitle}</p>

        </div>
      </div>
    </>
  )
}

export default GalleryCard