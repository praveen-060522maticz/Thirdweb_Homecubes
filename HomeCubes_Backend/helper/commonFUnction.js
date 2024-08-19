
const util = require("util");
var exec = util.promisify(require("child_process").exec);
import fs from "fs";
import path from "path";
import nodemailer from 'nodemailer'

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
import Web3 from 'web3'
// import EmailTemplates from '../models/admin_models/emailtemplates.schema'

ffmpeg.setFfmpegPath(ffmpegPath);
import sharp from "sharp";
import Config from "../config/serverConfig";
import { FindOne } from "./mongooseHelper";
import CryptoJS from 'crypto-js'

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0) ||
  (typeof value === "string" && value === "0") ||
  (typeof value === "number" && value === 0);


export const ImageAddFunc = async (
  send_file,
  type,
  ProfileUrl,
  Id,
  Creator,
  alldata,
  types, names,
  TokenName,
  CollectionNetwork, CollectionUrl
) => {
  var senddata;
  console.log("send_file", send_file);
  var newSend = await Promise.all(
    send_file.map(async (item) => {
      var nftimg = await fs.promises.mkdir(item.path, { recursive: true })
      var tokenname = await item.files.mv(item.path + item.filename)
      console.log("filename", tokenname);
      // await fs.mkdir(item.path, { recursive: true }, async function (err) {
      //   if (err) return false;
      //   else if (item.filename != "") {
      //     item.files?.mv(item.path + item.filename, function (err, data) {
      //       if (err) return false;
      //       else return item.filename;
      //     });
      //   }
      // });
      if (types?.toString().includes('airdrop')) {
        var promos = await Promise.all([...Array(Number(alldata.Quantity))].map(async (item) => {
          var code = GenerateCOde(names)

          return {
            Code: code,
            QrCode: await QrCode(`${Config.SITE_URL}/info/drop/${CollectionNetwork}/${CollectionUrl}/${Creator}/${Id}/${Buffer.from(code).toString('base64')}`),
            Email: '',
            Status: 'generated',
          }
        }))
      }
      senddata = type !== "bulk"
        ? item.filename
        : {
          file: item.filename,
          TokenId: Id,
          Id: Id,
          TokenName: TokenName ? TokenName : Id,
          ProfileUrl: ProfileUrl,
          status: "drop",
          tx: "",
          Description: "",
          ArtistAddress: alldata.ArtistAddress,
          ArtistUrl: alldata.ArtistUrl,
          TokenPrice: alldata.CollectionPrice,
          TokenOwner: Creator,
          Quantity: alldata.Quantity,
          Balance: alldata.Quantity,
          promo: promos ?? [],
          expiry: null
        }
    })
  );
  console.log("newssend", senddata, JSON.stringify(senddata))
  return senddata;
};

export const compress_file_upload = async (compress_file) => {

  if (compress_file) {
    let newSend = await Promise.all(
      compress_file.map(async (item) => {
        const { data, name, mimetype } = item.files;
        // await fs.mkdir(item.path, { recursive: true }, async function () {
        var nftimg = await fs.promises.mkdir(item.path, { recursive: true })
        // var tokenname = await data.files.mv(data.path + data.filename)
        if (String(mimetype).includes("image")) {
          sharp(data, { animated: true })
            .webp({ quality: 80 })
            .toFile(item.path + item.filename)
            .then(() => {
              return true;
            })
            .catch((e) => {
              return false;
            });
          return item.filename;
        }
        if (
          String(mimetype).includes("audio") ||
          String(mimetype).includes("video")
        ) {
          var datvi = await ffmpeg(item.fie_path)
            .setStartTime("00:00:01")
            .setDuration(10)
            .output(item.path + item.filename)
            .on("end", function (err) {
              if (!err) {
                return true;
              }
            })
            .on("error", function (err) {
              return false;
            })
            .run();
          return item.filename;
        }
        // });
        return item.filename;


      })
    );
    return newSend.pop();
  }
};

export const ipfs_add = async (data) => {
  const { item, path } = data;
  console.log('ipfssssaddddd', data)
  var res = false;
  try {
    if (!res) {
      var command = `curl -X POST -F file=@${path} -u ${Config.IPFSKEY}:${Config.IPFSPASS} https://ipfs.infura.io:5001/api/v0/add`;
      const { stdout, stderr, error } = await exec(command);
      if (error) {
        console.log("ipfserr", error);
        return error.toString();
      }
      if (stdout) {
        console.log("ipfssuccess");
        return JSON.parse(stdout)?.Hash ? JSON.parse(stdout)?.Hash : "";
      }
    } else {
      await ipfs_add({ item, path });
    }
  } catch (err) {
    console.log("eerrrereere", err);
    return ipfs_add(data)
  }
};

