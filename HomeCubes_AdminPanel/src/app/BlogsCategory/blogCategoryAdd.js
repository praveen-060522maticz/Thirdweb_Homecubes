import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useLocation } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';
import config from '../../lib/config.js';

import { addFaqCall } from '../../axioscalls/user.js'
import { getblogCategories } from '../../axioscalls/admin.js';
toast.configure();


export function BlogCategoryList() {

    useEffect(() => {
        bsCustomFileInput.init()
    }, [])

    var location = useLocation();
    const { pathname, state } = location;
    console.log("statatt", state);
    const path = pathname.split("/")[1]

    const [formData, setFormData] = useState(state ? state : {})



    const handlechange = async (e) => {
        // e.preventDefault();
        e.preventDefault();
        const { id, value } = e.target;
        console.log("value", value, "formdata", formData)
        let formdata = { ...formData, ...{ [id]: value } }
        console.log("formdata updated:", formdata)
        setFormData(formdata);
        // form.question=question;
        // console.log("Question",formData)
    }


    const History = useHistory();

    const handleSubmit = async () => {

        if (!formData?.title) return toast.error("Title can't be empty")
        formData.action = path == "blogCategoryEdit" ? "edit" : "add"
        var resp = await getblogCategories(formData);
        if (resp?.success == "success") {
            toast.success(resp.msg)
            setTimeout(() => {
                History.goBack()
            }, 1000);

        }
        else return toast.error(resp.msg)


    }


    return (
        <div>
            {console.log('fgfgsdfga', formData)}
            <div className="row">

                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <button className='btn mb-3 allbtn' type='button' onClick={() => History.goBack()} >Back</button>
                            <h4 className="card-title mt-3">ADD Blog Category</h4>
                            <form className="forms-sample">
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Title</label>
                                    <Form.Control type="text" className="form-control" id="title" placeholder="Enter title" value={formData?.title} onChange={(e) => handlechange(e)} />
                                </Form.Group>

                                {/* <Form.Group>
                                    <label htmlFor="exampleInputName1">slug</label>
                                    <Form.Control type="text" className="form-control" id="slug" placeholder="Enter Slug" value={formData?.slug} onChange={(e) => handlechange(e)} />
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Description</label>
                                    <Form.Control type="text" className="form-control" id="description" placeholder="Enter description" value={formData?.description} onChange={(e) => handlechange(e)} />
                                </Form.Group> */}

                                {/* <Form.Group>
                                    <label htmlFor="exampleInputName1">Upload Images</label>
                                    <div>
                                        <div class="upload-btn-wrapper">
                                            <button class="btn">Upload Images</button>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                id="imgfile"
                                                onChange={(e) => handlechange(e)}
                                            />
                                        </div>
                                    </div>

                                    {formData && formData?.image && formData?.image[0] ? (
                                        typeof formData?.image == "string" ? (
                                            <img
                                                src={`${config.ImG}/projects/ProjectThumbnail/${formData.image}`}
                                                style={{ height: 100, width: 100 }}
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(formData?.image[0])}
                                                style={{ height: 100, width: 100 }}
                                            />
                                        )
                                    ) : (
                                        <></>
                                    )}
                                </Form.Group> */}
                            </form>
                            <button className='btn mb-2 allbtn' type='button' onClick={() => handleSubmit()}>SUBMIT</button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default BlogCategoryList;



