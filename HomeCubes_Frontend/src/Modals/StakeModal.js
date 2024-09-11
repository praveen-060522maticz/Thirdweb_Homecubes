import React from 'react'
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Select from "react-select";
import { getDaysOfDesiredMonth } from '../actions/common';
import { useEffect } from 'react';


function TransferToken({ show, handleClose, onStackNft, setSelectedPlan }) {
    const [options, setOptions] = useState([
        { label: "90 days", value: "90 days", poolId: 1, startDate: getDaysOfDesiredMonth(3).startDate, days: 90, endDateFormat: new Date(new Date().setDate(new Date().getDate() + 90)) },
        { label: "180 days", value: "180 days", poolId: 2, startDate: getDaysOfDesiredMonth(6).startDate, days: 180, endDateFormat: new Date(new Date().setDate(new Date().getDate() + 180)) },
        { label: "365 days", value: "365 days", poolId: 3, startDate: getDaysOfDesiredMonth(12).startDate, days: 365, endDateFormat: new Date(new Date().setDate(new Date().getDate() + 365)) }
    ])


    useEffect(() => {
        // const getData = [
        //     { label: "90 days", value: "Season 1", poolId: 1, daysDifference: getDaysOfDesiredMonth(3).days, endDateFormat: getDaysOfDesiredMonth(3).dateFormat, startDate: getDaysOfDesiredMonth(3).startDate },
        //     { label: "190 days", value: "Season 2", poolId: 2, daysDifference: getDaysOfDesiredMonth(6).days, endDateFormat: getDaysOfDesiredMonth(6).dateFormat, startDate: getDaysOfDesiredMonth(6).startDate },
        //     { label: "270 days", value: "Season 3", poolId: 3, daysDifference: getDaysOfDesiredMonth(9).days, endDateFormat: getDaysOfDesiredMonth(9).dateFormat, startDate: getDaysOfDesiredMonth(9).startDate },
        //     { label: "360 days", value: "Season 4", poolId: 4, daysDifference: getDaysOfDesiredMonth(12).days, endDateFormat: getDaysOfDesiredMonth(12).dateFormat, startDate: getDaysOfDesiredMonth(12).startDate }
        // ]
        // setOptions(getData.sort((a, b) => a.daysDifference - b.daysDifference));

    }, [])


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
        valueContainer: (provided, state) => ({
            ...provided,
            height: "40px",
            padding: "0 20px",
            backgroundColor: "transparent ",
            // border: "1px solid rgba(34, 34, 34, 0.32)",
            borderRadius: 5,
            fontSize: "13px",
        }),
        control: (provided, state) => ({
            ...provided,
            height: "40px",
            borderRadius: 5,
            backgroundColor: "transparent",
            border: "1px solid #16EBC3",
            outline: "none",
            boxShadow: "none",
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: "40px",
            position: "absolute",
            right: 0,
            top: 0,
            color: "#000",
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: "#fff",
        }),
        menuList: (base) => ({
            ...base,
            // kill the white space on first and last option
            padding: 0,
        }),
    };

    console.log("options", options);
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
                        <p className='modal_title text-center'>Stake Token</p>
                        <img src={require('../assets/images/close.svg').default} onClick={() => handleClose()} className='modal_closer' />

                    </div>

                    <div className='modal_body mt-3'>
                        <Select
                            className="border_select"
                            classNamePrefix={"react_select"}
                            placeholder="Pool"
                            styles={stylesgraybg}
                            // defaultValue={selectedOption}
                            onChange={setSelectedPlan}
                            options={options}
                        />
                        {/* <div className='cp_nftimage_holder'>
                    <img className='cp_nftImage' src={require('../assets/images/nftimage.png')} />
                    <p className='cp_nftName mt-3'>3D Cubes</p>
                </div>
                
                 <div className='mt-3'>
                 <p className='modal_summaryLabel'>Valid quality Max 1</p>
                    <input type="number" className='modal_singleinput mt-3 cmnInput_scrollerHider' placeholder='Enter quality to transfer' />
                 </div>

                 <div className='mt-3'>
                 <p className='modal_summaryLabel'>Transfer to</p>
                    <input type="number" className='modal_singleinput mt-3 cmnInput_scrollerHider' placeholder='Enter wallet address' />
                 </div> */}


                        <button className='bodygradientBtn modal_grdientBtn mt-4' onClick={() => onStackNft()} >Stake</button>
                        {/* <button className='additional_btn modal_additionalBtn mt-3'>Cancel</button> */}

                    </div>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default TransferToken