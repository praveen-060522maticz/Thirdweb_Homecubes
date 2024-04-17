import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { LSsetItem, isEmpty } from "../../lib/common";
import * as adminFunctions from "../../axioscalls/admin.js";
import {
  Account_Connect,
  Account_disConnect,
  Initial_Connect,
  Admin_Login,
} from "../../redux/action.js";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

toast.configure();

export default function Login(props) {
  // var location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const Wallet_Details = useSelector((state) => state.wallet_detail);

  useEffect(() => {
    console.log("Props : ", props.data);
    console.log("admin_login", Wallet_Details.Login_Admin);
    if (localStorage.getItem("adminlogin") == "yes") {
      history.push("/dashboard");
    }
  }, [Wallet_Details.userAccountAddr]);

  const initialValue = {
    email: "",
    password: "",
  };

  const [formValue, setFormValue] = useState(initialValue);
  const [validErrors, setValidErrors] = useState("");
  const [loc, setLoc] = useState("");

  const formvalidation = async (data) => {
    console.log("i/p for validaion", data);

    var validationErr = {};
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([A-Za-zA-Z\-0-9]+\.)+[A-Za-zA-Z]{2,}))$/;

    if (data.email == "") {
      validationErr.email = "Email cannot be empty";
    } else if (data.email != "") {
      if (!emailRegex.test(data.email)) {
        validationErr.email = "Enter valid email";
      }
    }

    if (!data.password) {
      validationErr.password = "password cannot be empty";
    }

    console.log("validation object", validationErr);
    return validationErr;
  };

  const handleSubmit = async () => {
    var data = { email: formValue.email, password: passwordInput };
    var resp = await formvalidation(data);

    if (resp) setValidErrors(resp);
    if (!isEmpty(resp)) {
      console.log("erore", isEmpty(resp)); // shiuld add toastr here
    } else {
      data.path = "login";
      var Resp = await adminFunctions.loginAdmin(data);
      console.log("Resppppp", Resp);
      if (Resp.data) {
        localStorage.setItem("adminlogin", "yes");
        LSsetItem("adminType", Resp?.Type)
        toast.success(Resp.msg);
        history.push("/dashboard");
      } else toast.error(Resp.msg);
    }
  };

  const handlechange = (e) => {
    const { id, value } = e.target;
    setFormValue({ ...formValue, [id]: value });
  };

  // to check jwt is working
  const chektoken = async () => {
    var resp = await adminFunctions.check();
  };

  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  const handlePasswordChange = (evnt) => {
    setPasswordInput(evnt.target.value);
  };
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  return (
    <div className="login_sec">
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="card text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src={require("../../assets/images/logo.svg")} alt="logo" />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <Form className="pt-3">
                <Form.Group className="d-flex search-field mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    size="lg"
                    className="h-auto"
                    id="email"
                    value={formValue.email}
                    onChange={(e) => handlechange(e)}
                  />
                </Form.Group>
                <p className="error_msg">{validErrors.email}</p>
                {/* <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="Password" size="lg" className="h-auto" id="password" value={formValue.password} onChange={(e)=>handlechange(e)} />
                  </Form.Group> */}
                <div className="input-group passwordinput mb-3">
                  <input
                    type={passwordType}
                    onChange={(e) => handlePasswordChange(e)}
                    value={passwordInput}
                    name="password"
                    class="form-control pw"
                    placeholder="Enter Password"
                  />
                  <div className="input-group-btn ">
                    <button
                      className="btn btn-outline-primary eyebtns"
                      type="button"
                      onClick={() => togglePassword()}
                    >
                      {passwordType === "password" ? (
                        <AiFillEye />
                      ) : (
                        <AiFillEyeInvisible />
                      )}
                    </button>
                  </div>
                </div>
                <p className="error_msg">{validErrors.password}</p>
                <div className="mt-3">
                  <p
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn allbtn allbtns"
                    onClick={() => handleSubmit()}
                  >
                    SIGN IN
                  </p>
                </div>

                {/* <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input"/>
                        <i className="input-helper"></i>
                        Keep me signed in
                      </label>
                    </div>
                    <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-muted">Forgot password?</a>
                  </div>
                
                  <div className="text-center mt-4 font-weight-light">
                    Don't have an account? <Link to="/user-pages/register" className="text-primary">Create</Link>
                  </div> */}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
