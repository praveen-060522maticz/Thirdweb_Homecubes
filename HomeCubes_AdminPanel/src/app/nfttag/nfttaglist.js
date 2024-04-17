import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EditCms from '../cmscontent/editcms.js'

import * as tokenFunctions from '../../axioscalls/token.js'
import wallet_details from '../../redux/action';
import config from '../../lib/config.js';
import { getnfttags } from '../../axioscalls/user.js'
import { EditNftTag } from './editnfttag.js'


toast.configure();


export default function CmsList(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)


  const Wallet_Details = useSelector((state) => state.wallet_detail)
  const [nftTagsList, setNftTagsList] = useState([])





  const columns = [
    {
      key: "details",
      text: "Details",
      className: "Name",
      align: "left",
      sortable: false
    },
    {
      key: "nfttag",
      text: "Tag",
      className: "Name",
      align: "left",
      sortable: false
    },

    {
      key: "action",
      text: "Edit",
      className: "Name",
      align: "left",
      sortable: false,
      cell: record =>
        <div><Link to={{ pathname: `/editnfttag`, state: record }}><button className='btn allbtn allbtns'>Edit</button></Link></div>
    },

  ];



  return (

    <>
      {(path && path == "editnfttag") ?
        <><EditNftTag nfttagdata={state ? state : {}} /></> : <>

          <div>
            <div className="page-header">
              <nav aria-label="breadcrumb">

              </nav>
            </div>
            <div className="row">

              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">NFT TAGS LIST</h4>

                    <div className="table-responsive">
                      <ReactDatatable

                        records={nftTagsList}
                        columns={columns}
                      />

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>



        </>}
    </>



  )

}


