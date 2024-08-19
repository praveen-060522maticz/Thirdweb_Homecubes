import axios from 'axios'
import Config from '../config/config'
import { connectWallet } from '../hooks/useWallet';
import { Category, Currency, USDPRICE, TOKENPRICE } from '../actions/axioss/cms.axios'
import CryptoJS from 'crypto-js';

// import CopyToClipboard from "react-copy-to-clipboard";

// import { useSelector ,useDispatch } from "react-redux";
// import { getFormLabelUtilityClasses } from '@mui/material';


export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'string' && Number(value) === 0) ||
  (typeof value === 'number' && Number(value) === 0);


// Address cut function like 0x123...345
export const address_showing = (item) => {
  if (item && item.toString().length > 10) {
    var slice_front = item.slice(0, 9)
    var slice_end = item.slice(item.length - 9, item.length)
    return slice_front + '....' + slice_end
  }
  else return item
}

export const Name_showing = (item) => {
  if (item && item.toString().length > 10) {
    var slice_front = item.slice(0, 9)
    // var slice_end  = item.slice(item.length-9,item.length-1)
    return slice_front + '....'
  }
  else return item
}

export const NumWithSpecificDecimal = (data) => {
  var data = data.toString()
  var str = data ? data.includes('.') ? data.split('.').length >= 3 ? (data.split('.')[0] + '.' + data.split('.')[1]).toString() : data : data : data
  console.log('dsuiufuidfkdhkffnnn', str.toString().replace(Config.DecimalAlloweddigits, ''))
  if (Config.DecimalAlloweddigits.test(data)) return data
  else return ''

}
// Copy Text
export const copydata = (data) => {
  // <CopyToClipboard
  //                     text={data}
  //                     onCopy={() =>
  //                       toast.success("Address Copied")
  //                     } >

  //                     <i className="fas fa-sticky-note notes_fa cur_pointer"></i>
  //                   </CopyToClipboard>
  // var copyText = data;
  //  navigator.clipboard.writeText(copyText);
  //toast.success("Copied Successfully")
}

export const NumANdDotOnly = (data) => {
  var data = data.toString()
  var str = data ? data.includes('.') ? data.split('.').length >= 3 ? (data.split('.')[0] + '.' + data.split('.')[1]).toString() : data : data : data
  return str.toString().replace(Config.NumDigitOnly, '')
}

export const NumberOnly = (data) => {
  return data.toString().replace(Config.NumberOnly, '')
}

// // Common Formdata function
// export const AppenData = (data) => {
//   var formdata = new FormData()
//   var SendDta = Object.entries(data).map((item) => {
//     if (Array.isArray(item[1])) {
//       var come = item[1].map(data => {
//         formdata.append(item[0], data)
//         return formdata
//       })
//       return come

//     }
//     else {
//       formdata.append(item[0], item[1])
//       return formdata
//     }
//   })
//   return SendDta
// }

// Common Formdata function
export const AppenData = (data) => {

  var formdata = new FormData()
  var SendDta = Object.entries(data).map((item) => {
    console.log("item", item);
    if (Array.isArray(item[1])) {
      var come = item[1].map(data => {
        console.log("arrayitem", data);
        if (data?.type && data?.size) {
          console.log("appitem", item[0], data);
          formdata.append(item[0], data)
        }
        else {
          console.log("data", data);
          formdata.append(item[0], EncryptData(data))
        }
        return formdata
      })

      return come
    }
    else {
      if (item[1]?.type && item[1]?.size) {
        formdata.append(item[0], item[1])
      }
      else {
        console.log("appiitem", item);
        formdata.append(item[0], EncryptData(item[1]))
      }
      return formdata
    }
  })
  return SendDta
}

