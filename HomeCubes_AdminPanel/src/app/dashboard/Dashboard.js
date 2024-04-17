import React, { Component } from 'react';
import { VectorMap } from "react-jvectormap"
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Account_Connect, Account_disConnect, Initial_Connect ,Admin_Login} from "../../redux/action.js";


const mapData = {
  "BZ": 75.00,
  "US": 56.25,
  "AU": 15.45,
  "GB": 25.00,
  "RO": 10.25,
  "GE": 33.25
}

export default function Dashboard() {

  const Wallet_Details = useSelector((state)=>state.wallet_detail)



  const transactionHistoryData =  {
    labels: ["Paypal", "Stripe","Cash"],
    datasets: [{
        data: [55, 25, 20],
        backgroundColor: [
          "#111111","#00d25b","#ffab00"
        ]
      }
    ]
  };

const transactionHistoryOptions = {
    responsive: true,
    maintainAspectRatio: true,
    segmentShowStroke: false,
    cutoutPercentage: 70,
    elements: {
      arc: {
          borderWidth: 0
      }
    },      
    legend: {
      display: false
    },
    tooltips: {
      enabled: true
    }
  }

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  const toggleProBanner=()=>{
    document.querySelector('.proBanner').classList.toggle("hide");
  }

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
        <div className="row">
         
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                  
                      <p className="dash-token text-success ml-6 mb-0 font-weight-medium">{ (Wallet_Details.Admin_Address).slice(0,10).concat("...")}</p>
                    </div>
                  </div>
                  <div className="col-3">
                    {/* <div className="icon icon-box-success">
                    </div> */}
                  </div>
                </div>
                <h6 className="text-muted font-weight-normal">Admin Address</h6>
              </div>
            </div>
          </div>
          {/* <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0">$12.34</h3>
                      <p className="text-danger ml-2 mb-0 font-weight-medium"></p>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-danger">
                    </div>
                  </div>
                </div>
                <h6 className="text-muted font-weight-normal">BNB VALUE</h6>
              </div>
            </div>
          </div> */}
          {/* <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0 editservice">Edit service Fee</h3>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-success ">
                      <Link to="/servicefee">
                      <span className="mdi mdi-arrow-top-right icon-item"></span>
                      </Link>
                    </div>
                  </div>
                </div>
                <h6 className="text-muted font-weight-normal"></h6>
              </div>
            </div>
          </div> */}
        </div>
    
   
   
      </div> 
    );
  
}

