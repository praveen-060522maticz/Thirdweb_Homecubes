import React, { Component, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useLocation, useHistory } from "react-router-dom";

import { addCategoryCall } from "../../axioscalls/token.js";
import Select from "react-select";
import { isEmpty } from "../../lib/common.js";
import { createProject, getTokenCount } from "../../axioscalls/admin.js";
import config from "../../lib/config.js";
import "react-datepicker/dist/react-datepicker.css";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import useContractHook from "../../contract/contract.js";
import web3 from 'web3'
import { useSelector } from "react-redux";
import * as tokenFunctions from '../../axioscalls/token.js'
toast.configure();

export function AddProject() {
    const History = useHistory();
    var location = useLocation();
    const { pathname, state } = location;
    var path = pathname.split("/")[1];
    console.log("pathname", path, state);
    const [tokenCount, setTokenCount] = useState({});

    const { Categorys, UserAccountAddr, web3, web3p } = useSelector((state) => state.wallet_detail)


    useEffect(() => {
        bsCustomFileInput.init();
    }, []);

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    var [formData, setFormData] = useState({ ...state } ?? {});
    const [Errors, setError] = useState({});
    const [loading, setLoading] = useState(false)

    const contract = useContractHook()

    console.log("formData", formData);

    useEffect(() => {

        if (path == "projectEdit") getTokencount()
        else setFormData({ ...formData, ...{ royaltyReceiver: config.AdminAddress, baseUri: config.IPFS_IMG } });
    }, []);

    const getTokencount = async () => {

        const Resp = await getTokenCount({ _id: state?._id });
        console.log("respppp", Resp);
        if (Resp?.success == "success") {
            setTokenCount(Resp?.data[0] ?? {})
        }
    }

    const handleChange = (e) => {
        setError({});
        e.preventDefault();
        console.log("errrrr on 0", e);
        const { id, value, files } = e.target;
        let formdata = { ...formData, ...{ [id]: files ? files[0] : value } };
        setFormData(formdata);
        console.log("formdata", formData);
    };


    const validation = async () => {
        var errors = {};
        if (!formData?.aboutDescription)
            errors.aboutDescription = "About Description can't be empty";
        if (!formData?.baseUri) errors.baseUri = "Base Uri can't be empty";
        if (!formData?.duration) errors.duration = "Duration can't be empty";
        if (!formData?.maxNFTs) errors.maxNFTs = "MaxNFTs can't be empty";
        if (isEmpty(formData?.mintPrice)) errors.mintPrice = "Mint Price can't be empty";
        if (!formData?.projectDescription)
            errors.projectDescription = "Project Description can't be empty";
        if (!formData?.projectTitle)
            errors.projectTitle = "Project Title can't be empty";
        if (!formData?.royaltyReceiver)
            errors.royaltyReceiver = "Royalty Receiver can't be empty";
        if (!formData?.feeCollector)
            errors.feeCollector = "Fee Collector address can't be empty";
        if (!formData?.symbol) errors.symbol = "Symbol can't be empty";
        if (!formData?.propertyValue) errors.propertyValue = "Property Value can't be empty";
        // if (!formData?.fundReceiverAddress) errors.fundReceiverAddress = "Fund Receiver Address can't be empty";
        if (!formData?.aboutProject)
            errors.aboutProject = "About Project can't be empty";
        if (!formData?.ProjectThumbnail)
            errors.ProjectThumbnail = "Thumbnail can't be empty";
        if (!formData?.ProjectBanner)
            errors.ProjectBanner = "ProjectBanner can't be empty";

        if (formData?.ProjectBanner && (formData?.ProjectBanner?.size / (1024 * 1024)).toFixed(2) > 15)
            errors.ProjectBanner = "ProjectBanner size can't be more than 10MB";

        if (path != "projectEdit" && !formData?.imgfile)
            errors.imgfile = "NFT image can't be empty";

        if (path != "projectEdit" && formData?.symbol) {
            const checkSymbol = await createProject({ symbol: formData?.symbol, action: "checkSymbol" });;
            if (checkSymbol?.success == "error") {
                errors.symbol = "Symbol already exist";
            }
        }

        if (!formData?.mintToken) errors.mintToken = "Please select mint token"

        if (!formData.NFTRoyalty) errors.NFTRoyalty = "Royalty Required";
        else if (isEmpty(formData.NFTRoyalty))
            errors.NFTRoyalty = "Royalty Must Be Greate Than 0";
        else if (isNaN(formData.NFTRoyalty) === true)
            errors.NFTRoyalty = "Royalty must be a number";
        else if (Number(formData.NFTRoyalty) < 0)
            errors.NFTRoyalty = "Royalty must be Greater than 0";
        else if (Number(formData.NFTRoyalty) > 20)
            errors.NFTRoyalty = "Royalty Must be less than 20";
        else if (Number(formData.NFTRoyalty) % 1 !== 0)
            errors.NFTRoyalty = "Royalty must be a Whole Number";

        return errors;
    };


    const handleSubmit = async () => {

        if (path == "projectEdit" && formData?.maxNFTs < state?.maxNFTs) return toast.error("Can't decrease total supply");

        const validate = await validation();
        console.log("validate", validate)
        if (!isEmpty(validate)) return setError(validate);
        setLoading(true)
        if (path == "projectEdit" && state &&
            (((formData?.mintPrice != state?.mintPrice) || (formData?.maxNFTs != state?.maxNFTs)) ||
                (formData?.royaltyReceiver != state?.royaltyReceiver) || (formData?.baseUri != state?.baseUri) ||
                (formData?.feeCollector != state?.feeCollector))
        ) {
            if ((formData?.mintPrice != state?.mintPrice) || (formData?.maxNFTs != state?.maxNFTs)) {
                formData.NFTPrice = parseFloat(
                    formData.mintPrice / (formData.maxNFTs - tokenCount?.isMinted)
                ).toFixed(6);

                const signCall = await contract._signcall(formData);
                console.log("signCall", signCall);

                formData.changePrice = ((formData?.mintPrice != state?.mintPrice) || (formData?.maxNFTs != state?.maxNFTs));
                formData.Hash = signCall.signhash;
                formData.nonce = signCall.tot;
                formData.randomname = signCall.password;
            }

            const chengeFun = await contract.changeReceiver([formData?.contractAddress, formData?.royaltyReceiver, formData?.feeCollector], web3.utils.toWei(formData?.NFTPrice), formData?.baseUri != state?.baseUri ? formData?.baseUri : "");
            console.log("signCall", chengeFun);
            if (chengeFun?.status) formData.changeReceiver = true;
            else {
                setLoading(false)
                return toast.error("Error on changeing");
            }

        } else if (path == "projectAdd") {
            formData.NFTPrice = parseFloat(
                formData.mintPrice / formData.maxNFTs
            ).toFixed(6);
            formData.changePrice = false;

            const create = await contract.createCollection([formData?.royaltyReceiver, [formData?.projectTitle, formData?.symbol, formData?.baseUri], web3.utils.toWei(String(formData?.NFTPrice)), formData?.feeCollector]);
            console.log("jhyyfegsiufs", create);
            if (!create.status) return (
                toast.error("Error on contract."),
                setLoading(false)
            )
            formData.contractAddress = create.contractaddress.toLowerCase()


            const signCall = await contract._signcall(formData);
            console.log("signCall", signCall);

            formData.changePrice = ((formData?.mintPrice != state?.mintPrice) || (formData?.maxNFTs != state?.maxNFTs));
            formData.Hash = signCall.signhash;
            formData.nonce = signCall.tot;
            formData.randomname = signCall.password;
        }
        formData.creatoraddress = UserAccountAddr.toLowerCase()
        formData.action = path == "projectEdit" ? "edit" : "add";
        formData.roadMap = JSON.stringify(formData.roadMap ?? []);
        formData.CMS = JSON.stringify(formData.CMS ?? []);
        console.log("forrrrrrmdata", formData);
        var resp = await createProject(formData);
        console.log("respresp", resp, formData);
        if (resp?.success == "success") {
            toast.success(resp.msg);
            setTimeout(function () {
                History.push("/projectList");
            }, 2000);
        } else toast.error(resp.msg);
        setLoading(false);
    };


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

    const [currencyArr, setCurrencyArr] = useState([])

    useEffect(() => {
        getTokenList();
    }, [])

    const getTokenList = async () => {
        var resp = await tokenFunctions.getCurrencyList();
        if (resp?.success) {
            console.log(":", resp?.msg, config);
            let eth = resp?.msg.filter((item) => item.ChainId == String(config?.ETHCHAIN))
            console.log(":::", eth)
            // setTokenList(resp?.msg[0]?.CurrencyDetails)
            setCurrencyArr(eth[0]?.CurrencyDetails?.filter(val => val.address?.toLowerCase() != config.DEADADDRESS) || [])
        }
    }

    console.log("formadatatatta", formData);

    return (
        <div>
            <div className="page-header">
                <button
                    className="btn mt-2 allbtn"
                    type="button"
                    onClick={() => History.goBack()}
                >
                    Back
                </button>

                <h3 className="page-title"> ADD PROJECT </h3>
            </div>
            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <form className="forms-sample">
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Project Title</label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        disabled={path == "projectView" || path == "projectEdit"}
                                        id="projectTitle"
                                        maxLength={30}
                                        value={formData.projectTitle}
                                        placeholder="Name"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.projectTitle}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Project Description</label>
                                    <textarea
                                        rows={3}
                                        cols={5}
                                        className="form-control"
                                        disabled={path == "projectView"}
                                        id="projectDescription"
                                        value={formData.projectDescription}
                                        placeholder="description"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.projectDescription}</p>
                                </Form.Group>
                                {/* <Form.Group>
                                    <label htmlFor="exampleInputName1">Project Thumbnail</label>
                                    <Form.Control type="file" className="form-control" id="ProjectThumbnail" value={formData.description} placeholder="description" onChange={(e) => handleChange(e)} />
                                </Form.Group> */}
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        Maximum supply of NFTs
                                    </label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        disabled={path == "projectView"}
                                        id="maxNFTs"
                                        value={formData.maxNFTs}
                                        min={"0"}
                                        placeholder="NFTs"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.maxNFTs}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Mint Price</label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        disabled={path == "projectView"}
                                        id="mintPrice"
                                        min={"0"}
                                        value={formData.mintPrice}
                                        placeholder="price"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.mintPrice}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Mint token</label>
                                    <Select
                                        styles={stylesgraybg}
                                        options={currencyArr}
                                        value={formData?.mintTokenName ? { value: formData?.mintTokenName, label: formData?.mintTokenName } : null}
                                        onChange={(e) => setFormData({ ...formData, mintTokenName: e.value, mintToken: e.address })}
                                        disabled={path == "projectView"}
                                        placeholder="Select token"
                                    />
                                    <p className='mt-2' style={{ color: "red" }} >{Errors?.mintToken}</p>
                                </Form.Group>


                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        Collection Token Symbol(Ex. HMCBS)
                                    </label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        disabled={path == "projectView" || path == "projectEdit"}
                                        id="symbol"
                                        value={formData.symbol}
                                        placeholder="symbol"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.symbol}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">NFT Royalty (%)</label>
                                    <Form.Control
                                        type="number"
                                        className="form-control"
                                        disabled={path != "projectAdd"}
                                        id="NFTRoyalty"
                                        maxLength={30}
                                        value={formData?.NFTRoyalty}
                                        placeholder="NFTRoyalty"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.NFTRoyalty}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Project Base URI</label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        disabled={path == "projectView"}
                                        id="baseUri"
                                        value={formData.baseUri}
                                        placeholder="Uri"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.baseUri}</p>
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Property Value</label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        disabled={path == "projectView"}
                                        id="propertyValue"
                                        value={formData.propertyValue}
                                        placeholder="Property Value"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.propertyValue}</p>
                                </Form.Group>
                                {/* <Form.Group>
                                    <label htmlFor="exampleInputName1">Fund Receiver Address</label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        disabled={path == "projectView"}
                                        id="fundReceiverAddress"
                                        value={formData.fundReceiverAddress}
                                        placeholder="Fund Receiver Address"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.fundReceiverAddress}</p>
                                </Form.Group> */}

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        Royalties Receiver Address
                                    </label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        id="royaltyReceiver"
                                        disabled={path == "projectView"}
                                        value={formData.royaltyReceiver}
                                        placeholder="Receiver Address"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.royaltyReceiver}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        Mint fee collector Address
                                    </label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        id="feeCollector"
                                        disabled={path == "projectView"}
                                        value={formData.feeCollector}
                                        placeholder="Receiver Address"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.feeCollector}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Time to Launch</label>

                                    <DateTimePicker
                                        onChange={(e) => { setError({}); setFormData({ ...formData, duration: e }) }}
                                        value={formData?.duration ?? new Date()}
                                        id="duration"
                                        disabled={path == "projectView" || (path == "projectEdit" && new Date() > new Date(formData?.duration))}
                                        className="custom_time_date_picker"
                                        autoFocus
                                        // amPmAriaLabel="Select AM/PM"
                                        format="y-MM-dd h:mm a"
                                    />
                                    <p style={{ color: "red" }}>{Errors?.duration}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">About Project</label>
                                    <Form.Control
                                        type="textarea"
                                        disabled={path == "projectView"}
                                        className="form-control"
                                        id="aboutProject"
                                        value={formData.aboutProject}
                                        placeholder="About Project"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.aboutProject}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">
                                        About Project Description
                                    </label>
                                    <textarea
                                        rows={5}
                                        cols={5}
                                        disabled={path == "projectView"}
                                        className="form-control"
                                        id="aboutDescription"
                                        value={formData.aboutDescription}
                                        placeholder="About Project Description"
                                        onChange={(e) => handleChange(e)}
                                    />
                                    <p style={{ color: "red" }}>{Errors?.aboutDescription}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">NFT Image</label>

                                    {/* <Form.Control
                                        type="file"
                                        disabled={path == "projectView"}
                                        className="form-control"
                                        id="imgfile"
                                        accept='image/*'
                                        placeholder="NFT image"
                                        onChange={(e) => handleChange(e)}
                                    /> */}
                                    <div>
                                        <div class="upload-btn-wrapper">
                                            <button class="btn">Choose file</button>
                                            <input
                                                type="file"
                                                disabled={path == "projectView"}
                                                className="form-control"
                                                id="imgfile"
                                                accept='image/*'
                                                placeholder="NFT image"
                                                onChange={(e) => handleChange(e)}
                                            />
                                        </div>
                                    </div>

                                    <p style={{ color: "red" }}>{Errors?.imgfile}</p>
                                    {formData && formData?.imgfile ? (
                                        typeof formData?.imgfile == "string" ? (
                                            <img
                                                src={`${config.ImG}/nft/${config.AdminAddress}/Original/${formData.imgfile}`}
                                                style={{ height: 100, width: 100 }}
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(formData?.imgfile)}
                                                style={{ height: 100, width: 100 }}
                                            />
                                        )
                                    ) : (
                                        <></>
                                    )}
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Project thumbnail</label>
                                    {path != "projectView" && (
                                        // <Form.Control
                                        //     type="file"
                                        //     disabled={path == "projectView"}
                                        //     className="form-control"
                                        //     id="ProjectThumbnail"
                                        //     accept='image/*'
                                        //     placeholder="Project Thumbnail"
                                        //     onChange={(e) => handleChange(e)}
                                        // />
                                        <div>
                                            <div class="upload-btn-wrapper">
                                                <button class="btn">Choose file</button>
                                                <input
                                                    type="file"
                                                    disabled={path == "projectView"}
                                                    className="form-control"
                                                    id="ProjectThumbnail"
                                                    accept='image/*'
                                                    placeholder="Project Thumbnail"
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <p style={{ color: "red" }}>{Errors?.ProjectThumbnail}</p>
                                    {formData && formData?.ProjectThumbnail ? (
                                        typeof formData?.ProjectThumbnail == "string" ? (
                                            <img
                                                src={`${config.ImG}/projects/ProjectThumbnail/${formData.ProjectThumbnail}`}
                                                style={{ height: 100, width: 100 }}
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(formData?.ProjectThumbnail)}
                                                style={{ height: 100, width: 100 }}
                                            />
                                        )
                                    ) : (
                                        <></>
                                    )}
                                </Form.Group>

                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Project banner</label>
                                    {path != "projectView" && (
                                        <div>
                                            <div class="upload-btn-wrapper">
                                                <button class="btn">Choose file</button>
                                                <input
                                                    type="file"
                                                    disabled={path == "projectView"}
                                                    className="form-control"
                                                    id="ProjectBanner"
                                                    accept='image/*, video/*'
                                                    placeholder="Project Thumbnail"
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <p style={{ color: "red" }}>{Errors?.ProjectBanner}</p>
                                    {formData && formData?.ProjectBanner ? (
                                        typeof formData?.ProjectBanner == "string" ? (
                                            <img
                                                src={`${config.ImG}/projects/ProjectBanner/${formData.ProjectBanner}`}
                                                style={{ height: 100, width: 100 }}
                                            />
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(formData?.ProjectBanner)}
                                                style={{ height: 100, width: 100 }}
                                            />
                                        )
                                    ) : (
                                        <></>
                                    )}
                                </Form.Group>

                                {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                            </form>
                            {path != "projectView" && (
                                <button
                                    className="btn mt-2 allbtn"
                                    type="button"
                                    onClick={() => handleSubmit()}
                                    disabled={loading}
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProject;
