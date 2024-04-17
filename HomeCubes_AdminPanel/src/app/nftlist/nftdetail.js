import React, { Component, useState, useEffect } from "react";

import { Button, Form } from "react-bootstrap";

import bsCustomFileInput from "bs-custom-file-input";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import config from "../../lib/config.js";
import {
  Mint,
  SRoyalUserPercentage,
  Transfer,
  useMint,
  useServiceFee,
} from "../../useHooks/useContractMethods.js";
import {
  mintDbUpdate,
  getTokenOwner,
  ApproveCAll,
  CreateLazyMint,
} from "../../axioscalls/token.js";
import wallet_details from "../../redux/action.js";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { CheckBalance } from "../../axioscalls/user.js";
import { NumberOnly } from "../../lib/common.js";

toast.configure();

export function NftDetail(props) {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const [startDate, setStartDate] = useState(new Date());
  const [Btn, SetBtn] = useState("start");
  const [Mint_Btn, SetMint_Btn] = useState("init");
  const [App_Btn, SetApp_Btn] = useState("init");
  const [IPFS, SetIPFS] = useState({});
  const [validate, Setvalidate] = useState({});
  const [Royal, SetRoyal] = useState("0");
  const [SplitRoyalUser, SetSplitRoyalUser] = useState({
    "1u": "",
    "2u": "",
    "3u": "",
    "4u": "",
    "5u": "",
  });
  const [SplitRoyalPercentage, SetSplitRoyalPercentage] = useState({
    "1p": "",
    "2p": "",
    "3p": "",
    "4p": "",
    "5p": "",
  });
  const { nfts } = props;
  const [nft, SetNft] = useState(nfts);
  const [AlreadyExits, SetAlreadyExits] = useState(false);

  const Wallet_Details = useSelector((state) => state.wallet_detail);
  const { push } = useHistory();

  useEffect(() => {
    bsCustomFileInput.init();
  }, []);

  useEffect(() => {
    SetSplitRoyalUser({
      ...SplitRoyalUser,
      ...{
        ["1u"]: nft.Creator,
        ["2u"]: nft.NPO_Address,
        ["3u"]: nft.Artist_Address,
      },
    });
  }, [Wallet_Details.UserAccountAddr]);

  useEffect(() => {
    CheckBalance_here();
  }, [AlreadyExits]);

  const CheckBalance_here = async () => {
    var checkif = await CheckBalance({
      ContractAddress: nft.CollectionAddress,
      TokenName: nft.TokenName,
      CollectionUrl: nft.CollectionUrl,
      CollectionType: String(nft.CollectionType),
      Creator: nft.Creator,
      TokenId: nft.Id,
    });
    console.log("waht the ", checkif);
    if (checkif.success == "success") {
      console.log("askdksakdkaskdh", checkif);
      var user_royal = await SRoyalUserPercentage(
        Wallet_Details.providers,
        checkif?.msg?.TokenId
      );
      console.log("user_royal", user_royal);
      if (user_royal) {
        if (user_royal[0].length > 0) {
          var data = user_royal[0]
            .map((item, index) => {
              return { [`${index + 1}u`]: item };
            })
            .reduce((items, accum) => {
              return { ...items, ...accum };
            });
          SetSplitRoyalUser({ ...SplitRoyalUser, ...data });
        }
        if (user_royal[1].length > 0) {
          var data = user_royal[1]
            .map((item, index) => {
              return { [`${index + 1}p`]: item / 1e18 };
            })
            .reduce((items, accum) => {
              return { ...items, ...accum };
            });
          SetSplitRoyalPercentage({ ...SplitRoyalPercentage, ...data });
        }
      }
      SetRoyal(checkif?.msg?.Royalty);
      SetNft({ ...nft, ...{ ["TokenId"]: checkif?.msg?.TokenId } });
      SetAlreadyExits(true);
    }
  };

  const onChangeData = async (e) => {
    SetBtn("start");
    const { id, value } = e?.target;
    if (id.includes("p"))
      SetSplitRoyalPercentage({ ...SplitRoyalPercentage, ...{ [id]: NumberOnly(value) } });
    else SetSplitRoyalUser({ ...SplitRoyalUser, ...{ [id]: value } });
  };

  const validation = () => {
    var validateError = {};
    if (Royal == "") validateError["Royal"] = ` Royalty  Require`;
    if (SplitRoyalUser["1u"] && !SplitRoyalPercentage["1p"])
      validateError[
        "1u"
      ] = ` Spilit Royalty Pecentage Require For ${SplitRoyalUser["1u"]}`;
    if (SplitRoyalUser["2u"] && !SplitRoyalPercentage["2p"])
      validateError[
        "2u"
      ] = ` Spilit Royalty Pecentage Require For ${SplitRoyalUser["2u"]}`;
    if (SplitRoyalUser["3u"] && !SplitRoyalPercentage["3p"])
      validateError[
        "3u"
      ] = ` Spilit Royalty Pecentage Require For ${SplitRoyalUser["3u"]}`;
    if (SplitRoyalUser["4u"] && !SplitRoyalPercentage["4p"])
      validateError[
        "4u"
      ] = ` Spilit Royalty Pecentage Require For ${SplitRoyalUser["4u"]}`;
    if (SplitRoyalUser["5u"] && !SplitRoyalPercentage["5p"])
      validateError[
        "5u"
      ] = ` Spilit Royalty Pecentage Require For ${SplitRoyalUser["5u"]}`;
    if (SplitRoyalPercentage["4p"] && !SplitRoyalUser["4u"])
      validateError[
        "4p"
      ] = ` Spilit Royalty User Require For ${SplitRoyalPercentage["4p"]}`;
    if (SplitRoyalPercentage["5p"] && !SplitRoyalUser["5u"])
      validateError[
        "5p"
      ] = ` Spilit Royalty User Require For ${SplitRoyalPercentage["5p"]}`;
      if(SplitRoyalUser["4u"] && (!SplitRoyalUser["4u"].toString().slice(0,2).includes('0x') || SplitRoyalUser["4u"].toString().length != 42)) 
      validateError[
        "4u"
      ] = ` Spilit Royalty User Must Be Ethereum Address`;
      if(SplitRoyalUser["5u"] && (!SplitRoyalUser["5u"].toString().slice(0,2).includes('0x') || SplitRoyalUser["5u"].toString().length != 42)) 
      validateError[
        "5u"
      ] = ` Spilit Royalty User Must Be Ethereum Address`;
    return validateError;
  };

  const FormSubmit = () => {
    if (Wallet_Details?.UserAccountAddr != Wallet_Details.Admin_Address) {
      SetBtn("admin");
      toast.error("Only Admin have Access To Transfer Token");
    } else {
      var val = validation();
      console.log("dsadsabdnsa", val);
      Setvalidate(val);
      if (Object.values(val).length == 0) {
        if (
          Object.values(SplitRoyalPercentage).reduce((item, accum) => {
            return Number(accum) + Number(item);
          }) == 100
        ) {
          SetBtn("process");
          if (AlreadyExits) {
            SetApp_Btn("done");
            SetMint_Btn("start");
          } else {
            SetApp_Btn("start");
          }
        } else {
          toast.error("Split Royalty Must Be Within 100%", { autoClose: 1500 });
          SetBtn("error");
        }
      } else {
        toast.error("Check Field", { autoClose: 1500 });
        SetBtn("errors");
      }
    }
  };

  const Approvecall = async () => {
    const id = toast.loading("Creating Meta Data");
    SetApp_Btn("process");
    var Resp = await ApproveCAll({
      TokenName: nft.TokenName,
      image: `/${nft.CollectionName}/${nft.image}`,
      Creator: nft.Creator,
      mime: `.${nft.image.toString().split(".")[1]}`,
      CollectionBio: nft.Description,
    });
    console.log("Resp", Resp);
    toast.update(id, {
      render: "Approved Successfully",
      type: "success",
      autoClose: 1000,
      isLoading: false,
    });
    if (Resp?.data) {
      SetIPFS(Resp.data);
      SetApp_Btn("done");
      SetMint_Btn("start");
    } else {
      toast.update(id, {
        render: "Try Again",
        type: "error",
        autoClose: 1000,
        isLoading: false,
      });
      SetApp_Btn("try");
    }
  };

  const Mintcall = async () => {
    SetMint_Btn("process");
    const id = toast.loading("Creating Meta Data");
    var web3 = new Web3(Wallet_Details.providers);
    console.log("dsadhjksahkdsahd", Royal);

    if (AlreadyExits) {
      var cont = await Transfer(
        Wallet_Details.UserAccountAddr,
        Wallet_Details.providers,
        nft.TokenOwner,
        nft?.TokenId,
        nft.Balance
      );
    } else {
    
      var cont = await Mint(
        Number(nft.CollectionType.includes("1155") ? 1155 : 721),
        String(nft.Balance) == String(nft.Quantity) ? true : false,
        Wallet_Details.UserAccountAddr,
        Wallet_Details.providers,
        config.IPFS_IMG + IPFS.MetaData,
        [nft.Creator, nft.TokenOwner],
        [
          nft.Balance,
          Number(nft.CollectionType.includes("1155") ? 1155 : 721),
          web3.utils.toWei(String(Royal)),
          "0",
          nft.Quantity,
        ],
        Object.values(SplitRoyalPercentage)
          .map((item) => {
            if (item != "") {
              return web3.utils.toWei(item.toString());
            }
          })
          .filter((item) => item != undefined || item != null),
        Object.values(SplitRoyalUser).filter((item) => item != ""),
        "data"
      );
    }
    console.log("cont", cont);
    if (cont) {
      let initialTokenValue = {
        TokenName: nft.TokenName,
        Category: nft.CollectionCategory,
        ContractAddress: nft.CollectionAddress,
        ContractType: String(nft.CollectionType).includes("1155") ? 1155 : 721,
        CollectionUrl: nft.CollectionUrl,
        Creator: nft.Creator,
        TokenQuantity: nft.Quantity,
        TokenBalance: nft.Balance,
        PutOnSale: false,
        Royalty: Royal,
        PutOnSaleType: "NotForSale",
        HashValue: cont.HashValue,
        TokenId: cont.tokenId.toString(),
        oldTokenid: nft.Id,
        OriginalFileIpfs: IPFS.OriginalFileIpfs,
        OriginalFile: IPFS.OriginalFile,
        CompressedFile: IPFS.CompressedFile,
        MetaData: IPFS.MetaData,
        MetFile: IPFS.MetFile,
        TokenOwner: nft.TokenOwner,
        TokenOwner_Name: nft.TokenOwner_Name,
        Creator_Name: nft.CreatedBy,
        CollectionName: nft.CollectionName,
        activity: "TransfersFiat",
        CollectionNetwork: nft.CollectionNetwork,
        click: `${config.FRONT_URL}/info/${nft.CollectionNetwork}/${
          nft.CollectionAddress
        }/${nft.TokenOwner}/${cont?.tokenId?.toString()}`,
        check: String(nft.CollectionType).includes("airdrop")
          ? "buywithpromo"
          : "buywithfiat",
        // promo : promo
        NPO_CustomUrl: nft.NPO_CustomUrl,
        ArtistUrl: nft.ArtistUrl,
      };
      let Resp = await CreateLazyMint(initialTokenValue);
      if (Resp.success == "success") {
        toast.update(id, {
          render: "Transfered Successfully",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        SetBtn("done");
        SetMint_Btn("done");
        push("/nftlist");
      } else {
        toast.update(id, {
          render: "Transaction Failed",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
        SetMint_Btn("try");
      }
    } else {
      toast.update(id, {
        render: "Transaction Failed",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      SetMint_Btn("try");
    }
  };

  return (
    <div className="row">
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">NFT Details</h4>
            <form className="forms-sample">
              <Form.Group>
                <label>NFT ID</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value={nft.TokenId}
                />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">NFT Name</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value={nft.TokenName}
                />
              </Form.Group>
              <Form.Group>
                <label htmlFor="exampleInputName1">NFT </label>
                <img
                  className="img-xs rounded-circle"
                  src={`${config.ImG}/admin/bulkimage/${nft.CollectionName}/${nft.image}`}
                  alt="profile"
                />
              </Form.Group>
             
              <Form.Group>
                <label>NFT Balance</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value={nft.Balance}
                />
              </Form.Group>
              <Form.Group>
                <label>NFT Royalty</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Enter Royalty"
                  disabled={AlreadyExits}
                  maxLength={2}
                  onChange={(e) => {
                    SetRoyal(NumberOnly(e.target.value))
                    SetBtn("start");
                    Setvalidate({})
                  }} value={Royal}
                />
                {validate.Royal && (
                  <div className="error_msg">{validate.Royal}</div>
                )}
              </Form.Group>
              <Form.Group>
                <label>NFT Creator</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value={nft.Creator}
                />
              </Form.Group>
              <Form.Group>
                <label>NFT Owner</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value={nft.TokenOwner}
                />
              </Form.Group>
              <Form.Group>
                <label>NFT Network</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value={nft.CollectionNetwork}
                />
              </Form.Group>
              <Form.Group>
                <label>NFT Type</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value={nft.CollectionType}
                />
              </Form.Group>
              <Form.Group>
                <label>Quantity</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value="1"
                />
              </Form.Group>
              <Form.Group>
                <label>Transaction Id</label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="exampleInputName1"
                  placeholder="Name"
                  value={nft.tx}
                />
              </Form.Group>
              <Form.Group>
                <label>Split Royalty</label>
              </Form.Group>
              <Form.Group>
                <label>Address</label>
                <label>%</label>
              </Form.Group>
              <Form.Group>
                <div
                  style={{ display: "flex", marginTop: 10 }}
                  className="col-6"
                >
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="1u"
                    placeholder="Name"
                    value={SplitRoyalUser["1u"]}
                    disable={true}
                  />
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="1p"
                    placeholder="Enter Spilit Royalty in Percentage"
                    maxLength="3"
                    value={SplitRoyalPercentage["1p"]}
                    onChange={onChangeData}
                    disabled={AlreadyExits}
                  />
                  
                </div>
                {validate["1u"] && (
                    <div className="error_msg">{validate["1u"]}</div>
                  )}
                <div
                  style={{ display: "flex", marginTop: 10 }}
                  className="col-6"
                >
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="2u"
                    placeholder="Name"
                    value={SplitRoyalUser["2u"]}
                    disable={true}
                  />
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="2p"
                    placeholder="Enter Spilit Royalty in Percentage"
                    value={SplitRoyalPercentage["2p"]}
                    maxLength="2"
                    disabled={AlreadyExits}
                    onChange={onChangeData}
                  />
                  
                </div>
                {validate["2u"] && (
                    <div className="error_msg">{validate["2u"]}</div>
                  )}
                <div
                  style={{ display: "flex", marginTop: 10 }}
                  className="col-6"
                >
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="3u"
                    placeholder="Name"
                    value={SplitRoyalUser["3u"]}
                    disable={true}
                  />
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="3p"
                    placeholder="Enter Spilit Royalty in Percentage"
                    maxLength="2"
                    value={SplitRoyalPercentage["3p"]}
                    disabled={AlreadyExits}
                    onChange={onChangeData}
                  />
                  
                </div>
                {validate["3u"] && (
                    <div className="error_msg">{validate["3u"]}</div>
                  )}
                <div
                  style={{ display: "none", marginTop: 10 }}
                  className="col-6"
                  id="fourthdiv"
                >
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="4u"
                    placeholder="Enter Ethereum Address"
                    value={SplitRoyalUser["4u"]}
                    disable={AlreadyExits}
                    onChange={onChangeData}
                  />
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="4p"
                    placeholder="Enter Spilit Royalty in Percentage"
                    maxLength="2"
                    value={SplitRoyalPercentage["4p"]}
                    disabled={AlreadyExits}
                    onChange={onChangeData}
                  />
                  {validate["4p"] && (
                    <div className="error_msg">{validate["4p"]}</div>
                  )}
                  {validate["4u"] && (
                    <div className="error_msg">{validate["4u"]}</div>
                  )}
                </div>
                <div
                  style={{ display: "none", marginTop: 10 }}
                  className="col-6"
                  id="fivediv"
                >
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="5u"
                    placeholder="Enter Ethereum Address"
                    value={SplitRoyalUser["5u"]}
                    disable={AlreadyExits}
                    onChange={onChangeData}
                  />
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="5p"
                    placeholder="Enter Spilit Royalty in Percentage"
                    disabled={AlreadyExits}
                    value={SplitRoyalPercentage["5p"]}
                    maxLength="2"
                    onChange={onChangeData}
                  />
                  {validate["5p"] && (
                    <div className="error_msg">{validate["5p"]}</div>
                  )}
                  {validate["5u"] && (
                    <div className="error_msg">{validate["5u"]}</div>
                  )}
                </div>

                {Object.values(SplitRoyalPercentage).reduce((accum, redu) => {
                  return Number(accum) + Number(redu);
                }) < 100 && (
                  <div
                    style={{ marginTop: 10, display: "flex" }}
                    className="col-6"
                    id="btnvlo"
                  >
                    <Button
                      onClick={() =>
                        document.getElementById("fourthdiv").style.display ==
                        "none"
                          ? (document.getElementById(
                              "fourthdiv"
                            ).style.display = "flex")
                          : (document.getElementById("fivediv").style.display =
                              "flex") &&
                            (document.getElementById("btnvlo").style.display =
                              "none")
                      }
                    >
                      Add
                    </Button>
                  </div>
                )}
              </Form.Group>
              {Btn == "error" && (
                <div className="error_msg">Royalty Must be 100%</div>
              )}
            </form>

            <Button
              disabled={
                Btn == "admin" || Btn == "process" || Btn == "done"
                  ? true
                  : false
              }
              onClick={() =>
                Btn == "start" || Btn == "try" ? FormSubmit() : false
              }
            >
              {(Btn == "start" && "mintcall") ||
                (Btn == "admin" && "Access Denied") ||
                (Btn == "process" && "In-Progress") ||
                (Btn == "try" && "Try-Again") ||
                (Btn == "done" && "Done") ||
                (Btn == "error" && "Royalty Error") ||
                (Btn == "errors" && " Error")}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={Btn == "process" ? true : false}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="steps_to_follow">
          <div className="title_close">
            <h2>Steps to follow</h2>
            <button onClick={() => SetBtn("start")}>x</button>
          </div>
          {!AlreadyExits && (
            <div className="upload">
              <h3>
                Upload a file
                <p>Upload File To Cloud</p>
              </h3>
              <Button
                disabled={
                  App_Btn == "admin" ||
                  App_Btn == "process" ||
                  App_Btn == "done"
                    ? true
                    : false
                }
                onClick={() =>
                  App_Btn == "start" || App_Btn == "try" ? Approvecall() : false
                }
              >
                {(App_Btn == "start" && "Start") ||
                  (App_Btn == "init" && "Start") ||
                  (App_Btn == "process" && "In-Progress") ||
                  (App_Btn == "try" && "Try-Again") ||
                  (App_Btn == "done" && "Done")}
              </Button>
            </div>
          )}
          <div className="upload">
            {AlreadyExits ? (
              <h3>
                Transfer<p>Transfer An Token</p>
              </h3>
            ) : (
              <h3>
                Mint<p>Minting An Token</p>
              </h3>
            )}
            <Button
              disabled={
                !App_Btn == "done" ||
                Mint_Btn == "admin" ||
                Mint_Btn == "process" ||
                Mint_Btn == "done"
                  ? true
                  : false
              }
              onClick={() =>
                Mint_Btn == "start" || Mint_Btn == "try" ? Mintcall() : false
              }
            >
              {(Mint_Btn == "start" && "Start") ||
                (Mint_Btn == "init" && "Start") ||
                (Mint_Btn == "process" && "In-Progress") ||
                (Mint_Btn == "try" && "Try-Again") ||
                (Mint_Btn == "done" && "Done")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NftDetail;
