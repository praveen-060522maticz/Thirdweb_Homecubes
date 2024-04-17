import React, { Component, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useHistory } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { sendSubscriberMail } from '../../axioscalls/user.js';
toast.configure();


export function MailTemplate() {

  const [subject, setsubject] = useState("");
  const [mailData, setMailData] = useState("");
  const [load, setLoad] = useState(false)
  const History = useHistory();

  const onEditorChange = (event, editor) => {
    const description_text = editor.getData();
    setMailData(description_text)
  }

  const handleFormSubmit = async () => {
    if (!subject) return toast.error("Subject can't be empty");
    if (!mailData) return toast.error("Content can't be empty")
    setLoad(true)
    let sendData = { boc: mailData, subject }
    const resp = await sendSubscriberMail(sendData);
    console.log('respresp---->',resp);
    toast[resp?.success](resp?.msg);
    if(resp?.success == "success") History.goBack()
    setLoad(false)

  }


  return (
    <div>

      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button className='btn mb-4 allbtn' type='button' onClick={() => History.goBack()} >Back</button>
              <h4 className="card-title"> Create Mail</h4>
              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">subject</label>
                  <Form.Control type="text" className="form-control" id="subject" placeholder="Name" onChange={(e) => setsubject(e.target.value)} value={subject || ''} />
                </Form.Group>

                <Form.Group>
                  <CKEditor
                    editor={ClassicEditor}

                    onChange={(event, editor) => {
                      onEditorChange(event, editor);

                    }}

                  />
                </Form.Group>

                {/* <Form.Group>
                    <label>File upload</label>
                    <div className="custom-file">
                      <Form.Control type="file" className="form-control visibility-hidden" id="customFileLang" lang="es"/>
                      <label className="custom-file-label" htmlFor="customFileLang">Upload image</label>
                    </div>
                  </Form.Group> */}


                {/* <button type="submit" className="btn btn-primary mr-2">Submit</button> */}
              </form>
              <button className='btn mb-2 allbtn' type='button' onClick={() => handleFormSubmit()}>SEND</button>

            </div>
            <div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default MailTemplate;
