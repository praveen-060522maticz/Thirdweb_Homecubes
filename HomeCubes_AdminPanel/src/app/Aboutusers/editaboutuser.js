import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import config from '../../lib/config'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useLocation } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';

import { addFaqCall } from '../../axioscalls/user.js'
import { addaboutuser } from '../../axioscalls/token.js';
toast.configure();


export function Editaboutuser(props) {

  const history = useHistory();
  const location = useLocation();

  const detail = location.state;
  console.log("faqedit", props)
  useEffect(() => {
    bsCustomFileInput.init()

  }, [])

  const onEditorChange = (e) => {
  }
  const initData = {
    "name": "",
    "description": ""
  }

  const [formData, setFormData] = useState(initData)
  const [status, setStatus] = useState(false)






  const handlechange = async (e) => {
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
                <button className='btn mt-2 allbtn mb-3' type='button' onClick={() => history.goBack()} >Back</button></div>

              <h4 className="card-title">EDIT USER</h4>
              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">Name</label>
                  <Form.Control type="text" disabled={true} className="form-control" id="question" value={formData.name} />
                </Form.Group>
                {/* <Form.Group>
                    <label htmlFor="date for news">Date</label>
                    <Form.Control type="date" id="date" onChange={(e)=>handlechange(e)}/>
                  </Form.Group> */}
                <Form.Group>
                  <label htmlFor="exampleInputName1">content</label>
                  {
                    formData?.description &&
                    <CKEditor
                      initData={formData?.description}
                      onChange={onEditorChange}
                    />}
                </Form.Group>

                {formData?.img && <img className='mb-2' src={`${config.ImG}/${formData.img}`} height={100} width={100} />}
                <br />
                <input type="file" id="file" onChange={(e) => handlechange(e)} />
              </form>
              <button className='btn mt-3 allbtn' onClick={() => handleSubmit()}>SUBMIT</button>

            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default Editaboutuser;
