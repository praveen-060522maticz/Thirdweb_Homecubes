import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import config from '../../lib/config'

import { addSocial } from '../../axioscalls/user.js'


toast.configure();


export function AddSocial() {

  const history = useHistory();

  // useEffect(() => {
  //   bsCustomFileInput.init()

  // }, [])


  const History = useHistory();

  const [formData, setFormData] = useState({})
  const [status, setStatus] = useState(false)
  const [dataurl, setDataurl] = useState("")


  const handlechange = async (e) => {

    e.preventDefault();
  }

  const handleSubmit = async () => {
  }






  return (
    <div>

      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button className='btn mb-3 allbtn' type='button' onClick={() => History.goBack()} >Back</button>
              <h4 className="card-title">Add Social Links</h4>
              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">Website Name</label>
                  <Form.Control type="text" className="form-control" id="website" placeholder="topic" value={formData.website} onChange={(e) => handlechange(e)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Website Link</label>
                  <Form.Control type="text" className="form-control" id="link" placeholder="content" value={formData.link} onChange={(e) => handlechange(e)} />

                </Form.Group>


                {formData.img && <div><img src={URL.createObjectURL(formData.img)} width={100} /></div>}
                <div><input type="file" id="file" onChange={(e) => handlechange(e)} /></div>
              </form>
              <button className='btn mb-2 allbtn' type='button' onClick={() => handleSubmit()}>SUBMIT</button>

            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default AddSocial
