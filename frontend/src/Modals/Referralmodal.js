import React from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
function Referralmodal({ show, handleClose, }) {
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

            <input type="text" placeholder="Enter Referral Code" className='modal_singleinput' />


 



            <div className='w-100 text-center mt_3'>
              <button className='mint_cnctwallet bodygradientBtn'  >Submit</button>
            </div>

          </div>

        </Modal.Body>

      </Modal>
    </div>
  );
}

export default Referralmodal;
