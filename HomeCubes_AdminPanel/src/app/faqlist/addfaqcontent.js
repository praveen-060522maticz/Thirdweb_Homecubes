


         
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


export function FaqContent()  {

  const history = useHistory();

useEffect(()=>{
    bsCustomFileInput.init()

},[])



const initData = {
  "faqcontent":""
}

const History = useHistory(); 
const [formData,setFormData] = useState(initData);



var form=formData



// const handlechange = async(e)=>{
//   e.preventDefault();
//   const{id,value} = e.target;
//   console.log("value",value,"formdata",formData)
// //   let formdata = { ...formData, ...{ ["question"]: value } }
// //   console.log("formdata updated:",formdata)
// //  // setFormData(formdata);
//   SetQuestion(value);
//   form.question=question;
//   console.log("Question",formData)
// }

const onEditorChange = (evt) => {
  var content_text = evt.editor.getData() 
 
  
  let formdata = { ...formData, ...{ ['faqcontent']: content_text } }
  console.log("formdata",formdata);
  setFormData(formdata)



}

const handleSubmit = async()=>{
//  var form = formData;
//   form.faqcontent = faqcontent;
//  console.log("handle form : ",form)
//   setFormData(form)
//   console.log("Form Data : ",formData)
  var errors = {};
 
  if(!formData.faqcontent){
    errors.answer = "Faqcontent cannot be empty"
    return toast.error("Faqcontent cannot be empty")}

  if(Object.keys(errors).length == 0){

     console.log("erro length",Object.keys(errors).length,formData)

     var payload = {
      faqcontent:formData.faqcontent,
      action:"add"
     }

    //  console.log("payload",payload)
 
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
              <button className='btn mb-3 allbtn' type='button' onClick={()=> History.goBack()} >Back</button>
                <h4 className="card-title">ADD FAQ CONTENT</h4>
                <form className="forms-sample">

                  <Form.Group>
                    <label htmlFor="exampleInputName1">content</label>
                    {
                // formData?.answer&& 
                <CKEditor
                initData={formData?.faqcontent}
    onChange={onEditorChange}
	/>}
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

export default FaqContent;
