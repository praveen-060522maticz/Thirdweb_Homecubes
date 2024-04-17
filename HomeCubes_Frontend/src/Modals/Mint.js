import React from 'react'
import { Modal } from 'react-bootstrap'

function Mint({show,handleClose}) {
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
         <p className='modal_title text-center'>Mint</p>
         <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer'/>

            </div>

            <div className='modal_body mt-3'>

               <div className='modal_mintTitle mt-4'>
                <img className='modal_bluecheck' src={require('../assets/images/bluecheck.svg').default} />
                <p className='blogInfo_inplabel mint_imgLabel'>Sign in transaction</p>
               </div>
                    
                    <button className='bodygradientBtn modal_grdientBtn mt-3'>Upload Files</button>

                    <div className='modal_mintTitle mt-4'>
                <img className='modal_bluecheck' src={require('../assets/images/bluecheck.svg').default} />
                <p className='blogInfo_inplabel mint_imgLabel'>IPFS MetaData</p>
               </div>
                    <button className='additional_btn modal_additionalBtn mt-3' onClick={() => handleClose()}>Start</button>

                    <div className='modal_mintTitle mt-4'>
                <img className='modal_bluecheck' src={require('../assets/images/bluecheck.svg').default} />
                <p className='blogInfo_inplabel mint_imgLabel'>Upload files & mint token</p>
               </div>
                    
                    <button className='bodygradientBtn modal_grdientBtn mt-3'>Start</button>
                
            </div>
        </Modal.Body>
        
      </Modal>
    </>
  )
}

export default Mint