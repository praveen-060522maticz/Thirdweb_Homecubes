import React, { Component,useState, useEffect ,Fragment } from 'react';
import { useLocation,useHistory} from 'react-router-dom';
import moment from 'moment';


import { Button, ProgressBar } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';


import config from '../../lib/config.js'
import NFTDETAIL from './nftdetail.js';
import ViewToken from './viewtoken.js';
import * as tokenFunctions from '../../axioscalls/token.js'

import wallet_details from '../../redux/action';

export default function TokenTable (props) {


  var history = useHistory(); 
  var location = useLocation();
  const{pathname,state}=location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae",pathname,state,path)

 
  const Wallet_Details = useSelector((state)=>state.wallet_detail)

  const [nftList,setNftList] = useState([])
  const [viewState,setViewState] = useState("")
  const [viewComponent,setViewComponent]= useState(false);




  useEffect(()=>{
    getTokenlist();
    
  },[])



const getTokenlist = async () => {
  var test = await tokenFunctions.marketTokens();
  console.log("getpairlist", test)
  setNftList(test.userValue);
}


const ViewTokens=async(record)=>{
  // alert("1")
  console.log("record to viewtoken",record)
  var data = {
    TokenName:record.TokenName,
    TokenId:record.TokenId,
    TokenOwner:String(record.tokenOwnerDb.TokenOwner),
    TokenCategory:record.Category,
    TokenBalance:record.tokenOwnerDb.TokenBalance,
    // tokenStatus:record.status,
    HashValue:record.tokenOwnerDb.HashValue,
    HideShow:record.tokenOwnerDb.HideShow,
    Royalty:record.Royalty,
    TokenQuantity:record.TokenQuantity,
    TokenPrice:record.tokenOwnerDb.TokenPrice,
    CoinName:record.tokenOwnerDb.CoinName,
    upatedAt:record.tokenOwnerDb.upatedAt,
    OriginalFile:record.OriginalFile,
    Creator:record.Creator,
    startTime:record.tokenOwnerDb.ClockTime,
    endTime:record.tokenOwnerDb.EndClockTime,
    minimumBid:record.minimumBid


  }
  console.log("data to view",data)
    if(data.TokenOwner && data.TokenId) {
      console.log("if cond")
      setViewState(data)
      history.push({pathname:"/tokendetail",state:data})
      //setViewComponent(true)
    }
    else console.log("error in viewing token")

}







  const columns = [
    {
      key: "ind",
      text: "SNO",
      className: "name",
      align: "left",
      sortable: true,
      cell:(row, index, column, id)=>
      <p>{index+1}</p>
  
    },
    {
  
      key: "TokenId",
      text: "Token Count",
      className: "tokenId",
      align: "left",
      sortable: false
  
    },
    {
      key: "OriginalFile",
      text: "NFT",
      className: "NFT",
      align: "left",
      sortable: true,
      //
      cell: record =>
      <div><img className="img-xs rounded-circle" src={`${config.image_url}/${record.Creator}/NFT/${record.OriginalFile}`} alt="profile" />
      </div>
  
    },
    {
      key: "TokenName",
      text: "Token Name",
      className: "Name",
      align: "left",
      sortable: false
  
    },
 ,{
  
      key: "tokenOwner",
      text: "Token Owner",
      className: "tokenOwner",
      align: "left",
      sortable: false,
      cell:val=>
      <div>{String(val.tokenOwnerDb.TokenOwner)}</div>
  
  
    },

    {
      key: "HideShow",
      text: "Hide/Show",
      className: "Date",
      align: "left",
      sortable: false,
      cell: record =>
          <div><p>{(record.tokenOwnerDb.HideShow=="visible")? "Visible" :"Hidden"}</p></div>
    },
    {
      key: "action",
      text: "Actions",
      className: "action",
      width: 200,
      align: "left",
      sortable: false,
      cell: record => {
          return (
           
          <Fragment>
            <button
              data-toggle="modal"
              data-target="#update-template-modal"
              className="btn btn-primary btn-sm"
              onClick={() => ViewTokens(record)}
  
              style={{ marginRight: '5px' }}
              >
              <i className="fa fa-edit"></i>
              {/* <i className="fas fa-eye"></i> */}
            </button>
           </Fragment>
         
        );
      }
    },
    // {
    //   key: "Hide/show",
    //   text: "Actions",
    //   className: "action",
    //   width: 200,
    //   align: "left",
    //   sortable: false,
    //   cell: record => {
    //       return (
    //       <Fragment>
    //          <input type="checkbox"
            
    //           // checked={isItemSelected(record.tokenOwnerDb._id)}
    //           // onChange={(e)=>{hideshow(e,record)}}
    //           />
    //        </Fragment>
    //     );
    //   }
    // },
  ];

 



  
    return (
 
      <>
{(path && path == "markettokens")?
 <div>   
 <div className="page-header">
   <nav aria-label="breadcrumb">
   
   </nav>
 </div>
 <div className="row">

   <div className="col-lg-12 grid-margin stretch-card">
     <div className="card">
       <div className="card-body">
         <h4 className="card-title">DROP LIST</h4>
         <div className="table-responsive">
         <ReactDatatable

records={nftList}
columns={columns}
/>
       
         </div>
       </div>
     </div>
   </div>
   
 </div>
</div>:
<div><ViewToken nft={state}/> </div>
}
     
     
      </>
      
    )
  
}


