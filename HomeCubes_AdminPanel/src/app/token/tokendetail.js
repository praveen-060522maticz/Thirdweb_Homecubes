import React, { Component, useState, useEffect } from 'react';

import { Button, Form, FormControl } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import noimg from '../../assets/images/No_image.webp';
import 'react-toastify/dist/ReactToastify.css';

import { useHistory } from 'react-router-dom';
import config from '../../lib/config.js'
import { useMint, useServiceFee } from '../../useHooks/useContractMethods.js';
import { mintDbUpdate, getTokenOwner, ApproveCAll, CreateLazyMint } from '../../axioscalls/token'
import wallet_details from '../../redux/action.js';
import Modal from 'react-modal';
// import { useHistory } from 'react-router-dom';

export function TokenDetail(props) {
  const history = useHistory()
  const { detail } = props;
  return (
    <div className="row">

      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <button className='btn mb-3 allbtn' type='button' onClick={() => history.goBack()} >Back</button>

            <h4 className="card-title">Token Details</h4>
            <form className="forms-sample">
              <Form.Group>
                <label>Token ID</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTId} />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">Token Name</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTName} />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">NFT Image</label>
                <img className="img-xs rounded-circle" src={
                  ["webp"].includes(detail?.CompressedFile?.split('.')[1]) ?
                    `${config.ImG}/nft/${detail.NFTCreator}/Compressed/NFT/${detail.CompressedFile}` :
                    `${config.ImG}/nft/${detail.NFTCreator}/Compressed/NFT_THUMB/${detail.CompressedThumbFile}`
                } alt="OriginalFile" />
              </Form.Group>
              <Form.Group>
                <label>Contract Address</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.ContractAddress} />
              </Form.Group>
              <Form.Group>
                <label>Contract Type</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.ContractType} />
              </Form.Group>
              {/*<Form.Group>
                <label>Contract Name</label>
                <Form.Control type="text" className="form-control" id="exampleInputName1" placeholder="null" value={detail.ContractName} />
              </Form.Group>*/}
              <Form.Group>
                <label>Collection Network </label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.CollectionNetwork} />
              </Form.Group>
              <Form.Group>
                <label>Royalty</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTRoyalty} />
              </Form.Group>
              <Form.Group>
                <label>Creator</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTCreator} />
              </Form.Group>
              <Form.Group>
                <label>Updated At</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.updatedAt} />
              </Form.Group>
              <Form.Group>
                <label>Token Owner</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTOwner} />
              </Form.Group>
              <Form.Group>
                <label>Hash Value</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.HashValue} />
              </Form.Group>
              <Form.Group>
                <label>Put On Sale</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.PutOnSale} />
              </Form.Group>
              <Form.Group>
                <label>Put On Sale Type</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.PutOnSaleType} />
              </Form.Group>
              <Form.Group>
                <label>Token Price</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTPrice} />
              </Form.Group>
              <Form.Group>
                <label>Coin Name</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.CoinName} />
              </Form.Group>
              <Form.Group>
                <label>Token Quantity</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTQuantity} />
              </Form.Group>
              <Form.Group>
                <label>Token Balance</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTBalance} />
              </Form.Group>
              <Form.Group>
                <label>Clock Time</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.ClockTime} />
              </Form.Group>
              <Form.Group>
                <label>End Clock Time</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.EndClockTime} />
              </Form.Group>
              <Form.Group>
                <label>Display Name</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.DisplayName} />
              </Form.Group>
              <Form.Group>
                <label>Wallet Address</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.WalletAddress} />
              </Form.Group>
              <Form.Group>
                <label>Creator Display Name</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.Creator_DisplayName} />
              </Form.Group>
              <Form.Group>
                <label>Creator Wallet Address</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.Creator_WalletAddress} />
              </Form.Group>
              <Form.Group>
                <label>Token Owner Name</label>
                <Form.Control type="text" disabled={true} className="form-control" id="exampleInputName1" placeholder="null" value={detail.NFTOwner} />
              </Form.Group>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenDetail;
