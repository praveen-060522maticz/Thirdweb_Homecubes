import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {login} from './Login.js'

export class Register extends Component {
  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0 h-100">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src={require("../../assets/images/logo.svg")} alt="logo" />
                </div>
              
                  <div className="mt-3">
                    <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/login/superadmin">Super Admin</Link>
                  </div>
                  <div className="mt-3">
                    <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/login/admin">Admin</Link>
                  </div>
                  <div className="mt-3">
                    <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/login/user">User</Link>
                  </div>
                  
            
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Register
