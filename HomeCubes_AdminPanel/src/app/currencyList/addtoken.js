import React, { Component,useState,useEffect} from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Web3 from 'web3'
import tradeabi from '../../ABI/trade.json'
import BNBTRADEABI from '../../ABI/bnblocal.json'
import ETHTRADEABI from '../../ABI/avaxlocal.json'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useLocation,useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {addTokenCall} from '../../axioscalls/token.js';
import { customtokenfetch } from '../../axioscalls/admin.js';
import config from '../../lib/config'

toast.configure();


export function AddToken()  {

  var location = useLocation();
  var pathname = location.pathname;
  var path = pathname.split("/")[1]
 
useEffect(()=>{
  bsCustomFileInput.init()

},[])

const initData = {
  "name":"",
  "address":"",
  "decimal":"",
  "ChainId" : location.state.chain == "ETH" ? config.ETHCHAIN : config.BNBCHAIN
}

const History = useHistory(); 
const Wallet_Details = useSelector((state) => state.wallet_detail)
const [formData,setFormData] = useState(initData) 
console.log("pathname",location.state.chain,Wallet_Details)

const {
  name,
  address,
  decimal
} = formData

useEffect(()=>{
  chainIdCheck()
},[location])

// const handleChange = (e)=>{

//   e.preventDefault();
//   const { id, value } = e.target;
//   let formdata = { ...formData, ...{ [id]: value } }
//   setFormData(formdata)
//   console.log("formdata",formData)
// }

const chainIdCheck = async () => {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  const hexString = config.chainId.toString(16);
  console.log("hexString",hexString);
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: location.state.chain == "BNB" ?  config.bnbver : config.ethver }], // chainId must be in hexadecimal numbers
      });
      return true;
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: "0x" + hexString,
                rpcUrl: config.BNBProvider,
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  } else {
    // if no window.ethereum then MetaMask is not installed
    //console('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    return false;

  }
}

const handleChange =async(e)=>{
  // e.preventDefault();
  console.log("xcsdvsv",e.target.value);
  var address=e.target.value
  const { id, value } = e.target;
  if(value.length >40){
    let formdata = { ...formData, ...{ [id]: value } }
    setFormData(formdata)
  if(e.target.id=="address"){
    console.log(address);
    var resp=await customtokenfetch({contractaddress:address , network : location.state.chain})
    if(resp.msg=="Token Fetched operation failed"){
      toast.error("Address Invalid")
      }
      else{
        let formdata = { ...formData, ...{ 'name' :  resp.data.name ,'decimal' : resp.data.decimal , "address" : address  } }
        setFormData(formdata)
      }
  }
  }else{
    let formdata = { ...formData, ...{ [id]: value } }
    setFormData(formdata)
  }
}

const get_receipt = async (HashValue,web3) => {
  var receipt = await web3.eth.getTransactionReceipt(HashValue);
  console.log("sdsadshadsadhfsa", receipt, HashValue)
  if (receipt) {
      return receipt
  }
  else {
      get_receipt(HashValue)
  }
}
const handleSubmit = async()=>{
  console.log("Wallet_Details",Wallet_Details);
  if(Wallet_Details?.UserAccountAddr != ""){
    console.log("Wallerttdetails",Wallet_Details,Wallet_Details.UserAccountAddr == Wallet_Details.Admin_Address,Wallet_Details.UserAccountAddr, Wallet_Details.Admin_Address);
    if(Wallet_Details.UserAccountAddr == Wallet_Details.Admin_Address){

      var errors = {};
    
      if(!formData.name){
        errors.name = "Token name empty"
        return toast.error("Token name cannot be empty/Invalid Token Address")}
    
      if(!formData.address){
        errors.description = "Token address empty"
        return toast.error("Token address cannot be empty")}
    
        if(Object.keys(errors).length == 0){
      var web3 = new Web3(Wallet_Details.providers

        // location.state.chain == "ETH" ?  config.ETHprovider :  config.BNBprovider
        )
      var contract =  new web3.eth.Contract((config.ENVname == "local" || config.ENVname == "demo") ? location.state.chain == "ETH" ? ETHTRADEABI : BNBTRADEABI :  tradeabi, (config.ENVname == "local" || config.ENVname == "demo") ? location.state.chain == "ETH"? config.ETHTRADE : config.BNBTRADE :   config.tradeAddress)
      console.log("contract",contract.methods,formData.address);
      var hash= await contract.methods.addTokenType([formData.name.toUpperCase()],[formData.address]).send({from : Wallet_Details.UserAccountAddr})
      console.log("hash",hash);
      // var receipt = await get_receipt(hash,web3)
      if(hash.status ){
        console.log("erro length",Object.keys(errors).length,formData)
        formData.action = "add"
        var resp = await addTokenCall(formData);
       if(resp?.status){
         toast.success(resp.msg)
         setTimeout(function(){ 
           History.push('/currencylist')
         }, 2000);
         
       } 
       else if(resp.msg == "Token Already Exists/Token invalid'" ){
         toast.error(resp.msg)
       }
       else{
         toast.error(resp.msg)
       }
      }
        
        
    
      }
    }
    else{
      toast.warning("Admin can only Add Token")
    }
  }else{
    toast.warning("Please Connect Wallet")
  }


}


    return (
      <div>
        <div className="page-header">
        <button className='btn mt-2 allbtn' type='button' onClick={()=> History.goBack()} >Back</button>
          <h3 className="page-title"> ADD TOKEN </h3>
         
        </div>
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
            
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Token Name</label>
                    <Form.Control type="text" className="form-control" id="name" disabled={true} value={formData.name} placeholder="Name" onChange={(e)=>handleChange(e)} />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Token Address</label>
                    <Form.Control type="text" className="form-control" id="address" value={formData.address} placeholder="address" onChange={(e)=>handleChange(e)}/>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Token Decimal</label>
                    <Form.Control type="text" className="form-control" id="decimal" disabled={true} value={formData.decimal} placeholder="Decimal" onChange={(e)=>handleChange(e)}/>
                  </Form.Group>
                
                  
                 
                  {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                </form>
              <button className='btn mt-2 allbtn' type='button' onClick={()=>handleSubmit()}>Submit</button>

              </div>
            </div>
          </div>
         
        </div>
      </div>
    )
  
}

export default AddToken
