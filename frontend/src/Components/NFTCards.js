import React from "react";
import { NavLink } from "react-router-dom";

function NFTCards(props) {
  const { id, name, nftImg, coinImg, coinName, coinValue } = props.data;
  console.log(props.data, "eueirueir");
  return (
    <>
      <div className="nft_card">
        <div className="nftcard_imgwrapper">
          <NavLink
            to={{ pathname: `/nftInfo/${id}` }}
            state={{ nftInfo: JSON.stringify(props.data) }}
          >
            <img className="img-fluid nftImg" src={nftImg} />
          </NavLink>
        </div>
        <div className="nftcard_detailwrapper">
          <p className="nft_name">{name}</p>
          <div className="nftcard_coin">
            <img className="nft_coinImg" src={coinImg?.default} />
            <p className="nft_coinname">
              {coinValue} {coinName}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default NFTCards;
