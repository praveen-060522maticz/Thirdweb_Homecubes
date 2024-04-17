import React, { Component,useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import {WALLET_CONNECT,WALLET_DISCONNECT} from '../redux/action.js';
import Modal from 'react-modal';




function WalletConnect() {



  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  Modal.setAppElement('#yourAppElement');


    let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  
      return (
      
<>

<button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Wallet Options</h2>
        <button onClick={closeModal}>close</button>
        <div>Connect Wallet</div>
        <form>
          <button>Metamask</button>
          {/* <button>trustwallet</button>
          <button>walletconnect</button>
          <button>coinbase</button> */}
        </form>
      </Modal></>
      );
    
  }

  export default WalletConnect;


