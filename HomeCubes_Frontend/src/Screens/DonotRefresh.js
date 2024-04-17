import React from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
import loader from "../assets/lotties/loader.json";
import Lottie from "lottie-react";
function DonotRefresh({ show, handleClose }) {
  return (
    <div>
      <Modal
        size="md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        className="common_modal kyc_reject_modal do_not_refresh_modal"
      >
        <Modal.Body>
          <div className="modal_top justify-content-end">
            <img
              src={require("../assets/images/close.svg").default}
              id="redCloser"
              onClick={() => handleClose()}
              className="modal_closer"
            />
          </div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <div className="info_logo mb-3">
                <img
                  src={require("../assets/images/loader_info.svg").default}
                  className="img-fluid loader_info"
                />
              </div>
            </div>
            <h2>Processing...</h2>
            <p className="mb-0 ref_txt">Please wait and do not refresh the page!</p>
            <div className="d-flex align-items-center justify-content-center mt-4">
              <Lottie
                className="loader_lottie"
                animationData={loader}
                loop={true}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DonotRefresh;
