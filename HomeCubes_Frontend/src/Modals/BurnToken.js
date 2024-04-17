import React from 'react'
import { Modal } from 'react-bootstrap'

function BurnToken({show,handleClose}) {
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
         <p className='modal_title text-center'>Burn Token</p>
         <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer'/>

            </div>

            <div className='modal_body mt-3'>

                <div className='cp_nftimage_holder'>
                    <img className='cp_nftImage' src={require('../assets/images/nftimage.png')} />
                    <p className='cp_nftName mt-3'>3D Cubes</p>
                </div>
                
                 <div className='mt-3'>
                 <p className='modal_summaryLabel'>Valid quality Max 1</p>
                    <input type="number" className='modal_singleinput mt-3 cmnInput_scrollerHider' placeholder='Enter quality to burn' />
                 </div>

                 
                    
                    <button className='bodygradientBtn modal_grdientBtn mt-5'>Burn Token</button>
                    <button className='additional_btn modal_additionalBtn mt-3' onClick={() => handleClose()}>Cancel</button>
                
            </div>
        </Modal.Body>
        
      </Modal>
    </>
  )
}

export default BurnToken