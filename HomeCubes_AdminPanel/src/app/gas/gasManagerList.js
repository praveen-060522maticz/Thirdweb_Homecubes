import React, { Component, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import bsCustomFileInput from "bs-custom-file-input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useLocation, useHistory } from "react-router-dom";
import { addCategoryCall } from "../../axioscalls/token.js";
import { isEmpty } from "../../lib/common.js";
import { createProject, getGasFees, getTokenCount } from "../../axioscalls/admin.js";
import config from "../../lib/config.js";
import "react-datepicker/dist/react-datepicker.css";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import useContractHook from "../../contract/contract.js";
import { useSelector } from "react-redux";
toast.configure();

export function AddProject() {
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
    const [feeToken, setFeeToken] = useState("")
    const [tokenName, setTokenName] = useState("")

    const contract = useContractHook()

    console.log("formData", formData);



    const handleChange = (e) => {
        setError({});
        e.preventDefault();
        console.log("errrrr on 0", e);
        const { id, value, files } = e.target;
        const regex = /^\d*$/;
        if (id != "collectAddress" && value > 50 && regex.test(value)) return;
        let formdata = { ...formData, ...{ [id]: files ? files[0] : value } };
        setFormData(formdata);
        console.log("formdata", formData);
    };


    const validation = () => {
        var errors = {};
        if (!formData?.collectAddress) errors.collectAddress = "Collect Address can't be empty";
        if (!formData?.approveFee) errors.approveFee = "Approve Fee can't be empty";
        if (!formData?.cancelOrderFee) errors.cancelOrderFee = "Cancel Order Fee can't be empty";
        if (!formData?.placeOrderFee) errors.placeOrderFee = "Place Order Fee can't be empty";
        if (isEmpty(formData?.saleFee)) errors.saleFee = "Sale Fee can't be empty";
        if (!formData?.acceptBidFee)
            errors.acceptBidFee = "Accept Bid Fee can't be empty";
        if (!formData?.lazyMintFee)
            errors.lazyMintFee = "Lazy Mint Fee can't be empty";
        if (!formData?.stakeFee)
            errors.stakeFee = "Stake Fee can't be empty";
        if (!formData?.withdrawtFee)
            errors.withdrawtFee = "Withdrawt Fee can't be empty";
        if (!formData?.bidFee) errors.bidFee = "Bid Fee can't be empty";
        if (!formData?.cancelBidFee) errors.cancelBidFee = "Cancel Bid Fee can't be empty";
        // if (!formData?.fundReceiverAddress) errors.fundReceiverAddress = "Fund Receiver Address can't be empty";
        if (!formData?.editBidFee) errors.editBidFee = "Edit Bid Fee can't be empty";
        if (!feeToken) errors.gasToken = "Gas token can't be empty";

        return errors;
    };


    const handleSubmit = async () => {
        const valid = validation();
        if (!isEmpty(valid)) return setError(valid);

        if (formData?.gasToken != feeToken) {
            if(tokenName == "") return toast.error("Please enter valid gas token address")
            const Res = await contract.setGasToken(feeToken,config.stakeAddress);
            if (!Res?.status) {
                return (toast.error("Error on contract"))
            }
        }

        const resp = await getGasFees({ action: "edit", ...formData, gasToken: feeToken });
        toast[resp?.success ?? "error"](resp?.msg ?? "Error")
        getGasFeesData()
    };

    // useEffect(() => {
    //     if (feeToken) getTokenName();
    // }, [feeToken])

    useEffect(() => {
        getGasFeesData()
    }, [UserAccountAddr ])

    const getGasFeesData = async () => {
        const resp = await getGasFees({ action: "get" });
        setFormData(resp?.data);
        setFeeToken(resp?.data?.gasToken)
        getTokenName(resp?.data?.gasToken)
    }

    const getTokenName = async (data) => {
        const getName = await contract.getTokenName(data);
        console.log('getNamegetName---->', getName, data);
        if (getName?.name) setTokenName(getName.name);
        else setTokenName("")
    }
    console.log('tokenName---->', tokenName);
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
                                    <label htmlFor="exampleInputName1">Gas token Address Ex:USDT</label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        id="gasToken"
                                        value={feeToken}
                                        placeholder="Gas token Address"
                                        onChange={(e) => { setFeeToken(e.target.value); getTokenName(e.target.value) }}
                                    />
                                    {tokenName ? <p>Token Name : {tokenName}</p> : <p>This is not a contract address</p>}
                                    <p style={{ color: "red" }}>{Errors?.gasToken}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">collect Address</label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        id="collectAddress"
                                        value={formData?.collectAddress}
                                        placeholder="collect Address"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.collectAddress}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">approve Fee %</label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        id="approveFee"
                                        min={"0"}
                                        max={"50"}
                                        value={formData?.approveFee}
                                        placeholder="approveFee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.approveFee}</p>
                                </Form.Group>
                                {/* <Form.Group>
                                    <label htmlFor="exampleInputName1">Project Thumbnail</label>
                                    <Form.Control type="file" className="form-control" id="ProjectThumbnail" value={formData.description} placeholder="description" onChange={(e) => handleChange(e)} />
                                </Form.Group> */}
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        cancel Order Fee %
                                    </label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        id="cancelOrderFee"
                                        max={"50"}
                                        value={formData?.cancelOrderFee}
                                        min={"0"}
                                        placeholder="cancelOrderFee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.cancelOrderFee}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Place Order Fee %</label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        id="placeOrderFee"
                                        min={"0"}
                                        max={"50"}
                                        value={formData?.placeOrderFee}
                                        placeholder="place Order Fee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.placeOrderFee}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        sale Fee %
                                    </label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        id="saleFee"
                                        min={"0"}
                                        max={"50"}
                                        value={formData?.saleFee}
                                        placeholder="Sale Fee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.saleFee}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Accept Bid Fee %</label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        id="acceptBidFee"
                                        min={"0"}
                                        max={"50"}
                                        maxLength={30}
                                        value={formData?.acceptBidFee}
                                        placeholder="acceptBidFee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.acceptBidFee}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Lazy Mint Fee %</label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        min={"0"}
                                        max={"50"}
                                        id="lazyMintFee"
                                        value={formData?.lazyMintFee}
                                        placeholder="Uri"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.lazyMintFee}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Stake Fee %</label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        id="stakeFee"
                                        min={"0"}
                                        max={"50"}
                                        value={formData?.stakeFee}
                                        placeholder="Stake Fee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.stakeFee}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        withdrawt Fee %
                                    </label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        id="withdrawtFee"
                                        min={"0"}
                                        max={"50"}
                                        value={formData?.withdrawtFee}
                                        placeholder="Withdrawt Fee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.withdrawtFee}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        Bid Fee %
                                    </label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        id="bidFee"
                                        min={"0"}
                                        max={"50"}
                                        value={formData?.bidFee}
                                        placeholder="Bid Fee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.bidFee}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Cancel Bid Fee %</label>

                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        min={"0"}
                                        max={"50"}
                                        id="cancelBidFee"
                                        value={formData?.cancelBidFee}
                                        placeholder="Cancel Bid Fee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.cancelBidFee}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Edit Bid Fee %</label>
                                    <Form.Control
                                        type="number"
                                        min={"0"}
                                        max={"50"}
                                        className="form-control"
                                        id="editBidFee"
                                        value={formData?.editBidFee}
                                        placeholder="Edit Bid Fee"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.editBidFee}</p>
                                </Form.Group>

                                {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                            </form>
                            {UserAccountAddr.toLowerCase() == config.AdminAddress.toLowerCase() && <button
                                className="btn mt-2 allbtn"
                                type="button"
                                onClick={() => handleSubmit()}
                                disabled={loading}
                            >
                                Submit
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProject;
