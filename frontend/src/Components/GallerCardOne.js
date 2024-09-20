import React from 'react'

import { NavLink } from 'react-router-dom';
import config from '../config/config'

function GallerCardOne(props) {
  const { coinName, collectionImg, galleryTitle, projectId, galleryThumbImage, id } = props.data;
  return (
    <>
      <div className="collection_Card">
        <div className="collectioncard_imgwrapper">
          <NavLink to={{ pathname: `/collectionInfo` }}
            state={props.data}>
            <img
              className="collectionImg"
              src={`${config.IMG_URL}/collection/${projectId?._id ?? projectId}/${galleryThumbImage}`}
            />
          </NavLink>

        </div>
        <div className="nftcard_detailwrapper">
          <p className="nft_name text-center">{galleryTitle}</p>
          <div className='nftcard_coin'>
            {/* <p className="nft_coinname">floor price : {floorPrice} <span className='floor_prize'>{coinName}</span></p> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default GallerCardOne