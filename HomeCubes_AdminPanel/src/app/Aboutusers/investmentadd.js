import React, { Component, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useLocation, useHistory } from 'react-router-dom';
import { CKEditor } from 'ckeditor4-react';

import { addCategoryCall, addaboutuser } from '../../axioscalls/token.js'
import Select from 'react-select'
import { isEmpty } from '../../lib/common.js';
import { collectionFunctions, createProject, newsAndFeedFunc } from '../../axioscalls/admin.js';
import config from '../../lib/config.js';


toast.configure();


export function Investmentadd() {

    const History = useHistory();
    var location = useLocation();
    var pathname = location.pathname;
    var path = pathname.split("/")[1]
    console.log("pathnamePtodsv", path, location.state)

    useEffect(() => {
        bsCustomFileInput.init()

    }, [])

    const initData = {
        "investmentContent": "",

    }
    const [formData, setFormData] = useState(initData)
    console.log("formDatasss", formData);

    const [Errors, setError] = useState({})
    const [investmentContent, setinvestmentcontent] = useState("");
    console.log("fdffffffffff", investmentContent)
 

    const onEditorChange = (evt) => {
        console.log("oneditor change formdata :", formData);
        var content_text = evt.editor.getData()
console.log("content_text",content_text)


        let formdata = { ...formData, ...{ ['investmentContent']: content_text } }
        console.log("answer formdata",formdata);
        setFormData(formdata)
        setinvestmentcontent(content_text)

    }
    // console.log("-------------->", formData?.galleryThumbImage && Object.values(formData?.galleryThumbImage));

    const validation = () => {
        var errors = {}
        if (!formData?.investmentContent) errors.investmentContent = "Investment content can't be empty";

        return errors
    }

    const handleSubmit = async () => {
        var form = formData;
        console.log("formm", form)
        const validate = validation();
        console.log("validate", validate);
        if (!isEmpty(validate)) return setError(validate);
        form.investmentContent = investmentContent;
        setFormData(form)

        // formData.action = 'saveInvest'
        // formData.projectId = location.state._id
        var errors = {};
        console.log("errorrs", errors)


        if (!formData.investmentContent) {
            errors.investmentContent = "investmentContent cannot be empty"
            return toast.error("investmentContent cannot be empty")
        }

        if (Object.keys(errors).length == 0) {
            
                formData.investmentContent =investmentContent 
                formData.projectId = location.state._id
                formData.action= "saveInvest"
            
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
                                    <label htmlFor="exampleInputName1">Investment content</label>
                                    {
                                        // formData?.answer&& 
                                        <CKEditor
                                            // initData={formData?.answer}
                                            onChange={onEditorChange}
                                        />}
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

export default Investmentadd
