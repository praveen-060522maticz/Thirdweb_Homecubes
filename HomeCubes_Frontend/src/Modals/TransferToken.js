import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import config from '../config/config';
import { toast } from 'react-toastify';
import useThirdWeb from '../actions/useThirdWeb';
import { useSelector } from 'react-redux';
import { BuyAccept } from '../actions/axioss/nft.axios';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../actions/common';

function TransferToken({ show, handleClose, item, Tokens_Detail }) {
console.log('TokenTedetailsss---->', item, Tokens_Detail);

  const [Address, SetAddress] = useState('')
  const [disablestate, setdisablestate] = useState(false)
  const [canReload, setCanReload] = useState(true);
  const [Btn, SetBtn] = useState('start')
  const push = useNavigate()


  const getThirdweb = useThirdWeb();

  const { accountAddress, web3 } = useSelector(state => state.LoginReducer.AccountDetails);
  const { payload, isAdmin } = useSelector((state) => state.LoginReducer.User);


  const FormSubmit = async () => {

    if (isEmpty(Address)) return toast.error("Address can't be empty...")

    setdisablestate(true)
    const id = toast.loading('Transferring Your Price')
    SetBtn('process')
    // console.log("to transfer", item.ContractAddress, item.ContractType, Quantity, Address, owner.NFTId)
    // let cont = await ContractCall.Trsanfer(item.ContractAddress, item.ContractType, Quantity, Address, owner.NFTId)
    const cont = await getThirdweb.useContractCall("TransferToken", 0, 0, Tokens_Detail.NFTId, payload?.parentAddress, Tokens_Detail.ContractAddress, "2500000000000000000")

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
        CN: "BNB",
        click: "",
        initialBuy: "",
        referedBy: "",
        royaltyReceiver: "",
        earnPercentage: "0",
        Earning: "0",
        projectId: Tokens_Detail?.Current_Owner?.projectId
      };
      setCanReload(false)
      let Resp = await BuyAccept({ newOwner: newOwner, item: item });
      setCanReload(true)
      if (Resp.success == 'success') {
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
      toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000 })
    }
  }


  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!canReload) {
        const confirmationMessage = 'Do Not Refresh!';
        event.preventDefault();
        event.returnValue = confirmationMessage; // For Chrome
        return confirmationMessage; // For Safari
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [canReload]);


  return (
    <>
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
                className='modal_singleinput mt-3 cmnInput_scrollerHider'
                placeholder='Enter wallet address' />
            </div>


            <button
              className='bodygradientBtn modal_grdientBtn mt-4'
              disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
              onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null}
            >
              {Btn == 'start' && 'Start'
                || Btn == 'try' && 'Try-Again'
                || Btn == 'error' && 'Error'
                || Btn == 'done' && 'Done'
                || Btn == 'process' && 'In-Progress'
              }
            </button>
            <button className='additional_btn modal_additionalBtn mt-3'>Cancel</button>

          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default TransferToken