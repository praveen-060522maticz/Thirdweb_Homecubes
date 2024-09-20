import React from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
function KycRejected({ show, handleClose,userProfile }) {
  return (
    <div>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        className="common_modal kyc_reject_modal"
      >
        <Modal.Body>
          <div className="modal_top">
            <div className="kyc_poptop">
              <p className="modal_title text-center text-danger">
                KYC Rejected
              </p>
            </div>
            <img
              src={require("../assets/images/close.svg").default}
              id="redCloser"
              onClick={() => handleClose()}
              className="modal_closer"
            />
          </div>
          <p className="mb-0 mt-4">
            {userProfile?.comment}
          </p>
          {/* <div className="w-100 text-end mt-3">
            <button className="mint_cnctwallet bodygradientBtn ">Close</button>
          </div> */}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default KycRejected;
