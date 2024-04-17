import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useLocation } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';

import { addaboutuser } from '../../axioscalls/token.js'
toast.configure();


export function Addaboutuser() {

  const history = useHistory();
  var location = useLocation();
  const { pathname, state } = location;
  console.log("pathnamesstate",state)
  var path = pathname.split("/")[1]
  useEffect(() => {
    bsCustomFileInput.init()

  }, [])



  const initData = {
    "title": state ? state?.title : "",
    "content":  state ? state?.content :""
  }
  console.log("pathname", path, state,initData)

  const [formData, setFormData] = useState(initData);
  // const [Errors, setError] = useState({})
  console.log("formData", formData);
  const [title, settitle] = useState(state ? state?.title : "");
  const [content, setcontent] = useState(state ? state?.content :"");


  // var form=formData



  const handlechange = async (e) => {
    console.log("handlechange", e)
    e.preventDefault();
    const { id, value } = e.target;
    console.log("value", value, "formdata", formData)
    //   let formdata = { ...formData, ...{ ["question"]: value } }
    //   console.log("formdata updated:",formdata)
    //  // setFormData(formdata);
    settitle(value);
  }

  const onEditorChange = (evt) => {
    console.log("oneditor change formdata :", formData);
    var content_text = evt.editor.getData()



    // let formdata = { ...formData, ...{ ['answer']: description_text } }
    // console.log("answer formdata",formdata);
    // setFormData(formdata)
    setcontent(content_text)

  }
  const History = useHistory();

  const handleSubmit = async () => {
    var form = formData;
    form.title = title;
    form.content = content;
    console.log("handle form : ", form)
    setFormData(form)
    console.log("Form Data : ", formData)
    var errors = {};
    if (!formData.title) {
      errors.title = "title cannot be empty"
      return toast.error("title cannot be empty")
    }

    if (!formData.content) {
      errors.content = "content cannot be empty"
      return toast.error("content cannot be empty")
    }

    if (Object.keys(errors).length == 0) {

      console.log("erro length", Object.keys(errors).length, formData)
      // formData.action = path == "projectEdit" ? "edit" : "add";

      var payload = {
        title: formData.title,
        content: formData.content,
        projectId:state?._id ?? ""  ,
        action: formData.action = path == "aboutEdit"?"edit":"add"
      }

      console.log("payload", payload)

      var resp = await addaboutuser(payload);
      if (resp?.status == true) {
        toast.success(resp.msg)
        setTimeout(() => {
          history.goBack()
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
                <button className='btn mt-2 allbtn mb-3' type='button' onClick={() => History.goBack()} >Back</button></div>
              <h4 className="card-title">Add User</h4>

              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">title</label>
                  <Form.Control type="text" className="form-control" id="title" placeholder="Enter title" value={title} onChange={(e) => handlechange(e)} />
                </Form.Group>

                <Form.Group>
                  <label htmlFor="exampleInputName1">content</label>
                  {
                    // formData?.answer&& 
                    <CKEditor
                      initData={content}
                      onChange={onEditorChange}
                    />}
                </Form.Group>

              </form>


              {/* <input type="file" id="file" onChange={(e) => handlechange(e)} /> */}

              <div>
                <button className='btn mt-3  allbtn' onClick={() => handleSubmit()}>SUBMIT</button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default Addaboutuser;
