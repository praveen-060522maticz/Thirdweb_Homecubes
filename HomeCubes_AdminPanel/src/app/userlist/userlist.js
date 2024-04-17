import React, { Component,useEffect,useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';



import {getUserList,adminAccess} from '../../axioscalls/user.js'

toast.configure();


export function UserList()  {

  const history = useHistory();
  const Wallet_Details = useSelector((state)=>state.wallet_detail)

  const [userList,setUserList] = useState([])


useEffect(()=>{
    bsCustomFileInput.init()

},[])



const columns = [

    {
      key: "DisplayName",
      text: "User Name",
      className: "NFT NAME",
      align: "left",
      sortable: true,
     
  
    },
    {
      key: "WalletAddress",
      text: "User Address",
      className: "NFT IDT",
      align: "left",
      sortable: true,
  
    },
    {
        key: "ProfileUrl",
        text: "custom URL",
        className: "NFT IDT",
        align: "left",
        sortable: true,
    
      },
      {
        key: "Bio",
        text: "User Bio",
        className: "NFT IDT",
        align: "left",
        sortable: true,
    
      },

      {
        key: "EmailId",
        text: "Email Address",
        className: "NFT IDT",
        align: "left",
        sortable: true,
    
      },
      // {
      //   key: "isAdmin",
      //   text: "Admin status",
      //   className: "NFT IDT",
      //   align: "left",
      //   sortable: true,
      //   cell:record=>
      //   <div><button type='checkbox' checked={record.isAdmin == "Yes"?true:false} onClick={()=>giveAdminAccess(record)}></button></div>
    
      // },
  
  
   
    
  ]


useEffect(()=>{
    getUserDetails();
},[])

const getUserDetails = async()=>{
    var resp = await getUserList();
    console.log("resp userlist",resp)
    if(resp?.status)
       setUserList(resp.data);
}


const giveAdminAccess = async(data)=>{
    console.log("userdat,",data)
    var paylaod = {
        adminStatus:data.isAdmin == "Yes"?"No":"Yes",
        url:data.ProfileUrl
    }

    var resp = await adminAccess(paylaod)
    if(resp?.status){
        toast.success(resp.msg)
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    else{
        toast.error(resp.msg)
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
            <h4 className="card-title">USER LIST</h4>
           
            <div className="table-responsive">
            <ReactDatatable

records={userList}
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

export default UserList;
