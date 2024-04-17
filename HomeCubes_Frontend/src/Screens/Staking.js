import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import SideTab from "../Components/SideTab";
import Countdown from "react-countdown";
import DataCard from "../Components/DataCard";
import Footer from "../Components/Footer";
import ReactSearchBox from "react-search-box";
import BottomBar from "../Components/BottomBar";
import Select from "react-select";
import { nftcard } from '../datas/CardData'
import BreadPath from "../Components/BreadPath";
import RewardsModal from "../Modals/RewardsModal";
import { Token_MyList_Func, createProject } from "../actions/axioss/user.axios";
import { useSelector } from 'react-redux'
import { stackFunction } from "../actions/axioss/nft.axios";
import StakeModal from "../Modals/StakeModal";
import { toast } from 'react-toastify'
import { calculateStakingDaysPassed, getDaysOfDesiredMonth, isEmpty } from "../actions/common";
import useContractProviderHook from "../actions/contractProviderHook";
import { network } from "../config/network";
import Web3 from "web3";
import useThirdWeb from "../actions/useThirdWeb";

function Staking() {

  const { accountAddress } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );
  const { payload } = useSelector((state) => state.LoginReducer.User);

  const [showData, setShowData] = useState({})
  const [activeTab, setAtciveTab] = useState("staking");
  const [mobSearch, setMobSearch] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [cnctWallet, setCnctWallet] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState({})
  const [projectArr, setProjectArr] = useState([])
  const [rewardOption, setRewardOption] = useState({});
  const [pendingReward, setPendingReward] = useState(0)
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardDetail, setRewardDetail] = useState({});
  const [nftCounts, setNftCounts] = useState({});
  const [Loadmore, setLoadMore] = useState(true)
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ value: "All", label: "All" });
  const [searchValue, setSearchValue] = useState("")

  const contract = useContractProviderHook()
  const handleCloseWallet = () => setCnctWallet(false)
  const handleOpebWallet = () => setCnctWallet(true)

  const [dataCard, setDataCard] = useState([]);
  console.log("showData", showData, nftCounts);
  const [wallet, setWallet] = useState(false)

  const [options, setOptions] = useState([
    { label: "Season 1", value: "Season 1", },
    { label: "Season 2", value: "Season 2", },
    { label: "Season 3", value: "Season 3", }
  ])

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
      backgroundColor: "#000 ",
      // border: "1px solid rgba(34, 34, 34, 0.32)",
      borderRadius: 5,
      fontSize: "13px",
    }),
    control: (provided, state) => ({
      ...provided,
      height: "40px",
      borderRadius: 5,
      // backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      position: "absolute",
      right: 0,
      top: 0,
      color: "#6C6A81",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#6C6A81",
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  const [canReload, setCanReload] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!canReload) {
        const confirmationMessage = 'Do Not Refresh!';
        event.preventDefault();
        event.returnValue = confirmationMessage; // For Chrome
        return confirmationMessage; // For Safari
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [canReload]);

  useEffect(() => {
    const getData = [
      { label: "90 days", value: "Season 1", poolId: 1, daysDifference: getDaysOfDesiredMonth(3).days, endDateFormat: getDaysOfDesiredMonth(3).dateFormat, startDate: getDaysOfDesiredMonth(3).startDate, poolDay: getDaysOfDesiredMonth(3).newStartDate },
      { label: "190 days", value: "Season 2", poolId: 2, daysDifference: getDaysOfDesiredMonth(6).days, endDateFormat: getDaysOfDesiredMonth(6).dateFormat, startDate: getDaysOfDesiredMonth(6).startDate, poolDay: getDaysOfDesiredMonth(6).newStartDate },
      { label: "360 days", value: "Season 3", poolId: 3, daysDifference: getDaysOfDesiredMonth(12).days, endDateFormat: getDaysOfDesiredMonth(12).dateFormat, startDate: getDaysOfDesiredMonth(12).startDate, poolDay: getDaysOfDesiredMonth(12).newStartDate }
    ]
    const set = getData.filter((val) => val.daysDifference)[0]
    console.log("seifuhseoif", set);
    setRewardDetail(set)
  }, [])


  const [selectedOptionOne, setSelectedOptionOne] = useState(null);
  const getThirdweb =useThirdWeb()

  const optionsOne = [
    { value: "staked", label: "Staked" },
    { value: "not-staked", label: "Non - Staked" },
    { value: "All", label: "All" }
  ];


  useEffect(() => {
    createProject({ action: "getProjects" })
      .then((val) => {
        setProjectArr(val.data ?? [])
      })
      .catch((e) => {
        console.log(" erro on getProjects", e);
      })
  }, [])


  const stylesgraybgOne = {
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
      width: "40px",
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
      width: "150px",
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
      color: "#16EBC3",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      width: "20px",
      position: "absolute",
      right: 0,
      top: 0,
      color: "#16EBC3",
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    getNfts();
    getRewardDetails()
  }, [accountAddress]);

  useEffect(() => {
    if (rewardOption?.projectId && rewardOption?.Season) onSelectChange();
  }, [rewardOption])

  useEffect(() => {
    getNfts(1, true)
  }, [filter.value, searchValue])

  const getNfts = async (value, empty) => {
    var SendDATA = {
      TabName: "owned",
      limit: 8,
      CustomUrl: accountAddress,
      NFTOwner: accountAddress,
      page: value ? value : page,
      filter: "LatestDrops",
      filterValue: filter.value,
      searchValue: searchValue,
      from: 'myItem',
      cursor: ""
    }
    let Resp = await Token_MyList_Func(SendDATA);
    console.log("RespRespRespResp", Resp, SendDATA);

    if (empty) { setPage(1); setDataCard(Resp?.data ?? []); }
    else setDataCard([...dataCard, ...Resp?.data ?? []]);

    if (Resp?.data?.length < 8 || Resp?.success == "error") setLoadMore(false);
    else setLoadMore(true)
  }

  const onStackNft = async (e) => {
    if (isEmpty(selectedPlan)) return toast.error("Please select pool")
    const id = toast.loading("Staking... Do not refresh!")

    // const stake = await contract.getStackPools()

    const checkApprove = await contract.getStackApproveStatus(showData.ContractAddress)
    console.log("checkApprove", checkApprove);
    console.log("showData", showData);
    if (!checkApprove) {
      const apId = toast.loading("Need to approve")
      setCanReload(false)
      // const setAppove = await contract.setApproveForStack(showData.ContractAddress);
      const setAppove = await getThirdweb.useContractCall("setApprovalForAll", 0, "stake", showData.ContractAddress, true);

      setCanReload(true)

      if (!setAppove.status) {

        toast.update(id, {
          render: "Staking failed",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        })

        return toast.update(apId, {
          render: "Approve failed",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        })
      } else toast.update(apId, {
        render: "Approved successfully",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      })
    }
    setCanReload(false)
    // const stake = await contract.nftStakingAndWithdrawAndClaim("nftStack", showData.NFTId, selectedPlan?.poolId, showData.ContractAddress);
    const stake = await getThirdweb.useContractCall("nftStack", 0, "stake", showData.NFTId, selectedPlan?.poolId, showData.ContractAddress, "2500000000000000000");
    
    setCanReload(true)
    if (!stake.status) return toast.update(id, {
      render: "Token not staked",
      type: "error",
      isLoading: false,
      autoClose: 1000,
    });

    const sendData = {
      action: "setStack",
      NFTId: showData.NFTId,
      walletAddress: accountAddress,
      poolId: selectedPlan?.poolId,
      startDate: selectedPlan?.startDate,
      endDate: selectedPlan?.endDateFormat,
      totalStakeDays: selectedPlan?.days,
      Season: selectedPlan?.value,
      projectId: showData.projectId
    }
    console.log("sendData", sendData);
    setCanReload(false)
    const Resp = await stackFunction(sendData);
    setCanReload(true)
    console.log("RespResp", Resp);
    toast.update(id, {
      render: "Staked Successfully",
      type: "success",
      isLoading: false,
      autoClose: 1000,
    });
    setShowModal(false)
    setSelectedPlan({})
    getNfts(1, true)
  }

  const onSelectChange = async () => {
    const Resp = await stackFunction({ action: "getProjectRewardDetail", ...rewardOption, walletAddress: accountAddress });
    setPendingReward(Resp?.pendingReward ?? 0)
  }

  const getRewardDetails = async () => {
    const Resp = await stackFunction({ action: "getRewardByWalletAddress", walletAddress: accountAddress });
    console.log("ResponSelectChange", Resp);
    setRewardAmount(Resp?.rewardClaimed ?? 0)
    setNftCounts(Resp?.totalDetails)
  }

  const LoadMore = () => {
    setPage(page + 1)
    getNfts(page + 1);
  }

  const onWithdraw = async (nftObj) => {
    const id = toast.loading("Token withdrawing... Do not refresh!")
    const params = { action: "getStake", walletAddress: accountAddress, NFTId: nftObj.NFTId, }
    const getStake = await stackFunction(params);
    console.log("getStake", getStake, params);
    if (getStake?.success == "success") {
      setCanReload(false)
      // const unStake = await contract.nftStakingAndWithdrawAndClaim("nftWithdraw", nftObj.NFTId, getStake?.data?.poolId, nftObj.ContractAddress);
      const unStake = await getThirdweb.useContractCall("nftWithdraw", 0, "stake", nftObj.NFTId, getStake?.data?.poolId, nftObj.ContractAddress, "2500000000000000000");
      console.log("unStake", unStake);
      setCanReload(true)
      if (unStake.status) {
        setCanReload(false)
        const Resp = await stackFunction({ action: "onWithdraw", walletAddress: accountAddress, NFTId: nftObj.NFTId });
        setCanReload(true)
        if (Resp?.success == "success") {
          setTimeout(() => {
            window.location.reload()
          }, 1000)
          toast.update(id, {
            render: "Token unstaked",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
        } else {
          toast.update(id, {
            render: "Token not unstaked",
            type: "error",
            isLoading: false,
            autoClose: 1000,
          });
        }

      } else {
        toast.update(id, {
          render: "Token not unstaked",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
      }
    }


  }



  const onClaimReward = async () => {
    if (isEmpty(pendingReward)) return toast.error("Don't have a reward")
    const id = toast.loading("Reward claiming... Do not refresh!");
    setCanReload(false)
    // const unStake = await contract.nftStakingAndWithdrawAndClaim("claimReward", Web3.utils.toWei(String(pendingReward)));
    const unStake = await getThirdweb.useContractCall("claimReward", 0, "stake", Web3.utils.toWei(String(pendingReward)),payload?.parentAddress, "2500000000000000000");

    setCanReload(true)
    if (!unStake.status) return toast.update(id, {
      render: "Error in claim",
      type: "error",
      isLoading: false,
      autoClose: 1000,
    });
    setCanReload(false)
    const Resp = await stackFunction({ action: "onClaimReward", walletAddress: accountAddress, projectId: rewardOption?.projectId, Season: rewardOption?.Season, Hash: unStake?.HashValue });
    setCanReload(true)
    if (Resp?.success == "success") toast.update(id, {
      render: "Reward claimed",
      type: "success",
      isLoading: false,
      autoClose: 1000,
    });
    else toast.update(id, {
      render: "Error in claim",
      type: "error",
      isLoading: false,
      autoClose: 1000,
    });
    onSelectChange()
    getRewardDetails()
  }

  return (
    <>
      <BottomBar />
      <Header />
      <Container fluid className="pt-3 home_wrapper">
        <Container className="custom_container">
          <Row>
            <Col lg={1} md={2} className="sidetab_holder">
              <SideTab />
            </Col>
            <Col lg={11} md={10} sm={12} xs={12} className="res_pad_aligner mt-4">
              {/* <BreadPath/> */}
              <Row className="timer_row ">
                <Col lg={9}>
                  <h3 className="lorem_title">Lorem ipsum dolor</h3>
                  <Row className="counter_row justify-content-center">
                    <Col xl={4} lg={6} md={6} sm={6} xs={12} className="mb-3">
                      <div className="stack_nftcounter">
                        <p className="nftcounter_lable">Number of NFTs :</p>
                        <p className="nftcounter_value">{nftCounts?.totalNfts}</p>
                      </div>
                    </Col>
                    <Col xl={4} lg={6} md={6} sm={6} xs={12} className="mb-3">
                      <div className="stack_nftcounter">
                        <p className="nftcounter_lable">
                          Number of Staked NFTs :
                        </p>
                        <p className="nftcounter_value">{nftCounts?.isStaked}</p>
                      </div>
                    </Col>
                    <Col xl={4} lg={6} md={6} sm={6} xs={12} className="mb-3">
                      <div className="stack_nftcounter">
                        <p className="nftcounter_lable">
                          Number of non-staked NFTs :
                        </p>
                        <p className="nftcounter_value">{nftCounts?.isNotStaked}</p>
                      </div>
                    </Col>
                  </Row>

                  <Row className="timer_row">
                    <Col lg={6}>
                      <div className="hr_aligner">
                        <hr className="radiant_hr" />
                      </div>
                      <div className="stack_dateholder">
                        <p className="stack_datehint">
                          Next Reward Distribution Date:
                        </p>
                        <p className="stack_datevalue">{new Date(rewardDetail?.endDateFormat).toLocaleDateString()}</p>
                      </div>
                      <div className="stack_countdown">
                        <Countdown date={new Date(rewardDetail?.endDateFormat)} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col lg={12}>
                  <div className="stck_nftwrapper">
                    <Row className="justify-content-center">
                      <Col lg={4} md={8} sm={10} xs={12}>
                        <Row className="top_reltab">
                          <Col lg={6} xs={6} className="reltab_holder">
                            <div
                              className={
                                activeTab == "staking"
                                  ? "active stacking_tab"
                                  : "stacking_tab"
                              }
                              onClick={() => setAtciveTab("staking")}
                            >
                              <img
                                className="top_reltabimg"
                                src={
                                  require("../assets/images/whitestack.svg")
                                    .default
                                }
                              />
                              <p className="top_reltablabel">Staking</p>
                            </div>
                          </Col>
                          <Col lg={6} xs={6} className="reltab_holder">
                            <div
                              className={
                                activeTab == "rewards"
                                  ? "active stacking_tab"
                                  : "stacking_tab"
                              }
                              onClick={() => setAtciveTab("rewards")}
                            >
                              <img
                                className="top_reltabimg"
                                src={
                                  require("../assets/images/rewards.svg")
                                    .default
                                }
                              />
                              <p className="top_reltablabel">Rewards</p>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {activeTab == "staking" ? (
                      <>
                        <Row className="justify-content-between mt-2">
                          <Col lg={4} md={6} sm={6} xs={12}>
                            <div
                              className={
                                mobSearch
                                  ? "stack_searchbar"
                                  : " stack_searchbar stack_searchbarhider"
                              }
                            >
                              <div className="d-flex justify-content-start align-items-center">
                                <img
                                  className="searchglass"
                                  src={
                                    require("../assets/images/searchglass.svg")
                                      .default
                                  }
                                />
                                <input type='text' className='stack_search' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Search...' />
                                {/* <ReactSearchBox
                                  placeholder="Search..."
                                  value="Doe"
                                  data={data}
                                  callback={(record) => console.log(record)}
                                /> */}
                              </div>
                              <i
                                class="fa-solid fa-xmark search_closer"
                                onClick={() => setMobSearch(false)}
                              />
                            </div>

                            <div
                              className={
                                mobSearch ? "d-none" : " stack_searchbarmob"
                              }
                              onClick={() => setMobSearch(true)}
                            >
                              <img
                                className="searchglass"
                                src={
                                  require("../assets/images/searchglass.svg")
                                    .default
                                }
                              />
                            </div>
                          </Col>
                          <Col
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            className="d-flex justify-content-end"
                          >
                            {/* <Dropdown className="stack_dropdown">
                              <Dropdown.Toggle
                                variant="dark"
                                id="dropdown-basic"
                              >
                                All NFTs{" "}
                                <i class="fa-solid fa-angle-down ms-2"></i>
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">
                                  Action
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-2">
                                  Another action
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-3">
                                  Something else
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown> */}

                            <Select
                              className="border_select"
                              placeholder="Select status"
                              styles={stylesgraybgOne}
                              value={filter}
                              options={optionsOne}

                              onChange={(e) => setFilter(e)}
                            />
                          </Col>
                        </Row>

                        <Row className="nftcard_wrap">
                          {dataCard?.map((i) => (
                            <Col
                              xl={3}
                              lg={4}
                              md={6}
                              sm={6}
                              xs={12}
                              className="mb-3"
                            >
                              <DataCard data={i} setShowData={setShowData} setShowModal={setShowModal} onWithdraw={onWithdraw} />
                            </Col>
                          ))}

                          {Loadmore &&
                            <div className='loadmore_holder'><button className="seconday_btn width_fitter" onClick={() => LoadMore()} >Loadmore</button>
                            </div>}
                        </Row>
                      </>
                    ) : (
                      <>
                        {accountAddress ? (
                          <Row className="justify-content-center">
                            <Col lg={8}>
                              <h3 className="lorem_title">
                                Total Rewards Received {rewardAmount.toFixed(7)} BNB
                              </h3>
                              <Row className="select_holder">
                                <Col lg={5}>
                                  <Select
                                    className="border_select"
                                    placeholder="Project"
                                    styles={stylesgraybg}
                                    // defaultValue={selectedOption}
                                    onChange={(e) => setRewardOption({ ...rewardOption, projectId: e._id })}
                                    options={projectArr}
                                  />
                                </Col>
                                <Col lg={5}>
                                  <Select
                                    className="border_select"
                                    placeholder="Quarter"
                                    styles={stylesgraybg}
                                    onChange={(e) => setRewardOption({ ...rewardOption, Season: e.value })}
                                    // defaultValue={selectedOption}
                                    // onChange={setSelectedOption}
                                    options={options}
                                  />
                                </Col>
                              </Row>
                              <div className="d-flex justify-content-center mt-4">
                                <button className="header_gradientBtn stack_submitbtn" onClick={() => onClaimReward()} >
                                  Submit
                                </button>
                              </div>
                              <Row className="justify-content-center mt-3">
                                <Col lg={5}>
                                  <div className="stack_pendingholder">
                                    <p className="stack_pendinghint">
                                      Pending Rewards {pendingReward} BNB
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        ) : (
                          <Row className="justify-content-center mb-5">
                            <Col lg={8}>
                              <div className="staking_nowallet">
                                <h3 className="lorem_title staking_nowalc">
                                  Pending Rewards :
                                </h3>
                                <button
                                  className="stack_cnctwallet"
                                  onClick={() => handleOpebWallet()}
                                >
                                  <img
                                    className="header_wallet"
                                    src={
                                      require("../assets/images/wallet.svg")
                                        .default
                                    }
                                  />{" "}
                                  Connect - wallet
                                </button>
                              </div>
                            </Col>
                          </Row>
                        )}
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <Footer />
      </Container>
      <div className='gradient_holder staking_gradholder'></div>

      <StakeModal setSelectedPlan={setSelectedPlan} onStackNft={onStackNft} show={showModal} handleClose={() => setShowModal(false)} />
      {/* modal */}
      <RewardsModal show={cnctWallet} handleClose={handleCloseWallet} setWallet={setWallet} />
      {/* end of modal */}
    </>
  );
}

export default Staking;
