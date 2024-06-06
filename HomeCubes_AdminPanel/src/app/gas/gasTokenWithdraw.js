import React, { Component, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import bsCustomFileInput from "bs-custom-file-input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createProject, gasTokensFunctions } from "../../axioscalls/admin.js";
import config from "../../lib/config.js";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-bootstrap/Modal";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import useContractHook from "../../contract/contract.js";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from 'react-select'
import { isEmpty } from "../../lib/common.js";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

toast.configure();

export default function GasTokenWithdraw() {
    const History = useHistory();

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    useEffect(() => {
        bsCustomFileInput.init();
    }, []);
    const { Categorys, UserAccountAddr, web3, web3p } = useSelector((state) => state.wallet_detail)

    var [formData, setFormData] = useState({});
    const [Errors, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setshowModal] = useState(false);
    const [withdrawAmt, setWithdrawAmt] = useState("")

    const [options, setOptions] = useState([]);
    const [selected, setselected] = useState({});

    const contract = useContractHook()

    console.log("fsfsefefefsfe", formData);


    const handleSubmit = async () => {
        if (isEmpty(withdrawAmt)) return toast.error("Please enter withdraw amount");
        if (withdrawAmt >= selected?.balance) return toast.error("Enter valid amount");

        setLoading(true)
        const resp = await contract.withDrawProfit([selected?.contractAddress, await web3.utils.toWei(withdrawAmt)]);
        toast[resp?.status ? "success" : "error"](resp?.status ? "Token withdraw successfully" : "Error on contract");
        if (resp?.status) {
            handleChangeToken(selected);
            setshowModal(false);
            setWithdrawAmt("")
        }
        setLoading(false)
    }


    const handleChangeToken = async (value) => {
        console.log('valuevalue---->', value);
        const getBalance = await contract.getContractBalance(value.contractAddress);
        if (!getBalance) return toast.error("Not a token address")
        setselected({ ...value, balance: getBalance });
    };

    useEffect(() => {
        getGasFeesData()
    }, [UserAccountAddr])

    const getGasFeesData = async () => {
        const resp = await gasTokensFunctions({ action: "get" });
        console.log('DWDDWDD---->', resp.data);
        setOptions(resp?.data)
    }


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
        // header start
        valueContainer: (provided, state) => ({
            ...provided,
            height: "40px",
            padding: "0 20px",
            backgroundColor: "#2A3038",
            borderRadius: 5,
            fontSize: "13px",
            color: "#fff",
        }),
        control: (provided, state) => ({
            ...provided,
            height: "40px",
            borderRadius: 5,
            backgroundColor: "#2A3038",
            border: "none",
            outline: "none",
            boxShadow: "none",
            fontSize: "13px",
            color: "#fff",
        }),
        //header end
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: "40px",
            position: "absolute",
            right: 0,
            top: 0,
            color: "#6C6A81",
        }),
        //header color
        singleValue: (provided, state) => ({
            ...provided,
            color: "white",
        }),

        // menu list start
        menuList: (base) => ({
            ...base,
            //   padding: 0,
            backgroundColor: "#2A3038",
        }),
        //menu options
        option: (styles, { isFocused, isSelected, isHovered }) => {
            return {
                ...styles,
                backgroundColor: isHovered
                    ? "#16EBC3"
                    : isSelected
                        ? "#16EBC3"
                        : isFocused
                            ? "#16EBC3"
                            : "#2A3038",
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
        // option: (base) => ({
        //   ...base,
        //   ":active": {
        //     backgroundColor: "#16EBC3",
        //   },
        // }),
    };


    return (
        <div>
            <div className="page-header">

            </div>
            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <form className="forms-sample">
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Select Asset</label>
                                    <Select
                                        styles={stylesgraybg}
                                        options={options}
                                        onChange={(e) => { setError({}); handleChangeToken(e) }}
                                    />
                                    {/* {tokenName ? <p className="mt-2" >Token Name : {tokenName}</p> : <p className="mt-2">This is not a contract address</p>} */}
                                    <p style={{ color: "red" }}>{Errors?.gasToken}</p>
                                </Form.Group>
                                <p className="m2">Token Name : <span className="pl-2" > {selected?.Name} </span> </p>
                                <p className="m2">Token symbol : <span className="pl-2" > {selected?.symbol} </span></p>
                                <p className="m2">Contract address : <span className="pl-2" > {selected?.contractAddress} </span></p>
                                <p className="m2">Balance : <span className="pl-2" > {!isEmpty(selected?.balance) ? selected?.balance / 1e18 : selected?.balance} </span></p>
                                {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                            </form>
                            {UserAccountAddr.toLowerCase() == config.AdminAddress.toLowerCase() && !isEmpty(selected) &&
                                <>
                                    <button
                                        className="btn mt-2 allbtn"
                                        type="button"
                                        onClick={() => setshowModal(true)}

                                    >
                                        Withdraw
                                    </button>
                                    <p className="mt-3" style={{ color: "orange" }} >Note : Don't withdraw all the assets...!</p>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={showModal}
                onHide={() => { if (loading) return; setshowModal(false) }}
                centered
                className="wallet_details"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Withdraw {selected?.Name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card className="white_modal mb-3">
                        <Card.Body className="px-3 py-3">
                            {/* <div className="d-flex align-items-center justify-content-center flex-column"> */}
                            {/* <div className="whitemodal_img_sec"> */}
                            <Form.Group>
                                <label htmlFor="exampleInputName1">
                                    Withdraw amount
                                </label>
                                <Form.Control
                                    type="number"
                                    className="form-control"
                                    id="bidFee"
                                    min={"0"}
                                    placeholder="Enter the withdraw amount..."
                                    onChange={(e) => setWithdrawAmt(e.target.value)}
                                    value={withdrawAmt}
                                />
                                <p style={{ color: "red" }}>{Errors?.bidFee}</p>
                            </Form.Group>
                            {/* </div> */}
                            <Card.Title className="mb-0 mt-3">
                                Balance : {selected?.balance / 1e18}
                            </Card.Title>
                            {/* </div> */}
                            {/* <Card.Title className="mb-0">Wooden House</Card.Title> */}
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button
                        variant="secondary"
                        className="cmn_close_btn"
                        onClick={() => setshowModal(false)}
                    >
                        Close
                    </Button> */}
                    <Button
                        variant="primary"
                        className="allbtn"
                        onClick={() => handleSubmit()}
                        disabled={loading}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

