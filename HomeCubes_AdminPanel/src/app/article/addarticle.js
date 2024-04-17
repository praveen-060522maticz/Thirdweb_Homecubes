



import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';
import config from '../../lib/config'

import { addarticle } from '../../axioscalls/token.js'
toast.configure();


export function Addarticle() {

  const history = useHistory();

  useEffect(() => {
    bsCustomFileInput.init()

  }, [])

  const [ans, setAns] = useState("")

  const initData = {
    "heading": "",
    "content": "",
    "file": {}
  }

  const [formData, setFormData] = useState({});



  // var form=formData



  const handlechange = async (e) => {

    e.preventDefault();
  }

  const onEditorChange = (e) => {
    var content_text = e.editor.getData()
  }

  const handleSubmit = async () => {
  }






  return (
    <div>

      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div>
                <button className='btn mt-2 allbtn' type='button' onClick={() => history.goBack()} >Back</button></div>
              <h4 className="card-title mt-3">ADD Article CONTENT</h4>

              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">Heading</label>
                  <Form.Control type="text" className="form-control" id="heading" placeholder="Enter heading" value={formData?.heading} onChange={(e) => handlechange(e)} />
                </Form.Group>
                <Form.Group>


                  <label htmlFor="exampleInputName1">URL ({config?.Front_market_Url}/blogdetails/{formData?.url ? formData?.url : "your URL"})</label>
                  <p>Note  :  Special Characters not allowed</p>

                  <Form.Control type="text" className="form-control" id="url" placeholder="Enter URL" value={formData?.url} onChange={(e) => handlechange(e)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="date for news">Date</label>
                  <Form.Control type="date" id="date" value={formData?.date ? new Date(String(formData?.date)).toISOString().split('T')[0] : "Please select date"} onChange={(e) => handlechange(e)} />
                </Form.Group>
                <Form.Group>
                  {/* <label htmlFor="exampleInputName1">Heading</label>
                    <input type="text" id="heading" onChange={(e)=>handlechange(e)}/> */}
                  {
                    // formData?.answer&& 
                    <CKEditor
                      initData={ans}
                      onChange={(e) => onEditorChange(e)}
                    />}
                </Form.Group>
                {formData?.file && <img className='mb-2' src={URL.createObjectURL(formData?.file)} width={90} />}
              </form>


              <input type="file" id="file" onChange={(e) => handlechange(e)} />

              <div>
                <button className='btn mt-3 allbtn' onClick={() => handleSubmit()}>SUBMIT</button>

              </div>


            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default Addarticle;
