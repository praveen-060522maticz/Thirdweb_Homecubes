import React from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
function Paymentmodal({ show, handleClose,type, handleShowTransak, }) {
  return (
    <div>
      <Modal size='lg'
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

              <p className='modal_title text-center '>{type == "usdt" && "Buy USDT"} {type == "bnb" && "Buy BNB"}</p>
            </div>
            <img src={require('../assets/images/close.svg').default} id='redCloser' onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt_2'>
            <p className='modal_summaryLabel text-center'>{type =="bnb" && "HomeCubes will direct you to a regulated third party to purchase BNB tokens. Please note that we do not handle or manage the token purchase transaction. You will need approximately $1 to $5 worth of BNB to cover gas fees."}
            {type =="usdt" && "HomeCubes will direct you to a regulated third party to purchase USDT tokens on the BSC network. Please note that we do not manage or handle the token purchase transaction. You will need an amount of USDT equivalent to your property purchase. For example, if the initial sale price is 500 USDT, you must have 500 USDT in your wallet."}

            </p>
            <p className='modal_summaryLabel text-center mt_2'>
            By proceeding with the purchase, you agree to our terms and conditions.
            </p>

   
            {/* <p className="hc-kyc__modal-p mt_3" dangerouslySetInnerHTML={{ __html: kycCon?.content }} >
            </p>
          */}





            <div className='w-100 text-center mt_3'>
              <button className='mint_cnctwallet bodygradientBtn' onClick={() => handleShowTransak()} >Proceed</button>
            </div>

          </div>

        </Modal.Body>

      </Modal>
    </div>
  );
}

export default Paymentmodal;
