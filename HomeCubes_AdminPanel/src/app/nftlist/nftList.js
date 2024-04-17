import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';



import NFTDETAIL from './nftdetail.js';
import * as NFTFunctions from '../../axioscalls/token'
import config from '../../lib/config.js'
import { getNftsByProjectId } from '../../axioscalls/admin.js';

export default function NftTable(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)


  // const Wallet_Details = useSelector((state) => state.wallet_detail)

  const { UserAccountAddr, } = useSelector((state) => state.wallet_detail)




  const mappArr = [1, "dummy", 2, 2, 2, , 2, 2, 2, 2, 2]

  const [nftList, setNftList] = useState([])
  const [nftDetail, setNftDetail] = useState({});



  const columns = [
    {
      key: "",
      text: "SNO",
      className: "NFT",
      align: "left",
      sortable: true,
      cell: (record, index) =>
        <div>{index + 1}
        </div>

    },
    {
      key: "CollectionProfileImage",
      text: "NFT Image",
      className: "NFT",
      align: "left",
      // sortable: true,
      cell: record =>
        <div><img className="img-xs rounded-circle" src={`${config.ImG}/nft/${record.NFTCreator}/Original/${record.NFTOrginalImage}`} alt="profile" />
        </div>

    },
    {
      key: "NFTName",
      text: "NFT Name",
      className: "NFT",
      align: "left"
    },
    {
      key: "NFTDescription",
      text: "NFT Description",
      className: "NFT",
      align: "left"
    },
    {
      key: "NFTId",
      text: "NFT Id",
      className: "NFT",
      align: "left"
    },
    {
      key: "NFTRoyalty",
      text: "NFT Royalty",
      className: "NFT",
      align: "left"
    },
    // {
    //   key: "tx",
    //   text: "Transaction Id",
    //   className: "NFT",
    //   align: "left"
    // },



    // {
    //   // key: "updatedAt",
    //   text: "Created At",
    //   className: "NFT PRICE",
    //   align: "left",
    //   // sortable: true,
    //   cell: rec =>
    //     <>{new Date(rec.createdAt).toLocaleString()}</>
    // },
    // {
    //   key: "",
    //   text: "Edit",
    //   cell: (record) => {
    //     return (
    //       <div>
    //         {(UserAccountAddr.toLowerCase() == config.AdminAddress) && !record.isMinted && <Link to={{ pathname: "/editNfts", state: record }}>
    //           <img
    //             src={require("../../assets/images/pencil.svg")}
    //             alt="profile"
    //           />
    //         </Link>}
    //       </div>
    //     );
    //   },
    // },
  ]

  useEffect(() => {
    getNFTs();
  }, [])

  useEffect(() => {
    console.log("state data", state)
    if (state) setNftDetail(state)
    else setNftDetail({})
  }, [state])



  const getNFTs = async () => {
    var resp = await getNftsByProjectId({ _id: state?.record?._id });
    console.log("respresp on getNFTS", resp);
    if (resp.success == "success") {
      setNftList(resp.data);
    }
  }



  return (

    <>

      {/* {path
        && path == "nftdetails" ?
        <div>
          <NFTDETAIL nfts={state ? state : {}} address={Wallet_Details.UserAccountAddr ? Wallet_Details.UserAccountAddr : ""} />
        </div> : */}
      <div>
        {/* <div className="page-header">
          <nav aria-label="breadcrumb">

          </nav>
        </div> */}
        <div>
          {/* {(UserAccountAddr.toLowerCase() == config.AdminAddress) && <Link to={{ pathname: "/addNfts", state: state?.record ?? {} }}  >
            <button className='btn mb-2 allbtn' type='button'>Add Nfts</button>
          </Link>} */}
        </div>
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">NFT LIST</h4>
                <div className="table-responsive">
                  <ReactDatatable

                    records={nftList}
                    columns={columns}
                  />

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* } */}
    </>

  )

}


