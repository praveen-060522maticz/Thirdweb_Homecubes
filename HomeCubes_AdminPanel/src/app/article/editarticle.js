import React, { Component, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import config from "../../lib/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useLocation } from "react-router-dom";
import { CKEditor } from "ckeditor4-react";

import { addFaqCall } from "../../axioscalls/user.js";
import { addarticle } from "../../axioscalls/token.js";
toast.configure();

export function Editarticle(props) {
  const history = useHistory();
  const location = useLocation();

  const detail = location.state;
  console.log("faqedit", props);
  useEffect(() => {
    bsCustomFileInput.init();
  }, []);
  const [ans, setAns] = useState("");
  const initData = {
    question: "",
    answer: "",
  };

  const [formData, setFormData] = useState(initData);

  const onEditorChange = (e) => {
    var content_text = e.editor.getData();
  };

  const [status, setStatus] = useState(false);

  const handlechange = async (e) => {};

  const handleSubmit = async () => {};

  return (
    <div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div>
                <button
                  className="btn mt-2 allbtn"
                  type="button"
                  onClick={() => history.goBack()}
                >
                  Back
                </button>
              </div>

              <h4 className="card-title mt-3">EDIT ARTICLE</h4>
              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">heading</label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="heading"
                    placeholder="Enter heading"
                    value={formData?.heading}
                    onChange={(e) => handlechange(e)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">
                      URL ({config?.Front_market_Url}/
                      {formData?.url ? formData?.url : "your URL"})
                    </label>
                    <Form.Control
                      type="text"
                      disabled={true}
                      className="form-control"
                      id="url"
                      placeholder="Enter question"
                      value={formData?.url}
                    />
                  </Form.Group>
                  <label htmlFor="date for news">Date</label>
                  <Form.Control
                    type="date"
                    id="date"
                    value={
                      formData?.date
                        ? new Date(String(formData?.date))
                            .toISOString()
                            .split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) => handlechange(e)}
                  />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">content</label>
                  {ans && <CKEditor initData={ans} onChange={onEditorChange} />}
                </Form.Group>

                {formData?.img && (
                  <img
                    className="mb-2"
                    src={
                      status
                        ? URL.createObjectURL(formData?.file)
                        : `${config.ImG}/${formData.img}`
                    }
                    height={100}
                    width={100}
                  />
                )}
                {/* <br /> */}
                <div class="upload-btn-wrapper">
                  <button class="btn">Upload Images</button>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => handlechange(e)}
                  />
                </div>
              </form>
              <button
                className="btn mt-3 allbtn"
                onClick={() => handleSubmit()}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editarticle;
