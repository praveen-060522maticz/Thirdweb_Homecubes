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

export function AddProject() {
  const History = useHistory();
  var location = useLocation();
  var pathname = location.pathname;
  var path = pathname.split("/")[1];
  console.log("pathnamePto", path, location.state);

  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  const [formData, setFormData] = useState(path == "editSteps" ? location.state : {});
  const [Errors, setError] = useState({});
  const [loading, setLoading] = useState(false)

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

  console.log(
    "-------------->",
    formData?.galleryThumbImage && Object.values(formData?.galleryThumbImage)
  );

  const validation = () => {
    var errors = {};
    if (!formData?.step) errors.step = "Step can't be empty";
    if (!formData?.stepTitle) errors.stepTitle = "step Title can't be empty";
    if (!formData?.stepDescription)
      errors.stepDescription = "step Description can't be empty";
    if (!formData?.stepImage) errors.stepImage = "step Image can't be empty";

    return errors;
  };

  const handleSubmit = async () => {
    const validate = validation();
    console.log("validate", validate);
    if (!isEmpty(validate)) return setError(validate);
    setLoading(true)
    formData.action = path == "editSteps" ? "editStep" : "saveStep";
    formData.projectId = location.state._id;

    var resp = await createProject(formData);
    console.log("respresp", resp);
    if (resp?.success == "success") {
      toast.success(resp.msg);
      setTimeout(function () {
        History.push("/projectList");
      }, 2000);
    } else toast.error(resp.msg);
    setLoading(false)
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
                  <label htmlFor="exampleInputName1">Step</label>
                  <Form.Control
                    type="number"
                    className="form-control"
                    id="step"
                    disabled={path == "editSteps"}
                    value={formData?.step}
                    placeholder="Step"
                    onChange={(e) => handleChange(e)}
                    min="0"
                  />
                  <p style={{ color: "red" }}>{Errors?.step}</p>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Step Title</label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="stepTitle"
                    value={formData?.stepTitle}
                    placeholder="step Title"
                    onChange={(e) => handleChange(e)}
                  />
                  <p style={{ color: "red" }}>{Errors?.stepTitle}</p>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Step Description</label>
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
                <Form.Group>
                  <label htmlFor="exampleInputName1">Step Image</label>
                  {/* <Form.Control type="file" className="form-control" id="stepImage" onChange={(e) => handleChange(e)} /> */}
                  <div>
                    <div class="upload-btn-wrapper">
                      <button class="btn">Upload Images</button>
                      <input
                        type="file"
                        className="form-control"
                        id="stepImage"
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <p style={{ color: "red" }}>{Errors?.stepImage}</p>
                  {formData && formData?.stepImage ? (
                    typeof formData?.stepImage == "string" ? (
                      <img
                        src={`${config.ImG}/projects/steps/${formData.stepImage}`}
                        style={{ height: 100, width: 100 }}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(formData?.stepImage)}
                        style={{ height: 100, width: 100 }}
                      />
                    )
                  ) : (
                    <></>
                  )}
                </Form.Group>

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

export default AddProject;
