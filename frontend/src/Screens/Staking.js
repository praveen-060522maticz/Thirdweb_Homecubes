import React, { useEffect, useRef, useState } from "react";
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
import { setPendingTransaction, stackFunction } from "../actions/axioss/nft.axios";
import StakeModal from "../Modals/StakeModal";
import { toast } from 'react-toastify'
import { calculateStakingDaysPassed, generateSeasonOptions, getDaysOfDesiredMonth, isEmpty } from "../actions/common";
import useContractProviderHook from "../actions/contractProviderHook";
import { network } from "../config/network";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import web3utils from 'web3-utils';
import { useWallets } from "@privy-io/react-auth";
import Prompt from "../Components/Prompt";

import totalnft from '../assets/images/totalnft.svg'
import totalrewards from '../assets/images/totalreward.svg'


function Staking() {

  const { accountAddress } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );
  const { payload } = useSelector((state) => state.LoginReducer.User);
  const { gasFee } = useSelector((state) => state.LoginReducer.User);

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
  const [isFixed, setIsFixed] = useState(true);
  const footerRef = useRef(null);

  const contract = useContractProviderHook()
  const handleCloseWallet = () => setCnctWallet(false)
  const handleOpebWallet = () => setCnctWallet(true)

  const [dataCard, setDataCard] = useState([]);
  console.log("showData", showData, nftCounts);
  const [wallet, setWallet] = useState(false);
  const push = useNavigate();

  const [options, setOptions] = useState([
    { label: "Season 1", value: "Season 1", },
    { label: "Season 2", value: "Season 2", },
    { label: "Season 3", value: "Season 3", },
    { label: "Season 4", value: "Season 4", },
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
      backgroundColor: "transparent ",
      // border: "1px solid rgba(34, 34, 34, 0.32)",
      borderRadius: 5,
      fontSize: "13px",
    }),
    control: (provided, state) => ({
      ...provided,
      height: "100%",
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
      color: "#6C6A81",
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

  const [canReload, setCanReload] = useState(true);
  const { wallets } = useWallets();
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (!canReload) {
  //       const confirmationMessage = 'Do Not Refresh!';
  //       event.preventDefault();
  //       event.returnValue = confirmationMessage; // For Chrome
  //       return confirmationMessage; // For Safari
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [canReload]);
  const [years, setYears] = useState([]);


  useEffect(() => {
    const getData = [
      { label: "30 days", value: "Season 1", poolId: 1, daysDifference: getDaysOfDesiredMonth(3).days, endDateFormat: getDaysOfDesiredMonth(3).dateFormat, startDate: getDaysOfDesiredMonth(3).startDate, poolDay: getDaysOfDesiredMonth(3).newStartDate },
      { label: "60 days", value: "Season 2", poolId: 2, daysDifference: getDaysOfDesiredMonth(6).days, endDateFormat: getDaysOfDesiredMonth(6).dateFormat, startDate: getDaysOfDesiredMonth(6).startDate, poolDay: getDaysOfDesiredMonth(6).newStartDate },
      { label: "180 days", value: "Season 3", poolId: 3, daysDifference: getDaysOfDesiredMonth(9).days, endDateFormat: getDaysOfDesiredMonth(9).dateFormat, startDate: getDaysOfDesiredMonth(9).startDate, poolDay: getDaysOfDesiredMonth(9).newStartDate },
      { label: "360 days", value: "Season 4", poolId: 4, daysDifference: getDaysOfDesiredMonth(12).days, endDateFormat: getDaysOfDesiredMonth(12).dateFormat, startDate: getDaysOfDesiredMonth(12).startDate, poolDay: getDaysOfDesiredMonth(12).newStartDate }
    ]
    console.log('getDatsdagetData---->', getData);
    const set = getData.filter((val) => val.daysDifference)[0]
    console.log("seifuhseoif", set);
    setRewardDetail(set)
  }, [])


  const [selectedOptionOne, setSelectedOptionOne] = useState(null);

  const optionsOne = [
    { value: "staked", label: "Staked" },
    { value: "not-staked", label: "Non - Staked" },
    { value: "All", label: "All" }
  ];


  useEffect(() => {
    const seasonOptions = generateSeasonOptions(2024, 2080);
    setYears(seasonOptions)
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
      width: "230px",
      borderRadius: 5,
      backgroundColor: isHovered
        ? "transperant"
        : isSelected
          ? "transperant"
          : isFocused
            ? "transperant"
            : "transperant",
      backgroundColor: "#080808B2",
      border: "1px solid #525252",
      outline: "none",
      boxShadow: "none",
      color: "#16EBC3",

    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      width: "unset",
      position: "absolute",
      right: 0,
      top: 0,
      color: "#16EBC3",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff",
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
      border: "1px solid #16EBC3"
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
    if (rewardOption?.projectId && rewardOption?.Season && rewardOption?.year) onSelectChange();
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

    const checkApprove = await contract.getStackApproveStatus(showData.ContractAddress, wallets[0])
    console.log("checkApprove", checkApprove);
    console.log("showData", showData);
    if (!checkApprove) {
      const apId = toast.loading("Need to approve")
      setCanReload(false)
      const setAppove = await contract.setApproveForStack(wallets[0], showData?.ContractAddress);
      // const setAppove = await getThirdweb.useContractCall("setApprovalForAll", 0, "stake", showData.ContractAddress, true);
      // const setAppove = await contract.gasLessTransaction("setApprovalForAll", 0, "stake", wallets[0], showData.ContractAddress, true);

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
    const TStamp = Date.now()
    const stake = await contract.nftStakingAndWithdrawAndClaim(wallets[0], "nftStack", showData.NFTId, selectedPlan?.poolId, showData.ContractAddress);
    // const stake = await getThirdweb.useContractCall("nftStack", 0, "stake", showData.NFTId, selectedPlan?.poolId, showData.ContractAddress, gasFee?.collectAddress, "2500000000000000000");
    // const stake = await contract.gasLessTransaction("nftStack", 0, "stake", wallets[0], showData.NFTId, selectedPlan?.poolId, showData.ContractAddress, TStamp, gasFee?.collectAddress, "2500000000000000000");

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
    let pendingObj = {
      From: accountAddress,
      method: "nftStack",
      params: [sendData],
      TimeStamp: TStamp
    }
    const Resp = stake.status == "pending" ? await setPendingTransaction(pendingObj) : await stackFunction(sendData);

    if (stake?.status == "pending") {
      toast.update(id, {
        render:
          <div>
            <p className="mb-0">Staking is pending...</p>
            <p className="mb-0">Please check after some time!</p>
          </div>,
        type: 'warning', isLoading: false, autoClose: 1500, closeButton: true, closeOnClick: true
      });
      return push("/")
    }

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
      const TStamp = Date.now()
      const unStake = await contract.nftStakingAndWithdrawAndClaim(wallets[0], "nftWithdraw", nftObj.NFTId, getStake?.data?.poolId, nftObj.ContractAddress);
      // const unStake = await getThirdweb.useContractCall("nftWithdraw", 0, "stake", nftObj.NFTId, getStake?.data?.poolId, nftObj.ContractAddress, gasFee?.collectAddress, "2500000000000000000");
      // const unStake = await contract.gasLessTransaction("nftWithdraw", 0, "stake", wallets[0], nftObj.NFTId, getStake?.data?.poolId, nftObj.ContractAddress, TStamp, gasFee?.collectAddress, "2500000000000000000");
      console.log("unStake", unStake);
      setCanReload(true)
      if (unStake.status) {
        let pendingObj = {
          From: accountAddress,
          method: "nftWithdraw",
          params: [{ action: "onWithdraw", walletAddress: accountAddress, NFTId: nftObj.NFTId }],
          TimeStamp: TStamp
        }
        const Resp = unStake.status == "pending" ? await setPendingTransaction(pendingObj) : await stackFunction({ action: "onWithdraw", walletAddress: accountAddress, NFTId: nftObj.NFTId });

        if (unStake.status == "pending") {
          toast.update(id, {
            render:
              <div>
                <p className="mb-0">unStaking is pending...</p>
                <p className="mb-0">Please check after some time!</p>
              </div>,
            type: 'warning', isLoading: false, autoClose: 1500, closeButton: true, closeOnClick: true
          });
          return push("/")
        }
        else if (Resp?.success == "success") {
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
    const TStamp = Date.now();
    const sign = await contract._signcall(wallets[0], web3utils.toWei(String(pendingReward)));
    console.log('signsign---->', sign);
    if (!sign) return toast.error("Approve not accepted");

    const unStake = await contract.nftStakingAndWithdrawAndClaim(wallets[0], "claimReward", web3utils.toWei(String(pendingReward)), sign.tot, sign.signhash);
    // const unStake = await getThirdweb.useContractCall("claimReward", 0, "stake", web3utils.toWei(String(pendingReward)), payload?.parentAddress, gasFee?.collectAddress, "2500000000000000000");
    // const unStake = await contract.gasLessTransaction("claimReward", 0, "stake", wallets[0], web3utils.toWei(String(pendingReward)), TStamp, gasFee?.collectAddress, "2500000000000000000");

    setCanReload(true)
    if (!unStake.status) return toast.update(id, {
      render: "Error in claim",
      type: "error",
      isLoading: false,
      autoClose: 1000,
    });
    let pendingObj = {
      From: accountAddress,
      method: "claimReward",
      params: [{ action: "onClaimReward", walletAddress: accountAddress, projectId: rewardOption?.projectId, Season: rewardOption?.Season, Hash: unStake?.HashValue }],
      TimeStamp: TStamp
    }
    const Resp = unStake.status == "pending" ? await setPendingTransaction(pendingObj) : await stackFunction({ action: "onClaimReward", walletAddress: accountAddress, projectId: rewardOption?.projectId, Season: rewardOption?.Season, Hash: unStake?.HashValue });
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
    onSelectChange();
    getRewardDetails();
  }


  const handleScroll = () => {
    const footerTop = footerRef.current.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (footerTop < windowHeight) {
      setIsFixed(false);
    } else {
      setIsFixed(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Prompt when={!canReload} message={"Are you sure!!! changes may be lost...!"} />
      <BottomBar />
      <Header />
      <div className="innercontent">
        <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
          <SideTab />
        </div>
        <div className="banner_section banner_section_content claim-section">
          <div className='px-0 inner-container__width'>
            <div>
              <div className="home_titled hc-home__title head_txt text-center"  >
                Claim Rewards
              </div>
              <div className="d-flex flex-wrap align-items-center justify-content-start justify-content-xl-center claim-value__wrapper">



                <div className="value__wrapper-blue">
                  <p className="title d-none d-xl-block">Number of NFT's :</p>
                  <p className="title d-xl-none">Total NFT's :</p>
                  <p className="value"> {nftCounts?.totalNfts}</p>
                </div>

                <div className="value__wrapper-blue">
                  <p className="title d-none d-xl-block">
                    Number of Staked NFTs :
                  </p>
                  <div className="value__wrapper-image d-xl-none">
                    <img src={totalnft} />
                    <p className="title">
                      Total NFTs stacked :
                    </p>

                  </div>

                  <p className="value"> {nftCounts?.isStaked}</p>
                </div>
                <div className="value__wrapper-blue">
                  <p className="title d-none d-xl-block">
                    Number of non-staked NFTs :
                  </p>
                  <div className="value__wrapper-image d-xl-none">
                    <img src={totalrewards} />
                    <p className="title ">
                      Total Reward Claimed :
                    </p>
                  </div>
                  <p className="value"> {nftCounts?.isNotStaked}</p>
                </div>




              </div>
              <h5 className="hh-stake__subtitle text-center">
                Next Reward Distribution Date: <span>
                  {new Date(rewardDetail?.endDateFormat).toLocaleDateString()}
                </span>
              </h5>
              <div className="hh-stake__countdown">
                <Countdown date={new Date(rewardDetail?.endDateFormat)} />
              </div>

              <div className="stake-tab__wrapper">
                <div
                  className={
                    activeTab == "staking"
                      ? "active stacking_tab"
                      : "stacking_tab"
                  }
                  onClick={() => setAtciveTab("staking")}
                >
                  <img
                    className=""
                    src={
                      require("../assets/images/whitestack.svg")
                        .default
                    }
                  />
                  <p className="top_reltablabel">Staking</p>
                </div>
                <div
                  className={
                    activeTab == "rewards"
                      ? "active stacking_tab"
                      : "stacking_tab"
                  }
                  onClick={() => setAtciveTab("rewards")}
                >
                  <img
                    className=""
                    src={
                      require("../assets/images/rewards.svg")
                        .default
                    }
                  />
                  <p className="top_reltablabel">Rewards</p>
                </div>
              </div>
              {activeTab == "staking" ? (
                <>
                  <div className=" ">
                    <div className="d-flex align-items-center stake-actions">
                      {/* <div className="">
                        <div className="d-flex justify-content-start align-items-center">
                          <img
                            className="searchglass"
                            src={
                              require("../assets/images/searchglass.svg")
                                .default
                            }
                          />
                          <input type='text' className='stack_search' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Search...' />

                        </div>
                        <i
                          class="fa-solid fa-xmark search_closer"
                          onClick={() => setMobSearch(false)}
                        />
                      </div> */}
                      <div className="stake--searchContainer">
                        <div className="d-flex justify-content-start align-items-center project__list--search">
                          <img
                            className="searchglass"
                            src={require("../assets/images/searchs.svg").default} />
                          <input type='text' className='stack_search' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Search Properties' />
                          {/* <ReactSearchBox
                                  placeholder="Search..."
                                  value={search}
                                  data={data}
                                  onChange={(e) => setSearch(e)}
                                  callback={(record) => console.log(record)}
                                /> */}
                        </div>
                        {/* <i
                          class="fa-solid fa-xmark projects__list--searchCloser"
                          onClick={() => { setMobSearch(false); }}
                        /> */}
                      </div>
                      <div className="react-select-2-wrap">
                        <Select
                          classNamePrefix='react-select-2'
                          className="border_select"
                          placeholder="Select Properties"
                          // menuIsOpen
                          value={filter}
                          options={optionsOne}

                          onChange={(e) => setFilter(e)}
                        />
                      </div>
                      {/* <div
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
                      </div> */}
                    </div>
                    {/* <div
                            className="d-flex justify-content-end"
                          >
                            <Dropdown className="stack_dropdown">
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
                            </Dropdown>
                          </div> */}
                  </div>

                  {/* <Row className="nftcard_wrap">
                    {console.log('datacardd', dataCard)}
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
                  </Row> */}

                  <div className="stake-grid">


                    {/* <div className='box1'>
                      <div className="white"></div>
                    </div>
                    <div className='box1'></div>
                    <div className='box1'></div>
                    <div className='box1'></div> */}


                    {dataCard?.map((i) => (
                      <DataCard data={i} setShowData={setShowData} setShowModal={setShowModal} onWithdraw={onWithdraw} />
                    ))}

                  </div>
                  {Loadmore &&
                    <div className="mp-margin d-flex justify-content-center">
                      <button className="button-loadMore" onClick={() => LoadMore()} >Loadmore</button>
                    </div>
                  }

                </>
              ) : (
                <>
                  {accountAddress ? (
                    <Row className="justify-content-center ">
                      <Col lg={10} className="px-0">
                        <h5 className="hh-stake__subtitle text-center">
                          Total Rewards Received {rewardAmount.toFixed(7)} USDT
                        </h5>
                        <Row className="mx-auto select_holder  stake-rewards__selects justify-content-center">
                          <Col xs={6} lg={4} className="hh-col__paddings">
                            <Select
                              classNamePrefix="react-select-3"
                              className="border_select"
                              placeholder="Project"
                              // defaultValue={selectedOption}
                              onChange={(e) => setRewardOption({ ...rewardOption, projectId: e._id })}
                              options={projectArr}
                            />
                          </Col>
                          <Col xs={6} lg={4} className="hh-col__paddings">
                            <Select
                              classNamePrefix="react-select-3"
                              className="border_select"
                              placeholder="Year"
                              // defaultValue={selectedOption}
                              onChange={(e) => setRewardOption({ ...rewardOption, year: e.value })}
                              options={years}
                            />
                          </Col>
                          <Col xs={6} lg={4} className="hh-col__paddings">
                            <Select
                              classNamePrefix="react-select-3"
                              className="border_select"
                              placeholder="Quarter"
                              onChange={(e) => setRewardOption({ ...rewardOption, Season: e.value })}
                              // defaultValue={selectedOption}
                              // onChange={setSelectedOption}
                              options={options}
                            />
                          </Col>
                        </Row>
                        <div className="d-flex justify-content-center stack-button__wrap">
                          <button className="stack__button-submit" onClick={() => onClaimReward()} >
                            Submit
                          </button>
                        </div>
                        <Row className="justify-content-center margin__tb-5vh">
                          <Col lg={5} className="px-0 d-flex justify-content-center">
                            <div className="value__wrapper-blue">
                              <p className="title">
                                Pending Rewards {pendingReward} USDT
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ) : (
                    <Row className="justify-content-center margin__tb-5vh">
                      <Col lg={8} className="d-flex justify-content-center">
                        <div className="staking_nowallet">
                          <h3 className="hh-stake__subtitle text-center">
                            Pending Rewards :
                          </h3>
                          <button
                            className="nftinfo_gradeientBtn web_listitem_btn margin__tb-5vh"
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
          </div>
        </div>
      </div >

      <div ref={footerRef}>
        <Footer />
      </div>

      {/* modal */}
      <StakeModal setSelectedPlan={setSelectedPlan} onStackNft={onStackNft} show={showModal} handleClose={() => setShowModal(false)} />
      <RewardsModal show={cnctWallet} handleClose={handleCloseWallet} setWallet={setWallet} />
      {/* end of modal */}


    </>
  );
}

export default Staking;
