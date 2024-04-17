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


export default function Articlelist(props) {
  console.log("hfjhdfsfss", config.ImG)

  var history = useHistory();

  //   var location = useLocation();
  //   const{pathname,state}=location;
  //   const path = pathname.split("/")[1]
  //   console.log("pathname,stae",pathname,state,path)


  //   const Wallet_Details = useSelector((state)=>state.wallet_detail)
  const [article, setArticlelist] = useState([])


  const columns = [

    {
      key: "heading",
      text: "HEADING",
      className: "Email",
      align: "center",
      sortable: true,


    },
    {
      key: "url",
      text: "URL",
      className: "date",
      align: "center",
      sortable: true,

    },
    {
      key: "content",
      text: "CONTENT",
      className: "walletaddress",
      align: "center",
      sortable: true,
      cell: rec => <div dangerouslySetInnerHTML={{ __html: rec?.content.toString().length > 100 ? rec?.content.toString().slice(0, 100) + "...." : rec?.content }} />


    },
    {
      key: "img",
      text: "IMAGE",
      className: "image",
      align: "center",
      sortable: true,
      cell: rec =>
        <img src={`${config.ImG}/${rec.img}`} alt="img" height={50} width={50} />



    },
    {
      key: "date",
      text: "DATE",
      className: "date",
      align: "center",
      sortable: true,
      cell: rec =>
        <p>{new Date(String(rec?.date)).toISOString().split('T')[0]}</p>

    },
    {
      key: "Edit",
      text: "edit",
      className: "walletaddress",
      align: "center",
      sortable: true,
      cell: rec => <div><Link to={{ pathname: '/editarticle', state: rec }}><button className='btn mt-2 allbtn' >EDIT</button></Link></div>



    },
    {
      key: "delete",
      text: "DELETE",
      className: "walletaddress",
      align: "center",
      sortable: true,
      cell: rec => <div><button className='btn mt-2 allbtn' onClick={() => DeleteFaq(rec, "delete")}>DELETE</button></div>



    },
  ]

  const DeleteFaq = async (data, filter) => {
  }
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
                <h4 className="card-title ">Articles</h4>
                <Link to="/addarticle">
                  <button className='btn mt-2 mb-3 allbtn'>Add Article</button>
                </Link>
                <div className="table-responsive">
                  <ReactDatatable

                    records={article}
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
