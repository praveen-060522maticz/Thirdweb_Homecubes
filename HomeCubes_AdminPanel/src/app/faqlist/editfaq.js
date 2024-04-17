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


export function EditFaq(props) {

  const history = useHistory();

  const { faq } = props;
  console.log(faq, "faqqq")

  // useEffect(()=>{
  //     bsCustomFileInput.init()

  // },[])


  useEffect(() => {
    setFormData(faq)
    setAnser(faq.answer)
    setQuestion(faq.question)
    setId(faq._id)
  }, [])


  const onEditorChange = (evt) => {
    var description_text = evt.editor.getData()
    setAnser(description_text)
  }
  const initData = {
    "question": "",
    "answer": ""
  }

  const [formData, setFormData] = useState(initData)
  const [Answer, setAnser] = useState('')
  const[question,setQuestion]=useState("")
  const[id,setId]=useState("")

  





  const handlechange = async (e) => {
    try {
      e.preventDefault();
      const { id, value } = e.target;
      setQuestion(value)
    } catch (err) {
      console.log(err, 'handlechange__er')
    }
  }

  const handleSubmit = async () => {
    var errors = {};

    if (!formData.answer) {
      errors.answer = "answer cannot be empty"
      return toast.error("answer cannot be empty")
    }

    if (Object.keys(errors).length == 0) {

      console.log("erro length", Object.keys(errors).length, formData)

      var payload = {
        id:id,
        question: question,
        answer: Answer,
        action: "edit"
      }

      console.log("payload", payload)

      var resp = await addFaqCall(payload);
      if (resp?.status) {
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
            <button className='btn mb-3 allbtn' type='button' onClick={()=> history.goBack()} >Back</button>

              <h4 className="card-title mt-3">EDIT FAQ</h4>
              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">question</label>
                  <Form.Control type="text" className="form-control" id="question" value={question} onChange={(e) => handlechange(e)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">content</label>
                  {
                    Answer &&
                    <CKEditor
                      initData={Answer && Answer}
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

export default EditFaq;
