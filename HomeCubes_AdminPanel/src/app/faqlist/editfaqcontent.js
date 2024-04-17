import React, { Component,useEffect,useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';

import {addFaqcontentCall} from '../../axioscalls/user.js'
toast.configure();


export function EditFaqContent(props)  {

  const history = useHistory();

  const {faqcontent} = props.location.state;
  const {_id}=props.location.state;
  console.log('faqqqq',faqcontent,props.location.state)
  const initData = {
    "faqcontent":""
}

const [formData,setFormData] = useState({faqcontent:faqcontent,_id:_id}) 

useEffect(()=>{
    bsCustomFileInput.init()

},[])


useEffect(()=>{
 setFormData(faqcontent)
},[props])


const onEditorChange = (evt) => {
  var description_text = evt.editor.getData() 
  let formdata = { ...formData, ...{ ['faqcontent']: description_text } }
  setFormData(formdata)
  console.log("================",formdata);
}








const handleSubmit = async()=>{
  var errors = {};
  console.log("//////////////",formData);
 
  if(!formData.faqcontent){
    errors.answer = "answer cannot be empty"
    return toast.error("answer cannot be empty")}

  if(Object.keys(errors).length == 0){

     console.log("erro length",Object.keys(errors).length,formData)

     var payload = {
      
      faqcontent:formData.faqcontent,
      id:formData._id,
      action:"edit"
     }

     console.log("////////////payload",payload);
 
    var resp = await addFaqcontentCall(payload);
    if(resp?.status){
      toast.success(resp.msg)
      setTimeout(() => {
        history.push("/faqlist")
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
                <h4 className="card-title">EDIT FAQ Content</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">content</label>
                    {
                // formData?.faqcontent && 
                < CKEditor
		initData={formData?.faqcontent}
    onChange={onEditorChange}
	/>}
  {console.log("/'/'/'/'/'",formData?.faqcontent)}
                </Form.Group>
               
                  
                 
                </form>
              <button className='btn mb-2 allbtn' type='button' onClick={()=>handleSubmit()}>SUBMIT</button>

              </div>
            </div>
          </div>
         
        </div>
      </div>
    )
  
}

export default EditFaqContent;
