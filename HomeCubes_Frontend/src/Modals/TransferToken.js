import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import config from '../config/config';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { BuyAccept } from '../actions/axioss/nft.axios';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../actions/common';
import useContractProviderHook from '../actions/contractProviderHook';
import { useWallets } from '@privy-io/react-auth';
import Prompt from '../Components/Prompt';

function TransferToken({ show, handleClose, item, Tokens_Detail }) {
  console.log('TokenTedetailsss---->', item, Tokens_Detail);

  const [Address, SetAddress] = useState('')
  const [disablestate, setdisablestate] = useState(false)
  const [canReload, setCanReload] = useState(true);
  const [Btn, SetBtn] = useState('start')
  const push = useNavigate()


  const ContractCall = useContractProviderHook();


  const { accountAddress, web3 } = useSelector(state => state.LoginReducer.AccountDetails);
  const { payload, isAdmin } = useSelector((state) => state.LoginReducer.User);
  const { gasFee } = useSelector((state) => state.LoginReducer.User);
  const { wallets } = useWallets();

  const FormSubmit = async () => {

    if (isEmpty(Address)) return toast.error("Address can't be empty...")
    SetBtn('process')
    const checkApprove = await ContractCall.GetApproveStatus(
      "single",
      item?.ContractAddress,
      wallets[0]
    )
    console.log("checkApprovecheckApprove", checkApprove);

    if (!checkApprove) {
      const aprroveId = toast.loading("Approve in process... Do not refresh!");
      setCanReload(false)
      const cont = await ContractCall.SetApproveStatus(
        "Single",
        item.ContractAddress,
        wallets[0]
      );
      setCanReload(true)

      // const cont = await getThirdweb.useContractCall(
      //   "setApprovalForAll",
      //   0,
      //   0,
      //   item.ContractAddress, true
      // );

      // const cont = await ContractCall.gasLessTransaction(
      //   "setApprovalForAll",
      //   0,
      //   0,
      //   wallets[0],
      //   item.ContractAddress, true
      // );

      if (!cont) {
        toast.update(id, {
          render: "Transaction Failed",
          type: "error",
          isLoading: false,
          autoClose: 1000, closeButton: true, closeOnClick: true
        });
        SetBtn("try");

        return toast.update(aprroveId, {
          render: "Approved Failed",
          type: "error",
          isLoading: false,
          autoClose: 1000, closeButton: true, closeOnClick: true
        });
      } else {

        toast.update(aprroveId, {
          render: "Approved Success",
          type: "success",
          isLoading: false,
          autoClose: 1000, closeButton: true, closeOnClick: true
        });
      }

    }

    setdisablestate(true)
    var id = toast.loading('Transferring Your Token')
    const TStamp = Date.now()
    setCanReload(false)
    // console.log("to transfer", item.ContractAddress, item.ContractType, Quantity, Address, owner.NFTId)
    let cont = await ContractCall.TransferToken(wallets[0], Tokens_Detail.NFTId, Address, Tokens_Detail.ContractAddress)
    // const cont = await getThirdweb.useContractCall("TransferToken", 0, 0, Tokens_Detail.NFTId,Address , Tokens_Detail.ContractAddress,gasFee?.collectAddress, "2500000000000000000")
    // const cont = await ContractCall.gasLessTransaction("TransferToken", 0, 0,wallets[0], Tokens_Detail.NFTId, Address, Tokens_Detail.ContractAddress, gasFee?.collectAddress, TStamp, "2500000000000000000")
    setCanReload(true)
    setdisablestate(false)
    console.log("transfer hash ", cont?.HashValue, cont)
    if (cont) {
      let newOwner = {
        HashValue: cont.HashValue,
        NewTokenOwner: Address,
        NFTQuantity: 1,
        NFTId: item.NFTId,
        NFTOwner: accountAddress,
        PutOnSale: "false",
        PutOnSaleType: 'NotForSale',
        activity: "Transfer",
        TP: "0",
        New_EmailId: '',
        CN: "",
        click: "",
        initialBuy: "",
        referedBy: "",
        royaltyReceiver: "",
        earnPercentage: "0",
        Earning: "0",
        projectId: Tokens_Detail?.Current_Owner?.projectId
      };
      let Resp = await BuyAccept({ newOwner: newOwner, item: item });
      if (cont?.status == "pending") {
        toast.update(id, {
          render:
            <div>
              <p className="mb-0">bid placement pending...</p>
              <p className="mb-0">Please check after some time!</p>
            </div>,
          type: 'warning', isLoading: false, autoClose: 1500, closeButton: true, closeOnClick: true
        })
        setTimeout(() => {
          push("/marketplace");
        }, 1000)

      } else if (Resp.success == 'success') {
        toast.update(id, { render: "Trasferring Your token Successfully", type: "success", isLoading: false, autoClose: 1000 })
        SetBtn('done')
        push(`/profile/${payload.CustomUrl}`, {
          state: { Tab: "owned" },
        });
      }
      else {
        toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000 })
        SetBtn('try')
      }

    } else {
      SetBtn('try')
      toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000 })
    }
  }


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


  return (
    <>
      <Prompt when={!canReload} message={"Are you sure!!! changes may be lost...!"} />

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        className='common_modal hc-modal'
      >
        <Modal.Body>
          <div className='modal_top'>
            <p className='modal_title text-center'>Transfer Token</p>
            <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer' />
          </div>

          <div className='modal_body mt-3'>

            <div className='cp_nftimage_holder'>
              <img className='cp_nftImage' src={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Original/${Tokens_Detail?.NFTOrginalImage}`} />
              <p className='cp_nftName mt-3'>{item?.NFTName}</p>
            </div>

            {/* <div className='mt-3'>
              <p className='modal_summaryLabel'>Valid quality Max 1</p>
              <input type="number" className='modal_singleinput mt-3 cmnInput_scrollerHider' placeholder='Enter quality to transfer' />
            </div> */}

            <div className='mt-3'>
              <p className='modal_summaryLabel'>Transfer to</p>
              <input
                type="text"
                id="Address"
                onChange={(e) => { SetAddress((e.target.value).toLowerCase()) }}
                autoComplete="off"
                disabled={disablestate}
                className='modal_singleinput mt-2 cmnInput_scrollerHider'
                placeholder='Enter wallet address' />
            </div>


            <button
              className='nftinfo_gradeientBtn web_listitem_btn mt-3'
              disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
              onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null}
            >
              {Btn == 'start' && 'Transfer'
                || Btn == 'try' && 'Try-Again'
                || Btn == 'error' && 'Error'
                || Btn == 'done' && 'Done'
                || Btn == 'process' && 'In-Progress'
              }
            </button>
            <button className='hc-button__gray mt-3' onClick={() => handleClose()}>Cancel</button>

          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default TransferToken