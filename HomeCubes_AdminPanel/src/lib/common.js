import Config from "../lib/config";
import CryptoJS from 'crypto-js';
import axios from 'axios'

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'string' && Number(value) === 0) ||
  (typeof value === 'number' && Number(value) === 0);

export const NumANdDotOnly = (data) => {
  var data = data.toString();
  var str = data
    ? data.includes(".")
      ? data.split(".").length >= 3
        ? (data.split(".")[0] + "." + data.split(".")[1]).toString()
        : data
      : data
    : data;
  return str.toString().replace(Config.NumDigitOnly, "");
};
export const NumberOnly = (data) => {
  return data.toString().replace(Config.NumberOnly, "");
};

export const address_showing = (item) => {
  if (item && item.toString().length > 10) {
    var slice_front = item.slice(0, 9)
    var slice_end = item.slice(item.length - 9, item.length - 1)
    return slice_front + '....' + slice_end
  }
  else return item
}


// Common Formdata function
export const AppenData = (data) => {
  var formdata = new FormData()
  var SendDta = Object.entries(data).map((item) => {
    if (Array.isArray(item[1])) {
      var come = item[1].map((data) => {
        if (data?.type && data?.size) {
          //file
          formdata.append(item[0], data)
        }
        else {
          formdata.append(item[0], EncryptData(data))

        }
        return formdata
      })
      return come

    }
    else {
      if (item[1]?.type && item[1]?.size) {
        //file type
        formdata.append(item[0], item[1])
      }
      else {
        formdata.append(item[0], EncryptData(item[1]))

      }
      return formdata
    }
  })
  return [formdata]
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


export const EncryptData = (data, key) => {
  try {
    console.log("Config.KEY", Config.KEY);
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
      console.log("fasdfsfsdfsdfsdfsdsd", decData)
      const bytes = CryptoJS.AES.decrypt(decData, Config.KEY).toString(CryptoJS.enc.Utf8);
      console.log("Decryptdata 111 payload", bytes);
      return JSON.parse(bytes)
    }
  } catch (error) {
    console.log(" erro on Decryptdata", error);
    return ""
  }


})

export const imgFormats = ['jpeg', 'jpg', 'png', 'gif', 'svg', 'webp'];


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

export function parseHtmlString(str) {
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


export const getDaysOfDesiredMonth = (Season) => {

  var month;

  if (Season == "Season 1") month = 3; // next march last date
  else if (Season == "Season 2") month = 6; // next may last date
  else if (Season == "Season 3") month = 9; // next june last date
  else if (Season == "Season 4") month = 12; // next oct last date

  // Get the current date
  var currentDate = new Date();

  // Set the target date to March 1 of the current year
  var targetDate = new Date(currentDate.getFullYear(), month, 1); // Note: Months are 0-indexed, so March is represented by 2
  console.log("targetDate", targetDate);
  // Calculate the difference in days
  var timeDifference = targetDate.getTime() - currentDate.getTime();
  var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  console.log("Days until", daysDifference);

  var poolStartDate = new Date(currentDate.getFullYear(), month - 3, 1);

  // days difference from now and previous day of 1
  return {
    days: (daysDifference - 1) < 0 ? 0 : daysDifference - 1,
    dateFormat: new Date(targetDate.setDate(targetDate.getDate() - 1)).toISOString(),
    startDate: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
    poolStartDate: poolStartDate.toISOString()
  }
}

export const LSsetItem = (key, val) => localStorage.setItem(key, typeof val == "object" ? EncryptData(val) : EncryptData(val))
export const LSgetItem = (key) => {
  try {
    return JSON.parse(Decryptdata(localStorage.getItem(key)))
  } catch (e) {
    return Decryptdata(localStorage.getItem(key))
  }
}

export const adminList = ["Super admin", "Admin", "Report only"];


export const getUtcTime = () => {
  // Create a new Date object.
  const now = new Date();

  // Get the UTC components directly.
  const utcDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ));
console.log('utcDate---->',utcDate,utcDate.toUTCString());
  // Print the UTC time.
  console.log(utcDate.toUTCString());
} 
getUtcTime()



export const generateSeasonOptions = (startYear, endYear) => {
  const options = [];
  for (let year = startYear; year <= endYear; year++) {
    options.push({ label: `${year}`, value: `${year}` });
  }
  return options;
};