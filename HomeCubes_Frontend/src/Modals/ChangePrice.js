import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import Select from "react-select";

function ChangePrice({ show, handleClose }) {
  const [selectedOption, setSelectedOption] = useState(null);


  const options = [
    { value: "USD", label: "USD" },
    { value: "ETH", label: "ETH" },
    { value: "BNB", label: "BNB" },
    { value: "WETH", label: "WETH" },
    { value: "WEETH", label: "WEETH" },
  ];

  const stylesgraybg = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      color: "#6C6A81",
      background: isFocused
        ? "#F5F6F7"
        : isSelected
          ? "#F5F6F7"
          : isHovered
            ? "red"
            : "#F5F6F7",

      zIndex: 1,
      cursor: "pointer",
      fontSize: "13px",
    }),

    option: (styles, { isFocused, isSelected, isHovered }) => {
      // const color = chroma(data.color);

      return {
        ...styles,
        backgroundColor: isHovered
          ? "#16EBC3"
          : isSelected
            ? "#16EBC3"
            : isFocused
              ? "#16EBC3"
              : "#151515",
        cursor: "pointer",
        color: isHovered
          ? "#000"
          : isSelected
            ? "#000"
            : isFocused
              ? "#000"
              : "#fff",
        fontSize: "13px",
      };
    },
    valueContainer: (provided, { isFocused, isSelected, isHovered }) => ({
      ...provided,
      height: "40px",
      width: "70px",
      backgroundColor: isHovered
        ? "transperant"
        : isSelected
          ? "transperant"
          : isFocused
            ? "transperant"
            : "transperant",
      // border: "1px solid rgba(34, 34, 34, 0.32)",
      borderRadius: 5,
      fontSize: "13px",
      color: "#fff",
    }),
    control: (provided, { isFocused, isSelected, isHovered }) => ({
      ...provided,
      height: "40px",
      width: "70px",
      borderRadius: 5,
      backgroundColor: isHovered
        ? "transperant"
        : isSelected
          ? "transperant"
          : isFocused
            ? "transperant"
            : "transperant",
      // backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
      color: "#fff",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      width: "20px",
      position: "absolute",
      right: 0,
      top: 0,
      color: "#6C6A81",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#16EBC3",
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };
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
            <p className='modal_title text-center'>Change Price</p>
            <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt-3'>

            <div className='cp_nftimage_holder'>
              <img className='cp_nftImage' src={require('../assets/images/nftimage.png')} />
              <p className='cp_nftName mt-3'>3D Cubes</p>
            </div>

            <div className='modal_inputGroup mt-3'>
              <input type="number" className='modal_input cmnInput_scrollerHider' placeholder='Enter your price' />
              <Select
                className="border_select"
                placeholder="Coin"
                styles={stylesgraybg}
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
              />
            </div>

            <p className='blogInfo_inplabel mt-3 mb-4'>Summary:</p>
            <div className='bidmodal_summary mb-3'>
              <p className='modal_summaryLabel'>Your balance</p>
              <p className='modal_summaryLabel'>2.5 %</p>
            </div>

            <div className='bidmodal_summary mb-3'>
              <p className='modal_summaryLabel'>Service fees</p>
              <p className='modal_summaryLabel'>0 %</p>
            </div>

            <button className='bodygradientBtn modal_grdientBtn mt-4'>Change Price</button>

          </div>
        </Modal.Body>

      </Modal>
    </>
  )
}

export default ChangePrice