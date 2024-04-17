import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import * as tokenFunctions from '../../axioscalls/token.js'
import wallet_details from '../../redux/action';
import config from '../../lib/config.js';

toast.configure();


export default function CategoryList(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)


  const Wallet_Details = useSelector((state) => state.wallet_detail)
  const [catList, setCatList] = useState([])

  const columns = [

    {
      key: "name",
      text: "Category Name",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },
    {
      key: "description",
      text: "Category Description",
      className: "NFT IDT",
      align: "left",
      cel: record => record?.description.length > 19 ? record?.description.slice(0, 20) : record?.description



    },
    {
      key: "Delete",
      text: "Hide/Show Category",
      className: "NFT IDT",
      align: "left",
      // sortable: true,
      cell: record =>
        <div><button className='btn allbtn allbtns' onClick={() => { }}>{record.hideShow == "hidden" ? "SHOW" : "HIDE"}</button></div>


    }


  ]




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
                <h4 className="card-title">CATEGORIES</h4>
                <Link to="/addcategory">
                  <button className='btn mb-3 allbtn' type='button'>Add Category</button>
                </Link>
                <div className="table-responsive">
                  <ReactDatatable

                    records={catList}
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


