import React from 'react'
import { Modal, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { connectWallet } from '../hooks/useWallet';
import { GetUserCookieToken, getFessFunc, userRegister } from '../actions/axioss/user.axios';
import { isEmpty } from '../actions/common';
import { GetNftCookieToken } from '../actions/axioss/nft.axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function ConnectWallet({ show, handleCloseWallet }) {

  const { token } = useSelector(state => state.LoginReducer.User)


  const dispatch = useDispatch();
  const navigate = useNavigate()

  console.log("token", token);
  const onWalletClick = async (type) => {
    if (type == "WalletConnect") handleCloseWallet();
    try {
      console.log("afaiwdhaoiwdhaoiwdh",type);
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
            handleCloseWallet()
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
        onHide={handleCloseWallet}
        backdrop="static"
        keyboard={false}
        centered
        className='common_modal'
      >
        <Modal.Body>
          <div className='modal_top'>
            <p className='modal_title text-center'>Connect Wallet</p>
            <img src={require('../assets/images/close.svg').default} onClick={() => handleCloseWallet()} className='modal_closer' />

          </div>

          <div className='modal_body mt-5'>

            <Row className='mb-3 wallet_holder' onClick={() => onWalletClick("MetaMask")} >
              <Col xs={5} className='d-flex justify-content-end'>
                <img src={require('../assets/images/metamask.svg').default} className='modal_walletImg' />

              </Col>
              <Col xs={7}>
                <p className='modal_walletLabel'>Metamask</p>
              </Col>
            </Row>

            <Row className='mb-3 wallet_holder' onClick={() => onWalletClick("WalletConnect")}>
              <Col xs={5} className='d-flex justify-content-end'>
                <img src={require('../assets/images/walletconnect.svg').default} className='modal_walletImg' />
              </Col>
              <Col xs={7}>
                <p className='modal_walletLabel'>Wallet Connect</p>

              </Col>
            </Row>

            {/* <Row className='mb-3 wallet_holder'>
              <Col xs={5} className='d-flex justify-content-end'>
                <img src={require('../assets/images/coinbase.svg').default} className='modal_walletImg' />
              </Col>
              <Col xs={7}>
                <p className='modal_walletLabel'>Coinbase Wallet</p>
              </Col>
            </Row> */}

            <Row className='mb-3 wallet_holder' onClick={() => onWalletClick("WalletConnect")}>
              <Col xs={5} className='d-flex justify-content-end'>
                <img src={require('../assets/images/trustwallet.svg').default} className='modal_walletImg' />
              </Col>
              <Col xs={7}>
                <p className='modal_walletLabel'>Trust Wallet</p>
              </Col>
            </Row>




            <button className='bodygradientBtn modal_grdientBtn mt-4'>Show more</button>

          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default ConnectWallet