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
import Select from 'react-select'
import { isEmpty } from '../../lib/common.js';
import { collectionFunctions, createProject } from '../../axioscalls/admin.js';
import config from '../../lib/config.js';


toast.configure();


export function AddProject() {

  const History = useHistory();
  var location = useLocation();
  var pathname = location.pathname;
  var path = pathname.split("/")[1]
  console.log("pathname", path, location.state)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    bsCustomFileInput.init()

  }, [])


  const [formData, setFormData] = useState(location.state?.record ?? {})
  const [Errors, setError] = useState({})

  console.log("formData", formData);

  const handleChange = (e) => {
    setError({})
    e.preventDefault();
    console.log("errrrr on 0", e.target);
    const { id, value, files } = e.target;
    let formdata = { ...formData, ...{ [id]: files ? files[0] : value } }
    setFormData(formdata)
    console.log("formdata", formData)
  }

  console.log("-------------->", formData?.galleryThumbImage && Object.values(formData?.galleryThumbImage));

  const validation = () => {
    var errors = {}
    if (!formData?.galleryTitle) errors.galleryTitle = "Gallery Title can't be empty";
    if (!formData?.galleryDescription) errors.galleryDescription = "Gallery Description can't be empty";
    if (!formData?.galleryThumbImage) errors.galleryThumbImage = "Gallery ThumbImage can't be empty";

    return errors
  }

  const handleSubmit = async () => {

    const validate = validation();
    console.log("validate", validate);
    if (!isEmpty(validate)) return setError(validate);

    setLoading(true)
    formData.action = path == "GalleryEdit" ? "edit" : "add"
    formData.projectId = formData.projectId ? formData.projectId : location.state?.projectId ?? ""
    console.log("formData", formData);
    var resp = await collectionFunctions(formData);
    console.log("respresp", resp);
    if (resp?.success == "success") {
      toast.success(resp.msg)
      setTimeout(function () {
        History.push('/projectList');
      }, 2000);

    }
    else toast.error(resp.msg)
    setLoading(false)
  }

  return (
    <div>
      <div className="page-header">
        <button className='btn mt-2 allbtn' type='button' onClick={() => History.goBack()} >Back</button>

        {/* <h3 className="page-title"> ADD PROJECT </h3> */}

      </div>
      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">

              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">Gallery Title</label>
                  <Form.Control type="text" className="form-control" id="galleryTitle" maxLength={30} value={formData?.galleryTitle} placeholder="galleryTitle" onChange={(e) => handleChange(e)} />
                  <p style={{ color: "red" }} >{Errors?.galleryTitle}</p>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Gallery Description</label>
                  <textarea rows={3} cols={5} className="form-control" id="galleryDescription" value={formData?.galleryDescription} placeholder="description" onChange={(e) => handleChange(e)} />
                  <p style={{ color: "red" }} >{Errors?.galleryDescription}</p>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Gallery ThumbImage</label>
                  {/* <Form.Control type="file" className="form-control" id="galleryThumbImage" onChange={(e) => handleChange(e)} /> */}
                  <div>
                    <div class="upload-btn-wrapper">
                      <button class="btn">Choose File</button>
                      <input
                        type="file"
                        className="form-control"
                        id="galleryThumbImage"
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <p style={{ color: "red" }} >{Errors?.galleryThumbImage}</p>
                  {console.log("vfsdevsde", formData?.galleryThumbImage)}
                  {
                    formData && formData?.galleryThumbImage ?
                      typeof formData?.galleryThumbImage == "string" ?
                        <img src={`${config.ImG}/collection/${formData.projectId}/${formData.galleryThumbImage}`} style={{ height: 100, width: 100 }} />
                        :
                        <img src={URL.createObjectURL(formData?.galleryThumbImage)} style={{ height: 100, width: 100 }} /> :
                      <></>
                  }
                </Form.Group>

                {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
              </form>
              <button className='btn mt-2 allbtn' disabled={loading} type='button' onClick={() => handleSubmit()}>Submit</button>

            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default AddProject
