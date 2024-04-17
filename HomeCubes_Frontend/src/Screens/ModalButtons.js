import React,{useState} from 'react'
import PlaceaBid from '../Modals/PlaceaBid'
import ChangePrice from '../Modals/ChangePrice';
import PutonSale from '../Modals/PutonSale';
import TransferToken from '../Modals/TransferToken';
import DeleteInstantSale from '../Modals/DeleteInstantSale';
import BurnToken from '../Modals/BurnToken';
import CheckOut from '../Modals/CheckOut';
import Mint from '../Modals/Mint';
import Purchase from '../Modals/Purchase';
import Calendar from '../Modals/Calendar';
import CancelOrder from '../Modals/CancelOrder';
import AcceptBid from '../Modals/AcceptBid';
import CancelBid from '../Modals/CancelBid';

function ModalButtons() {

    const [showBid, setShowBid] = useState(false);

    const handleCloseBid = () => setShowBid(false);
    const handleShowBid = () => setShowBid(true);

    // changeprice state

    const [showChangePrice, setShowChangePrice] = useState(false);

    const handleCloseChangePrice = () => setShowChangePrice(false);
    const handleShowChangePrice = () => setShowChangePrice(true);

    // putonsale state

    const [showPutSale, setShowPutSale] = useState(false);

    const handleClosePutSale = () => setShowPutSale(false);
    const handleShowPutSale = () => setShowPutSale(true);

    // transfer token state

    const [showTransfer, setShowTransfer] = useState(false);

    const handleCloseTransfer = () => setShowTransfer(false);
    const handleShowTransfer = () => setShowTransfer(true);

    // delete instant sale state

    const [showDelete, setShowDelete] = useState(false);

    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    // burn token state

    const [showBurn, setShowBurn] = useState(false);

    const handleCloseBurn = () => setShowBurn(false);
    const handleShowBurn = () => setShowBurn(true);

    // burn token state

    const [showCheckout, setShowCheckout] = useState(false);

    const handleCloseCheckout = () => setShowCheckout(false);
    const handleShowCheckout = () => setShowCheckout(true);

    // mint state

    const [showMint, setShowMint] = useState(false);

    const handleCloseMint = () => setShowMint(false);
    const handleShowMint = () => setShowMint(true);

     // purchase state

     const [showPurchase, setShowPurchase] = useState(false);

     const handleClosePurchase = () => setShowPurchase(false);
     const handleShowPurchase = () => setShowPurchase(true);

     // calendar state

     const [showCalendar, setShowCalendar] = useState(false);

     const handleCloseCalendar = () => setShowCalendar(false);
     const handleShowCalendar = () => setShowCalendar(true);

      // cancelorder state

      const [showCancel, setShowCancel] = useState(false);

      const handleCloseCancel = () => setShowCancel(false);
      const handleShowCancel = () => setShowCancel(true);

      // cancelbid state

      const [showCancelBid, setShowCancelBid] = useState(false);

      const handleCloseCancelBid = () => setShowCancelBid(false);
      const handleShowCancelBid = () => setShowCancelBid(true);

      // acceptbid state

      const [showAcceptBid, setShowAcceptBid] = useState(false);

      const handleCloseAcceptBid = () => setShowAcceptBid(false);
      const handleShowAcceptBid = () => setShowAcceptBid(true);

  return (
    <>
    <div className='d-flex'>
        <button onClick={() => handleShowBid()}>place a bid</button>
        <button onClick={() => handleShowChangePrice()}>Change price</button>
        <button onClick={() => handleShowPutSale()}>Put on Sale</button>
        <button onClick={() => handleShowTransfer()}>Transfer Token</button>
        <button onClick={() => handleShowDelete()}>Delete Instant Sale</button>
        <button onClick={() => handleShowBurn()}>Burn Token</button>
        <button onClick={() => handleShowCheckout()}>Check out</button>
        <button onClick={() => handleShowMint()}>Mint</button>
        <button onClick={() => handleShowPurchase()}>Purchase</button>
        <button onClick={() => handleShowCalendar()}>Calendar</button>
        <button onClick={() => handleShowCancel()}>Cancel Order</button>
        <button onClick={() => handleShowAcceptBid()}>Accept Bid</button>
        <button onClick={() => handleShowCancelBid()}>Cancel Bid</button>
        
        </div>

        <PlaceaBid showBid={showBid} handleCloseBid={handleCloseBid}/>
        <ChangePrice show={showChangePrice} handleClose={handleCloseChangePrice}/>
        <PutonSale show={showPutSale} handleClose={handleClosePutSale}/>
        <TransferToken show={showTransfer} handleClose={handleCloseTransfer}/>
        <DeleteInstantSale show={showDelete} handleClose={handleCloseDelete}/>
        <BurnToken show={showBurn} handleClose={handleCloseBurn}/>
        <CheckOut show={showCheckout} handleClose={handleCloseCheckout}/>
        <Mint show={showMint} handleClose={handleCloseMint}/>
        <Purchase show={showPurchase} handleClose={handleClosePurchase}/>
        <Calendar show={showCalendar} handleClose={handleCloseCalendar}/>
        <CancelOrder show={showCancel} handleClose={handleCloseCancel}/>
        <AcceptBid show={showAcceptBid} handleClose={handleCloseAcceptBid}/>
        <CancelBid show={showCancelBid} handleClose={handleCloseCancelBid}/>
        </>
  )
}

export default ModalButtons