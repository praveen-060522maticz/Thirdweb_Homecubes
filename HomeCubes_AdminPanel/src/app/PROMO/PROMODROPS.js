import React, { Component, useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import {  useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { FindpromoDrop } from '../../axioscalls/user';

export default function PROMODROPS() {

  const Wallet_Details = useSelector((state)=>state.wallet_detail)
  React.useEffect(()=>{
    FindpromoDrops()
  },[])
  const [Promos,Set_Promo]   =   React.useState([])
    
 const FindpromoDrops = async() => {
    var Resp = await FindpromoDrop()
    if(Resp?.success == "success") Set_Promo(Resp?.msg)
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
        <div className="row boxes">
         
          <div className="grid-margin stretch-card strectch-card_cms" >
          <Grid container spacing={2}>
           {Promos.map((item)=>{
            return(
                <Grid item xs={12} lg={4} md={12} sm={12} xl={4}>
               <div className="card">
              <div className="card-body ml-2 mr-2">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0">{(item.CollectionName)}</h3>
                      {/* <p className="text-success ml-2 mb-0 font-weight-medium">+3.5%</p> */}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-success ">
                      <Link to={`/promo/${item.CollectionUrl}`}>
                      <span className="mdi mdi-arrow-top-right icon-item"></span>
                      </Link>
                    </div>
                  </div>
                </div>
                <h6 className="text-muted font-weight-normal"></h6>
              </div>
            </div>
            </Grid>
            )})}
            </Grid>
          </div>
        </div>
      </div> 
    );
  
}

