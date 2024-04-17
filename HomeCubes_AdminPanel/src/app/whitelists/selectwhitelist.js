import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "react-bootstrap/Card";
import { addwhitelists } from "../../axioscalls/admin";
import config from "../../lib/config";
import useContractHook from "../../contract/contract";
import web3 from "web3";
import { Buymint, onInitialMint } from "../../axioscalls/token";
import whitelist from "../../assets/images/whitelist.webp";

function Selectwhitelist() {
  const history = useHistory();
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
      color: "#6C6A81",
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
  const [projectArr, setProjectArr] = useState([]);
  const [rewardOption, setRewardOption] = useState({});
  const [projectdata, setprojectdata] = useState([]);
  const [nft, setNft] = useState({});

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1];
  console.log("pathname,stae", pathname, state, path);

  const contract = useContractHook();

  useEffect(() => {
    addwhitelists({ action: "getProjectsoption" })
      .then((val) => {
        setProjectArr(val.data ?? []);
      })
      .catch((e) => {
        console.log(" erro on getProjectsoption", e);
      });
  }, []);

  const handleChange = async (data) => {
    var dataproject = {
      projecttitle: data,
      action: "getAll",
    };

    console.log("dataprojectss", dataproject);
    var resp = await addwhitelists(dataproject);
    console.log("resssspppp", resp.data);
    setprojectdata(resp.data);
  };

  const onSubmit = async () => {
    console.log("nfftt", nft);
    const id = toast.loading("Transfering token");
    const params = {
      NFTId: nft?.NFTId,
      mintCount: 1,
    };
    console.log("paramsms", params);
    const initialMint = await onInitialMint(params);
    console.log("initial min", initialMint);
    console.log(
      "checkkk ",
      1,
      721,
      "BNB",
      web3.utils.toWei(nft?.NFTPrice.toString()),
      // initialMint?.MetaData,
      "Praveen",
      [1, web3?.utils.toWei(nft?.NFTRoyalty)],
      [state?.walletAddress, nft?.ContractAddress]
    );

    const hash = await contract.adminlazyminting_721_1155(
      1,
      721,
      "BNB",
      web3.utils.toWei(nft?.NFTPrice.toString()),
      initialMint?.MetaData,
      [1, web3?.utils.toWei(nft?.NFTRoyalty)],
      [state?.walletAddress, nft?.ContractAddress]
    );
    console.log("rtret3e3", hash);
    if (hash.status) {
      const changedToken = await Promise.all(
        initialMint.data.map((val, i) => {
          val.NFTId = hash?.Tokenid[i];
          val.Hash = hash.HashValue;
          val.isMinted = true;

          return val;
        })
      );

      console.log("changedToken", changedToken);
      let update = {
        NFTOwner: state?.walletAddress,
        HashValue: hash.HashValue,
        changedToken,
        NFTPrice: nft?.NFTPrice,
        CoinName: config.COIN_NAME,
        isWhiteList: true,
      };
      console.log("update", update);
      let Resp = await Buymint(update);
      console.log("Resppppppsppsps dta", Resp);
      if (Resp.status) {
        toast.update(id, {
          render: "Token Transfered Successfully",
          type: "success",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
        });
        setTimeout(() => {
          history.goBack();
        }, 1000);
      } else {
        toast.update(id, {
          render: "Token Transaction Failed",
          type: "error",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
        });
      }
    } else {
      toast.update(id, {
        render: "Token Transaction Failed",
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Row className="select_holder">
                <Col lg={12}>
                  <p className="mb-2">Select Whitelist</p>
                  <Select
                    className="border_select"
                    placeholder="Project"
                    styles={stylesgraybg}
                    // defaultValue={selectedOption}
                    onChange={(e) => {
                      setRewardOption({
                        ...rewardOption,
                        projectsTitle: e._id,
                      });
                      handleChange(e._id);
                    }}
                    options={projectArr}
                  />
                </Col>
              </Row>
              <div className="row gallery_img_sec mt-4">
                {projectdata.map((val) => (
                  <>
                    {/* {console.log("vvvlalllal", val.NFTName, val)} */}
                    <div className="col-xl-4 col-xxl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
                      <Card className="whitelist_card_custom">
                        <Card.Body>
                          <Card.Title>{val.NFTName}</Card.Title>

                          <Card.Text>
                            <div
                              className="whitelist_img_sec"
                              onClick={() => {
                                handleShow();
                                setNft(val);
                              }}
                            >
                              {/* <p className="mb-2 text-center">{val.NFTName}</p> */}
                              {val.CompressedFile && (
                                <img
                                  src={
                                    val.CompressedFile ? (
                                      typeof val.CompressedFile == "object" ? (
                                        window.URL.createObjectURL(
                                          val.CompressedFile
                                        )
                                      ) : (
                                        `${config.ImG}/nft/${val?.NFTCreator}/Original/${val.NFTOrginalImage}`
                                      )
                                    ) : (
                                      <></>
                                    )
                                  }
                                  // `${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Original/${Tokens_Detail.OriginalFile}`
                                  //   style={{ height: 100, width: 100 }}
                                />
                              )}
                            </div>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  </>
                ))}
              </div>

              <Modal
                show={show}
                onHide={handleClose}
                centered
                className="wallet_details"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Wallet Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="body_sec">
                    <Card className="white_modal mb-3">
                      <Card.Body className="px-3 py-3">
                        <div className="d-flex align-items-center justify-content-center flex-column">
                          <div className="whitemodal_img_sec">
                            <img
                              src={`${config.ImG}/nft/${nft?.NFTCreator}/Original/${nft?.NFTOrginalImage}`}
                              alt="whitelist"
                            />
                            {/* <p className="mb-0 mt-3 text-center">Wooden House</p> */}
                          </div>
                          <Card.Title className="mb-0 mt-3">
                            {nft?.NFTName}
                          </Card.Title>
                        </div>
                        {/* <Card.Title className="mb-0">Wooden House</Card.Title> */}
                      </Card.Body>
                    </Card>

                    <div className="mb-3">
                      <p className="mb-0">Wallet Address</p>
                      <p className="mb-0 val">{state?.walletAddress}</p>
                    </div>
                    <div className="mb-3">
                      <p className="mb-0">Email</p>
                      <p className="mb-0 val">{state?.gmail}</p>
                    </div>
                    <div>
                      <p className="mb-0">Description</p>
                      <p className="mb-0 val">{nft?.NFTDescription}</p>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    className="cmn_close_btn"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    className="allbtn"
                    onClick={onSubmit}
                  >
                    Send
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Selectwhitelist;
