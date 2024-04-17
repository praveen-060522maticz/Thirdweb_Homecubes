import React, { Component, useState, useEffect } from 'react';

import { Button, Form, FormControl } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import { CKEditor } from 'ckeditor4-react';
import { useDispatch, useSelector } from 'react-redux';
import * as tokenFunctions from '../../axioscalls/token.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import config from '../../lib/config.js'
import { useMint, useServiceFee } from '../../useHooks/useContractMethods.js';
import { mintDbUpdate, getTokenOwner, ApproveCAll, CreateLazyMint } from '../../axioscalls/token.js'
import wallet_details from '../../redux/action.js';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';


export function EmailTemplateEdit(props){
    const { detail }=props;
    const { UserAccountAddr,Admin_Address } = useSelector((state) => state.wallet_detail);
    const { push,goBack } = useHistory();

    const [Content,setContent]=useState(detail.Content)

    const onEditorChange=(evt)=>{
        const description_text =  evt.editor.getData();
        
        setContent(description_text);
    }
    const FormSubmit=async()=>{
        if(UserAccountAddr!==Admin_Address){
            var data ={Type:detail.Type,Content:Content};
            var resp= await tokenFunctions.editemailTemplateList(data);
            if(resp.success=='success'){
                push("/emailtemplatelist")
            }
            else{
                toast.error(resp.success);
            }
        }
    }
    return(
        <div className="row">

            <div className="col-12 grid-margin stretch-card">
            <div className="card">
            <div className="card-body">
        <button className='btn mt-2 allbtn' type='button' onClick={()=> goBack()} >Back</button>

            <h4 className="card-title mt-3">Email Template Edit</h4>
            <form className="forms-sample">
            <Form.Group>
            <label>Type</label>
            <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={detail.Type} />
            </Form.Group>
            <Form.Group>
            <label htmlFor="exampleInputName1">Content</label>
          
                <CKEditor
		initData={Content}
    onChange={onEditorChange}
	/>
            </Form.Group>
            </form>
            <div className='text-center'>  <Button onClick={()=>{FormSubmit()}}> Submit</Button></div>
            </div>
        </div>
        </div>
        </div>

    )
}

export default EmailTemplateEdit;