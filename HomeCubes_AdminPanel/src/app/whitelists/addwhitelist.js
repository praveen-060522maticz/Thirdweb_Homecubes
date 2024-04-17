import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { CKEditor } from 'ckeditor4-react';

import { addwhitelists } from '../../axioscalls/admin'
toast.configure();


export function Addwhitelist() {

  const history = useHistory();

  useEffect(() => {
    bsCustomFileInput.init()

  }, [])

  const [formData, setFormData] = useState({})
  console.log("erererererererer", formData);
  const [walletaddress, setwalletaddress] = useState("");
  const [gmail, setgmail] = useState("")
  console.log("sdgsfsdgffd", gmail);

  const handlechange = async (e) => {
    // e.preventDefault();
    e.preventDefault();

    console.log("sadfgjhadfasdf", e.target.value);
    var { id, value } = e.target;
    console.log("nv", id, value);
    setFormData({ ...formData, ...{ [e.target.id]: e.target.value } });
    // setgmail(value);

    // form.question=question;
    // console.log("Question",formData)
  }


  const History = useHistory();

  const handleSubmit = async () => {

    // var form = formData;
    // form.walletaddress = walletaddress;
    // form.gmail = gmail;
    // console.log("handle form : ", form)
    // setFormData(form)
    // console.log("Form Data : ", formData)

    // console.log("Form Data : ",walletaddress)
    var errors = {};
    if (!formData.walletAddress) {
      errors.walletAddress = "walletAddress cannot be empty"
      return toast.error("walletAddress cannot be empty")
    }
    if (!formData.gmail) {
      errors.gmail = "mail cannot be empty"
      return toast.error("mail cannot be empty")
    }

    if (Object.keys(errors).length == 0) {

      console.log("erro length", Object.keys(errors).length, walletaddress)

      var payload = {

        walletAddress: formData.walletAddress.toLowerCase(),
        gmail: formData.gmail,
        action: "add"
      }

      console.log("payload", payload)

      var resp = await addwhitelists(payload);
      if (resp?.status == true) {
        toast.success(resp.msg)
        setTimeout(() => {
          // history.push("/listwhitelist")
          history.goBack()
        }, 1000);

      }
      else return toast.error(resp.msg)

    }
  }


  return (
    <div>
      {console.log('fgfgsdfga', walletaddress)}
      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button className='btn mb-3 allbtn' type='button' onClick={() => History.goBack()} >Back</button>
              <h4 className="card-title mt-3">ADD Whitelist</h4>
              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">Wallet Address</label>
                  <Form.Control type="text" className="form-control" id="walletAddress" placeholder="Enter walletAddress" value={formData?.walletaddress} onChange={(e) => handlechange(e)} />
                </Form.Group>

                <Form.Group>
                  <label htmlFor="exampleInputName1">Email</label>
                  <Form.Control type="text" className="form-control" id="gmail" placeholder="Enter email Address" value={formData?.gmail} onChange={(e) => handlechange(e)} />
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

export default Addwhitelist;



