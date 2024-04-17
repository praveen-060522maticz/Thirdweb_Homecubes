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



import EditFaq from "../../app/faqlist/editfaq.js"
import { getFaqList, addFaqCall, getFaqContentsList, addFaqcontentCall } from '../../axioscalls/user.js'

toast.configure();


export function FaqList() {

  const history = useHistory();
  const Wallet_Details = useSelector((state) => state.wallet_detail)

  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)

  const [faqList, setFaqList] = useState([]);
  console.log("faqList",faqList)
  const [contents, setContents] = useState([]);
console.log("contents",contents)

  useEffect(() => {
    bsCustomFileInput.init()

  }, [])



  const columns = [
    {
      key: "question",
      text: "Question",
      className: "NFT NAME",
      align: "left",
      sortable: true,
      cell: rec =>
      rec?.question?.length > 15 ? <>{rec?.question.slice(0,10)}...</> : rec?.question

    },
    {
      key: "answer",
      text: "Answer",
      className: "NFT IDT",
      align: "left",
      sortable: true,
      wrap: true,
      width: "80px",
      maxWidth: "80px",      
      cell: rec =>
        <div dangerouslySetInnerHTML={{ __html:rec.answer }}></div>

    },


    {
      key: "isAdmin",
      text: "Edit FAQ",
      className: "NFT IDT",
      align: "left",
      // sortable: true,
      cell: record =>
        <div><Link to={{ pathname: '/editfaq', state: record }}><button className='btn allbtn allbtns' type='button'>Edit</button></Link></div>

    },
    {
      key: "isAdmin",
      text: "Delete FAQ",
      className: "NFT IDT",
      align: "left",
      // sortable: true,
      cell: record =>
        <div><button className='btn allbtn allbtns' type='button' onClick={() => DeleteFaq(record, "delete")}>Delete</button></div>

    },

   
      // {
      //   key: "isAdmin",
      //   text: "Edit FAQ",
      //   className: "NFT IDT",
      //   align: "left",
      //   sortable: false,
      //   cell:record=>
      //   <div><Link to={{pathname:'/editfaq',state:record}}><button >EDIT</button></Link></div>
    
      // },
      // {
      //   key: "isAdmin",
      //   text: "Delete FAQ",
      //   className: "NFT IDT",
      //   align: "left",
      //   sortable: false,
      //   cell:record=>
      //   <div><button   onClick={()=>DeleteFaq(record,"delete")}>DELETE</button></div>
    
      // },
  
  
  
   
    

  ]



  useEffect(() => {
    getFaqDetails();
    getFaqContentsDetails();
  }, [])

  const getFaqDetails = async () => {
    var getall = {
      action : "all"
    }
    var resp = await addFaqCall(getall);
    if (resp?.status)
      setFaqList(resp.data);

  }


  const DeleteFaq = async (data, filter) => {

    console.log("dfsf", data, filter)
    var payload = {
      question: data.question,
      answer: data.answer,
      filter: filter
    }

    console.log("payload", payload)

    var resp = await addFaqCall(payload);
    if (resp?.status) {
      toast.success(resp.msg)
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    }
    else return toast.error(resp.msg)




  }

  const getFaqContentsDetails = async () => {
    var resp = await getFaqContentsList();
    console.log("resp userlist", resp)
    if (resp?.status)
      setContents(resp.data);
  }


  const DeleteFaqcontent = async (data, filter) => {

    console.log("dfsf", data, filter)
    var payload = {
      faqcontent: data.faqcontent,
      filter: filter
    }

    console.log("payload", payload)

    var resp = await addFaqcontentCall(payload);
    if (resp?.status) {
      toast.success(resp.msg)
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    }
    else return toast.error(resp.msg)




  }



  return (

    <>


      {path && path == "editfaq" ?
        <EditFaq faq={state ? state : {}} /> :
        <div>
          <div className="page-header">
            <nav aria-label="breadcrumb">

            </nav>
          </div>
          <div className="row">

            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">FAQ LIST</h4>
                  <Link to="/addfaq" >
                    <button className='btn mb-3 allbtn' type='button'>Add FAQ</button>
                  </Link>
                  <div className='faq'>
                    <ReactDatatable
                      // className="tension"
                      records={faqList}
                      columns={columns}
                    />
                  </div>

                  {/* <h4 className="card-title mt-4">FAQ CONTENT LIST</h4>
                  <Link to="/addfaqcontent">
                    <button className='btn mb-3 allbtn' type='button'>Add Faq Content</button>
                  </Link>
                  <div className="table-responsive">
                    <ReactDatatable

                      records={contents}
                      columns={columns_in}
                    />
                    {console.log('stateeee', contents)}

                  </div> */}
                </div>
              </div>

            </div>

          </div>
        </div>}





    </>

  )
}

export default FaqList;