// Error handling
export const handleCallback = (callback) => {
  return async (data) => {
    try {
      return await callback(data);
    } catch (error) {
      console.error("error", error)
      return ({
        error: error,
        success: "error",
        data: [],
        msg: `${'From user' + error.toString()}`
      })
    }
  };
};
// Common Axios Function
export const axiosFunc = handleCallback(async (data, social) => {
  console.log("hderrgser", data);
  let Resp = await axios(data)

  console.log("Resp?.data", Resp?.data, Decryptdata(Resp.data), isEmpty(Decryptdata(Resp.data)))

  if (Resp?.data) {
    Resp.data = Resp.data ? isEmpty(Decryptdata(Resp.data)) ? Resp.data : Decryptdata(Resp.data) : Resp.data
  }
  console.log("Resp?.data", Resp?.data)
  return Resp.data


})
export const switchnetwork = async (chainid, switched) => {
  // const dispatch=useDispatch()
  var obj = await connectWallet(localStorage.getItem("walletConnectType"), chainid, "switched")
  console.log("localStorage.getItem", localStorage.getItem("walletConnectType"), chainid, "switched");
  // }else{
  // var obj= await connectWallet(localStorage.getItem("walletConnectType"),e)
  // }
  console.log("OOOOBBJJ", obj)
  const chainId = await obj.web3.eth.getChainId();
  if (chainId == chainid) {
    var currency = await getcurrency(chainid)
    return ({
      status: true,
      data: {
        type: "Account_Section",
        Account_Section: { AccountDetails: obj }

      },
      currency: currency
    })
  }
  else {
    return ({ status: false, msg: " Please switch network" })
  }
}
export const getcurrency = async (chainid) => {
  // const {Network} = useSelector((state)=>state.LoginReducer)
  console.log("NETWORKssddsds", chainid);
  let Resp = await Currency();

  if (Resp?.msg) {
    var sen = [];
    var bnb = Resp?.msg.filter((item) => item.ChainId == Config?.BNBCHAIN)
    var eth = Resp?.msg.filter((item) => item.ChainId == Config?.ETHCHAIN)
    console.log('aaaaaaasssssssssssssssssssssssssaa', sen, bnb, eth)
    var bnbdatas = await Promise.all(
      bnb[0]?.CurrencyDetails ||
      []?.map(async (data) => {
        if (data.label == "BNB" || data.label == "ETH")
          var USD = await USDPRICE(data.label);
        else var USD = await TOKENPRICE(data.address);
        sen.push({
          value: data.value,
          label: data.label,
          address: data.address,
          usd: USD ? USD : 0,
          decimal: data.decimal,
        });
      })
    );
    var ethdatas = await Promise.all(
      eth[0]?.CurrencyDetails ||
      []?.map(async (data) => {
        if (data.label == "BNB" || data.label == "ETH")
          var USD = await USDPRICE(data.label);
        else var USD = await TOKENPRICE(data.address);
        sen.push({
          value: data.value,
          label: data.label,
          address: data.address,
          usd: USD ? USD : 0,
          decimal: data.decimal,
        });
      })
    );
    console.log('aaaaaaasssssssssssssssssssssssss', sen, bnbdatas, ethdatas, chainid)
    return ({
      type: "Register_Section",
      Register_Section: {
        currency: chainid == Config.BNBCHAIN ? bnbdatas : ethdatas
      },
    });
  }
}

export const EncryptData = (data, key) => {
  try {
    if (key) {
      return CryptoJS.AES.encrypt(data, Config.KEY).toString()
    } else {
      const encJson = CryptoJS.AES.encrypt(JSON.stringify(data), Config.KEY).toString();
      const encData = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encJson)
      );
      return encData;
    }

  }
  catch (err) {
    console.log("encerr", err);
    return false
  }
}


export const Decryptdata = ((data, key) => {
  try {
    if (key) {
      console.log('rthdrtjhdddd', data)
      return CryptoJS.AES.decrypt(data, Config.KEY).toString(CryptoJS.enc.Utf8)
    }
    else {
      console.log('rthdrtjh', data)
      const decData = CryptoJS.enc.Base64.parse(data)?.toString(CryptoJS.enc.Utf8);
      // console.log("fasdfsfsdfsdfsdfsdsd", decData)
      const bytes = CryptoJS.AES.decrypt(decData, Config.KEY).toString(CryptoJS.enc.Utf8);
      // console.log("Decryptdata 111 payload", bytes);
      return JSON.parse(bytes)
    }
  } catch (error) {
    console.log(" erro on Decryptdata", error);
    return ""
  }


})


