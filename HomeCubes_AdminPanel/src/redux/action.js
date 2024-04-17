
// ----->  Redux Explanation  <-------\\

// step one action -->  usedispatch  -- trigger change inital state data  / pass {reducer type , payload state}
// step two reducer --> to update   -- change initial state data using action data passed from dispatch
//                                     in wallet_details fn
// step three store --> use useSelector() hook to access store state variable




export const WALLET_CONNECT = "wallet_connect";
export const WALLET_DISCONNECT = "wallet_disconnect";

export const Account_Connect = 'Account_Connect';
export const Account_disConnect = 'Account_disConnect';
export const Initial_Connect = 'Initial_Connect';
export const Admin_Login = 'Admin_Login';

const initial_wallet = {
    UserAccountAddr     : '',
    UserAccountBal      : 0,
    providers           : null,
    Service_Fee         : 0,
    Wen_Bln             : 0,  //default token bln
    Accounts            : '',
    WalletConnected     : 'false',
    AddressUserDetails  : null,
    tokenAddress        : null,
    swapFee             : 0,
    buyerfee            : 0,  //buyer service fee
    sellerfee           : 0,  // buyer seller fee
    token_usd_value     : 0,  //Wen_bln $ price
    currency_usd_value  : 0,  //bnb $ price
    shareTag            : null ,
    Listing_Fee         : 0,
    SingleContract      : null,
    MultipleContract    : null,
    load                : "false",
    Wallet_Type         : '',
    // Admin_Address       : '0xB36c21475963A515c399D5726fcF843454884CF1'.toLowerCase(),
    Admin_Address       : '0x025c1667471685c323808647299e5dbf9d6adcc9'.toLowerCase(),
    SocialLinks         : {},
    Categorys           : [],
    web3                : null,
    web3p               : null

}


function wallet_details(state = initial_wallet,action){
   
        switch (action.type) {
            case Initial_Connect:
              return {
              ...state,
              ...action.Initial_Connecting
              };
            case Account_Connect:
              return {
              ...state,
              ...action.Account_Detail
              };
            case Account_disConnect:
              return {
              ...state,
              ...action.Account_Detail_Disconnect
              };
            case Admin_Login:
            return {
            ...state,
            ...action.Admin_connection
            };
         
            default:
              return state;
    }

}


export default wallet_details;