import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import config from '../config/config'
import BNBIcon from "../assets/images/bnbcoin.svg"
import { calculateStakingDaysPassed, getDaysOfDesiredMonth } from "../actions/common";
import { toast } from "react-toastify";

function DataCard(props) {

  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);
  console.log(location.pathname, "pathuuuuu");
  const { stakeDetais, CoinName, PutOnSale, PutOnSaleType, NFTName, NFTId, isStaked, NFTOwner, CollectionNetwork, NFTCreator, NFTOrginalImage, NFTPrice, isBidPending } = props.data;
  console.log(props.data, "asdfsf");

  const stake = stakeDetais?.[0]
  if (stake) {
    var poolDetail = getDaysOfDesiredMonth();
    console.log("poolDetail", poolDetail, poolDetail.newStartDate, poolDetail.dateFormat, stake.startDate, stake.endDate);
    var getStakedDate = calculateStakingDaysPassed(poolDetail.newStartDate, poolDetail.dateFormat, stake.startDate, stake.endDate)
  }
  console.log("getStakedDate", getStakedDate, poolDetail);

  console.log('PutOnSaleType---->', PutOnSaleType, PutOnSale);
  return (
    <>
      <div className="nft_card hc-card__nft-height">
        <div className="nftcard_imgwrapper_sep">
          {PutOnSaleType != "UnlimitedAuction" && PutOnSaleType != "NotForSale" &&
            <div className={isStaked ? "nftcard_statuslabelblue_dark" : PutOnSaleType != "FixedPrice" ? "nftcard_statuslabel" : "nftcard_statuslabelblue"}>
              {/* class name -> nftcard_statuslabelblue_dark */}
              <div className="card_status">
                {PutOnSaleType == "FixedPrice" ? "Listed" : PutOnSaleType}
              </div>
            </div>}
          <NavLink
            to={{ pathname: `/nftInfo/${NFTOwner}/${NFTId}` }}
            state={{ nftInfo: JSON.stringify(props.data) }}
          >
            <img
              className="img-fluid nftImg"
              src={`${config.IMG_URL}/nft/${NFTCreator}/Original/${NFTOrginalImage}`}
            />
          </NavLink>

        </div>

        {pathname == "/staking" &&
          <div className="nftcard_detailwrapper">
            <p className="nft_name hc-nft__card-title">{NFTName}</p>
            <p className="hh-nft__text-sm ">Days Staked on this Quarter : {getStakedDate ?? "None"}</p>
            <p className="hh-nft__text-sm ">Staking expiry date: {stake?.endDate ? new Date(stake?.endDate).toLocaleDateString() : "None"}</p>
            <button
              className={!isStaked ? "bodygradientBtn modal_grdientBtn " : "nftcard_btnviolet "}
              // disabled={PutOnSaleType != "UnlimitedAuction" && (PutOnSaleType != "NotForSale") && !isStaked}
              onClick={() => {
                if (isBidPending) return toast.warn("Please Complete the bid process")
                if (PutOnSaleType != "UnlimitedAuction" && PutOnSaleType != "NotForSale" && !isStaked) return toast.warn("Token listed on marketplace")

                props.setShowData(props.data);
                if (isStaked) props.onWithdraw(props.data);
                else props?.setShowModal(true);
              }}
            >
              {!isStaked ? "List For Rent" : "Remove From Rent"}
            </button>
          </div>}

        {pathname == "/staking" ? <></> :
          <div className="nftcard_detailwrapper">
            <p className="nft_name hc-nft__card-title" title={NFTName} >{NFTName.length > 20 ? NFTName.slice(0, 20).concat('...') : NFTName}</p>
            {pathname == '/profile' ? <></> :
              <div className="nftcard_coin">
                <img className="nft_coinImg" src={BNBIcon} />
                <p className="nft_coinname">
                  {NFTPrice} <span>{CoinName ? CoinName : CollectionNetwork}</span>
                </p>
              </div>}
          </div>}

      </div>



    </>
  );
}

export default DataCard;
