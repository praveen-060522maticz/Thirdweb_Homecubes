import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import Datetime from 'react-datetime';
import Moment from 'react-moment'
import "react-datetime/css/react-datetime.css";

function Calendar({ show, handleClose, handleOpenList, setDate, validDate, setClockValue, modal }) {

  const [Clock, setClock] = useState(null)

  const handleendclock = (value) => {
    setClock(value)
    setClockValue(modal, value)
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        className='common_modal calendar_opacity'
      >
        <Modal.Body>
          <div className='modal_top'>
            <p className='modal_title text-center'>Check out</p>
            <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt-3'>

            <Datetime open={true}
              // onChange={(e) => {
              //   setDate(new Date(e));
              //   // console.log(new Date(e),"setDaet");
              // }}
              isValidDate={validDate}
              value={Clock}
              onChange={(value) => handleendclock(value)}
            />

            <button className='bodygradientBtn modal_grdientBtn mt-4' onClick={() => {
              handleClose()
              console.log("ofwirhwnw");
            }}>Done</button>

          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default Calendar