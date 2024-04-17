import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EditSocial from '../sociallinks/editsocial.js'

import * as tokenFunctions from '../../axioscalls/token.js'
import * as userFunctions from '../../axioscalls/user.js'

import wallet_details from '../../redux/action';
import config from '../../lib/config.js';

toast.configure();


export default function SocialList(props) {

  var history = useHistory();

  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)


  const Wallet_Details = useSelector((state) => state.wallet_detail)
  const [socialList, setSocialList] = useState([])
  const [allcheck, setAllcheck] = useState(false);



  const columns = [

    {
      key: "website",
      text: "Website",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },

    {
      key: "link",
      text: "Website Link",
      className: "NFT NAME",
      align: "left",
      sortable: true,



    },
    {
      key: "img",
      text: "ICON",
      className: "NFT NAME",
      align: "left",
      sortable: false,
      cell: record =>
        <div><img src={`${config.ImG}/socialimg/${record.img}`} width={50} /></div>
    },

    {
      key: "edit",
      text: "Edit",
      className: "NFT NAME",
      align: "left",
      sortable: false,
      cell: record =>
        <div><Link to={{ pathname: `/editsociallink`, state: record }}><button className='btn allbtn allbtns'>Edit</button></Link></div>


    },
    {
      key: "delete",
      text: "Delete",
      className: "NFT NAME",
      align: "left",
      sortable: false,
      cell: record =>
        <div><button className='btn allbtn allbtns' onClick={() => {}} >DELETE</button></div>


    },
    {
      key: "selected",
      text: "Select Social Links",
      className: "NFT NAME",
      align: "left",
      // sortable: true,
      cell: record =>
        <div><input type="checkbox" checked={record.selected} onClick={() => setMaySent(record)} /></div>


    },





  ]

  
  const setMaySent = async (data) => {
    

  }


  return (

    <>
      {(path && path == "editsociallink") ?
        <EditSocial rec={state ? state : {}} /> :

        <div>
          <div className="page-header">
            <nav aria-label="breadcrumb">
            </nav>
          </div>
          <div className="row">

            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">SOCIAL LINKS</h4>

                  <Link to="/addsocial">
                    <button className='btn mb-3 allbtn' type='button'>Add</button>
                  </Link>
                  <div className="table-responsive">
                    <div className='mb-3'>
                      Select All
                      <input type="checkbox" className='selectall ml-2' checked={allcheck} onChange={(e) => setMaySent(e)} /></div>
                    <ReactDatatable

                      records={socialList}
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


