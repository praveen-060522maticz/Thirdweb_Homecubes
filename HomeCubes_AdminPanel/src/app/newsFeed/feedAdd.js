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
import { collectionFunctions, createProject, newsAndFeedFunc } from '../../axioscalls/admin.js';
import config from '../../lib/config.js';


toast.configure();


export function AddProject() {

    const History = useHistory();
    var location = useLocation();
    var pathname = location.pathname;
    var path = pathname.split("/")[1]
    console.log("pathnamePto", path, location.state)

    useEffect(() => {
        bsCustomFileInput.init()

    }, [])


    const [formData, setFormData] = useState(location.state ?? {})
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
        if (!formData?.feedTitle) errors.feedTitle = "Title can't be empty";
        if (!formData?.feedDescription) errors.feedDescription = "Description can't be empty";

        return errors
    }

    const handleSubmit = async () => {

        const validate = validation();
        console.log("validate", validate);
        if (!isEmpty(validate)) return setError(validate);
        const sendData = {}
        sendData.action = path != "feedsAdd" ? "edit" : "add"
        sendData.projectId = formData._id
        sendData.feedTitle = formData.feedTitle
        sendData.feedDescription = formData.feedDescription
        sendData._id = formData._id
        console.log("sendData", sendData);
        

        var resp = await newsAndFeedFunc(sendData);
        console.log("respresp", resp);
        if (resp?.success == "success") {
            toast.success(resp.msg)
            setTimeout(function () {
                History.push('/feedList');
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
                                    <label htmlFor="exampleInputName1">Title</label>
                                    <Form.Control type="text" className="form-control" id="feedTitle" value={formData?.feedTitle} placeholder="Title" onChange={(e) => handleChange(e)} />
                                    <p style={{ color: "red" }} >{Errors?.feedTitle}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Description</label>
                                    <textarea rows={3} cols={5} className="form-control" id="feedDescription" value={formData?.feedDescription} placeholder="description" onChange={(e) => handleChange(e)} />
                                    <p style={{ color: "red" }} >{Errors?.feedDescription}</p>
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

export default AddProject
