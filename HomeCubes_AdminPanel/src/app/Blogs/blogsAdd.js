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
import { blogsFunction, getblogCategories, saveCkeditorImage } from '../../axioscalls/admin.js';
import Select from 'react-select'
import { isEmpty } from '../../lib/common.js';
toast.configure();
 

export function BlogList() {

    useEffect(() => {
        bsCustomFileInput.init()

    }, [])

    var location = useLocation();
    const { pathname, state } = location;
    console.log("statatt", state);
    const path = pathname.split("/")[1]

    const [formData, setFormData] = useState(state ? state : {});
    const [categories, setCategories] = useState([]);
    const [ans, setAns] = useState("");
    const [Error, setError] = useState({})


    const stylesgraybg = {
        option: (styles, { isFocused, isSelected, isHovered }) => ({
          ...styles,
          color: "#6C6A81",
          background: isFocused
            ? "#F5F6F7"
            : isSelected
            ? "#F5F6F7"
            : isHovered
            ? "red"
            : "#F5F6F7",
    
          zIndex: 1,
          cursor: "pointer",
          fontSize: "13px",
        }),
        // header start
        valueContainer: (provided, state) => ({
          ...provided,
          height: "40px",
          padding: "0 10px",
          backgroundColor: "#2A3038",
          borderRadius: 5,
          fontSize: "13px",
          color: "#fff",
        }),
        control: (provided, state) => ({
          ...provided,
          height: "40px",
          borderRadius: 5,
          backgroundColor: "#2A3038",
          border: "none",
          outline: "none",
          boxShadow: "none",
          fontSize: "13px",
          color: "#fff",
        }),
        
        indicatorsContainer: (provided, state) => ({
          ...provided,
          height: "40px",
          position: "absolute",
          right: 0,
          top: 0,
          color: "#6C6A81",
        }),
        //header color
        singleValue: (provided, state) => ({
          ...provided,
          color: "white",
        }),
    //header end
        // menu list start
        menuList: (base) => ({
          ...base,
          //   padding: 0,
          backgroundColor: "#2A3038",
        }),
        //menu options
        option: (styles, { isFocused, isSelected, isHovered }) => {
          return {
            ...styles,
            backgroundColor: isHovered
              ? "#16EBC3"
              : isSelected
              ? "#16EBC3"
              : isFocused
              ? "#16EBC3"
              : "#2A3038",
            cursor: "pointer",
            color: isHovered
              ? "#000"
              : isSelected
              ? "#000"
              : isFocused
              ? "#000"
              : "#fff",
            fontSize: "13px",
          };
        },
        // option: (base) => ({
        //   ...base,
        //   ":active": {
        //     backgroundColor: "#16EBC3",
        //   },
        // }),
      };

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

        if (!formData?.blog_category) error.blog_category = "Blog Category can't be empty";
        if (!formData?.description) error.description = "Blog Description can't be empty";
        if (!formData?.image) error.image = "Blog image can't be empty";
        if (!formData?.slug) error.slug = "Blog slug can't be empty";
        if (!formData?.title) error.title = "Blog title can't be empty";
        if (!ans) error.ans = error.ans = "Blog content can't be empty";
        return error
    }


    const History = useHistory();

    const handleSubmit = async () => {

        const validate = validation();
        console.log("validatevalidate", validate);
        if (!isEmpty(validate)) return setError(validate)

        formData.action = path == "blogEdit" ? "edit" : "add"
        formData.content = ans
        console.log("forortorjgorgrg", formData);
        var resp = await blogsFunction(formData);
        console.log("respresp", resp);
        if (resp?.success == "success") {
            toast.success(resp.msg)
            setTimeout(() => {
                History.goBack()
            }, 1000);

        }
        else return toast.error(resp.msg)


    }


    useEffect(() => {
        getblogCategories({ action: "get" })
            .then((val) => setCategories(val.data))
            .catch((e) => console.log("errr on getblogCategories", e))
    }, [])


    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    loader.file.then(async (file) => {
                        console.log("fifififififif", file);
                        const setData = await saveCkeditorImage({ file: "upload", imgFile: file });
                        console.log("setData", setData);
                        if (setData?.success == "success") {
                            console.log("ereirhoisehs", `${config.ImG}/blogImg/${setData.imgFile}`);
                            resolve({ default: `${config.ImG}/blogImg/${setData.imgFile}` });
                        }
                        else {
                            reject("Image upload")
                        }

                    })
                })
            }
        }
    }

    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
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
                            <h4 className="card-title mt-3">ADD Blog</h4>
                            <form className="forms-sample">
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Category</label>
                                    <Select
                                        styles={stylesgraybg}
                                        options={categories}
                                        value={{ value: formData.blog_category, label: formData.blog_category }}
                                        onChange={(e) => { setError({}); setFormData({ ...formData, blog_category: e.value }) }}
                                        isDisabled={path == "blogView"}
                                    //  menuIsOpen={true}
                                    />
                                    <p style={{ color: "red" }} >{Error?.blog_category}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Title</label>
                                    <Form.Control type="text" className="form-control" disabled={path == "blogView"} id="title" placeholder="Enter title" value={formData?.title} onChange={(e) => handlechange(e)} />
                                    <p style={{ color: "red" }} >{Error?.title}</p>

                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">slug</label>
                                    <Form.Control type="text" className="form-control" disabled={path == "blogView"} id="slug" placeholder="Enter Slug" value={formData?.slug} onChange={(e) => handlechange(e)} />
                                    <p style={{ color: "red" }} >{Error?.slug}</p>

                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Description</label>
                                    {/* <Form.Control type="text" className="form-control" id="description" placeholder="Enter description" value={formData?.description} onChange={(e) => handlechange(e)} /> */}
                                    <textarea
                                        rows={3}
                                        cols={5}
                                        className="form-control"
                                        // disabled={path == "projectView"}
                                        id="description"
                                        value={formData.description}
                                        placeholder="description"
                                        onChange={(e) => handlechange(e)}
                                        disabled={path == "blogView"}
                                    />
                                    <p style={{ color: "red" }} >{Error?.description}</p>

                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Upload Images</label>
                                    <div>
                                        <div class="upload-btn-wrapper">
                                            <button class="btn" disabled={path == "blogView"}>Upload Images</button>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                id="image"
                                                onChange={(e) => handlechange(e)}
                                                disabled={path == "blogView"}
                                            />
                                        </div>
                                    </div>
                                    <p style={{ color: "red" }} >{Error?.image}</p>

                                    {formData && formData?.image ? (
                                        typeof formData?.image == "string" ? (
                                            <img
                                                src={`${config.ImG}/blogImg/${formData.image}`}
                                                style={{ height: 200, width: 200 }}
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(formData?.image)}
                                                style={{ height: 200, width: 200 }}
                                            />
                                        )
                                    ) : (
                                        <></>
                                    )}
                                </Form.Group>
                                <Form.Group>

                                    <CKEditor
                                        editor={Editor}
                                        data={ans}
                                        disabled={path == "blogView"}
                                        config={{
                                            extraPlugins: [uploadPlugin]
                                        }}
                                        onChange={(e, editor) => {
                                            const data = editor.getData();
                                            console.log("getDatagetDatagetData", e, editor, data);
                                            setAns(data);
                                            setError({});
                                        }}
                                    />
                                    <p style={{ color: "red" }} >{Error?.ans}</p>

                                </Form.Group>
                            </form>
                            {path != "blogView" && <button className='btn mb-2 allbtn' type='button' onClick={() => handleSubmit()}>SUBMIT</button>}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default BlogList;

