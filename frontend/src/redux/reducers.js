import { combineReducers } from "redux";
import Config from '../config/config'
import { Data_Section, Account_Section, createprofile, ServiceFees_Section, Follow, Network_section, Adminaddress, walletConnect } from "./constants";

const Initial_State = {
  Admin_address: true,
  currency: [],
  Categorys: [],
  USD: {
    BNB: '',
    ETH: ''
  },
  walletConnected: false,
  Network: Config.CHAIN_ID,
  User: {
    token: '',
    payload: null
  },
  CMS: {
    impactcollectivemarketplace: '',
    latestdrop: '',
    featuredartist: '',
    footer: '',
    aboutus: '',
    contactus: '',
    termsofservice: '',
    privacypolicy: '',
  },
  AccountDetails: {
    accountAddress: '',
    tokenBalance: 0,
    coinBalance: 0,
    web3: null,
    web3p: null
  },
  ServiceFees: {
    buyerFees: '0',
    sellerFees: '0',
    baseRoyalty: '0'
  },
  follow: true,
  userdata: {}
}


function LoginReducer(state = Initial_State, action) {
  switch (action.type) {

    case Data_Section:
      return {
        ...state,
        ...action.Register_Section
      }
    case Account_Section:
      return {
        ...state,
        ...action.Account_Section
      }
    case ServiceFees_Section:
      return {
        ...state,
        ...action.ServiceFees_Section
      }
    case Network_section:
      return {
        ...state,
        ...action.Network_section
      }
    case Adminaddress:
      return {
        ...state,
        ...action.Admin_address
      }
    case createprofile:
      return {
        ...state,
        ...action.createprofile
      }
    case Follow:
      return {
        ...state,
        ...action.Follow
      }
    case walletConnect:
      return{
        ...state,
        ...action.walletSection
      }
    default:
      return state;
  }
}


const ImpactApp = combineReducers({ LoginReducer: LoginReducer });

export default ImpactApp;