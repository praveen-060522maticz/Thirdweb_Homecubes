import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import config from '../../lib/config'
import { isEmpty } from '../../lib/common';
import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import excel from '../../assets/excel/mail.xlsx'

import EditCms from '../cmscontent/editcms.js'

import * as tokenFunctions from '../../axioscalls/token.js'
import * as userFunctions from '../../axioscalls/user.js'

import wallet_details from '../../redux/action';


toast.configure();


export default function Addbulkusrs(props) {

  const history = useHistory();

  const [file, setFile] = useState({})

  const onChangehandler = async (e) => {
    var file = e.target.files[0]
  }



  return (

    <>

      <div>
        <div className="page-header">
          <button className='btn mt-2 allbtn' type='button' onClick={() => history.goBack()} >Back</button>
          <nav aria-label="breadcrumb">
          </nav>
        </div>
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">

            <div className="card">
              <div className="card-body">
                <h4 className="card-title">ADD USERS</h4>
                <input type="file" className='btn mt-2 allbtn' onChange={(e) => {
                  onChangehandler(e)
                }} style={{ flexDirection: 'row-reverse', }} />

                {/* <div>
                <p>Example File</p>
                <a download href={excel} > Download excel </a>
             </div> */}

                <div className="table-responsive">
                  <button className='btn mt-2 allbtn' onClick={() => {}} >Submit</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>



    </>

  )

}
