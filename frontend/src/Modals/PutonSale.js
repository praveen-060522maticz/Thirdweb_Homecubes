import React from 'react'
import { Modal } from 'react-bootstrap'

function PutonSale({ show, handleClose,text, owner, types, closePop, file, type, thumb, item  }) {
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
                  <p className='modal_title text-center'>Put on Sale</p>
                  <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer' />

               </div>

               <div className='modal_body mt-3'>

                  <div className='cp_nftimage_holder'>
                     <img className='ps_nftImage' src={file} />
                     <p className='cp_nftName mt-3'>{item?.NFTName}</p>
                  </div>

                  <div className='modal_inputGroup mt-3'>
                     <input type="number" className='modal_input cmnInput_scrollerHider' placeholder='Enter new price' />
                     <p className='modal_inpgrp_cointype'>matic</p>
                  </div>

                  <p className='blogInfo_inplabel mt-3 mb-4'>Summary:</p>
                  <div className='bidmodal_summary mb-3'>
                     <p className='modal_summaryLabel'>Seller Service</p>
                     <p className='modal_summaryLabel'>2.5 %</p>
                  </div>

                  <div className='bidmodal_summary mb-3'>
                     <p className='modal_summaryLabel'>You will get</p>
                     <p className='modal_summaryLabel'>0 %</p>
                  </div>

                  <button className='bodygradientBtn modal_grdientBtn mt-4'>Put on sale</button>

               </div>
            </Modal.Body>

         </Modal>
      </>
   )
}

export default PutonSale