export const getBNBvalue = async (val) => {
  try {
    const resp = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${val}`)
    console.log("respszegzsegzsegzes", resp.data);
    return resp.data?.price
  } catch (error) {
    console.log("err on getBNBvalue", error);
    return 0
  }
}

export function parseHtmlString(str) {

  if (!str) return ""
  // Replace HTML entities with their corresponding characters
  str = str.replace(/&#([0-9]+);/g, (match, dec) => {
    if (dec === '160') {
      return '';
    }

    return String.fromCharCode(dec);
  });

  // Remove CSS and JavaScript
  str = str.replace(/<style([\s\S]*?)<\/style>|<script([\s\S]*?)<\/script>/gi, '');

  // Remove HTML tags
  str = str.replace(/(<([^>]+)>)/gi, '');

  // Remove extra whitespace and special characters
  str = str
    .replace(/\s+/g, ' ')
    .replace(/[\n\r]+/g, ' ')
    .replace(/(&nbsp;)/gi, '')
    .trim();

  // Replace special characters
  str = str.replace(/&quot;/g, '"');
  str = str.replace(/&amp;/g, '&');

  // Remove '[link]' and '[comments]' from description
  const linkRegex = /\[link]/g;
  const commentsRegex = /\[comments]/g;
  const emptyCommentsRegex = /Comments/g;
  str = str.replace(linkRegex, '').replace(commentsRegex, '').replace(emptyCommentsRegex, '');

  // Remove leading and trailing whitespace
  str = str.trim();

  return str;
}


export const videoFileFormats = [
  'mp4',
  'avi',
  'mkv',
  'mov',
  'wmv',
  'flv',
  'webm',
  'm4v',
  '3gp',
  'mpeg',
  'ogv',
  'mpg',
  'asf',
  'rm',
  'swf',
];

export const imgFormats = ['jpeg', 'jpg', 'png', 'gif', 'svg', 'webp'];

export const UaeTimeLineNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }))

export const getDaysOfDesiredMonth = () => {
  var month;
  // Get the current date
  var currentDate = new Date();
  let currentMonth = new Date().getMonth() + 1
  if(currentMonth >= 1 && currentMonth <= 3) month = 3;
  if(currentMonth >= 4 && currentMonth <= 6) month = 6;
  if(currentMonth >= 7 && currentMonth <= 9) month = 9;
  if(currentMonth >= 9 && currentMonth <= 12) month = 12;

  // Set the target date to March 1 of the current year
  var targetDate = new Date(currentDate.getFullYear(), month, 1); // Note: Months are 0-indexed, so March is represented by 2
  console.log("targetDate", targetDate);
  // Calculate the difference in days
  var timeDifference = targetDate.getTime() - currentDate.getTime();
  var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  console.log("Days until", daysDifference);

  var newStartDate = new Date(currentDate.getFullYear(), month - 3, 1).toISOString(); // Note: Months are 0-indexed, so March is represented by 2

  // days difference from now and previous day of 1
  return {
    days: (daysDifference - 1) < 0 ? 0 : daysDifference - 1,
    dateFormat: new Date(targetDate.setDate(targetDate.getDate() - 1)).toISOString(),
    startDate: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
    newStartDate
  }
}


export function calculateStakingDaysPassed(eventStartDate, eventEndDate, stakingStartDate, stakingEndDate) {
  // Parse the input strings to Date objects
  const eventStart = new Date(eventStartDate);
  const eventEnd = new Date(eventEndDate);
  const stakingStart = new Date(stakingStartDate);
  const stakingEnd = new Date(stakingEndDate);

  // Get the current date
  const currentDate = new Date();

  // Determine the overlap end date (min of event end date, staking end date, and today's date)
  const overlapEnd = new Date(Math.min(eventEnd, stakingEnd, currentDate));

  // If the overlap end date is before the staking start date or event start date, there is no overlap
  if (overlapEnd < stakingStart || overlapEnd < eventStart) {
    return 0;
  }

  // Calculate the number of days within the overlap
  const timeDiff = overlapEnd - Math.max(stakingStart, eventStart);
  const daysOfStaking = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  return daysOfStaking;
}

export const LSsetItem = (key, val) => localStorage.setItem(key, typeof val == "object" ? EncryptData(val) : EncryptData(val))
export const LSgetItem = (key) => {
  try {
    return JSON.parse(Decryptdata(localStorage.getItem(key)))
  } catch (e) {
    return Decryptdata(localStorage.getItem(key))
  }
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const getErrorForToast = str => str?.split?.('\n')?.[0];