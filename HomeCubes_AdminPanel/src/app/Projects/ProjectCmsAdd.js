import React, { Component, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useLocation, useHistory } from "react-router-dom";

import { addCategoryCall } from "../../axioscalls/token.js";
import Select from "react-select";
import { isEmpty } from "../../lib/common.js";
import {
    collectionFunctions,
    createProject,
    newsAndFeedFunc,
} from "../../axioscalls/admin.js";
import config from "../../lib/config.js";

toast.configure();

export function ProjectCmsAdd() {
    const History = useHistory();
    var location = useLocation();
    var pathname = location.pathname;
    var path = pathname.split("/")[1];
    console.log("pathnamePto", path, location.state);

    useEffect(() => {
        bsCustomFileInput.init();
    }, []);

    const [formData, setFormData] = useState(path == "ProjectCmsEdit" ? location.state : {});
    const [Errors, setError] = useState({});
    const [loading, setLoading] = useState(false)
    const [titleArr, setTitleArr] = useState([
        { label: "Photo Galleries", value: "Photo Galleries" },
        { label: "News Feed and Updates", value: "News Feed and Updates" },
        { label: "Road map", value: "Road map" },
        { label: "NFTs", value: "NFTs" },
        { label: "PROPERTY VALUE", value: "PROPERTY VALUE" },
    ])

    console.log("formData", formData);

    const handleChange = (e) => {
        setError({});
        e.preventDefault();
        console.log("errrrr on 0", e.target);
        const { id, value, files } = e.target;
        let formdata = { ...formData, ...{ [id]: files ? files[0] : value } };
        setFormData(formdata);
        console.log("formdata", formData);
    };

    const validation = () => {
        var errors = {};
        if (!formData?.stepTitle) errors.stepTitle = "Title can't be empty";
        if (!formData?.stepDescription)
            errors.stepDescription = "Description can't be empty";
        // if (formData?.stepTitle && !formData?.img) errors.img = "Please select Image"

        return errors;
    };

    const handleSubmit = async () => {
        const validate = validation();
        console.log("validate", validate);
        if (!isEmpty(validate)) return setError(validate);
        setLoading(true)
        formData.action = path == "ProjectCmsEdit" ? "editCms" : "addCms";
        formData.projectId = location.state._id;

        var resp = await createProject(formData);
        console.log("respresp", resp);
        if (resp?.success == "success") {
            toast.success(resp.msg);
            setTimeout(function () {
                History.push("/projectList");
            }, 1000);
        } else toast.error(resp.msg);
        setLoading(false)
    };

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
            padding: "0 20px",
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
        //header end
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

    return (
        <div>
            <div className="page-header">
                <button
                    className="btn mt-2 allbtn"
                    type="button"
                    onClick={() => History.goBack()}
                >
                    Back
                </button>

                {/* <h3 className="page-title"> ADD PROJECT </h3> */}
            </div>
            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <form className="forms-sample">
                                <Form.Group>

                                    <Form.Group>
                                        <label htmlFor="exampleInputName1">CMS Title</label>
                                        <Select
                                            styles={stylesgraybg}
                                            options={titleArr}

                                            isDisabled={path == "ProjectCmsEdit"}
                                            value={{ value: formData.stepTitle, label: formData.stepTitle }}
                                            onChange={(e) => { setError({}); setFormData({ ...formData, stepTitle: e.value }) }}
                                        />
                                        <p className='mt-2' style={{ color: "red" }} >{Errors?.stepTitle}</p>

                                    </Form.Group>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">CMS Description</label>
                                    <textarea
                                        rows={3}
                                        cols={5}
                                        className="form-control"
                                        id="stepDescription"
                                        value={formData?.stepDescription}
                                        placeholder="Step Description"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.stepDescription}</p>
                                </Form.Group>

                                {/* {formData?.stepTitle == "PROPERTY VALUE" &&
                                    <Form.Group>
                                        <div>
                                            <div class="upload-btn-wrapper">
                                                <button class="btn">Choose file</button>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="img"
                                                    accept='image/*'
                                                    placeholder="Project Thumbnail"
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                        </div>
                                        <p style={{ color: "red" }}>{Errors?.img}</p>

                                        {formData && formData?.img ? (
                                            typeof formData?.img == "string" ? (
                                                <img
                                                    src={`${config.ImG}/projects/steps/${formData.img}`}
                                                    style={{ height: 100, width: 100 }}
                                                />
                                            ) : (
                                                <img
                                                    src={URL.createObjectURL(formData?.img)}
                                                    style={{ height: 100, width: 100 }}
                                                />
                                            )
                                        ) : (
                                            <></>
                                        )}
                                    </Form.Group>

                                } */}


                                {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                            </form>
                            <button
                                className="btn mt-2 allbtn"
                                type="button"
                                disabled={loading}
                                onClick={() => handleSubmit()}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCmsAdd;
