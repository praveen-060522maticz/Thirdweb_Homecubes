import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import useContractProviderHook from '../actions/contractProviderHook';
import { CreateOrder, setPendingTransaction } from '../actions/axioss/nft.axios';
import { useSelector } from 'react-redux';
import { useWallets } from '@privy-io/react-auth';
import Prompt from '../Components/Prompt';

function CancelOrder({ show, handleClose, owner, types, file, type, thumb, item }) {
  console.log("propsprops", owner, types, file, type, thumb, item);
  const { gasFee } = useSelector((state) => state.LoginReducer.User);

  const push = useNavigate();
  const ContractCall = useContractProviderHook()
  const [Btn, SetBtn] = useState('start')

  const { accountAddress, web3 } = useSelector(state => state.LoginReducer.AccountDetails);
  const { payload } = useSelector(state => state.LoginReducer.User);
  const { wallets } = useWallets();
  const [canReload, setCanReload] = useState(true);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (!canReload) {
  //       const confirmationMessage = 'Do Not Refresh!';
  //       event.preventDefault();
  //       event.returnValue = confirmationMessage; // For Chrome
  //       return confirmationMessage; // For Safari
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [canReload]);

  const FormSubmit = async () => {
    // debugger
    SetBtn('process')
    const id = toast.loading('Cancel Your order... Do not refresh!')
    var error = await ContractCall.Contract_Base_Validation()
    console.log("error", error);
    if (error) {
      toast.update(id, { render: error, type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
      SetBtn('error')
    }
    else {
      if (types == "Cancel") {
        setCanReload(false)
        let TStamp = Date.now();
        let cont = await ContractCall.cancel_order_721_1155(wallets[0], owner.NFTId)
        // let cont = await getThirdweb.useContractCall("cancelOrder", 0, 0, owner.NFTId,gasFee?.collectAddress, "2500000000000000000");
        // let cont = await ContractCall.gasLessTransaction("cancelOrder", 0, 0, wallets[0], owner.NFTId, TStamp, gasFee?.collectAddress, "2500000000000000000");

        setCanReload(true)
        if (cont) {
          await Back_end(id, cont.HashValue, TStamp, cont?.status)
        }
        else {
          toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          SetBtn('try')
        }
      }
      else {
        await Back_end(id, '')
      }

    }
  }


  console.log("cancelorderitems", item)
  const Back_end = async (id, HashValue, TStamp, status) => {

    owner.NFTCreator = item?.NFTCreator
    owner.HashValue = HashValue
    owner.NFTPrice = 0
    owner.CoinName = ''
    owner.NFTId = owner.NFTId
    owner.PutOnSale = 'false'
    owner.PutOnSaleType = 'NotForSale'
    owner.activity = types == "Cancel" ? "CancelOrder" : "CancelAuction";
    owner.NFTOwner = accountAddress
    owner.Category = item.Category
    owner.EmailId = payload.EmailId
    owner.ContractType = item.ContractType
    owner.ContractAddress = item.ContractAddress
    owner.CollectionNetwork = item.CollectionNetwork

    if (status == "pending") {
      let pendingObj = {
        From: accountAddress,
        method: "cancelOrder",
        params: [owner],
        TimeStamp: TStamp
      }
      const pending = await setPendingTransaction(pendingObj);
      toast.update(id, {
        render:
          <div>
            <p className="mb-0">Cancel order pending...</p>
            <p className="mb-0">Please check after some time!</p>
          </div>,
        type: 'warning', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true
      })
      push("/marketplace");
    } else {

      console.log("dataincancelorger", owner)
      let Resp = await CreateOrder(owner)
      if (Resp.success == 'success') {
        toast.update(id, { render: "Cancelled Your Order Successfully", type: "success", isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        SetBtn('done')
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      }
      else {
        toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        SetBtn('try')
      }
    }
  }
  return (
    <>
      <Prompt when={!canReload} message={"Are you sure!!! changes may be lost...!"} />u
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        className='common_modal'
      >
        <Modal.Body>
          <div className='modal_top'>

            <p className='modal_title text-center'>Cancel Order</p>
            <img src={require('../assets/images/close.svg').default} id='redCloser' onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt_2'>

            <div className='cp_nftimage_holder'>
              <img className='cp_nftImage' src={file} />
              <p className='cp_nftName cancelname mt_2'>{item?.TokenName}</p>
            </div>

            <p className='modal_summaryLabel text-center mt_3'>you are about to delete instant sale for <span className='cancelSale'>{item?.TokenName}</span> </p>

            <p className='cancel_salePrice mt_2 text-center'>{item?.NFTPrice}  {item?.CoinName}</p>




            <div className='mt_2'>
              <button
                className='bodygradientBtn modal_grdientBtn mt_2'
                disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
                onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null}
              >
                {Btn == 'start' && 'Confirm'
                  || Btn == 'try' && 'Try-Again'
                  || Btn == 'error' && 'Error'
                  || Btn == 'done' && 'Done'
                  || Btn == 'process' && 'In-Progress'
                }
              </button>
              <button
                // className='additional_btn modal_additionalBtn mt_2'
                className="hc-button__gray mt_2"
                disabled={Btn === "process" || Btn === "done" ? true : false}
                onClick={() => handleClose()}
              >
                Cancel
              </button>
            </div>

          </div>

        </Modal.Body>

      </Modal>
    </>
  )
}

export default CancelOrder