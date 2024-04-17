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
import * as adminFunction from '../../axioscalls/admin'
import * as tokenFunctions from '../../axioscalls/token.js'
import * as userFunctions from '../../axioscalls/user.js'

import wallet_details from '../../redux/action';
import config from '../../lib/config.js';

toast.configure();


export default function Aboutuserlist(props) {
  console.log("hfjhdfsfss", config.ImG)

  var history = useHistory();

  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathnamestae", pathname, state, path)

  const [aboutlist, setaboutlist] = useState([]);
  console.log("aboutlist", aboutlist)
  const [contents, setContents] = useState([]);
  console.log("contents", contents)
  //   const Wallet_Details = useSelector((state)=>state.wallet_detail)
  useEffect(() => {
    getaboulist()
    window.scroll(0,0)
  }, [])

  const getaboulist = async () => {
    var resp = await tokenFunctions.addaboutuser({ action: "all" })
    console.log("responsee", resp)
    if (resp?.status) {
      setaboutlist(resp?.data ?? [])
    }
  }
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
      key: "title",
      text: "TITLE",
      className: "Email",
      align: "center",
      sortable: true,


    },

    {
      key: "content",
      text: "CONTENT",
      className: "Email",
      align: "center",
      sortable: true,
      cell: rec => <div dangerouslySetInnerHTML={{ __html: rec.content }} />


    },
    // {
    //   key: "img",
    //   text: "IMAGE",
    //   className: "image",
    //   align: "center",
    //   sortable: true,
    //   cell: rec =>
    //     <img src={`${config.ImG}/${rec.img}`} alt="img" height={50} width={50} />



    // },
    // {
    //   key: "Edit",
    //   text: "edit",
    //   className: "walletaddress",
    //   align: "center",
    //   sortable: true,
    //   cell: rec => <div><Link to={{ pathname: '/editaboutuser', state: rec }}><button className='btn mt-2 allbtn' >EDIT</button></Link></div>



    // },
    {
      text: "aboutusteps",
      cell: record =>
        <div>
          <Link to={{ pathname: `/aboutList/${record._id}` }}  >
            {/* // <Link to="/GalleryList" state={{ route: "sefseoifoeifhsoeif" }} > */}
            <button className='btn mb-2 allbtn' type='button'>Steps</button>
          </Link>
        </div>//checked={true}

    },
    {
      text: "investmentList",
      cell: record =>
        <div>
          <Link to={{ pathname: `/investmentList/${record._id}` }}  >
            {/* // <Link to="/GalleryList" state={{ route: "sefseoifoeifhsoeif" }} > */}
            <button className='btn mb-2 allbtn' type='button'>Investment</button>
          </Link>
        </div>//checked={true}

    },


    {
      text: "Edit",
      cell: record => {
        return (
          <div>
            <Link to={{ pathname: "/aboutEdit", state: record }}  >
              <img src={require("../../assets/images/pencil.svg")} alt="profile" />
            </Link>
          </div>
        )
      }
    },

  ]


  return (

    <>
      {/* {(path && path == "editsociallink")? */}
      {/* <EditSocial rec={state?state:{}}/>: */}

      <div>
        <div className="page-header">
          <nav aria-label="breadcrumb">
          </nav>
        </div>
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">About Us</h4>
                <Link to="/addaboutuser">
                  <button className='btn mt-2 allbtn mb-3' type='button'>Add about Us</button>
                </Link>

                <div className="table-responsive">
                  <ReactDatatable

                    records={aboutlist}
                    columns={columns}
                  />

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* } */}

    </>

  )

}
