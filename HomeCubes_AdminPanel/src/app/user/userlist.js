import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import * as tokenFunctions from '../../axioscalls/user.js'
import { UserDetail } from './userdetail';

export default function Userlist(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)




  const [userList, setUserList] = useState([])




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
      key: "DisplayName",
      text: "User Name",
      className: "NFT",
      align: "left",
    },
    {
      key: "EmailId",
      text: "Email Address",
      className: "NFT",
      align: "left"
    },
    {
      key: "WalletAddress",
      text: "Wallet Address",
      className: "NFT",
      align: "left",
      cell: rec =>
        <div title={rec.WalletAddress}>{rec.WalletAddress.toString().slice(0, 5) + '...' + rec.WalletAddress.toString().slice(-5)}</div>
    },
    {
      key: "CustomUrl",
      text: "Custom URL",
      className: "NFT",
      align: "left",
      cell: rec =>
        <div title={rec.CustomUrl}>{rec.CustomUrl.length > 5 ? rec.CustomUrl.toString().slice(0, 5) + '...' : rec.CustomUrl}</div>
    },


    {
      text: "Detail",
      cell: record =>
        <div><Link to={{ pathname: `/userdetail`, state: record }} ><button className='btn mt-2 mb-2 allbtn'>view</button></Link></div>

    },
  ]



  return (

    <>
      {path && path === "userdetail" ?
        <div>
          <UserDetail detail={state} />
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
                  <h4 className="card-title">USER LIST</h4>

                  <div className="table-responsive userlistss">
                    <ReactDatatable

                      records={userList}
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


