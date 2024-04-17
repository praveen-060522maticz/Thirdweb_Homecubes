import React, { Component, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useLocation, useHistory } from "react-router-dom";

import { addCategoryCall, getCurrencyList } from "../../axioscalls/token.js";
import Select from "react-select";
import { EncryptData, NumANdDotOnly, isEmpty } from "../../lib/common.js";
import {
  collectionFunctions,
  createProject,
  editToken,
  imgageupload,
} from "../../axioscalls/admin.js";
import config from "../../lib/config.js";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import useContractHook from "../../contract/contract.js";

import "react-datepicker/dist/react-datepicker.css";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
toast.configure();

function AddNfts() {
  const [value, setValue] = useState(new Date());
  const History = useHistory();
  var location = useLocation();
  var pathname = location.pathname;
  var path = pathname.split("/")[1];
  console.log("pathnameAddnft", path, location.state);
  const [projects, setProject] = useState({});

  const excelFile =
    "https://docs.google.com/spreadsheets/d/1dD3K_89w1uHsCyC-6Ljc55lNWLiR9kipkRqvypl0ogs/edit?usp=sharing";
  const contract = useContractHook();

  const { Categorys, UserAccountAddr, web3, web3p } = useSelector(
    (state) => state.wallet_detail
  );
  console.log(
    " Categorys, accountAddress",
    Categorys,
    UserAccountAddr,
    web3,
    web3p
  );

  console.log("projects", projects);
  const initialTokenValue = {
    NFTName: "",
    NFTQuantity: 1,
    NFTOrginalImage: "",
    NFTOrginalImagePreview: "",
    NFTThumpImage: "",
    NFTThumpImagePreview: "",
    NFTOrginalImageIpfs: "",
    NFTThumpImageIpfs: "",
    CompressedFile: "",
    CompressedThumbFile: "",
    NFTDescription: "",
    PutOnSaleType: "NotForSale",
    PutOnSale: false,
    NFTPrice: projects?.NFTPrice,
    NFTMinimumBid: "",
    ClockTime: "",
    EndClockTime: "",
    NFTRoyalty: location.state?.Royalty ?? projects?.NFTRoyalty,
    NFTProperties: [],
    NFTCreator: UserAccountAddr,
    NFTOwner: UserAccountAddr,
    HashValue: "",
    MetFile: "",
    MetaData: "",
    ContractAddress: "",
    ContractType: "",
    Category: (Categorys?.length > 0 && Categorys[0]?.label) ?? "BNB",
    CoinName: config.COIN_NAME,
    UnlockContent: "",
    CollectionName: "DITMAX",
    CollectionNetwork: config.COIN_NAME,
    CollectionSymbol: "",
    isMessageapprove: "",
    isPricenotification: "",
    isPromotion: "",
    islegalalert: "",
    imgfile: [],
    UnlockAt: new Date(),
  };
  const [formData, setFormData] = useState(location.state ? { ...initialTokenValue, ...location.state, creatoraddress: UserAccountAddr } : initialTokenValue);
  const [Errors, setError] = useState({});
  const [NFTFormValue, setNFTFormValue] = useState({});
  const [filename, setFileName] = useState("");
  const [Submit, setSubmit] = useState("Submit");
  const [loading, setLoading] = useState(false)


  // console.log("formData", formData);
  console.log("filename", filename);

  useEffect(() => {
    bsCustomFileInput.init();

    if (path != "editNfts") getProject();

  }, []);

  const getProject = async () => {
    var resp = await createProject({
      action: "getOne",
      projectId: location.state?._id,
    });
    setProject(resp?.data ?? {});
    setFormData({
      ...formData,
      ...{ NFTRoyalty: resp?.data?.NFTRoyalty, NFTPrice: resp?.data?.NFTPrice, ContractAddress: resp?.data?.contractAddress },
    });
  };

  const handleChange = (e) => {
    setError({});
    e.preventDefault();
    console.log("errrrr on 0", e.target);
    const { id, value, files } = e.target;

    if (id == "excelfile") {
      var fileNameExt = e.target.files[0].name.substr(
        e.target.files[0].name.lastIndexOf(".") + 1
      );

      if (fileNameExt == "xlsx") {
        setFileName(e.target.files[0].name);
        setFormData({
          ...formData,
          ...{ ["excelfile"]: e.target.files[0] },
        });
        return toast.success("Excel file Uploaded");
      } else {
        return toast.warning("Please upload Excel file only");
      }
    }

    console.log("files", files);
    if (files)
      var filess = files?.length == undefined ? [files] : Object.values(files);
    // else if (value && !/^\d*\.?\d*$/.test(value)) return;

    let formdata = { ...formData, ...{ [id]: files ? filess : value } };
    setFormData(formdata);
    console.log("formdata", formdata);
  };
  console.log("ahdaiuihdaw", formData);

  const Validation = (data) => {
    let ValidateError = {};
    const {
      NFTPrice,
      NFTRoyalty,
      CoinName,
      excelfile,
      NFTName,
      imgfile,
      NFTDescription
    } = data;

    if (!NFTRoyalty) ValidateError.NFTRoyalty = "Royalty Required";
    else if (isEmpty(NFTRoyalty))
      ValidateError.NFTRoyalty = "Royalty Must Be Greate Than 0";
    else if (isNaN(NFTRoyalty) === true)
      ValidateError.NFTRoyalty = "Royalty must be a number";
    else if (Number(NFTRoyalty) < 0)
      ValidateError.NFTRoyalty = "Royalty must be Greater than 0";
    else if (Number(NFTRoyalty) > 20)
      ValidateError.NFTRoyalty = "Royalty Must be less than 20";
    else if (Number(NFTRoyalty) % 1 !== 0)
      ValidateError.NFTRoyalty = "Royalty must be a Whole Number";

    if(isEmpty(NFTName))  ValidateError.NFTName = "NFT Name Required";
    // if(isEmpty(NFTDescription))  ValidateError.NFTDescription = "NFT Description Required";

    if (isEmpty(NFTPrice)) ValidateError.NFTPrice = "NFTPrice Required";
    if (!CoinName) ValidateError.CoinName = "CoinName Required";

    if (path != "editNfts" && imgfile.length == 0) {
      ValidateError.imgfile = "File/Folder Required";
    }

    // if (!excelfile) {
    //     ValidateError.excelfile = "Excel file Required";
    // }

    // if (isNaN(NFTPrice) === true)
    //   ValidateError.NFTPrice = "NFT Price Should Be a Number";

    return ValidateError;
  };

  const handleSubmit = async () => {
    const validate = Validation(formData);
    console.log("validate", validate);
    if (!isEmpty(validate)) return setError(validate);

    setSubmit("loading...");
    setLoading(true)
    const id = toast.loading(" Minting Processing");

    const signCall = await contract._signcall(formData);
    console.log("signCall", signCall);

    var sendfiles = new FormData();

    console.log("formData?.excelfile", formData?.excelfile);

    await Promise.all(
      formData.imgfile.map((img) => {
        sendfiles.append("imgfile", img);
      })
    );
    console.log(
      ":seifhsiufesfsef",
      UserAccountAddr,
      formData.NFTRoyalty,
      formData.NFTPrice,
      signCall.signhash,
      signCall.tot,
      signCall.password,
      formData.CoinName,
      config.singleAddress,
      location.state?._id,
      location.state?.projectId,
      formData.NFTName,
      formData.NFTDescription,
    );
    // sendfiles.append("excelfile", formData?.excelfile)
    sendfiles.append("creatoraddress", EncryptData(UserAccountAddr));
    sendfiles.append("royalty", EncryptData(formData.NFTRoyalty));
    sendfiles.append("price", EncryptData(formData.NFTPrice));
    sendfiles.append("Hash", EncryptData(signCall.signhash));
    sendfiles.append("nonce", EncryptData(signCall.tot));
    sendfiles.append("randomname", EncryptData(signCall.password));
    sendfiles.append("coinname", EncryptData(formData.CoinName));
    sendfiles.append("contractaddress", EncryptData(formData.ContractAddress));
    sendfiles.append("CollectionId", "");
    sendfiles.append("projectId", EncryptData(location.state?._id));
    sendfiles.append("Nftname", EncryptData(formData.NFTName));
    sendfiles.append("NFTDescription", EncryptData(formData.NFTDescription));
    sendfiles.append("UnlockAt", EncryptData(formData.UnlockAt));
    sendfiles.append("baseUri", EncryptData(projects?.baseUri ?? ""));
    // sendfiles.append("category", EncryptData(formData.category ?? ""));

    const Resp = await imgageupload(sendfiles);
    console.log("Resp", Resp);
    toast.update(id, {
      render: Resp.msg,
      type: Resp.success,
      isLoading: false,
      autoClose: 1000,
      closeButton: true,
      closeOnClick: true,
    });

    if (Resp.status) {
      setSubmit("success");
      History.goBack();
    } else {
      setSubmit("Try again");
    }
    setLoading(false)
  };

  const handleEditSubmit = async () => {
    const validate = Validation(formData);
    console.log("validate", validate, formData);
    if (!isEmpty(validate)) return setError(validate);

    setSubmit("loading...");
    setLoading(true)
    const id = toast.loading("Editing");

    const Resp = await editToken(formData);
    console.log("Resp", Resp);
    toast.update(id, {
      render: Resp.msg,
      type: Resp.success,
      isLoading: false,
      autoClose: 1000,
      closeButton: true,
      closeOnClick: true,
    });

    if (Resp?.success == "success") {
      setSubmit("success");
      History.goBack();
    } else {
      setSubmit("Try again");
    }
    setLoading(false)
  }

  const customStyles = {
    option: (styles) => ({
      ...styles,
      cursor: "pointer",
    }),
  };

  const onSelect = async (e) => {
    setError({});
    let formdata = { ...formData, ...{ CoinName: e.value } };
    setFormData(formdata);
    console.log("formdata", formData);
  };

  return (
    <div>
      <div className="page-header custom_addnft_header">
        <button
          className="btn mt-2 allbtn"
          type="button"
          onClick={() => History.goBack()}
        >
          Back
        </button>

        <h3 className="page-title"> ADD NFT </h3>

        {/* <a href={`${excelFile}`} target="_blank">
          <button className="btn mt-2 allbtn" type="button">
            Sample Excel
          </button>
        </a> */}
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form className="forms-sample">
                <Form.Group>
                  <label htmlFor="exampleInputName1">Price</label>
                  <Form.Control
                    type="number"
                    className="form-control"
                    id="NFTPrice"
                    disabled
                    value={formData.NFTPrice}
                    placeholder="Price"
                    onChange={(e) => handleChange(e)}
                  />
                  <p style={{ color: "red" }}>{Errors?.NFTPrice}</p>
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Coin Name</label>
                  {/* <Select
                                        styles={customStyles}
                                        options={Categorys}
                                        id={"CoinName"}
                                        onChange={(e) => { console.log("wsewresserse", e); onSelect(e) }}
                                    /> */}
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="CoinName"
                    disabled
                    value={formData.CoinName}
                    placeholder="Price"
                    onChange={(e) => handleChange(e)}
                  />
                  <p style={{ color: "red" }}>{Errors?.CoinName}</p>
                </Form.Group>

                <Form.Group>
                  <label htmlFor="exampleInputName1">Upload Images</label>

                  {/* <Form.Control
                    type="file"
                    className="form-control"
                    accept="image/*"
                    id="imgfile"
                    onChange={(e) => handleChange(e)}
                  /> */}
                  <div>
                    <div class="upload-btn-wrapper">
                      <button class="btn">Upload Images</button>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        id="imgfile"
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>

                  <p style={{ color: "red" }}>{Errors?.imgfile}</p>
                  {formData && formData?.imgfile[0] ? (
                    typeof formData?.imgfile == "string" ? (
                      <img
                        src={`${config.ImG}/projects/ProjectThumbnail/${formData.imgfile}`}
                        style={{ height: 100, width: 100 }}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(formData?.imgfile[0])}
                        style={{ height: 100, width: 100 }}
                      />
                    )
                  ) :
                    formData?.NFTOrginalImage != "" ?
                      <img
                        src={`${config.ImG}/nft/${formData?.NFTCreator}/Original/${formData.NFTOrginalImage}`}
                        style={{ height: 100, width: 100 }}
                      />
                      :
                      <></>
                  }
                </Form.Group>

                <Form.Group>
                  <label htmlFor="exampleInputName1">Nft name</label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="NFTName"
                    value={formData.NFTName}
                    placeholder="Nft name"
                    onChange={(e) => handleChange(e)}
                  />
                  <p style={{ color: "red" }}>{Errors?.NFTName}</p>
                </Form.Group>

                {/* <Form.Group>
                  <label htmlFor="exampleInputName1">Color</label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="color"
                    value={formData.color}
                    placeholder="color"
                    onChange={(e) => handleChange(e)}
                  />
                  <p style={{ color: "red" }}>{Errors?.color}</p>
                </Form.Group> */}

                <Form.Group>
                  <label htmlFor="exampleInputName1">Description</label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="NFTDescription"
                    value={formData.NFTDescription}
                    placeholder="Description"
                    onChange={(e) => handleChange(e)}
                  />
                  <p style={{ color: "red" }}>{Errors?.NFTDescription}</p>
                </Form.Group>

                {/* <Form.Group>
                  <label htmlFor="exampleInputName1">UnlockAt</label>
                  <DateTimePicker
                    onChange={(e) => setFormData({ ...formData, UnlockAt: e })}
                    value={formData?.UnlockAt}
                    className="custom_time_date_picker"
                    autoFocus
                    format="y-MM-dd h:mm a"
                  />
                  <p style={{ color: "red" }}>{Errors?.UnlockAt}</p>
                </Form.Group> */}

                {/* <Form.Group>
                                    <label htmlFor="exampleInputName1">Upload Excel file</label>

                                    <Form.Control type="file" className="form-control" multiple={true} id="excelfile" accept="excel/*" onChange={(e) => handleChange(e)} />
                                    <p style={{ color: "red" }} >{Errors?.excelfile}</p>

                                </Form.Group> */}

                {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
              </form>
              <button
                className="btn mt-2 allbtn"
                type="button"
                disabled={Submit == "loading..."}
                onClick={() => { path == "editNfts" ? handleEditSubmit() : handleSubmit() }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNfts;
