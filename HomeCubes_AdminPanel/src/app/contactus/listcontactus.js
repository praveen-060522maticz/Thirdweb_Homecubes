import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';



import EditFaq from "../../app/faqlist/editfaq.js"
import { getFaqList, addFaqCall, getFaqContentsList, addFaqcontentCall, addcontactus,addcontactdata } from '../../axioscalls/user.js'

toast.configure();


export function Listcontactus() {

  const history = useHistory();

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
      key: "Name",
      text: "NAME",
      className: "NFT NAME",
      align: "left",
      sortable: true,

    },
    {
      key: "email",
      text: "Email",
      className: "NFT IDT",
      align: "left",
      sortable: true,
    

    },

    {
        key: "comment",
        text: "COMMENT",
        className: "NFT IDT",
        align: "left",
        sortable: true,

  
      },
  ]



  useEffect(() => {
    getFaqDetails();
  }, [])

  const getFaqDetails = async () => {
    var getall = {
      action : "all"
    }
    var resp = await addcontactdata(getall);
    console.log("respp",resp.data.data)
    if (resp?.status)
      setFaqList(resp.data.data);

  }


//   const DeleteFaq = async (data, filter) => {

//     console.log("dfsf", data, filter)
//     var payload = {
//       question: data.question,
//       answer: data.answer,
//       filter: filter
//     }

//     console.log("payload", payload)

//     var resp = await addFaqCall(payload);
//     if (resp?.status) {
//       toast.success(resp.msg)
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);

//     }
//     else return toast.error(resp.msg)




//   }

//   const getFaqContentsDetails = async () => {
//     var resp = await getFaqContentsList();
//     console.log("resp userlist", resp)
//     if (resp?.status)
//       setContents(resp.data);
//   }






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
                  <h4 className="card-title">CONTACT LIST</h4>
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

export default Listcontactus;
