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

toast.configure();


export default function CmsList(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)


  const Wallet_Details = useSelector((state) => state.wallet_detail)
  const [cmsList, setCmsList] = useState([])

  const columns = [

    {
      key: "question",
      text: "CMS TOPIC",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },
    {
      key: "answer",
      text: "CMS CONTENT",
      className: "NFT IDT",
      align: "left",
      sortable: true,

    },
    {
      key: "delete",
      text: "Edit Content",
      className: "NFT IDT",
      align: "left",
      sortable: true,
      cell: record =>
        <div><Link to={{ pathname: `/editcms`, state: record }} ><button >Edit</button></Link></div>

    },



  ]

  useEffect(() => {
    getCmsList();
  }, [])


  const getCmsList = async () => {
    var resp = await tokenFunctions.getCmsContent();
    if (resp?.status) {
      setCmsList(resp.data)
    }
  }



  return (

    <>
      {(path && path == "editcms") ?
        <EditCms cms={state ? state : {}} /> :
        <div>
          <div className="page-header">
            <nav aria-label="breadcrumb">

            </nav>
          </div>
          <div className="row">

            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">CMS LIST</h4>

                  <div className="table-responsive">
                    <ReactDatatable
              
                      records={cmsList}
                      columns={columns}
                    />

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>}



    </>

  )

}


