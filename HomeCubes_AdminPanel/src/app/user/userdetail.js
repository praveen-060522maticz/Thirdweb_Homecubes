import React, { Component, useState, useEffect } from 'react';

import { Button, Form, FormControl } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import config from '../../lib/config.js'
import noimg from '../../assets/images/No_image.webp';
import { useMint, useServiceFee } from '../../useHooks/useContractMethods.js';
import { mintDbUpdate, getTokenOwner, ApproveCAll, CreateLazyMint } from '../../axioscalls/token.js'
import wallet_details from '../../redux/action.js';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';

export function UserDetail(props){
  const history=useHistory()
    const { detail }=props;


    return(
        <div className="row">

      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
          <button className='btn mt-2 allbtn' type='button' onClick={()=> history.goBack()} >Back</button>

            <h4 className="card-title mt-3">User Details</h4>
            <form className="forms-sample">
              <Form.Group>
                <label>User Name</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.DisplayName} />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">Custom URL</label>
                <Form.Control type="text"  disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.CustomUrl} />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">Profile  </label>
                {detail.Profile==''? <img className="img-xs rounded-circle" src={noimg} alt="Pnorofile" />
                :<img className="img-xs rounded-circle" src={`${config.ImG}/user/${detail.CustomUrl}/profile/${detail.Profile}`} alt="Profile" />}
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">Cover Image  </label>
                {detail.Cover=='' ? <img className="img-xs rounded-circle" src={noimg} alt="Pnorofile" />
                :<img className="img-xs rounded-circle" src={`${config.ImG}/user/${detail.CustomUrl}/cover/${detail.Cover}`} alt="Cover Image" />}
              </Form.Group>
              <Form.Group>
                <label>Email ID</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.EmailId} />
              </Form.Group>
              {/* <Form.Group>
                <label>Mobile Number</label>
                <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={detail.Mobile} />
              </Form.Group> */}
              <Form.Group>
                <label>Wallet Address</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.WalletAddress} />
              </Form.Group>
              <Form.Group>
                <label>Youtube </label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.Youtube} />
              </Form.Group>
              <Form.Group>
                <label>Facebook</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.Facebook} />
              </Form.Group>
              <Form.Group>
                <label>Twitter</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.Twitter} />
              </Form.Group>
              <Form.Group>
                <label>Instagram</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.Instagram} />
              </Form.Group>
              <Form.Group>
                <label>Wallet Type</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="Name" value={detail.WalletType} />
              </Form.Group>
            </form>
        </div>
        </div>
        </div>
        </div>
    )
}

export default UserDetail;