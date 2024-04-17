import React from 'react'
import { Modal } from 'react-bootstrap'

function DeleteInstantSale({show,handleClose}) {
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
         <p className='modal_title text-center'>Delete Instant Sale</p>
         <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer'/>

            </div>

            <div className='modal_body mt-3'>

                <div className='cp_nftimage_holder'>
                    <img className='ps_nftImage' src={require('../assets/images/nftimage.png')} />
                    <p className='cp_nftName mt-3'>3D Cubes</p>
                </div>
                
                    
                    <button className='bodygradientBtn modal_grdientBtn mt-5'>Delete Sale</button>
                    <button className='additional_btn modal_additionalBtn mt-3'>Cancel</button>
                
            </div>
        </Modal.Body>
        
      </Modal>
    </>
  )
}

export default DeleteInstantSale