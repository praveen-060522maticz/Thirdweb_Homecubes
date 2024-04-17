import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import Select from 'react-select';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';
import config from '../../lib/config'
import * as tokenFunctions from '../../axioscalls/token.js'

import { addcmshome } from '../../axioscalls/token.js'
toast.configure();


export function Addcmshome() {

  const history = useHistory();

  useEffect(() => {
    bsCustomFileInput.init()
  }, [])

  const [ans, setAns] = useState("")
  console.log("anssss", ans)


  const [formData, setFormData] = useState({

    title: "",
    position: "", page: "", content: "", link: ""

  });
  console.log("formDataasf", formData)
  const [catelist, setcatelist] = useState([])
  console.log("catelist", catelist)

  // var form=formData


  const handlechange = async (e) => {
    console.log("eeeeee", e)
    // e.preventDefault();
    console.log("eeeeee", e)

    const { id, value } = e.target
    console.log('dkfjkgjkdjjg', id)
    if (id === "file") {
      var files = e.target.files[0]
      var formdata = formData
      formdata.file = files
      console.log("files", files)
      setFormData({ ...formdata })
    }

    else {
      //   const { value, id } = e.target;
      //   var formdata = formData
      //   formdata[id] = value
      //   console.log("files", files)
      //   setFormData({ ...formdata })
      console.log("formdaaaata", formData)

      setFormData({ ...formData, ...{ [id]: value } })
    }
  }
  console.log("formdata", formData)

  const onEditorChange = (e) => {
    var content_text = e.editor.getData()
    formData.content = content_text

    setAns(content_text)
    console.log("content_text", content_text)

  }
  console.log("contencdfdft_text", formData)

  const handleSubmit = async () => {

    formData.content = ans
    var errors = {};
    if (!formData?.title) {
      errors.title = "title cannot be empty"
      return toast.error("please select the title")
    }
    // if (!formData?.page) {
    //   errors.page = "page cannot be empty"
    //   return toast.error("please select the page")
    // }
    // if (!formData?.position) {
    //   errors.position = "position cannot be empty"
    //   return toast.error("please select the position")
    // }
    // if (!formData?.link) {
    //   errors.link = "link cannot be empty"
    //   return toast.error("please select the link")
    // }
    // if (!formData?.content) {
    //   errors.content = "content cannot be empty"
    //   return toast.error("please select the content")
    // }


    if (Object.keys(errors).length == 0) {

      console.log("erro length", Object.keys(errors).length, formData)

      var sendata = formData
      sendata.img = formData.file ?? ""
      sendata.content = ans
      sendata.action = "add"
      var resp = await addcmshome(formData);
      if (resp?.status == true) {
        toast.success(resp?.msg)
        setTimeout(() => {
          history.push("/cmshomelist")
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
              <div>
                <button className='btn mt-2 allbtn mb-3' type='button' onClick={() => history.goBack()} >Back</button></div>
              <Form.Group>
                <label htmlFor="exampleInputName1">Title</label>
                <Form.Control type="text" className="form-control" id="title" placeholder="Enter title" value={formData?.title} onChange={(e) => handlechange(e)} />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">Page</label>
                <Form.Control type="text" className="form-control" id="page" placeholder="Enter page" value={formData?.page} onChange={(e) => handlechange(e)} />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">Position</label>
                <Form.Control type="text" className="form-control" id="position" placeholder="Enter position" value={formData?.position} onChange={(e) => handlechange(e)} />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">Link</label>
                <Form.Control type="text" className="form-control" id="link" placeholder="Enter link" value={formData?.link} onChange={(e) => handlechange(e)} />
              </Form.Group>
              {/* <Form.Group> */}
              {/* <label htmlFor="date for news">Date</label> */}
              {/* <Form.Control type="date" id="date" value={formData?.date ? new Date(String(formData?.date)).toISOString().split('T')[0] : "Please select date"} onChange={(e) => handlechange(e)} /> */}
              {/* </Form.Group> */}
              <Form.Group>
                {/* <label htmlFor="exampleInputName1">Heading</label>
                    <input type="text" id="heading" onChange={(e)=>handlechange(e)}/> */}
                {
                  // formData?.answer&& 
                  <CKEditor
                    initData={ans}
                    id="content"
                    onChange={(e) => onEditorChange(e)}
                  />}
              </Form.Group>

              <Form.Group>
                {formData?.file && <img className='mb-2' src={URL.createObjectURL(formData?.file)} width={90} />}

              </Form.Group>
              <Form.Group>
              <label htmlFor="exampleInputName1">Image</label>
                {/* <input type="file" id="file" onChange={(e) => handlechange(e)} /> */}
                <div>
                <div class="upload-btn-wrapper">
                    <button class="btn">Choose file</button>
                    <input
                      type="file" id="file" onChange={(e) => handlechange(e)}

                    />
                  </div>
                  </div>
              </Form.Group>

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

export default Addcmshome;
