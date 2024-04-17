import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import * as tokenFunctions from '../../axioscalls/token.js'
import { EmailTemplateEdit } from './emailtemplateedit';
import config from '../../lib/config'

export default function EmailTemplateList(props) {


  const { push } = useHistory();
  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)
  const { UserAccountAddr, Admin_Address } = useSelector((state) => state.wallet_detail)



  const [emailTemplateList, setEmailTemplateList] = useState([])




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
      key: "Type",
      text: "Type",
      className: "NFT",
      align: "left",
    },
    {
      key: "Content",
      text: "Content",
      className: "NFT",
      align: "left",
      cell: record =>
        <div dangerouslySetInnerHTML={{ __html: record.Content }}></div>

    },


    {
      key: "Edit",
      text: "Edit",
      className: "NFT",
      align: "left",
      cell: record =>
        <div><button className='btn allbtn allbtns' onClick={() => push({ pathname: '/emailtemplateedit/' + record.Type, state: record })} >edit</button></div>
    },

  ]




  return (

    <>
      {path && path === "emailtemplateedit" ?
        <div>
          <EmailTemplateEdit detail={state} />
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
                  <h4 className="card-title">Email Template List</h4>

                  <div className="table-responsive">
                    <ReactDatatable

                      records={emailTemplateList}
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
