import React, { useState } from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userRegister } from "../actions/axioss/user.axios";
function Referralmodal({ show, handleClose, }) {
  const accountDetails = useSelector((state) => state.LoginReducer.AccountDetails);
  const [referralCode, setReferralCode] = useState("")

  const handleSubmit = async () => {
    if (!referralCode) return toast.error("Referral Code Required")
    try {
      var reqData = {
        Type: "applyReferral",
        WalletAddress: accountDetails?.accountAddress,
        referral: referralCode
      };
      let resp = await userRegister(reqData)
      console.log("respreferral", resp)
      if (resp?.success != "success") {
        toast.error(resp?.msg)
      } else {
        toast.success(resp?.msg)
        handleClose()
      }
    } catch (error) {
      console.log("Error apply referral", error)
    }
  }
  return (
    <div>
      <Modal size='md'
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        className='common_modal kycactivates paymentmodal'
      >
        <Modal.Body>
          <div className='modal_top'>
            <div className='kyc_poptop w-100'>
              {/* <img src={require('../assets/images/redround.svg').default} /> */}

              <p className='modal_title text-center '>Referral Code</p>
            </div>
            <img src={require('../assets/images/close.svg').default} id='redCloser' onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt_2'>

            <input 
            type="text" 
            placeholder="Enter Referral Code" 
            className='modal_singleinput' 
            value={referralCode} 
            onChange={(e) => setReferralCode(e.target.value)} />


 



            <div className='w-100 text-center mt_3'>
              <button className='mint_cnctwallet bodygradientBtn' onClick={handleSubmit}  >Submit</button>
            </div>

          </div>

        </Modal.Body>

      </Modal>
    </div>
  );
}

export default Referralmodal;
