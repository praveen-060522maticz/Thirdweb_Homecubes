import React, { Component, useEffect, useState } from 'react';
import { Form, Toast } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'

import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import config from '../../lib/config'


import { addSocial } from '../../axioscalls/user.js'
import { useServiceFee, useSetServiceFee, useSetRoyaltyFee } from '../../useHooks/useContractMethods.js'

toast.configure();


export function AddSocial() {
  const [btnfinal, setbtnfinal] = useState(false)
  const [chainid, setChainid] = useState('')
  const dispatch = useDispatch()

  const history = useHistory();
  const Wallet_Details = useSelector((state) => state.wallet_detail)
  console.log("Wallet_Details", Wallet_Details);


  useEffect(() => {
    bsCustomFileInput.init()

  }, [])

  const options = [
    { value: 'ETH', label: 'ETH' },
    { value: 'BNB', label: 'BNB' },
  ]




  const initData = {
    "buyerFee": "",
    "sellerFee": "",
    "royaltyFee": ""
  }

  const [formData, setFormData] = useState(initData)
  const [royalty, setRoyalty] = useState("")

  const {
    buyerFee,
    sellerFee,
    royaltyFee

  } = formData





  const handlechange = async (e) => {
    e.preventDefault();
  }

  const handleSubmit = async () => {
  }



  const customStyles = {
    option: (styles) => ({
      ...styles,
      cursor: 'pointer',
    }),
  }

  const onchange = async (e) => {
    // e.preventDefault()


  }
  const notecolorStyle = {
    color: "rgb(248 229 84)", // Change 'blue' to the desired color
  };

  return (
    <div>

      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button className='btn mt-2 mb-3 allbtn' type='button' onClick={() => history.goBack()} >Back</button>
              <h5 style={notecolorStyle}> Note : The Service fee for both Networks needs to be the same </h5>
              <h4 className="card-title">Select Network</h4>
              {console.log("ggggggssschain", chainid, "options", options, "formdata", formData)}
              <Select
                styles={customStyles}
                options={options} value={{
                  value: chainid ? chainid : "Please Select Network",
                  label: chainid ? chainid : "Please Select Network"
                }} onChange={(e) => { onchange(e.value) }}
              //  menuIsOpen={true}
              />

              <h4 className="card-title mt-3">Service Fee Management</h4>
              <form className="forms-sample">
                <p className='text-right'>{localStorage.getItem("info")}</p>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Buyer Fee</label>
                  <Form.Control type="text" className="form-control" id="buyerFee" placeholder="buyer fee" value={formData.buyerFee} onChange={(e) => handlechange(e)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Seller Fee</label>
                  <Form.Control type="text" className="form-control" id="sellerFee" placeholder="seller fee" value={formData.sellerFee} onChange={(e) => handlechange(e)} />

                </Form.Group>
              </form>
              <div>
                <button className='btn mb-2 allbtn' type='button' onClick={() => handleSubmit()} disabled={btnfinal}>Change Service Fee</button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )

}

export default AddSocial
