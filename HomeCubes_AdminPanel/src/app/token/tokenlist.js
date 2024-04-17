import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import * as tokenFunctions from '../../axioscalls/user.js'
import { TokenDetail } from './tokendetail';

export default function Userlist(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)




  const [tokenList, setTokenList] = useState([])




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
      key: "NFTId",
      text: "NFT Id",
      className: "NFT",
      align: "left",
    },
    {
      key: "NFTName",
      text: "NFT Name",
      className: "NFT",
      align: "left"
    },
    {
      key: "NFTCreator",
      text: "NFT Creator",
      className: "NFT",
      align: "left",
      cell: rec =>
        <div title={rec.NFTCreator}>{rec.NFTCreator.toString().slice(0, 2) + '...' + rec.NFTCreator.toString().slice(-2)}</div>
    },
    {
      key: "Creator_DisplayName",
      text: "Creator Name",
      className: "NFT",
      align: "left"
    },
    {
      key: "NFTRoyalty",
      text: "Royalty",
      className: "NFT",
      align: "left"
    },
    {
      key: "NFTOwner",
      text: "NFT Owner",
      className: "NFT",
      align: "left",
      cell: rec =>
        <div title={rec.NFTOwner}>{rec?.NFTOwner.toString().slice(0, 2) + '...' + rec?.NFTOwner.toString().slice(-2)}</div>
    },
    {
      key: "NFTBalance",
      text: "NFT Balance",
      className: "NFT",
      align: "left"
    },
    {
      key: "DisplayName",
      text: "Display Name",
      className: "NFT",
      align: "left"
    },


    {
      key: "view",
      text: " View",
      className: "NFT",
      align: "left",
      cell: record =>
        <div><Link to={{ pathname: `/viewdetail`, state: record }} ><button className='btn allbtn allbtns' >view</button></Link></div>

    },
  ]



  return (

    <>
      {path && path === "viewdetail" ?
        <div>
          <TokenDetail detail={state} />
        </div> :

        <div>
          <div className="page-header">
            <nav aria-label="breadcrumb">

            </nav>
          </div>
          <div className="row">

            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Token List</h4>

                  <div className="table-responsive">
                    <ReactDatatable

                      records={tokenList}
                      columns={columns}
                    />

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      }
    </>

  )

}


