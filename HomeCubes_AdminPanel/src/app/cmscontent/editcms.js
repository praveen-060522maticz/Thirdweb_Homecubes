import React, { Component,useEffect,useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";

import {editCmsCall} from '../../axioscalls/token.js'
toast.configure();


export function EditCms(props)  {

  const history = useHistory();

useEffect(()=>{
    bsCustomFileInput.init()

},[])

const {cms} = props;


const initData = {
  "question":"",
  "answer":""
}

const [formData,setFormData] = useState(initData) 

const {
  question,
  answer
 
} = formData


useEffect(()=>{
console.log("cms state",cms);
setFormData(cms)

},[props])


const handlechange = async(e)=>{
  e.preventDefault();
  const{id,value} = e.target;
  console.log("value",value)
  let formdata = { ...formData, ...{ [id]: value } }
  setFormData(formdata)
  console.log("formval",formData)
}

const handleSubmit = async()=>{
  var errors = {};

  if(!formData.answer){
    errors.answer = "Content cannot be empty"
    return toast.error("Content cannot be empty")}

  if(Object.keys(errors).length == 0){

     console.log("erro length",Object.keys(errors).length,formData)

     var payload = {
      question:formData.question,
      answer:formData.answer
     }

     console.log("payload",payload)
 
     var resp = await editCmsCall(payload);
    if(resp?.status){
      toast.success(resp.msg)
      setTimeout(function(){ 
        history.push("/cmslist")
      }, 1000);
      
    } 
    else return toast.error(resp.msg)

  }
}






    return (
      <div>
   
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">CMS</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Name</label>
                    <Form.Control type="text" className="form-control" id="question" placeholder="topic" value={formData.question} />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">content</label>
                    <Form.Control type="text" className="form-control" id="answer" placeholder="content" value={formData.answer} onChange={(e)=>handlechange(e)}/>

                </Form.Group>
               
                  
                 
                </form>
              </div>
              <button className='btn mb-2 allbtn' type='button' onClick={()=>handleSubmit()}>SUBMIT</button>
            </div>
          </div>
         
        </div>
      </div>
    )
  
}

export default EditCms
