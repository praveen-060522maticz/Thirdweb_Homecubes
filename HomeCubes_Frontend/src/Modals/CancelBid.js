import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import useContractProviderHook from '../actions/contractProviderHook'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { BidApprove } from '../actions/axioss/nft.axios';
import config from '../config/config'
import { useWallets } from '@privy-io/react-auth';

function CancelBid({ show, handleClose, owner, bidder, item }) {


  const push = useNavigate()
  const [Btn, SetBtn] = useState('start')
  const ContractCall = useContractProviderHook()
  const { web3, accountAddress } = useSelector(state => state.LoginReducer.AccountDetails);
  const { payload } = useSelector(state => state.LoginReducer.User)
  const [show9, setShow9] = useState(true);
  const {  gasFee } = useSelector((state) => state.LoginReducer.User);
console.log('segegsegeegasFee---->',gasFee);
  const [canReload, setCanReload] = useState(true);
  const {wallets} = useWallets();

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

  const FormSubmit = async () => {
    SetBtn('process')
    const id = toast.loading('Cancel Your Bid...Do not refresh!')
    var error = await ContractCall.Contract_Base_Validation()
    console.log("adasdasdasdsadasdasdasd", error)
    if (error) {
      toast.update(id, { render: error, type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
      SetBtn('error')
    }
    else {
      const TStamp = Date.now()
      // let cont = await ContractCall.BidNFt_Contract(0, "cancelBid", item.NFTId, item.ContractAddress)
      // let cont = await getThirdweb.useContractCall("cancelBid", 0, 0, item.NFTId, item.ContractAddress, gasFee?.collectAddress,"2500000000000000000");
      let cont = await ContractCall.gasLessTransaction("cancelBid", 0, 0,wallets[0], item.NFTId, item.ContractAddress,TStamp, gasFee?.collectAddress,"2500000000000000000");

      if (cont) {
        console.log('biiddd', bidder, item);
        var FormValue = {
          TokenBidderAddress: accountAddress,
          NFTQuantity: bidder.NFTQuantity ?? 1,
          NFTId: item.NFTId,
          ContractAddress: item.ContractAddress,
          ContractType: item.ContractType,
          CollectionNetwork: item.CollectionNetwork,
          from: 'Cancel',
          activity: 'Cancel',
          Category: item.Category,
          EmailId: payload.EmailId,
          click: `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`,
          HashValue:cont.HashValue,
        }
        setCanReload(false)
        console.log('gsfgsfg', FormValue, bidder)
        let Resp = await BidApprove(FormValue)
        setCanReload(true)
        console.log('dksfgsdhkg', Resp)
        if (Resp.success == 'success') {
          toast.update(id, { render: 'Cancelled Bid Successfully', type: 'success', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          SetBtn('done')
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          // push(`/my-item/${payload?.CustomUrl}`)
        }
        else {
          toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          SetBtn('try')
        }

      } else {
        toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        SetBtn('try')
      }

    }

  }

  const [once, setOnce] = useState(true)

  useEffect(() => {
    async function BalanceCheck() {
      if (once) {
        setOnce(false)
        var Nftbalance = await ContractCall.Current_NFT_Balance(owner, item,wallets[0])
        console.log('cancelbidbalncheck ', Nftbalance, owner.NFTBalance);
        if (Nftbalance?.toLowerCase() != owner.NFTOwner?.toLowerCase()) {
          toast.warning("You won't buy at this moment please refresh you data");
          setTimeout(() => {
            push("/")
          }, 1000);
        }
      }

    }
    BalanceCheck();
  }, [item, owner])

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

            <p className='modal_title text-center'>Cancel Bid</p>
            <img src={require('../assets/images/close.svg').default} id='redCloser' onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt-3'>
            <p className='modal_summaryLabel text-center mt-4'>you are about to Canel bid for <span className='cancelSale'>Blockchain</span></p>

            {/* <p className='cancel_salePrice mt-3 text-center'>2 CAKE form 1 edition(s)</p> */}



            <div className='mt-3'>
              <button
                className='bodygradientBtn modal_grdientBtn mt-4'
                disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
                onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null}
              >
                Cancel Bid
              </button>
              <button className='additional_btn modal_additionalBtn mt-3'
                onClick={() => handleClose()}
                disabled={Btn === "process" || Btn === "done" ? true : false}
              >Cancel</button>
            </div>

          </div>

        </Modal.Body>

      </Modal>
    </>
  )
}

export default CancelBid