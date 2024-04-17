import React from 'react'
import { NavLink } from 'react-router-dom';
import config from '../config/config'

function CollectionCard(props) {
  const { projectId, galleryTitle,galleryThumbImage  } = props?.data;
  console.log(props.data, "sdfsdfsf");
  return (
    <>
      <div className="collection_Card">
        <div className="collectioncard_imgwrapper">
          <NavLink
            to={{ pathname: `/collectionInfo` }}
            state={props.data}>
            <img
              className="collectionImg"
              src={`${config.IMG_URL}/collection/${projectId?._id}/${galleryThumbImage}`}
            />
          </NavLink>

        </div>
        <div className="nftcard_detailwrapper">
          <p className="nft_name ">{galleryTitle}</p>
          <div className='nftcard_coin'>
            <p className="nft_coinname">floor price : {projectId?.NFTPrice} <span className='floor_prize'>BNB</span></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CollectionCard