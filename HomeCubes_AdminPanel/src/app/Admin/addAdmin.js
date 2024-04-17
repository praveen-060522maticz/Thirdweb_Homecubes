import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useLocation } from "react-router-dom";
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import config from '../../lib/config.js';
import { addFaqCall } from '../../axioscalls/user.js'
import { blogsFunction, createAdmin, getblogCategories, saveCkeditorImage } from '../../axioscalls/admin.js';
import Select from 'react-select'
import { isEmpty } from '../../lib/common.js';
toast.configure();


export function AddAdmin() {

    useEffect(() => {
        bsCustomFileInput.init()
    }, [])

    var location = useLocation();
    const { pathname, state } = location;
    console.log("statatt", state);
    const path = pathname.split("/")[1]

    const [formData, setFormData] = useState(state ? state : {});
    const [categories, setCategories] = useState([{ label: "Admin", value: "Admin" }, { value: "Report only", label: "Report only" }]);
    const [ans, setAns] = useState("");
    const [Error, setError] = useState({})


    const customStyles = {
        option: (styles) => ({
            ...styles,
            cursor: 'pointer',
        }),
    }

    useEffect(() => {
        if (state) setAns(state?.content)
    }, [])

    const handlechange = async (e) => {
        // e.preventDefault();
        setError({})
        e.preventDefault();
        const { id, value, files } = e.target;
        console.log("value", value, "formdata", formData)
        let formdata = { ...formData, ...{ [id]: files ? files[0] : value } }
        console.log("formdata updated:", formdata)
        setFormData(formdata);
    }

    const validation = () => {
        const error = {};
        if (!formData?.Type) error.Type = "Type can't be empty";
        if (!formData?.email) error.email = "Email can't be empty";
        if (!formData?.password) error.password = "Password can't be empty";
        if (formData?.email && !config?.EMAIL.test(formData?.email)) error.email = "Please enter valid email address";
        return error
    }


    const History = useHistory();

    const handleSubmit = async () => {

        const validate = validation();
        console.log("validatevalidate", validate);
        if (!isEmpty(validate)) return setError(validate)
        formData.action = "save"
        var resp = await createAdmin(formData);
        console.log("respresp", resp);
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
            <div className="row">

                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <button className='btn mb-3 allbtn' type='button' onClick={() => History.goBack()} >Back</button>
                            <h4 className="card-title mt-3">ADD Admin/Report only</h4>
                            <form className="forms-sample">
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Role</label>
                                    <Select
                                        styles={customStyles}
                                        options={categories}
                                        value={{ value: formData.Type, label: formData.Type }}
                                        onChange={(e) => { setError({}); setFormData({ ...formData, Type: e.value }) }}
                                        isDisabled={path == "blogView"}
                                    //  menuIsOpen={true}
                                    />
                                    <p style={{ color: "red" }} >{Error?.Type}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Email</label>
                                    <Form.Control type="text" className="form-control" disabled={path == "blogView"} id="email" placeholder="Enter email" value={formData?.email} onChange={(e) => handlechange(e)} />
                                    <p style={{ color: "red" }} >{Error?.email}</p>

                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Password</label>
                                    <Form.Control type="text" className="form-control" disabled={path == "blogView"} id="password" placeholder="Enter password" value={formData?.password} onChange={(e) => handlechange(e)} />
                                    <p style={{ color: "red" }} >{Error?.password}</p>
                                </Form.Group>
                            </form>
                            <button className='btn mb-2 allbtn' type='button' onClick={() => handleSubmit()}>SUBMIT</button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default AddAdmin;

