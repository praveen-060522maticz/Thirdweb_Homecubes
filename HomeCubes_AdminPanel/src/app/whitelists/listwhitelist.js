import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';
import config from '../../lib/config.js'


import EditFaq from "../../app/faqlist/editfaq.js"
import { addwhitelists, hideShowwallet } from '../../axioscalls/admin.js'

toast.configure();


export function Listwhitelist() {

  const history = useHistory();
  const Wallet_Details = useSelector((state) => state.wallet_detail)

  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)

  const [whitelistss, setwhitelists] = useState([]);
  console.log("whitelistss", whitelistss)

  const { Categorys, UserAccountAddr, web3, web3p } = useSelector(
    (state) => state.wallet_detail
  );

  useEffect(() => {
    bsCustomFileInput.init()

  }, [])

  const handlesubmitmail = async (data) => {
    console.log("datasds", data.gmail);
    var mail = {
      gmail: data.gmail,
      action: "send"
    }
    var resp = await addwhitelists(mail);
    console.log("masdilresp", resp);
  }

  const columns = [

    {
      key: "walletAddress",
      text: "walletAddress",
      className: "NFT walletAddress",
      align: "left",
      sortable: true,
      wrap: true,
      width: "80px",
      maxWidth: "80px",
      cell: rec =>
        <div>{console.log("wlafawelf", rec)}{rec.walletAddress}</div>

    },
    {
      key: "gmail",
      text: "Gmail",
      className: "NFT wwalletAddress",
      align: "left",
      // sortable: true,

    },
    // {
    //   key: "Delete",
    //   text: "walletted",
    //   className: "NFT walletted",
    //   align: "left",
    //   // sortable: true,
    //   cell: record =>
    //     <div>{console.log("recordsasds", record)}<button className='btn allbtn allbtns' onClick={() => hideShownft(record.whitelisted == "true" ? "false" : "true", record.walletAddress)}>{record.whitelisted == "true" ? "false" : "true"}</button></div>


    // },
    //   {
    //     key: "Send",
    //     text: "Send",
    //     className: "NFT wwalletAddress",
    //     align: "left",
    //     sortable: true,
    //     cell: record =>
    //       <div>{console.log("rerererere",record._id)}<button className='btn allbtn allbtns'>send</button></div>


    //   },
    {
      text: "Send",
      cell: record =>
        <div>{console.log("Send", record)}
          {UserAccountAddr.toLowerCase() ==
            config.AdminAddress.toLowerCase() && <Link to={{ pathname: `/selectwhitelist/${record._id}`, state: record }}  >
              <button className='btn mb-2 allbtn' type='button'>send</button>
            </Link>}
        </div>

    },

  ]



  useEffect(() => {
    addwhitelistsdetail();
  }, [])

  const addwhitelistsdetail = async () => {
    var getall = {
      action: "all"
    }
    var resp = await addwhitelists(getall);
    if (resp?.status == true)
      setwhitelists(resp.data);

  }

  const hideShownft = async (data, walletAddress) => {
    var payload = { whitelisteds: data, walletName: walletAddress }
    var resp = await hideShowwallet(payload);
    if (resp?.status) {
      toast.success(resp.msg)
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    else toast.error(resp.msg)

  }


  return (

    <>
      <div>
        <div className="page-header">
          <nav aria-label="breadcrumb">

          </nav>
        </div>
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">WALLETADDRESS LIST</h4>
                {UserAccountAddr.toLowerCase() ==
                  config.AdminAddress.toLowerCase() && (<Link to="/addwhitelist" >
                    <button className='btn mb-3 allbtn' type='button'>Add WalletAddress</button>
                  </Link>)}
                <div className='walletAddress'>
                  <ReactDatatable
                    // className="tension"
                    records={whitelistss}
                    columns={columns}
                  />
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </>

  )
}

export default Listwhitelist;
