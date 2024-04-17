import React, { Component, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useLocation, useHistory } from 'react-router-dom';

import { addCategoryCall } from '../../axioscalls/token.js'


toast.configure();


export function AddCategory() {

  const History = useHistory();
  var location = useLocation();
  var pathname = location.pathname;
  var path = pathname.split("/")[1]
  console.log("pathname", path)

  useEffect(() => {
    bsCustomFileInput.init()

  }, [])


  const initData = {
    "name": "",
    "description": ""
  }

  const [formData, setFormData] = useState(initData)

  const {
    name,
    description

  } = formData

  const handleChange = (e) => {

    e.preventDefault();
    const { id, value } = e.target;
    let formdata = { ...formData, ...{ [id]: value } }
    setFormData(formdata)
    console.log("formdata", formData)
  }

  const handleSubmit = async () => {
    var errors = {};

    if (!formData.name) {
      errors.name = "category name empty"
      return toast.error("Category name cannot be empty")
    }

    if (!formData.description) {
      errors.description = "category description empty"
      return toast.error("Category description cannot be empty")
    }

    if (Object.keys(errors).length == 0) {
      if (path == "addcategory") formData.action = "add"
      else formData.action = "edit"
      console.log("erro length", Object.keys(errors).length, formData)

      var resp = await addCategoryCall(formData);
      if (resp?.status) {
        toast.success(resp.msg)
        setTimeout(function () {
          History.push('/categorylist');
        }, 2000);

      }
      else return toast.error(resp.msg)

    }
  }


  return (
    <div>
      <div className="page-header">
        <button className='btn mt-2 allbtn' type='button' onClick={() => History.goBack()} >Back</button>

        <h3 className="page-title"> ADD CATEGORY </h3>

      </div>
      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">

              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">Category Name</label>
                  <Form.Control type="text" className="form-control" id="name" maxLength={30} value={formData.name} placeholder="Name" onChange={(e) => handleChange(e)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Category Description</label>
                  <Form.Control type="text" className="form-control" id="description" value={formData.description} placeholder="description" onChange={(e) => handleChange(e)} />
                </Form.Group>



                {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
              </form>
              <button className='btn mt-2 allbtn' type='button' onClick={() => handleSubmit()}>Submit</button>

            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default AddCategory
