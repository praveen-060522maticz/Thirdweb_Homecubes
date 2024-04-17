import React, { Component ,useState, useEffect } from 'react';

import { Form, FormControl } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams ,Link} from "react-router-dom";
import config from '../../lib/config.js'

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import wallet_details from '../../redux/action.js';


import {hideOrShowToken,getShowStatus} from '../../axioscalls/token.js';

toast.configure();




export function ViewToken(props)  {

    const {nft} = props;
    console.log("prp to viewtoken",nft)

const [startDate,setStartDate] = useState(new Date());
const [hideShow,setHideShow] = useState("");

const Wallet_Details = useSelector((state)=>state.wallet_detail)




 
  const handleChange = (date) => {
    setStartDate(date);
   
  };


  useEffect(()=>{
    bsCustomFileInput.init()
  },[])

  useEffect(()=>{
   if(nft)
    getHideShow();

  },[props])


  const getHideShow = async()=>{

    var payload = { tokenOwner:nft.TokenOwner,
                    tokenCounts:nft.TokenId}
    var resp = await getShowStatus(payload);
    if(resp && resp.status){
      console.log("reponse hide",resp.data)
      setHideShow(resp.data)
    }
    else{console.log("error occured")}
  }



  const hideshowfn = async(data)=>{
console.log("dasdas",data)
    var payload = {hideshow:data,
                   tokenOwner:nft.TokenOwner,
                   tokenCounts:nft.TokenId}
    console.log("payload to hide token",payload,nft.TokenId)
    var resp = await hideOrShowToken(payload);
    console.log("response hidesjow",resp)
    if(resp){
        if(resp.success){
          getHideShow();
          toast.success(resp.msg)}
            
        else {
          toast.error(resp.msg)}
    }
  }






    return (
      <div>

        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">NFT Details</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">NFT Name</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={nft.TokenName}  />
                    {/* <p>{this.props.nft.tokenName}</p> */}
                  </Form.Group>
                  <Form.Group>
                    <label>NFT ID</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={nft.TokenId}  />
                     
                  </Form.Group>
                  <Form.Group>
                  <label>NFT </label>
                  <img className="img-xs rounded-circle" src={`${config.image_url}/${nft.Creator}/NFT/${nft.OriginalFile}`} alt="profile" />                     
                  </Form.Group>

                  <Form.Group>
                    <label>NFT Token Owner</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={nft.TokenOwner} />
                     
                  </Form.Group>
                  <Form.Group>
                    <label>NFT Token Category</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={nft.TokenCategory} />
                     
                  </Form.Group>
                  <Form.Group>
                    <label>NFT Token Balance</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={nft.TokenBalance} />
                     
                  </Form.Group>

                  {/* <Form.Group>
                    <label>NFT Token Status</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name" value={nft.tokenStatus}  />
                     
                  </Form.Group> */}

                  <Form.Group>
                    <label>NFT Royalty</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={nft.Royalty} />
                     
                  </Form.Group>
                  <Form.Group>
                    <label>NFT Token Quantity</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={`${nft.TokenBalance}/${nft.TokenQuantity}`} />
                     
                  </Form.Group>
                  {(nft && !nft.startTime)&&
                   <Form.Group>
                   <label>NFT Price</label>
                   <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={`${nft.TokenPrice} ${nft.CoinName}`} />
                    
                 </Form.Group>}
                 
                  {(nft && nft.startTime)&&
                  <>
                       <Form.Group>
                       <label>Auction Start Time</label>
                       <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={nft.startTime} />
                        
                     </Form.Group>
                     <Form.Group>
                       <label>Auction End Time</label>
                       <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={nft.endTime} />
                        
                     </Form.Group>
                     <Form.Group>
                       <label>Minimum Bid</label>
                       <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={`${nft.TokenPrice} ${nft.CoinName}`} />
                        
                     </Form.Group>
                     </>
                     }
                    <Form.Group>
                    <label>NFT Last Updated</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={nft.updatedAt} />
                     
                  </Form.Group>
                  <Form.Group>
                    <label>NFT Hash</label>
                    <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="Name"  value={nft.HashValue} />
                     
                  </Form.Group>
                 
                  
                  
                  {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>this.Mintcall(nft?nft:"")}>Mint</button> */}
                </form>
              <button onClick={()=>hideshowfn(hideShow == "hidden"?"visible":"hidden")}>{(hideShow == "visible")?"VISIBLE":"HIDDEN"}</button>
               
              </div>

            </div>
          </div>
         
        </div>
      </div>
    )
  
}

export default ViewToken
