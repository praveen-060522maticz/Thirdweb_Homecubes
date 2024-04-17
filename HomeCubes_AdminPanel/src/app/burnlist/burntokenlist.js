import React, { Component,useEffect,useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory ,Link,useLocation} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';



import EditFaq from "../../app/faqlist/editfaq.js"
import { getBurnTokens} from '../../axioscalls/token.js'

toast.configure();


export function BurnList()  {

  const history = useHistory();
  const Wallet_Details = useSelector((state)=>state.wallet_detail)

  var location = useLocation();
  const{pathname,state}=location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae",pathname,state,path)

  const [burnList,setBurnList] = useState([])


useEffect(()=>{
    bsCustomFileInput.init()

},[])



const columns = [

    {
      key: "TokenId",
      text: "Token Id",
      className: "NFT IDT",
      align: "left",
      sortable: true,
  
    },

    {
      key: "TokenOwner",
      text: "Token Owner",
      className: "NFT NAME",
      align: "left",
      sortable: true,
     
  
    },
    {
        key: "TokenQuantity",
        text: "Token Quantity",
        className: "NFT IDT",
        align: "left",
        sortable: true,
    
      },
      {
        key: "TokenBalance",
        text: "Token Balance",
        className: "NFT IDT",
        align: "left",
        sortable: true,
    
      },
      {
        key: "burnToken",
        text: "Tokens Burned",
        className: "NFT IDT",
        align: "left",
        sortable: true,
    
      },
 

   

    
  
  
   
    
  ]


useEffect(()=>{
    getBurnList();
},[])

const getBurnList = async()=>{
    var resp = await getBurnTokens();
    console.log("resp userlist",resp)
    if(resp?.status)
       setBurnList(resp.data);
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
            <h4 className="card-title">BURN TOKEN LIST</h4>
         
            <div className="table-responsive">
            <ReactDatatable

records={burnList}
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

export default BurnList;
