import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';

import { addFaqCall } from '../../axioscalls/user.js'
toast.configure();


export function Addinvestment() {

    const history = useHistory();

    useEffect(() => {
        bsCustomFileInput.init()

    }, [])



    const initData = {
        "content": ""
    }

    const [formData, setFormData] = useState(initData)
    const [content, setContent] = useState("");


    var form = formData



    //   const handlechange = async (e) => {
    //     // e.preventDefault();
    //     e.preventDefault();
    //       const{id,value} = e.target;
    //       console.log("value",value,"formdata",formData)
    //     //   let formdata = { ...formData, ...{ ["question"]: value } }
    //     //   console.log("formdata updated:",formdata)
    //     //  // setFormData(formdata);
    //       SetQuestion(value);
    //       // form.question=question;
    //       // console.log("Question",formData)
    //     }





    const onEditorChange = (evt) => {

        console.log("oneditor change formdata :", formData);
        var content_text = evt.editor.getData()


        // let formdata = { ...formData, ...{ ['answer']: description_text } }
        // console.log("answer formdata",formdata);
        // setFormData(formdata)
        setContent(content_text)

    }

    const History = useHistory();

    const handleSubmit = async () => {
        var form = formData;
        form.content = content;
        console.log("handle form : ", form)
        setFormData(form)
        console.log("Form Data : ", formData)
        var errors = {};


        if (!formData.content) {
            errors.answer = "content cannot be empty"
            return toast.error("content cannot be empty")
        }

        if (Object.keys(errors).length == 0) {

            console.log("erro length", Object.keys(errors).length, formData)

            var payload = {
                content: formData.content,
                action: formData.action == "InvestmentEdit" ? "edit" : "add"

            }

            console.log("payload", payload)

            var resp = await addFaqCall(payload);
            if (resp?.status == true) {
                toast.success(resp.msg)
                setTimeout(() => {
                    history.push("/investmentList")
                }, 1000);

            }
            else return toast.error(resp.msg)

        }
    }






    return (
        <div>
            {console.log('fgfgsdfga', formData)}
            <div className="row">

                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <button className='btn mb-3 allbtn' type='button' onClick={() => History.goBack()} >Back</button>
                            <h4 className="card-title mt-3">ADD Investment</h4>
                            <form className="forms-sample">

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">content</label>
                                    {
                                        // formData?.answer&& 
                                        <CKEditor
                                            // initData={formData?.answer}
                                            onChange={onEditorChange}
                                        />}
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

export default Addinvestment;