export const Node_Mailer = async ({ Type, EmailId, Subject, OTP, click, promo, QrCode, username }) => {
  try {
    let data = {
      DBName: EmailTemplates,
      FinData: { Type: Type },
      SelData: { _id: 0, Type: 1, Content: 1 },
    };
    // let htmldata = "";
    let dirpath = './public/naifty_email.html'
    // let htmldata = fs.readFileSync(path, 'utf8');

    let htmldata = await fs.promises.readFile(path.resolve(dirpath), { encoding: 'utf-8' })
    console.log("datainhtml", htmldata);


    let List = await FindOne(data);
    if (Type == "forgot") {

      let dbContent = (List?.msg?.Content).toString().replace(/000/g, OTP);
      var Content = htmldata.toString().replace("[[HTMLCONTENT]]", dbContent)

    }
    else if (Type == "mint" || Type == "transfer_drop" || Type == "putonsale" || Type == "cancelorder" || Type == "lower" || Type == "buy_owner" || Type == "sell_owner" || Type == "accept" || Type == "edit_bid" || Type == "cancel_bid" || Type == "bid" || Type == "changeprofile") {
      console.log("datacomingingretting", List?.msg?.Content)

      let dbContent = (List?.msg?.Content).toString().replace('http://a', click);
      var Content = htmldata.toString().replace("[[HTMLCONTENT]]", dbContent)

    }
    else if (Type == "promo") {
      let dbContent = (List?.msg?.Content).toString().replace('http://a', click).replace('000000', promo)
      var Content = htmldata.toString().replace("[[HTMLCONTENT]]", dbContent)

    }
    else if (Type == 'greeting') {

      console.log("datacomingingretting", List?.msg?.Content)
      let dbContent = (List?.msg?.Content).toString().replace("{{username}}", username)
      var Content = htmldata.toString().replace("[[HTMLCONTENT]]", dbContent)
    }
    else {
      let dbContent = List?.msg?.Content
      var Content = htmldata.toString().replace("[[HTMLCONTENT]]", dbContent)

    }

    let smtp = nodemailer.createTransport(
      Config.keyEnvBased.emailGateway.nodemailer
    );
    console.log("Content", Content)
    let info = await smtp.sendMail({
      from: Config.keyEnvBased.emailGateway.fromMail, // sender address
      to: EmailId, // list of receivers
      subject: Subject, // Subject line
      html: Content, // html body
    });
    console.log("info", info)
    return true;
  } catch (E) {
    console.log("info", E)

    return false;
  }
};

export const Encryptdata = (data) => {
  const encJson = CryptoJS.AES.encrypt(JSON.stringify(data), Config.SECRET_KEY).toString();
  const encData = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encJson)
  );
  return encData;
}

export const Decryptdata = (data, key) => {
  // try catch commented so we can send response for unauthorised users
  // try {
  if (isEmpty(data)) {
    return data
  }
  if (key) {
    return CryptoJS.AES.decrypt(data, Config.SECRET_KEY).toString(CryptoJS.enc.Utf8)
  }
  else {
    const decData = CryptoJS.enc.Base64.parse(data)?.toString(CryptoJS.enc.Utf8);
    const bytes = CryptoJS.AES.decrypt(decData, Config.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    console.log("Decryptdata_Decryptdata", data, JSON.parse(bytes))

    return JSON.parse(bytes)
  }


  // }
  // catch (e) {
  //   console.log("SDSDFSD", e);
  //   return ''
  // }
}

export const containsDuplicates = async (array) => {
  if (array.length !== new Set(array).size) {
    return true;
  } else {
    return false;

  }

}

export const getDaysOfDesiredMonth = (month) => {

  // Get the current date
  var currentDate = new Date();

  // Set the target date to March 1 of the current year
  var targetDate = new Date(currentDate.getFullYear(), month, 1); // Note: Months are 0-indexed, so March is represented by 2
  console.log("targetDate", targetDate);
  // Calculate the difference in days
  var timeDifference = targetDate.getTime() - currentDate.getTime();
  var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  console.log("Days until", daysDifference);

  var newStartDate = new Date(currentDate.getFullYear(), month - 3, 1); // Note: Months are 0-indexed, so March is represented by 2


  // days difference from now and previous day of 1
  return {
    days: daysDifference - 1,
    dateFormat: targetDate.toISOString(),
    startDate: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
    newStartDate
  }
}


export const getDateObject = (date) => {
  const dateObj = new Date(date ?? Date.now())
  return {
    date: dateObj.getDate(),
    month: dateObj.getMonth(),
    year: dateObj.getFullYear()
  }
}

export const UseWeb3 = async (rpc) => {
  ////console.log("dadasdasd",tokenType);
  // const RPC_URL = UseRPCURL(tokenType);
  const httpProvider = new Web3.providers.HttpProvider(Config.SEPOLIA_RPC);
  const web3 = new Web3(httpProvider);
  // console.log("Dasdrcp",web3)
  return web3;
};

export const UsePrivateWallet = async (key, rpc) => {
  const web3 = await UseWeb3(rpc);
  console.info("key", key);
  await web3.eth.accounts.wallet.add(key);
  return web3;
};

export const contrat_connection = async (...data) => {
  try {

    const web3 = await UsePrivateWallet(Config.adminPrivKey);

    var contract_value = new web3.eth.Contract(
      ...data
    );
    return contract_value;
  } catch (e) {
    console.log('eeee---->', e);
  }

}

export const getAddress = async () => {
  try {
    const web3 = await UseWeb3()
    var network = await web3.eth.accounts.privateKeyToAccount(
      Config.adminPrivKey
    );
    return network.address
  } catch (e) {
    console.log('Error getAddress---->', e);
  }
}

export const methodsArr = [
  'CancelOrder',
  'ChangePrice',
  'OrderPlace',
  'acceptBId',
  'bidNFT',
  'cancelBid',
  'cancelBidBySeller',
  'cancelOrder',
  'changePrice',
  'editBid',
  'lazyMinting',
  'minting',
  'orderPlace',
  'order_place',
  'saleToken',
  'saleWithToken'
]

export function extractAlphabets(inputString) {
  try {
      if (isEmpty(inputString)) return "";
      const regex = /[a-zA-Z]+/g;
      const matches = inputString.match(regex);
      const result = matches ? matches.join('') : '';
      return result;
  } catch (e) {
      console.log('Erro on extractAlphabets---->', e);
      return false
  }

}