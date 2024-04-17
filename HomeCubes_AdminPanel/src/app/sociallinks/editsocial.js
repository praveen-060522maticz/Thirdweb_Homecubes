import React, { Component,useEffect,useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";

import {editDeleteSocial} from '../../axioscalls/user.js'
import config from '../../lib/config'

toast.configure();


export function EditSocial(props)  {

  const{rec} = props;

  const history = useHistory();

useEffect(()=>{
    bsCustomFileInput.init()

},[])

useEffect(()=>{
    setFormData(rec)
},[props])



const initData = {
  "website":"",
  "link":"",
  "img":""
}

const [formData,setFormData] = useState(initData) 
const [status, setStatus] = useState(false)
const[dataurl,setDataurl]=useState("")


const {
    website,
    link
 
} = formData





const handlechange = async(e)=>{
    e.preventDefault();
    const { id } = e.target;
    if (id == "file") {
      const reader = new FileReader(e.target.files[0]);
      setDataurl(window.URL.createObjectURL(e.target.files[0]))
    
      var files = e.target.files[0]
      console.log("files in cms", files,reader)
      let formdata = { ...formData, ...{ "files": files } }
      setFormData(formdata)
      setStatus(true)
    } else {
      const { id, value } = e.target
      console.log("value", value)
      let formdata = { ...formData, ...{ [id]: value } }
      setFormData(formdata)
      console.log("formval", formData)
    }
  
  // e.preventDefault();
  // const{id,value} = e.target;
  // console.log("value",value)
  // let formdata = { ...formData, ...{ [id]: value } }
  // setFormData(formdata)
  // console.log("formval",formData)
}

const handleSubmit = async()=>{
  var errors = {};


  if(!formData.link){
        errors.link = "website link cannot be empty"
        return toast.error("website link cannot be empty")}


        if(!formData.website){
          errors.website = "website cannot be empty"
          return toast.error("website cannot be empty")}

        if (Object.keys(errors).length == 0) {
          if (status) {
            var FormDatas = new FormData()
            FormDatas.append("website", formData?.website)
            FormDatas.append("id",formData._id)
            FormDatas.append("link", formData?.link)
            FormDatas.append("img", formData?.img)
            FormDatas.append("files",formData.files)
            FormDatas.append("action","edit")
            var resp = await editDeleteSocial(FormDatas);
            if (resp?.status) {
              toast.success(resp.msg)
              setTimeout(function () {
                history.push("/sociallist")
              }, 1000);
             
    
            }
            else return toast.error(resp.msg)
          }
          else {
            var payload = {
              id:formData._id,
                  website:formData.website,
                  link:formData.link,
                  action:"edit"
                 }
            
                 console.log("payload",payload)
             
                 var resp = await editDeleteSocial(payload);
                if(resp?.status){
                  toast.success("Social link updated successfully")
                  setTimeout(function(){ 
                    history.push("/sociallist")
                  }, 1000);
                  
                } 
                else return toast.error(resp.msg)

          }
        }
}






    return (
      <div>
   
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
           
              <div className="card-body">
              <button className='btn mt-2 allbtn' type='button' onClick={()=> history.goBack()} >Back</button>
                <h4 className="card-title">Edit Social Links</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Website Name</label>
                    <Form.Control type="text" className="form-control" id="website" placeholder="topic" value={formData.website} onChange={(e)=>handlechange(e)}/>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Website Link</label>
                    <Form.Control type="text" className="form-control" id="link" placeholder="content" value={formData.link} onChange={(e)=>handlechange(e)}/>
                </Form.Group>
               
                <div><img src={status ? dataurl : `${config.ImG}/socialimg/${formData.img}`} width={100} /></div>
<div><input type="file" id="file" onChange={(e) => handlechange(e)} /></div>
                 
                </form>
              <button className='btn mb-2 allbtn' type='button' onClick={()=>handleSubmit()}>SUBMIT</button>

              </div>
            </div>
          </div>
         
        </div>
      </div>
    )
  
}

export default EditSocial
