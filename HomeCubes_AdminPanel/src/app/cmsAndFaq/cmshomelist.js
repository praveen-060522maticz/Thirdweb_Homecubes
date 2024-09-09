import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Edithomecms from '../cmsAndFaq/editcmshome'

import * as tokenFunctions from '../../axioscalls/token.js'
import wallet_details from '../../redux/action';
import config from '../../lib/config.js';

toast.configure();


export default function Cmshomelist(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathnameffstae", pathname, state, path)


  const Wallet_Details = useSelector((state) => state.wallet_detail)
  const [cmsList, setCmsList] = useState([])
  console.log("cmsssli", cmsList);
  const columns = [
    {
      key: "",
      text: "S No",
      className: "NFT",
      align: "left",
      sortable: true,
      cell: (record, index) =>
        <div>{index + 1}
        </div>

    },
    {
      // key: "title",
      text: "CMS title",
      className: "NFT NAME",
      align: "left",
      sortable: true,
      cell: rec => <div dangerouslySetInnerHTML={{ __html: rec?.title }} />

    },
    {
      key: "content",
      text: "CMS CONTENT",
      className: "NFT IDT",
      align: "left",
      sortable: true,
      cell: rec => <div dangerouslySetInnerHTML={{ __html: rec?.content }} />

    },
    // {
    //   key: "position",
    //   text: "CMS position",
    //   className: "NFT IDT",
    //   align: "left",
    //   sortable: true,

    // },
    {
      key: "page",
      text: "CMS page",
      className: "NFT IDT",
      align: "left",
      sortable: true,

    },
    {
      key: "link",
      text: "CMS link",
      className: "NFT IDT",
      align: "left",
      sortable: true,

    },
    {
      key: "img",
      text: "IMAGE",
      className: "image",
      align: "center",
      sortable: true,
      cell: record =>
        <>
          {record.img ? <img src={`${config.ImG}/cmsimg/${record.img}`} alt="img" height={50} width={50} /> : <></>}

        </>



    },
    {
      key: "edit",
      text: "Edit Content",
      className: "NFT IDT",
      align: "left",
      sortable: true,
      cell: record =>
        <div>
          <Link to={{ pathname: `/editcmshome`, state: record }} ><button className='btn allbtn allbtns'>Edit</button></Link></div>

    },
    // {
    //   key: "delete",
    //   text: "DELETE",
    //   className: "walletaddress",
    //   align: "center",
    //   sortable: true,
    //   cell:rec=> <div>{console.log("recoreddd",rec)}<button className='btn mt-2 allbtn'  onClick={() => DeleteFaq(rec, "delete")}>DELETE</button></div>



    // },



  ]

  useEffect(() => {
    getCmsList();
    console.log("/////////////////////////////////////");
  }, [])

  const DeleteFaq = async (data, filter) => {

    console.log("dfsf", data, filter)
    var payload = {
      _id: data._id,
      action: filter
    }

    console.log("payload", payload)

    var resp = await tokenFunctions.editCmsCall(payload);
    if (resp?.status) {
      toast.success("deleted")
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    }
    else return toast.error("error occured")
  }
  const getCmsList = async () => {
    var resp = await tokenFunctions.getCmsContent();
    if (resp?.status) {
      console.log("responseeeeeeeeeeeeeeeeeeeeeeeee");
      setCmsList(resp.data)
    }
  }



  return (

    <>
      {(path && path == "editcmshome") ?
        <Edithomecms cms={state ? state : {}} /> :
        <div>
          <div className="page-header">
            <nav aria-label="breadcrumb">

            </nav>
          </div>
          <div className="row">

            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <Link to="/addcmshome">
                    <button className='btn mt-2 mb-3 allbtn'>Add Cms</button>
                  </Link>
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


