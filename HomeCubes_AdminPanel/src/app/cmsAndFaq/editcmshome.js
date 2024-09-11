import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, useLocation, useParams } from "react-router-dom";
import { editCmsCall, getCmsContent } from '../../axioscalls/token.js'
import { CKEditor } from 'ckeditor4-react';
import config from '../../lib/config.js'
import { EncryptData } from '../../lib/common.js';
import { URL } from 'url';
toast.configure();


export function Editcmshome() {
  const history = useHistory();
  // useEffect(()=>{
  //     bsCustomFileInput.init()
  // },[])

  const { data } = useParams()
  const locate = useLocation()
  console.log("locate", locate)
  console.log("data", data)
  const initData = {
    title: "",
    content: "",
    link: '',
    position: "",
    img: "",
    page: "",
    File: null,
    url: null,
    key: ""
  }

  const [formData, setFormData] = useState(initData)
  console.log("formDataaa", formData)
  const [ckcontent, setckcontent] = useState('')
  const [ckTitle, setckTitle] = useState('')
  console.log(("ckcontent", ckcontent));
  // const [description, setdescription] = useState("")



  // const handlechange = async (e, index) => {
  //   e.preventDefault();
  // }
  // console.log("suefhiushdiuhseidu", formData);


  const handlechange = async (e) => {
    console.log("eeeee", e.target.files)
    e.preventDefault();
    const { id } = e.target;
    if (id == "File") {


      var files = e.target.files[0]
      console.log("fileincms", files)

      var reader = new FileReader()
      reader.readAsDataURL(files);
      reader.onloadend = function (e) {
        if (reader.result) {

          setFormData({ ...formData, img: files, url: reader.result })
        }
      }.bind(this);

      // let formdata = { ...formData, ...{ "img": files } }
      // setFormData(formdata)
      // var formdata = formData
      // formdata.File = files
      console.log("files", files)

    } else {
      const { value } = e.target;
      var formdata = formData
      formdata[id] = value
      // console.log("files",files)
      setFormData({ ...formdata, ckcontent })
    }

  }
  const onEditorChange = (evt) => {
    var description_text = evt.editor.getData()

    setckcontent(description_text)

  }
  const onTitleChange = (e) => {
    setckTitle(e.editor.getData())
  }
  useEffect(() => {
    // if (locate) {
    setFormData({ ...locate.state })
    setckcontent(locate.state.content)
    // }
  }, [])
  console.log("formDataformData", formData);
  const handleSubmit = async () => {
    var errors = {};

    if (!formData?.content) {
      errors.Content = "Content cannot be empty"
      return toast.error("Content cannot be empty")
    }
    if (!formData?.title) {
      errors.title = "Title cannot be empty"
      return toast.error("Title cannot be empty")
    }

    if (Object.keys(errors).length == 0) {
      var datacms = {
        title: ckTitle || formData?.title,
        content: formData.content,
        link: formData.link,
        position: formData.link,
        img: formData.img,
        page: formData.page,
        File: formData?.File ?? "",
        content: ckcontent,
        key: formData?.key
      }
      console.log("datacms", datacms);
      var resp = await editCmsCall(datacms);

      if (resp?.status) {
        toast.success(resp.msg)
        setTimeout(function () {
          history.push("cmshomelist")
        }, 1000);

      }
      else return toast.error(resp.msg)
    }


    else {
      console.log("erro length", Object.keys(errors).length, formData)
      // if(formData?.description){

      //   var payload = {
      //     title:formData?.title,
      //     content : formData?.content,
      //     position:formData?.position,
      //     link:formData.link,
      //     page:formData.page
      //    }
      // }else{
      //   var payload = {
      //     title:formData?.title,
      //     content : formData?.content,
      //     link:formData.link
      //    }
      // }


      // console.log("payload",payload)

      var resp = await editCmsCall(formData);
      if (resp?.status == true) {
        toast.success(resp.msg)
        setTimeout(function () {
          history.push("cmshomelist")
        }, 1000);

      }
      else return toast.error(resp.msg)
    }



  }

  console.log('fontsdfl', formData)


  return (
    <div>

      <div className="row">

        <div className="col-12 grid-margin stretch-card">
          <div className="card">


            <div className="card-body">
              <div>
                <button className='btn mt-2 allbtn' type='button' onClick={() => history.goBack()} >Back</button></div>
              {/* <h4 className="card-title">{formData?.title}</h4> */}
              <br />

              <form className="forms-sample">
                <Form.Group>

                  <label htmlFor="exampleInputName1">title</label>

                  {/* {formData?.title && */}
                  {/* <input type="text" className="form-control" id="title" placeholder="title" value={formData?.title} onChange={(e) => handlechange(e)} /> */}

                  {/* } */}
                  {formData?.title && <CKEditor
                    initData={formData.title != "" ? formData.title : ""}
                    onChange={(e) => onTitleChange(e)}
                  />}

                </Form.Group>
                <Form.Group>

                  <label htmlFor="exampleInputName1">page</label>

                  {/* {formData?.page && */}
                  <input type="text" className="form-control" disabled id="page" placeholder="page" value={formData?.page} onChange={(e) => handlechange(e)} />

                  {/* } */}
                </Form.Group>

                {/* <Form.Group>

                  <label htmlFor="exampleInputName1">position</label>

                  {formData?.position &&
                    <input type="text" className="form-control" id="title" placeholder="position" value={formData?.position} onChange={(e) => handlechange(e)} />

                  }
                </Form.Group> */}
                <Form.Group>

                  <label htmlFor="exampleInputName1">link</label>

                  {/* {formData?.link && */}
                  <input type="text" className="form-control" id="link" placeholder="link" value={formData?.link} onChange={(e) => handlechange(e)} />

                  {/* } */}
                </Form.Group>
                {/* {(data == "aboutus"||data == "contactus"||data == "termsofservice"||data == "privacypolicy")? */}

                {/* {slug == "aboutus_video" ? <>
                  <> <div><video src={dataurl == "" ? `${config.ImG}/cmsimg/${formData?.img}` : dataurl} width={100} /></div>
                    <div><input type="file" id="file" onChange={(e) => handlechange(e)} /></div>
                  </>
                </>
                  :
                  ((slug == 'homepage_top') || (slug == "homepage_middle") || (slug == "aboutus_top") || (slug == "aboutus_middle") || (slug == "aboutus_middle1") || (slug == "aboutus_middle2") || (slug == "aboutus_middle3")) ?
                    <><label htmlFor="exampleInputName1">Heading</label><br />
                      <Form.Control type="text" id="description" value={description} onChange={(e) => handlechange(e)} placeholder="Heading" /></> : ""} */}

                <Form.Group>

                  <label htmlFor="exampleInputName1">content</label>

                  {formData?.content &&
                    <CKEditor
                      initData={formData.content != "" ? formData.content : ""}
                      onChange={(e) => onEditorChange(e)}
                    />
                  }
                </Form.Group>
                {/* {console.log("formDataformData", typeof formData?.file == "string", formData?.file)} */}

                <Form.Group>

                  <label htmlFor="exampleInputName1">Image</label>
                  {/* {console.log("datsasdashda", formData.file)}
                  <br />

                  {formData?.file && <img className='mb-2' src={formData?.file ? URL.createObjectURL(formData?.file) :
                    `${config.ImG}/cmsimg/${formData?.img}`} height={100} width={100} />}
                  <br /> */}
                  {/* <input type="file" id="File" onChange={(e) => handlechange(e)} /> */}
                  <div>
                    <div class="upload-btn-wrapper">
                      <button class="btn">Choose file</button>
                      <input
                        type="file" id="File" onChange={(e) => handlechange(e)}

                      />
                    </div>
                  </div>
                  {console.log("awefaw", formData)}
                  {/* {formData && formData?.url && <img src={formData.url} style={{ height: 100, width: 100 }} />} */}
                  {
                    // formData && formData?.img ?
                    (typeof formData?.img == "string" || formData?.img == undefined || formData?.img == "")
                      ?
                      <img src={`${config.ImG}/cmsimg/${formData.img}`} style={{ height: 100, width: 100 }} />
                      :
                      <>
                        <img src={formData?.url ? (formData?.url) : ''} style={{ height: 100, width: 100 }} />
                      </>

                    //  :
                    // <></>
                  }
                </Form.Group>

                {/* {(data == "impactcollectivemarketplace" || data == "featuredartist") && <Form.Group>
                  <label htmlFor="exampleInputName1">Link</label>
                  <Form.Control type="text" className="form-control" id="link" placeholder="topic" value={formData?.link} onChange={(e) => handlechange(e)} />

                </Form.Group>}
                {formData?.page == "homepage_middle" || formData?.page == "aboutus_top" ?

                  <> <div><img src={link == "" ? `${config.ImG}/cmsimg/${formData?.img}` : link} width={100} /></div>
                    <div><input type="file" id="file" onChange={(e) => handlechange(e)} /></div></>

                  : ""
                }
                {formData?.slug == "aboutus_middle" ? formData &&
                  formData?.img.map((item, index) => {
                    return (
                      <>
                        <div><img src={link == "" ? `${config.ImG}/cmsimg/${item}` : link} width={100} /></div>
                        <div><input type="file" id="file" onChange={(e) => handlechange(e, index)} /></div>
                      </>
                    )
                  })
                  : ""
                } */}



              </form>
              <button className='btn mt-2 allbtn' type='button' onClick={() => handleSubmit()}>SUBMIT</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )

}

export default Editcmshome
