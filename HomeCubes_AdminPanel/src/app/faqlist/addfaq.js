import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';

import { addFaqCall } from '../../axioscalls/user.js'
toast.configure();


export function AddFaq() {

  const history = useHistory();

  useEffect(() => {
    bsCustomFileInput.init()

  }, [])



  const initData = {
    "question": "",
    "answer": ""
  }

  const [formData, setFormData] = useState(initData)
  const [question, SetQuestion] = useState("");
  const [answer, SetAnswer] = useState("");


  var form = formData



  const handlechange = async (e) => {
    // e.preventDefault();
    e.preventDefault();
      const{id,value} = e.target;
      console.log("value",value,"formdata",formData)
    //   let formdata = { ...formData, ...{ ["question"]: value } }
    //   console.log("formdata updated:",formdata)
    //  // setFormData(formdata);
      SetQuestion(value);
      // form.question=question;
      // console.log("Question",formData)
    }
    

    
   

  const onEditorChange = (evt) => {
  
    console.log("oneditor change formdata :",formData);
    var description_text = evt.editor.getData() 
   
    
    // let formdata = { ...formData, ...{ ['answer']: description_text } }
    // console.log("answer formdata",formdata);
    // setFormData(formdata)
    SetAnswer(description_text)

  }

  const History = useHistory();

  const handleSubmit = async () => {
    var form = formData;
     form.question = question;
     form.answer = answer;
     console.log("handle form : ",form)
      setFormData(form)
      console.log("Form Data : ",formData)
      var errors = {};
      if(!formData.question){
        errors.question = "question cannot be empty"
        return toast.error("question cannot be empty")}
    
      if(!formData.answer){
        errors.answer = "answer cannot be empty"
        return toast.error("answer cannot be empty")}
    
      if(Object.keys(errors).length == 0){
    
         console.log("erro length",Object.keys(errors).length,formData)
    
         var payload = {
          question:formData.question,
          answer:formData.answer,
          action:"add"
         }
    
         console.log("payload",payload)
     
         var resp = await addFaqCall(payload);
        if(resp?.status == true){
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
      {console.log('fgfgsdfga', formData)}
      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button className='btn mb-3 allbtn' type='button' onClick={() => History.goBack()} >Back</button>
              <h4 className="card-title mt-3">ADD FAQ</h4>
              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">Name</label>
                  <Form.Control type="text" className="form-control" id="question" placeholder="Enter question" value={question} onChange={(e) => handlechange(e)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">content</label>
                  {
                    // formData?.answer&& 
                    <CKEditor
                      // initData={formData?.answer}
                      onChange={onEditorChange}
                    />}
                </Form.Group>
              </form>
              <button className='btn mb-2 allbtn' type='button' onClick={() => handleSubmit()}>SUBMIT</button>

            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default AddFaq;



