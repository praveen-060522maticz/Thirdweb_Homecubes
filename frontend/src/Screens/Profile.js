import React, { useEffect, useState, useRef } from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import { Container, Row, Col } from 'react-bootstrap'
import SideTab from '../Components/SideTab'
import Select from "react-select";
import { nftcard } from '../datas/CardData'
import CollectionCard from '../Components/CollectionCard'
import Footer from '../Components/Footer'
import KYCActivate from '../Modals/KYCActivate'
import NFTCards from '../Components/NFTCards'
import DataCard from '../Components/DataCard'
import { useParams } from 'react-router-dom'
import { Token_MyList_Func, getFessFunc, userRegister } from '../actions/axioss/user.axios'
import { address_showing, isEmpty } from '../actions/common'
import { useDispatch, useSelector } from 'react-redux'
import config from '../config/config'
import { searchQueryForMyitems, stackFunction } from '../actions/axioss/nft.axios'
import GalleryCard from '../Components/GalleryCard'
import ProjectCard from '../Components/ProjectCard'
import { toast } from 'react-toastify'
import KycComment from '../Modals/KycRejected'

import copyIcon from '../assets/images/copyicon.png'
import CopyToClipboard from 'react-copy-to-clipboard'

function Profile() {

  const { web3, web3p, accountAddress, coinBalance, BNBUSDT } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );
  const { payload, token, gasFee } = useSelector((state) => state.LoginReducer.User);
  const { currency } = useSelector(state => state.LoginReducer)
  console.log('currency---->', currency);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showKYC, setShowKYC] = useState(false)
  const [showKycCmd, setShowKycCmd] = useState(false)
  const [Tokens, SetTokens] = useState({ 'owned': { 'loader': true, page: 1, list: [] } })
  const [value, SetTabName] = React.useState('owned');
  const [totalValues, setTotalvalues] = useState([])
  const [optionVal, setOptionVal] = useState([{ label: "All", value: "All" }])
  const [searchVal, setSearchVal] = useState('')
  const [searchDataArr, setSearchDataArr] = useState({})
  const [Loadmore, setLoadMore] = useState(true)
  const [searchLoad, setSearchLoad] = useState(true)
  const [rewardAmount, setRewardAmount] = useState(0);


  console.log("Tokens", Tokens);
  const handleCloseKYC = () => setShowKYC(false);
  const handleShowKYC = () => setShowKYC(true);

  const handleCloseKycCmd = () => setShowKycCmd(false);
  const handleShowKycCmd = (e) => {
    e.stopPropagation();
    setShowKycCmd(true);
  }



  console.log("showKYC", showKYC)
  const { customurl } = useParams()
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  console.log("optionVal", optionVal);

  const [userProfile, setUserProfile] = useState({})
  console.log("userProfile", userProfile);

  console.log("searchVal", searchVal);



  const footerRef = useRef(null);
  const [isFixed, setIsFixed] = useState(true);
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
    if (typeof Tokens[value] == 'undefined') {
      Tokens[value] = { page: 1, list: [], loader: false };
      SetTokens(Tokens);
      Explore(1, value);
    }

  }, [value])

  useEffect(() => {
    Explore();
    getProfileDetails()
  }, [customurl, userProfile?.WalletAddress])

  useEffect(() => {
    if (!isEmpty(searchVal)) onSearch();
  }, [searchVal, userProfile])

  useEffect(() => {
    getRewardDetails()
  }, [])
  const dispatch = useDispatch();
  const getProfileDetails = async () => {
    var SendDATA = {
      CustomUrl: customurl,
      Type: 'getProfile'
    }
    var profileInfo = await userRegister(SendDATA)
    if (profileInfo?.success == 'success' && profileInfo?.data?.WalletAddress) {
      setUserProfile(profileInfo.data)
      const getFees = await getFessFunc({ action: "get" });
      dispatch({
        type: "Register_Section",
        Register_Section: {
          User: {
            payload: profileInfo.data,
            token: token,
            gasFee: getFees || {}
          },
        },
      });
    }
  }

  const getRewardDetails = async () => {
    const Resp = await stackFunction({ action: "getRewardByWalletAddress", walletAddress: accountAddress });
    console.log("ResponSelectChange", Resp);
    setRewardAmount(Resp?.rewardClaimed ?? 0)
  }

  const Explore = async (data, tab) => {
    var page = data ? data : (Tokens[value]?.page)
    var SendDATA = {
      TabName: value,
      limit: 8,
      CustomUrl: customurl,
      NFTOwner: (userProfile?.WalletAddress),
      page: page ?? 1,
      filter: "LatestDrops",
      from: 'myItem',
      cursor: ""
    }
    let Resp = await Token_MyList_Func(SendDATA);
    console.log('sfgfhgfs', Resp, SendDATA)
    if (Resp?.success == 'success' && Resp.data.length > 0) {
      setLoadMore(true)

      let uniqueSet = new Set();
      let uniqueArray = Resp?.totalvalues.filter(obj => {

        if (uniqueSet.has(obj.projectTitle)) {
          return false;
        }

        uniqueSet.add(obj.projectTitle);
        return true;
      });

      if (optionVal.length == 1) setOptionVal([...optionVal, ...uniqueArray]);
      if (isEmpty(totalValues)) setTotalvalues(Resp?.totalvalues ?? {});

      SetTokens({
        ...Tokens, ...{
          [value]: {
            list: [...Tokens[value].list, ...Resp.data],
            loader: (Resp.data.length == 0 || Resp.cursor == null) ? false : true,
            page: Tokens[value].page,
            filter: "LatestDrops",
          }
        }
      })
    } else {
      setLoadMore(false)
      setTotalvalues(totalValues)
      SetTokens({
        ...Tokens,
        ...{
          [value]: {
            list: Tokens[value].list,
            loader: false,
            page: Tokens[value].page,
            filter: "LatestDrops"
          },
        },
      });
    }
  }

  const LoadMore = () => {
    if (searchVal) onSearch();
    else {
      Tokens[value].page = Tokens[value].page + 1;
      SetTokens(Tokens);
      Explore(Tokens[value].page);
    }


  }

  const onSearch = async () => {
    const params = {
      NFTOwner: userProfile?.WalletAddress,
      keyWord: searchVal,
      tokenSkip: searchDataArr?.Tokens?.length ?? 0,
      projectSkip: searchDataArr?.projects?.length ?? 0,
      collectionSkip: searchDataArr?.collections?.length ?? 0,
      limit: 4
    }
    const Resp = await searchQueryForMyitems(params)
    console.log("paramsofSearchvalue", Resp, params);
    // setSearchDataArr(Resp)
    setSearchDataArr({
      ...searchDataArr,
      Tokens: [...searchDataArr?.Tokens ?? [], ...Resp?.Tokens],
      // collections: [...searchDataArr?.collections ?? [], ...Resp?.collections],
      projects: [...Resp?.projects]
    })

    if (Resp?.Tokens?.length == 0 && Resp?.collections?.length == 0) setSearchLoad(false)
  }
  console.log("totalValues", totalValues);

  const onProfileChange = async (e) => {
    const { value, id, files } = e.target
    if (files?.length != 0) {
      const params = { [id]: files[0], Type: id == "Profile" ? "profileimage" : "cover", WalletAddress: userProfile?.WalletAddress }
      const setData = await userRegister(params);
      console.log("setData", setData);
      getProfileDetails()
      toast[setData?.success ?? "success"](setData?.msg ?? "failed")
    }

  }
  return (
    <>
      <BottomBar />
      <Header />

      <div className="innercontent">
        <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
          <SideTab />
        </div>
        <div className="banner_section">
          <div className="inner-container__width">

            <div className='mb_1'>
              <div className='profile_dtlswhole'>

                <div className='profile_imgDtls'>
                  <img
                    className='profile_img img-fluid'
                    accept="image/*"
                    src={
                      isEmpty(userProfile?.Profile) ?
                        require('../assets/images/collections/shapeEight.jpg') :
                        `${config?.IMG_URL}/user/${userProfile?.WalletAddress}/profile/${userProfile?.Profile}`}
                  />
                  <button className='profile_editBtn'>
                    <i class="fa-regular fa-pen-to-square"></i> Edit

                    <input type='file' className='editprofile_input' id="Profile" onChange={(e) => onProfileChange(e)} />
                  </button>
                </div>


                <div>
                  <p className='mb_1 hc-profile__title'>Profile</p>
                  <p className='profile_joinDate  mt_1'>{new Date(userProfile?.createdAt).toDateString()}</p>
                  <div className='d-flex flex-wrap align-items-center gap_1 mt_1'>
                    <p className='profile_joinDate mb-0'>Wallet Address :</p>
                    <div className='d-flex  align-items-center gap_1'>
                      <p className="profile_name" >{userProfile?.DisplayName ? userProfile?.DisplayName : address_showing(userProfile?.WalletAddress)}</p>
                      <CopyToClipboard
                        onCopy={() => toast.success("Address copied successfully")}
                        text={`${userProfile?.DisplayName ? userProfile?.DisplayName : address_showing(userProfile?.WalletAddress)}`}
                      >
                        <button className='bg-transparent border-0 outline-0'>
                          <img src={copyIcon} className='img-fluid copyiconimg' alt='copy' />
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>
                  <div className='mt_1 d-block d-sm-none'>
                    <div className='profile_topright'>
                      <div className='align-items-end h-100'>

                        {userProfile?.KycStatus == "complete" ?
                          <div className='mb_1' onClick={() => handleShowKYC()}>
                            <div
                              className={userProfile?.KycStatus == "complete" ? "kyc_activated greenkyc text-center" : "kyc_activated text-center"}
                            // className='kyc_activated'
                            >
                              <img src={require('../assets/images/greenround.svg').default} />
                              <p>KYC Approved</p>
                            </div>
                          </div>
                          :
                          userProfile?.KycStatus == "submit" ?
                            <div className='mb_1' onClick={() => handleShowKYC()}>
                              <div
                                className={userProfile?.KycStatus == "submit" ? "kyc_activated actiate_hint orange text-center" : "kyc_activated actiate_hint text-center"}
                              // className='kyc_activated actiate_hint'
                              >
                                {userProfile?.KycStatus == "submit" ? <></> : <img src={require('../assets/images/redround.svg').default} />}
                                <p className='text-center'>KYC submitted, please wait till it is reviewed</p>
                              </div>
                            </div>
                            :
                            userProfile?.KycStatus == "retry" ?
                              <div className='mb_1'>

                                <div className='kyc_activated actiate_hint' onClick={() => handleShowKYC()}>

                                  <img src={require('../assets/images/redround.svg').default} />
                                  <p>Kyc got rejected retry please</p>

                                  {userProfile?.comment && <button className='primary_blueBtn kyc_reject_btn' onClick={(e) => handleShowKycCmd(e)}>
                                    <i class="fa-regular fa-comment-dots"></i>
                                  </button>}

                                </div>

                              </div>
                              :
                              <div className='mb_1'>
                                <div className='kyc_activated actiate_hint' onClick={() => handleShowKYC()}>
                                  <img src={require('../assets/images/redround.svg').default} />
                                  <p>Complete Your KYC</p>
                                </div>
                              </div>}
                      </div>


                    </div>
                  </div>

                  <div className='d-none d-sm-block'>
                    <div className='d-flex flex-wrap align-items-center gap_1 mt_2'>
                      <p className='profile_joinDate mb-0'>Referral Link :</p>
                      <div className='d-flex align-items-center gap_1 gap_1'>
                        <div className='hc-profile__wrapper-border'>
                          Link Address
                        </div>
                        <button className='bg-transparent border-0 outline-0'>
                          <img src={copyIcon} className='img-fluid copyiconimg' alt='copy' />
                        </button>
                      </div>

                    </div>
                    <div className='d-flex flex-wrap align-items-center gap_1  mt_2'>
                      <p className='profile_joinDate mb-0'>Referral Code :</p>
                      <div className='d-flex align-items-center gap_1'>
                        <div className='hc-profile__wrapper-border'>
                          WA098JA
                        </div>
                        <button className='bg-transparent border-0 outline-0'>
                          <img src={copyIcon} className='img-fluid copyiconimg' alt='copy' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className='d-block d-sm-none'>
              <div className=''>
                <p className='profile_joinDate mb_1'>Referral Link :</p>
                <div className='d-flex align-items-center gap_1'>
                  <div className='hc-profile__wrapper-border'>
                    Link Address
                  </div>
                  <button className='bg-transparent border-0 outline-0'>
                    <img src={copyIcon} className='img-fluid copyiconimg copy1' alt='copy' />
                  </button>
                </div>

              </div>
              <div className='mt_2'>
                <p className='profile_joinDate mb_1'>Referral Code :</p>
                <div className='d-flex align-items-center gap_1'>
                  <div className='hc-profile__wrapper-border'>
                    WA098JA
                  </div>
                  <button className='bg-transparent border-0 outline-0'>
                    <img src={copyIcon} className='img-fluid copyiconimg copy1' alt='copy' />
                  </button>
                </div>
              </div>
            </div>

            <div className='mb_1 d-none d-sm-block'>
              <div className='profile_topright'>
                <div className='d-flex justify-content-end align-items-end h-100'>
                
                  {userProfile?.KycStatus == "complete" ?
                    <div className='mb_2 mt_2' onClick={() => handleShowKYC()}>
                      <div
                        className={userProfile?.KycStatus == "complete" ? "kyc_activated greenkyc text-center" : "kyc_activated text-center"}
                      // className='kyc_activated'
                      >
                        <img src={require('../assets/images/greenround.svg').default} />
                        <p>KYC Approved</p>
                      </div>
                    </div>
                    :
                    userProfile?.KycStatus == "submit" ?
                      <div className='mb_2 mt_2' onClick={() => handleShowKYC()}>
                        <div
                          className={userProfile?.KycStatus == "submit" ? "kyc_activated actiate_hint orange text-center" : "kyc_activated actiate_hint text-center"}
                        // className='kyc_activated actiate_hint'
                        >
                          {userProfile?.KycStatus == "submit" ? <></> : <img src={require('../assets/images/redround.svg').default} />}
                          <p className='text-center'>KYC submitted, please wait till it is reviewed</p>
                        </div>
                      </div>
                      :
                      userProfile?.KycStatus == "retry" ?
                        <div className='mb_2 mt_2'>

                          <div className='kyc_activated actiate_hint' onClick={() => handleShowKYC()}>

                            <img src={require('../assets/images/redround.svg').default} />
                            <p>Kyc got rejected retry please</p>

                            {userProfile?.comment && <button className='primary_blueBtn kyc_reject_btn' onClick={(e) => handleShowKycCmd(e)}>
                              <i class="fa-regular fa-comment-dots"></i>
                            </button>}

                          </div>

                        </div>
                        :
                        <div className='mb_2'>
                          <div className='kyc_activated actiate_hint' onClick={() => handleShowKYC()}>
                            <img src={require('../assets/images/redround.svg').default} />
                            <p>Complete Your KYC</p>
                          </div>
                        </div>}
                </div>


              </div>
            </div>

            <div className='hc-proile__border-top gap_set'>
              <p className='profile_balance'>Total Balance :  $ {(coinBalance * BNBUSDT)?.toFixed(6)}</p>
              <div className='vert_line vert_line1'></div>
              <div className='pro_valuecount'>
                <div >
                  <div className='profile_coinnameimg'>
                    <img className='nft_coinImg' src={require('../assets/images/Tether Usdt.png')} />
                    <p className='profile_balance'>USDT</p>
                  </div>
                  <p className='hc-profile__text-xs'>
                    BNB Smart Coin
                  </p>
                </div>

                <div className='vertical_dtl'>
                  <p className='profile_greentTxt'>{currency?.filter(val => val.value == "USDT")?.[0]?.balance}</p>
                  <p className='small_dollar'>$ {BNBUSDT}</p>
                </div>
              </div>
              <div className='vert_line'></div>
              <div className='pro_valuecount'>
                <div >
                  <div className='profile_coinnameimg'>
                    <img className='nft_coinImg' src={require('../assets/images/bnbcoin.svg').default} />
                    <p className='profile_balance'>{config.COIN_NAME}</p>
                  </div>
                  <p className='hc-profile__text-xs'>
                    BNB Smart Coin
                  </p>
                </div>

                <div className='vertical_dtl'>
                  <p className='profile_greentTxt'>{coinBalance?.toFixed(6)}</p>
                  <p className='small_dollar'>$ {BNBUSDT}</p>
                </div>
              </div>
            </div>

            <div className='hc-proile__border-top counterslist'>
              <div className="stack_nftcounter profile_counter">
                <p className="nftcounter_lable">Total NFTs :</p>
                <p className="nftcounter_value">{totalValues?.length}</p>
              </div>
              <div className="stack_nftcounter profile_counter">
                <img className="top_reltabimg" src={require('../assets/images/whitestack.svg').default} />
                <p className="nftcounter_lable">Total NFTs Staked :</p>
                <p className="nftcounter_value">{totalValues?.filter((val) => val.isStaked)?.length ?? 0}</p>
              </div>
              <div className="stack_nftcounter lasttotal profile_counter">
                <img className="top_reltabimg" src={require('../assets/images/rewards.svg').default} />
                <p className="nftcounter_lable">Total Reward Claimed :</p>
                <p className="nftcounter_value">{Number(rewardAmount).toFixed(6)}</p>
              </div>
            </div>



          </div>
        </div>
        <div className="bottom_content profile_top">
          <div className="inner-container__width">

            <div className='d-flex align-items-center stake-actions'>
              <div className='stake--searchContainer'>
                <div className='d-flex justify-content-start align-items-center project__list--search'>
                  <img
                    className="searchglass"
                    src={
                      require("../assets/images/searchglass.svg")
                        .default
                    }
                  />
                  <input
                    type='text'
                    className='stack_search'
                    placeholder='Search Project...'
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                  />
                </div>
              </div>
              <div className="react-select-2-wrap">
                <Select
                  classNamePrefix={"react-select-2"}
                  className="border_select"
                  placeholder="Select Project"
                  // styles={stylesgraybgOne}
                  options={optionVal}
                  // value={selectedVal}
                  onChange={(e) => { setSearchVal(""); SetTabName(e.projectId ?? "owned") }}
                />
              </div>
            </div>








            {console.log('searchDataArr', searchDataArr)}
            <div className='row_bottomLine row_hideLine mt_4'>
              {searchVal ?
                <>
                  <div className='stake-grid mb_2'>
                    {searchDataArr?.Tokens && searchDataArr?.Tokens?.length != 0 &&
                      searchDataArr?.Tokens.map((val) => (

                        <DataCard data={val} />

                      ))}
                  </div>
                  {/* {searchDataArr?.collections && searchDataArr?.collections.length != 0 &&
                      searchDataArr?.collections?.map((val) => (
                        <Col lg={3} md={4} sm={6} xs={12} className='mb-3'>
                          <GalleryCard data={val} />
                        </Col>
                      ))} */}
                  <div className='stake-grid mb_2'>
                    {searchDataArr?.projects && searchDataArr?.projects.length != 0 &&
                      searchDataArr?.projects?.map((val) => (

                        <ProjectCard data={val} show={true} />

                      ))}
                  </div>
                  {searchLoad &&
                    <div className='mp-margin d-flex justify-content-center'>
                      <button className="button-loadMore" onClick={() => LoadMore()} >Loadmore</button>
                    </div>}
                </>
                :
                Tokens[value] &&
                  Tokens[value]?.list?.length > 0 ?
                  <>
                    <div className='stake-grid mb_2'>
                      {Tokens[value].list.map((i) => (

                        <DataCard data={i} />

                      ))}
                    </div>
                    {Loadmore &&
                      <div className='mp-margin d-flex justify-content-center'><button className="button-loadMore" onClick={() => LoadMore()} >Load More</button>
                      </div>}
                  </>

                  : <p className='nodata_found'>No data found</p>
              }
            </div>
          </div>
        </div>
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>

      {/* <Container fluid className='p-0'>

        <div className='profile_emptygrad'>
          <img className='prfofile_gradImg' src={require('../assets/images/profilegrad.svg').default} />
        </div>
      </Container> */}


      {/* kyc modal */}
      {showKYC && <KYCActivate show={showKYC} userProfile={userProfile} getProfileDetails={getProfileDetails} handleClose={handleCloseKYC} />}

      {/* kyc comment modal */}
      {showKycCmd && <KycComment show={showKycCmd} userProfile={userProfile} handleClose={handleCloseKycCmd} />}




      {/* end of kyc modal */}
    </>
  )
}

export default Profile