import React, { Component, useEffect, useState } from 'react';
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';



// import ViewReportToken from "../../app/report/viewreporttoken.js"
import { getReportTokens, manageReportToken } from '../../axioscalls/token.js'
import moment from 'moment'
import { Form } from 'react-bootstrap';
toast.configure();


export function ReportList() {


  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)

  const [reportList, setReportList] = useState([])
  const [nft, SetNft] = useState({})
  const history = useHistory()

  useEffect(() => {
    bsCustomFileInput.init()

  }, [])

  const columns = [

    {
      key: "NFTId",
      text: "Token Id",
      className: "NFT IDT",
      align: "left",
      sortable: true,

    },

    {
      key: "NFTName",
      text: "Report",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },
    {
      key: "report",
      text: "Reporters Count",
      className: "NFT NAME",
      align: "left",
      sortable: true,
      cell: rec =>
        <>{rec.ReportBy.length}</>

    },
    {
      key: "updatedAt",
      text: "Last Modified",
      className: "NFT NAME",
      align: "left",
      sortable: true,
      cell: rec =>
        <>{moment(rec.updatedAt).from()}</>

    },
    {
      key: "reported",
      text: "Visible On Marketplace",
      className: "NFT NAME",
      align: "left",
      sortable: true,
      cell: rec =>
        <>{!rec.reported ? 'VISIBLE' : 'HIDDEN'}</>

    },
    {
      key: "view",
      text: "View Token",
      className: "NFT NAME",
      align: "left",
      sortable: true,
      cell: record =>
        <div><Link to={{ pathname: `/viewreporttoken`, state: record }}><button className='btn mt-0 mb-4 allbtn'>VIEW</button></Link></div>


    },

  ]




  const columns_in = [

    {
      key: "Address",
      text: "Reporter Address",
      className: "NFT IDT",
      align: "left",
      sortable: true,

    },

    {
      key: "CustomUrl",
      text: "Reporter URL",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },
    {
      key: "CustomUrl",
      text: "Reporter LINK",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },
    {
      key: "Message",
      text: "Message",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },
  ]



  return (

    <>
      {path && path == "viewreporttoken" ?
        <div>

          <div className="row">

            <div className="col-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <button className='btn mb-3 allbtn' type='button' onClick={() => history.goBack()} >Back</button>
                  <h4 className="card-title">Token Details</h4>
                  <form className="forms-sample">
                    <Form.Group>
                      <label htmlFor="exampleInputName1">NFT Name</label>
                      <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={nft.NFTName} />
                    </Form.Group>
                    <Form.Group>
                      <label>NFT ID</label>
                      <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={nft.NFTId} />

                    </Form.Group>

                    <Form.Group>
                      <label>NFT Token Contract Address</label>
                      <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={nft.ContractAddress} />

                    </Form.Group>
                    <Form.Group>
                      <label>NFT Token Type</label>
                      <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={nft.ContractType} />

                    </Form.Group>


                  </form>
                  <button className='btn mt-2 allbtn' onClick={() => {}}>{!nft.reported ? "Hide Token" : "Make Token Visible"}</button>
                </div>

              </div>
            </div>

          </div>
          <div className="row">

            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">REPORTERS LIST</h4>

                  <div className="table-responsive">
                    <ReactDatatable
                      records={nft.ReportBy}
                      columns={columns_in}
                    />

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        :
        <div>
          <div className="page-header">
            <nav aria-label="breadcrumb">

            </nav>
          </div>
          <div className="row">

            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">REPORT TOKEN LIST</h4>

                  <div className="table-responsive">
                    <ReactDatatable
                      records={reportList}
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

export default ReportList;
