import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Account_Connect, Account_disConnect, Initial_Connect, Admin_Login } from "../../redux/action.js";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const mapData = {
  "BZ": 75.00,
  "US": 56.25,
  "AU": 15.45,
  "GB": 25.00,
  "RO": 10.25,
  "GE": 33.25
}

export default function Dashboard() {
  const Wallet_Details = useSelector((state) => state.wallet_detail)

  return (
    <div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card corona-gradient-card">
            <div className="card-body py-0 px-0 px-sm-3">

            </div>
          </div>
        </div>
      </div>
      <div className="row boxes">

        <div className="grid-margin stretch-card strectch-card_cms" >
          <Grid container spacing={2}>
            {/* {['Latest Drop','Featured Artist','Featured NPO','Footer','About Us','Contact Us','How Its Works','Terms Of Service','Privacy Policy']*/}
            {[].map((item) => {
            // {['Home page_top', 'Home page_middle', 'Footer', 'About Us_top', "About Us_middle", "About Us_video", "About Us_middle1", "About Us_middle2", "About Us_middle3", "referral_page", 'Privacy Policy'].map((item) => {

              return (
                <Grid item xs={12} lg={4} md={12} sm={12} xl={4}>
                  <div className="card">
                    <div className="card-body ml-2 mr-2">
                      <div className="row">
                        <div className="col-9">
                          <div className="d-flex align-items-center align-self-start">
                            <h3 className="mb-0">{(item)}</h3>
                            {/* <p className="text-success ml-2 mb-0 font-weight-medium">+3.5%</p> */}
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="icon icon-box-success ">
                            <Link to={item === "How Its Works" ? "/faqlist" : "/editcms/" + (item).toString().replace(/\s/g, '').toLowerCase()}>
                              <span className="mdi mdi-arrow-top-right icon-item"></span>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <h6 className="text-muted font-weight-normal"></h6>
                    </div>
                  </div>
                </Grid>
              )
            })}
          </Grid>
        </div>
      </div>
    </div>
  );

}

