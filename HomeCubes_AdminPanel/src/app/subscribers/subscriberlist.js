import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import wallet_details from '../../redux/action';
import config from '../../lib/config.js';
import { getSubscribers } from '../../axioscalls/user.js';

toast.configure();


export default function CmsList(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)


  const Wallet_Details = useSelector((state) => state.wallet_detail)
  const [subscriberList, setSubscriberList] = useState([])
  const [allcheck, setAllcheck] = useState(false);


  const columns = [

    {
      key: "email",
      text: "Subscriber Mail",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },

    // {
    //   key: "select",
    //   text: "Select Subscribers",
    //   className: "NFT NAME",
    //   align: "left",
    //   // sortable: true,
    //   cell: record =>
    //     <div><input type="checkbox" checked={record.maySent} onClick={() => setMaySent(record)} /></div>


    // },
  ]

  useEffect(()=>{
    getSubscribers().then(val => setSubscriberList(val?.data ?? []))
  },[])

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
                <h4 className="card-title">SUBSCRIBERS LIST</h4>
                <div style={{ flexDirection: "column" }}>

                  {subscriberList.length > 0 ? <> <Link to="/sendmail">
                    <button className='btn mt-0 mb-4 allbtn' type='button'>Send Mail</button>
                  </Link></> : <><button className='btn mt-0 mb-4 allbtn' type='button'>Send Mail</button></>}
                  {/* <Link to="/sendmail">
             <button className='btn mt-0 mb-4 allbtn' type='button'>Send Mail</button>
             </Link> */}
                </div>
                <div className="table-responsive">
                  {/* <div className='mb-3'>
                    Select All
                    <input type="checkbox" className='selectall ml-2' checked={allcheck} /></div> */}
                  <ReactDatatable

                    records={subscriberList}
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


