import React from 'react'
import { Row, Modal, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { connectWallet } from '../hooks/useWallet';
import { toast } from 'react-toastify';
import { GetUserCookieToken, getFessFunc, userRegister } from '../actions/axioss/user.axios';
import { GetNftCookieToken } from '../actions/axioss/nft.axios';
import { isEmpty } from '../actions/common';

function RewardsModal({ show, handleClose, setWallet }) {


  const { token } = useSelector(state => state.LoginReducer.User)


  const dispatch = useDispatch();
  const navigate = useNavigate()

  console.log("token", token);
  const onWalletClick = async (type) => {
    if (type == "WalletConnect") handleClose();
    try {
      console.log("afaiwdhaoiwdhaoiwdh");
      const id = toast.loading(type + "Connecting");
      var accountDetails = await connectWallet(type)
      console.log("accountDetails", accountDetails, type)

      if (!isEmpty(accountDetails)) {
        if (accountDetails?.accountAddress) {
          var NewMethod = {
            Type: "InitialConnect",
            WalletAddress: accountDetails?.accountAddress,
            WalletType: type,
          };
          const getFees = await getFessFunc({ action: "get" });
          let Resp = await userRegister(NewMethod);
          console.log("errr on userRegister", Resp);
          if (Resp?.success == 'success') {
            dispatch({
              type: 'Register_Section',
              Register_Section: {
                User: {
                  payload: Resp.data,
                  token: Resp.token ? Resp.token : token,
                  gasFee: getFees || {}
                }
              }
            })
            document.cookie = 'token' + "=" + Resp?.token + ";" + ";path=/";
            GetNftCookieToken();
            GetUserCookieToken();

            toast.update(id, { render: Resp.msg, type: Resp.success, autoClose: 1000, isLoading: false, closeButton: true, closeOnClick: true })
            handleClose()
            dispatch({
              type: "Account_Section",
              Account_Section: { AccountDetails: accountDetails }
            })
            navigate("/")
          } else {
            toast.update(id, { render: Resp.msg, type: Resp.success, autoClose: 1000, isLoading: false, closeButton: true, closeOnClick: true })
          }

        }
        else return { success: 'error', msg: 'No Address Detected.. Check Your Wallet' }
      }
      else toast.update(id, { render: "Try Again", type: 'error', autoClose: 1000, isLoading: false, closeButton: true, closeOnClick: true })
    } catch (error) {
      console.log("err o connect wallet ", error);
    }
  }

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
            <p className='modal_title text-center'>Connect Wallet</p>
            <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt-3'>

            <Row>
              <Col lg={7} md={7} sm={7} xs={12} className='mob_centerr mb-3 mb-sm-0'>
                <p className='mp_detailbrief'>lorem text connect to wallet</p>
              </Col>
              <Col lg={5} md={5} sm={5} xs={12} className='mob_centerr mb-3 mb-sm-0'>
                <button onClick={() => { onWalletClick("MetaMask") }}
                  className="stack_cnctwallet"
                >
                  <img
                    className="header_wallet"
                    src={
                      require("../assets/images/wallet.svg")
                        .default
                    }
                  />{" "}
                  Connect - wallet
                </button>
              </Col>
            </Row>
          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default RewardsModal