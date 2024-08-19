import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import config from '../config/config'
import BNBIcon from "../assets/images/bnbcoin.svg"
import { calculateStakingDaysPassed, getDaysOfDesiredMonth } from "../actions/common";

function DataCard(props) {

  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);
  console.log(location.pathname, "pathuuuuu");
  const { img, status, name, stackdays, expiry, nftName, stakeDetais, nftImg, coinImg, CoinName, PutOnSale, PutOnSaleType, NFTName, NFTId, isStaked, id, NFTOwner, CollectionNetwork, NFTCreator, NFTOrginalImage, NFTPrice } = props.data;
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


      <div className="nft_card">
        <div className="nftcard_imgwrapper_sep">
          {PutOnSaleType != "UnlimitedAuction" && PutOnSaleType != "NotForSale" &&
            <div className={ isStaked ? "nftcard_statuslabelblue_dark" : PutOnSaleType != "FixedPrice" ? "nftcard_statuslabel" : "nftcard_statuslabelblue"}>
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
          <div className="nftcard_detailwrapper"
            onClick={() => {
              props.setShowData(props.data);
              if (isStaked) props.onWithdraw(props.data);
              else props?.setShowModal(true);
            }} >
            <p className="nft_name">{NFTName}</p>
            <p className="nft_stackdate">Days Staked on this Quarter : {getStakedDate ?? "None"}</p>
            <p className="nft_expiry">Staking expiry date: {stake?.endDate ? new Date(stake?.endDate).toLocaleDateString() : "None"}</p>
            <button className={!isStaked ? "nftcard_btnblue" : "nftcard_btnviolet"}>{!isStaked ? "Stake" : "Withdraw"}</button>
          </div>}

        {pathname == "/staking" ? <></> :
          <div className="nftcard_detailwrapper">
            <p className="nft_name" title={NFTName} >{NFTName.length > 20 ? NFTName.slice(0, 20).concat('...') : NFTName}</p>
            {pathname == '/profile' ? <></> :
              <div className="nftcard_coin">
                <img className="nft_coinImg" src={BNBIcon} />
                <p className="nft_coinname">
                  {NFTPrice} {CoinName ? CoinName :CollectionNetwork} 
                </p>
              </div>}
          </div>}

      </div>



    </>
  );
}

export default DataCard;
