import React, { useState, useEffect  } from 'react';
import { useLocation, useParams} from 'react-router-dom';

import {Link} from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import {  useSelector } from 'react-redux';


import config from '../../lib/config.js'
import { getDroppromoList } from '../../axioscalls/user.js';
export default function NftTable (props) {



  var location = useLocation();
  const{pathname,state}=location;
  const path = pathname.split("/")[1]
  console.log("pathname,stae",pathname,state,path)

 
  const Wallet_Details = useSelector((state)=>state.wallet_detail)
  const [nftList,setNftList] = useState({})
console.log('sdsadashdkhkasjd',nftList)
const { CollectionUrl } = useParams()

const columns = [
  {
    key: "",
    text: "SNO",
    className: "NFT",
    align: "left",
    sortable: true,
    cell: (record,index) =>
    <div>{index+1}
    </div>

  },
  {
    key: "file",
    text: "NFT",
    className: "NFT",
    align: "left",
    sortable: true,
    cell: (record) => 
    
    <div><img className="img-xs rounded-circle" src={`${config.ImG}/admin/bulkimage/${nftList.CollectionName}/${record.file}`} alt="profile" />
    </div>

  },
  
  {
    key: "TokenId",
    text: "TokenId",
    className: "NFT",
    align: "left"
  },
  {
    key: "TokenName",
    text: "Token Name",
    className: "NFT",
    align: "left"
  },
  {
    key: "updatedAt",
    text: "Last Modified",
    className: "NFT PRICE",
    align: "left",
    sortable: true,
    cell:rec=>
    <>{`${new Date(rec.updatedAt).getDate()} / ${new Date(rec.updatedAt).getMonth()} / ${new Date(rec.updatedAt).getFullYear()}  ${new Date(rec.updatedAt).getHours()} : ${new Date(rec.updatedAt).getMinutes()}: ${new Date(rec.updatedAt).getSeconds()}  ${new Date(rec.updatedAt).getDay()}`}</>
  },
  {
    key: "",
    text: "View Promo",
    className: "NFT PRICE",
    align: "left",
    sortable: true,
    
    cell: record =>
    <div><Link to={{pathname:`/promo-code/${nftList.CollectionUrl}/${record.TokenName}`,
    state:{record:record,
      CollctionUrl : nftList.CollectionUrl, 
      CollectionName: nftList.CollectionName,
      CollectionNetwork:nftList.CollectionNetwork,
      Creator:nftList.Creator}}} ><button >view</button></Link></div>

  },
]

  useEffect(()=>{
      getTokens();
  },[])

 


  const getTokens = async()=>{
    var resp = await getDroppromoList({
        CollectionUrl : CollectionUrl
    });
      if(resp?.success == 'success'){
        setNftList(resp.msg);
      }
  }


  
    return (
 
      <>

      {
      <div>   
        <div className="page-header">
          <nav aria-label="breadcrumb">
          
          </nav>
        </div>
        <div className="row">
       
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{nftList.CollectionName}</h4>
                <div className="table-responsive">
                <ReactDatatable

records={nftList.CollectionBulkImage}
columns={columns}
/>
              
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>}
      </>
      
    )
  
}


