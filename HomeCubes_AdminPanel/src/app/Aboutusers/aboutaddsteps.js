import React, { Component, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useLocation, useHistory } from 'react-router-dom';

import { addCategoryCall, addaboutuser } from '../../axioscalls/token.js'
import Select from 'react-select'
import { isEmpty } from '../../lib/common.js';
import { collectionFunctions, createProject, newsAndFeedFunc } from '../../axioscalls/admin.js';
import config from '../../lib/config.js';


toast.configure();


export function Aboutaddsteps() {

    const History = useHistory();
    var location = useLocation();
    var pathname = location.pathname;
    var path = pathname.split("/")[1]
    console.log("pathnamePto", path, location.state)

    useEffect(() => {
        bsCustomFileInput.init()

    }, [])


    const [formData, setFormData] = useState(location.state ? location.state : {})
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

    // console.log("-------------->", formData?.galleryThumbImage && Object.values(formData?.galleryThumbImage));

    const validation = () => {
        var errors = {}
        if (!formData?.stepTitle) errors.stepTitle = "step Title can't be empty";
        if (!formData?.stepContent) errors.stepDescription = "step content can't be empty";
        if (!formData?.stepImage) errors.stepImage = "step Image can't be empty";

        return errors
    }

    const handleSubmit = async () => {

        const validate = validation();
        console.log("validate", validate);
        if (!isEmpty(validate)) return setError(validate);
        formData.action = path == "editaddsteps" ? "editStep" : 'saveStep'
        formData.projectId = location.state._id ?? ""
        formData.oldTitle = location.state.stepTitle ?? ""
        console.log("formDatahandleSubmit",formData);
        var resp = await addaboutuser(formData);
        console.log("respresp", resp);
        if (resp?.success == "success") {
            toast.success(resp.msg)
            setTimeout(function () {
                History.goBack()
            }, 2000);

        }
        else return toast.error(resp.msg)

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
                                    <label htmlFor="exampleInputName1">Step Title</label>
                                    <Form.Control type="text" className="form-control" id="stepTitle" value={formData?.stepTitle} placeholder="Step Title" onChange={(e) => handleChange(e)} />
                                    <p style={{ color: "red" }} >{Errors?.stepTitle}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Step Content</label>
                                    <textarea rows={3} cols={5} className="form-control" id="stepContent" value={formData?.stepContent} placeholder="Step Content" onChange={(e) => handleChange(e)} />
                                    <p style={{ color: "red" }} >{Errors?.stepContent}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Step Image</label>
                                    {/* <Form.Control type="file" className="form-control" id="stepImage" onChange={(e) => handleChange(e)} />  */}
                                    <div>
                  <div class="upload-btn-wrapper">
                    <button class="btn">Choose file</button>
                    <input
                      type="file"
                      id="stepImage" 
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                                    <p style={{ color: "red" }} >{Errors?.stepImage}</p>
                                    {
                                        formData && formData?.stepImage ?
                                            typeof formData?.stepImage == "string" ?
                                                <img src={`${config.ImG}/aboutus/steps/${formData.stepImage}`} style={{ height: 100, width: 100 }} />
                                                :
                                                <img src={URL.createObjectURL(formData?.stepImage)} style={{ height: 100, width: 100 }} /> :
                                            <></>
                                    }
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

export default Aboutaddsteps
