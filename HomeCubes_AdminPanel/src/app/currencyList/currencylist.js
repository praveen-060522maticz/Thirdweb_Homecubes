import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Select from 'react-select'
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
  const [ethtokenList, setethTokenList] = useState([])
  const [bnbtokenList, setbnbTokenList] = useState([])

  const [chainid, setChainid] = useState('')

  const options = [
    { value: 'ETH', label: 'ETH' },
    { value: 'BNB', label: 'BNB' },
  ]

  const columns = [

    {
      key: "label",
      text: "Token Name",
      className: "NFT NAME",
      align: "left",
      sortable: true,


    },
    {
      key: "address",
      text: "Token Address",
      className: "NFT IDT",
      align: "left",
      sortable: true,

    },
    {
      key: "delete",
      text: "Show / Hide Token",
      className: "NFT IDT",
      align: "left",
      // sortable: true,
      cell: record =>
        <div><button className='btn allbtn' onClick={() => { }}>{(record.deleted == 1) ? "SHOW" : "HIDE"}</button></div>

    },



  ]


  const customStyles = {
    option: (styles) => ({
      ...styles,
      cursor: 'pointer',
    }),
  }

  const onchange = (e) => {
    // e.preventDefault()
  }

  useEffect(()=>{
    getTokenList();
  },[])


  const getTokenList = async()=>{
    var resp = await tokenFunctions.getCurrencyList();
    if(resp?.success){
      console.log(":",resp?.msg,config);
      let eth=resp?.msg.filter((item)=> item.ChainId == String(config?.ETHCHAIN))
      let bnb=resp?.msg.filter((item)=> item.ChainId == String(config?.BNBCHAIN))
      console.log(":::",eth,bnb)
      // setTokenList(resp?.msg[0]?.CurrencyDetails)
      setethTokenList(eth[0]?.CurrencyDetails)
      setbnbTokenList(bnb[0]?.CurrencyDetails)
    }
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
                <h4 className="card-title">CURRENCY LIST</h4>
                <><Link to={{ pathname: `/addtoken`, state: { chain: chainid } }}>
                  <button className='btn mb-3 mt-3 allbtn' type='button'>Add Token</button>
                </Link>
                  <div className="table-responsive">
                    <ReactDatatable

                      records={ethtokenList}
                      columns={columns}
                    />
                  </div>
                </>


                {/* <Link to="/addtoken">
                <button className='btn mb-3 allbtn' type='button'>Add Token</button>
                </Link>
                <div className="table-responsive">
                <ReactDatatable

records={tokenList}
columns={columns}
/>
              
                </div> */}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>

  )

}


