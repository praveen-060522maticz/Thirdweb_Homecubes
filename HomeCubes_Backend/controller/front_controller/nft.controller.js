import * as MongooseHelper from "../../helper/mongooseHelper";
import Tokens from "../../models/front_models/token.schema";
import TokenOwners from "../../models/front_models/tokenowner.schema";
import Category from "../../models/admin_models/category.schema";
import Bids from "../../models/front_models/bid.schema";
import userSchema from "../../models/front_models/user.schema";
import gallery from '../../models/admin_models/gallery.schema';
import stakeSchema from '../../models/front_models/stake.schema';
import RewardSchema from '../../models/admin_models/reward.schema';
import PendingTrans from '../../models/front_models/pendingTransactions.schema';
import Transactions from '../../models/front_models/transactions.schema';
import mongoose from 'mongoose'

import axios from 'axios'
// import fetch from "node-fetch";

var http = require('http');
var https = require('https');
var Stream = require('stream').Transform;
var ObjectId = mongoose.Types.ObjectId;

import collection from "../../models/front_models/collection.schema"


// import lik
import {
  ImageAddFunc,
  compress_file_upload,
  ipfs_add,
  isEmpty,
  Node_Mailer,
  Encryptdata
} from "../../helper/commonFUnction";
import config from "../../config/serverConfig";
import fs from "fs";
import Collection from "../../models/front_models/collection.schema";
import ActivitySchema from "../../models/front_models/activity.schema";
import LikeDb from "../../models/front_models/like.schema"
import CollectionLikeSchema from "../../models/front_models/collectionlike.schema"
import projectSchema from "../../models/admin_models/project.schema";
const util = require("util");
var movefile = util.promisify(fs.writeFile);
var MkDir = util.promisify(fs.mkdir);




export const validateNFTName = async (req, res) => {
  let data = {
    DBName: Tokens,
    FinData: { NFTName: req.body.NFTName },
    SelData: { _id: 0, NFTName: 1 },
  };
  let List = await MongooseHelper.FindOne(data);
  if (List.success == "success")
    res.json({ success: "error", msg: "TokenName Already exits" });
  else res.json({ success: "success", msg: null });
};

//NFT image and IPFS upload Function
export const nftImageUpload = async (req, res) => {
  try {
    // var OrginalFile;
    const { NFTCreator, NFTName, NFTDescription, type, NFTProperties } = req.body;
    var response;
    var OrginalFile;
    var ImgTYpeName;

    var ref = Date.now();
    var JSOnpat = "public/nft/" + NFTCreator + "/jsonfolder";
    var MetFile = `${NFTName.toLowerCase().replace(/\s/g, "")}.txt`;

    response = type == "list" ? await axios.get(req?.body?.NFTOrginalImage, { responseType: 'arraybuffer' }) : undefined
    OrginalFile = type == "list" ? Buffer.from(response.data, "utf-8") : req?.files?.NFTOrginalImage
    ImgTYpeName = type == "list" ? (response.headers["content-type"].includes('image') ? `${ref}.webp` : response.headers["content-type"].includes('video') ? `${ref}.webm` : `${ref}.mp3`) : ref + "." +
      req?.files?.NFTOrginalImage.name.split(".")[
      req?.files?.NFTOrginalImage.name.split(".").length - 1
      ]
    if (type == "list") {
      await MkDir(`public/nft/${NFTCreator}/Original/NFT/`, { recursive: true })
    }
    console.log("one 1")
    var NFTOrginalImage;
    if (OrginalFile) {
      NFTOrginalImage = type == "list"
        ? await movefile(`public/nft/${NFTCreator}/Original/NFT/${ImgTYpeName}`, OrginalFile)
        : await ImageAddFunc([
          {
            path: `public/nft/${NFTCreator}/Original/NFT/`,
            files: req.files?.NFTOrginalImage,
            filename: ImgTYpeName,
          },
        ]);
      console.log("OrginalFile", OrginalFile, NFTOrginalImage)

      var CompressedFile = await compress_file_upload([
        {
          path: `public/nft/${NFTCreator}/Compressed/NFT/`,
          files: type == "list" ? {
            data: Buffer.from(response.data, "utf-8"), name: ref, mimetype: response.headers["content-type"]
          } : req?.files?.NFTOrginalImage,
          filename:
            type == "list" ? (response.headers["content-type"].includes('image') ? `${ref}.webp` : response.headers["content-type"].includes('video') ? `${ref}.webm` : `${ref}.mp3`)
              :
              ref +
              (req.files.NFTOrginalImage.mimetype.includes("image")
                ? ".webp"
                : req.files.NFTOrginalImage.mimetype.includes("video")
                  ? ".webm"
                  : ".mp3"),
          fie_path:
            `public/nft/${NFTCreator}/Original/NFT/` +
            ImgTYpeName
        },
      ]);

      // console.log('dgjgfjsjhgfsh',CompressedFile)
      // if(NFTOrginalImage != undefined){
      console.log("ipfs,originalimage");
      var NFTOrginalImageIpfs = type == "list" ? undefined : await ipfs_add({
        item: "img",
        path: `public/nft/${NFTCreator}/Original/NFT/${NFTOrginalImage}`,
      });
      // }
      console.log('NFTOrginalImageIpfs', NFTOrginalImageIpfs)

      if (req?.files?.NFTThumpImage) {
        var NFTThumpImage =
          await ImageAddFunc([
            {
              path: `public/nft/${NFTCreator}/Original/NFT_THUMB/`,
              files: req.files.NFTThumpImage,
              filename:
                ref +
                "." +
                req.files.NFTThumpImage.name.split(".")[
                req.files.NFTThumpImage.name.split(".").length - 1
                ],
            },
          ]);
        var CompressedThumbFile = await compress_file_upload([
          {
            path: `public/nft/${NFTCreator}/Compressed/NFT_THUMB/`,
            files: req.files.NFTThumpImage,
            filename: ref + ".webp",
          },
        ]);
        var NFTThumpImageIpfs = await ipfs_add({
          item: "img",
          path: `public/nft/${NFTCreator}/Original/NFT_THUMB/${NFTThumpImage}`,
        });
        console.log('NFTThumpImageIpfs', NFTThumpImageIpfs)
      } else {
        var NFTThumpImage = "",
          NFTThumpImageIpfs = "",
          CompressedThumbFile = "";
      }
      if (type == "list") {
        fs.mkdir(JSOnpat, { recursive: true }, function (err, data) {
          if (err) return false;
          fs.writeFile(
            `${JSOnpat}/${MetFile}`,
            `${req.body.MetFile}`,
            async function (err, data) {
              if (err) return err;
              console.log("dasdasd", err, data)
              return res.json({
                success: "success",
                msg: "Uploaded Successfully",
                data: {
                  NFTOrginalImage: ImgTYpeName,
                  CompressedFile: CompressedFile,
                  MetFile: MetFile,
                },
              });

            }
          );
        });
      }
      else {
        if (
          NFTOrginalImage &&
          NFTOrginalImageIpfs &&
          (NFTOrginalImage || NFTThumpImage) &&
          (NFTOrginalImageIpfs || NFTThumpImageIpfs)
        ) {
          var newmetadata = {
            name: NFTName,
            image: req.files.NFTOrginalImage.mimetype.includes("image")
              ? config.IPFS_IMG + NFTOrginalImageIpfs
              : config.IPFS_IMG + NFTThumpImageIpfs,
            description: NFTDescription,
          };
          if (NFTThumpImage) {
            newmetadata.animation_url = config.IPFS_IMG + NFTOrginalImageIpfs;
          }
          if (NFTProperties.length > 0) {
            var arrayproperty = JSON.parse(NFTProperties);
            var properties = [];
            arrayproperty.map((val) => {
              properties.push({ "trait_type": Object.keys(val)[0], "value": Object.values(val)[0] });
            });
            newmetadata.attributes = properties;
          }
          fs.mkdir(JSOnpat, { recursive: true }, function (err, data) {
            if (err) return false;
            var senddata = JSON.stringify(newmetadata);
            fs.writeFile(
              `${JSOnpat}/${MetFile}`,
              `${senddata}`,
              async function (err, data) {
                if (err) return err;
                var MetaData = await ipfs_add({
                  item: "img",
                  path: `${JSOnpat}/${MetFile}`,
                });
                if (MetaData) {
                  res.json({
                    success: "success",
                    msg: "Uploaded Successfully",
                    data: {
                      NFTOrginalImage: NFTOrginalImage,
                      NFTThumpImage: NFTThumpImage,
                      CompressedFile: CompressedFile,
                      CompressedThumbFile: CompressedThumbFile,
                      NFTOrginalImageIpfs: NFTOrginalImageIpfs,
                      NFTThumpImageIpfs: NFTThumpImageIpfs,
                      MetaData: MetaData,
                      MetFile: MetFile,
                    },
                  });
                } else
                  res.json({
                    success: "error",
                    msg: "Uploaded Failed",
                    data: {},
                  });
              }
            );
          });
        }
      }

    }
  } catch (e) {
    console.log("error msg", e);
    return res.json({ success: "error", mgs: e.toString() });
  }
};

//New NFT Creation Function
export const createNewNFT = async (req, res) => {
  try {
    const {
      click,
      CollectionNetwork,
      CollectionName,
      NFTId,
      NFTName,
      Category,
      NFTDescription,
      NFTOrginalImage,
      NFTThumpImage,
      UnlockContent,
      CollectionSymbol,
      ContractAddress,
      ContractType,
      NFTRoyalty,
      NFTProperties,
      CompressedFile,
      CompressedThumbFile,
      NFTOrginalImageIpfs,
      NFTThumpImageIpfs,
      MetaData,
      MetFile,
      NFTCreator,
      NFTQuantity,
      PutOnSale,
      PutOnSaleType,
      NFTPrice,
      CoinName,
      ClockTime,
      EndClockTime,
      HashValue,
      NFTOwner,
      activity,
      NFTBalance,
      EmailId
    } = req.body;
    console.log("req.bodyadd", req.body);
    var TokenADd = await TokenOwnerADD(
      {
        CollectionNetwork,
        CollectionName,
        MetFile,
        CollectionSymbol,
        NFTId,
        NFTName,
        Category,
        NFTDescription,
        NFTOrginalImage,
        NFTThumpImage,
        UnlockContent,
        ContractAddress,
        ContractType,
        NFTRoyalty,
        NFTProperties,
        CompressedFile,
        CompressedThumbFile,
        NFTOrginalImageIpfs,
        NFTThumpImageIpfs,
        MetaData,
        NFTCreator,
        NFTQuantity,
        activity,
      },
      {
        PutOnSale,
        PutOnSaleType,
        NFTPrice,
        CoinName,
        ClockTime,
        EndClockTime,
        HashValue,
        NFTOwner,
        NFTBalance,
      }
    );

    // if (activity == "Mint" && TokenADd.success == "success") var Send_Mail = await Node_Mailer({ Type: 'mint', EmailId: EmailId, Subject: `Minting An ${(CollectionNetwork == 'BSC') ? "BEP" : 'ETH'}${(ContractType == 721 || ContractType == "721") ? '721' : '1155'}`, OTP: '', click: click })
    // // if(activity == "TransfersFiat" && TokenADd.success == "success") var Send_Mail   =   await Node_Mailer({Type:'transfer_drop',EmailId:EmailId,Subject:'Tranfer Drop',OTP:'',click:click})
    // if (activity == "PutOnSale" && TokenADd.success == "success") var Send_Mail = await Node_Mailer({ Type: 'putonsale', EmailId: EmailId, Subject: 'Listing An NFT', OTP: '', click: click })
    // if (activity == "CancelOrder" && TokenADd.success == "success") var Send_Mail = await Node_Mailer({ Type: 'cancelorder', EmailId: EmailId, Subject: 'Cancel Price An NFT', OTP: '', click: click })
    // if (activity == "Lower" && TokenADd.success == "success") var Send_Mail = await Node_Mailer({ Type: 'lower', EmailId: EmailId, Subject: 'Changing Price An NFT', OTP: '', click: click })
    await MongooseHelper.Activity({
      From:
        (activity === "Mint" || activity === "List")
          ? "NullAddress"
          : activity === "TransfersFiat"
            ? NFTCreator
            : NFTOwner,
      To: (activity === "Mint") ? NFTCreator : NFTOwner,
      Activity: activity,
      NFTPrice: NFTPrice,
      Type: PutOnSale ? PutOnSaleType : "Not For Sale",
      CoinName: CoinName,
      NFTQuantity: NFTQuantity,
      HashValue: HashValue,
      NFTId: NFTId,
      ContractType: ContractType,
      ContractAddress: ContractAddress,
      CollectionNetwork: CollectionNetwork,
      Category: Category,
      CollectionSymbol: CollectionSymbol,
    });
    res.json(Encryptdata(TokenADd));
  } catch (e) {
    console.log("Dsadasd", e);
    return res.json(Encryptdata({ success: "error", mgs: [], catch: e }));
  }
};

//Add NFT Owner (TokenTable)
export const TokenOwnerADD = async (data, tokenOWN) => {
  tokenOWN.NFTBalance = tokenOWN.NFTBalance
    ? tokenOWN.NFTBalance
    : tokenOWN.NFTQuantity
      ? tokenOWN.NFTQuantity
      : data.NFTQuantity;
  tokenOWN.NFTId = data.NFTId;
  tokenOWN.NFTOwner = tokenOWN.NFTOwner ? tokenOWN.NFTOwner : data.NFTCreator;
  tokenOWN.Status = "list";
  //   tokenOWN.PutOnSale == true || tokenOWN.PutOnSale == "true"
  //     ? "list"
  //     : "not-list";

  let data_already_token = {
    DBName: TokenOwners,
    FinData: {
      NFTId: data.NFTId,
      NFTOwner: tokenOWN.NFTOwner ? tokenOWN.NFTOwner : data.NFTCreator,
    },
    SelData: { _id: 0, NFTRoyalty: 1, NFTBalance: 1 },
  };
  let data_already_token_list = await MongooseHelper.FindOne(
    data_already_token
  );
  tokenOWN.NFTBalance =
    data.activity === "TransfersFiat"
      ? data_already_token_list?.msg?.NFTBalance
        ? Number(data_already_token_list?.msg?.NFTBalance) +
        Number(tokenOWN.NFTBalance)
        : tokenOWN.NFTBalance
      : tokenOWN.NFTBalance;
  var finVal = {
    DBName: TokenOwners,
    FinData: {
      NFTId: data.NFTId,
      NFTOwner: tokenOWN.NFTOwner ? tokenOWN.NFTOwner : data.NFTCreator,
    },
    Updata: { $set: tokenOWN },
    save: { new: true },
  };
  const Finddata = await MongooseHelper.FindOneAndUpdate(finVal);
  console.log("data_already_token_list", tokenOWN, Finddata, Finddata?.data?.NFTBalance);
  if (Finddata.data) {
    if (Finddata.data.NFTBalance == 0 || Finddata.data.NFTBalance == "0") {
      var add = await TokenADD(data, Finddata.data._id, "up");
    } else {
      var add = await TokenADD(data, Finddata.data._id, "nor");
    }
    return Finddata;
  } else {
    tokenOWN.NFTQuantity = tokenOWN.NFTQuantity
      ? tokenOWN.NFTQuantity
      : data.NFTQuantity;
    tokenOWN.NFTBalance = tokenOWN.NFTBalance
      ? tokenOWN.NFTBalance
      : tokenOWN.NFTQuantity
        ? tokenOWN.NFTQuantity
        : data.NFTQuantity;
    var SenVal = { DBName: TokenOwners, Data: tokenOWN };
    let Resp = await MongooseHelper.Save(SenVal);
    console.log("hgddfh", Resp);
    if (Resp.success === "success") {
      var add = await TokenADD(data, Resp.data._id, "nor");
      return add;
    } else {
      console.log("Dsadasd", Resp);
      return Resp;
    }
  }
};

//Add NFT Owner (TokenOwners Table)
export const TokenADD = async (data, _id, val) => {
  console.log("skjfdgjsdfg", _id);
  data.NFTOwnerDetails = [_id];
  var newdata = {
    data,
  };
  let data_chk = {
    DBName: TokenOwners,
    FinData: { NFTBalance: '0', _id }, SelData: {}
  };
  let List_chk = await MongooseHelper.FindOne(data_chk);
  console.log("List_chk", List_chk);
  var update = val === 'nor' ? { $push: { NFTOwnerDetails: _id } } : { $pull: { NFTOwnerDetails: _id } }
  // var update =
  //   List_chk.success == "success" && List_chk.msg
  //     ? { $pull: { NFTOwnerDetails: _id } }
  //     : { $push: { NFTOwnerDetails: _id } };
  var finVal = {
    DBName: Tokens,
    FinData: { NFTId: data.NFTId, NFTCreator: data.NFTCreator },
    Updata: update,
    save: { new: true },
  };
  var Find = await MongooseHelper.FindOneAndUpdate(finVal);
  if (Find.data) {
    return Find;
  } else {
    var SenVal = { DBName: Tokens, Data: newdata.data };
    let Resp = await MongooseHelper.Save(SenVal);
    return Resp;
  }
};
//Get Token List
export const Tokenlistfunc = async (req, res) => {
  const { TabName, limit, CustomUrl, page, from, CollectionSymbol } = req.query;
  var SendDta = {};
  console.log('hghgdsjgdj', req.query)
  SendDta.limit = parseInt(limit) ?? 1;
  SendDta.skip = ((page ? parseInt(page) : 1) - 1) * limit;
  SendDta.CustomUrl = CustomUrl;
  SendDta.from = from;

  if (from == "Explore") {
    const { filter } = req.query
    console.log('fgfgbfgbfbgv', filter, req.query)
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          // { '$eq':['$Status', 'list' ]},
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
        ],
      },
    };
    var TabNames =
      TabName == "All" ||
        TabName == "LatestDrops" ||
        TabName == "PriceLowToHigh" ||
        TabName == "PriceHighToLow"
        ? ""
        : TabName;
    // SendDta.TokenMatch = {
    //   Category: TabNames ? TabNames : { $ne: "" },
    //   reported: { $eq: false },
    // };
    // SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    if (filter == "PriceLowToHigh") {
      SendDta.TokenMatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        reported: { $eq: false }
      };
      SendDta.sort = { "NFTPrice": 1 };
    } else if (filter == "PriceHighToLow") {
      SendDta.TokenMatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        reported: { $eq: false }
      };
      SendDta.sort = { "NFTPrice": -1 };
    } else if (filter == "oldest") {
      SendDta.sort = { "tokenowners_list.updatedAt": 1 };
      SendDta.TokenMatch = { Category: TabNames ? TabNames : { $ne: "" }, };
    } else if (filter == "recentlisted") {
      SendDta.tokenOwnerMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            // { '$eq':['$Status', 'list' ]},
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTId", "$$tId"] },
          ],
        },
      };
      SendDta.Activitymatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        Type: { $ne: "Not For Sale" }
      }
    } else if (filter == "recentcreated") {
      SendDta.tokenOwnerMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            // { '$eq':['$Status', 'list' ]},
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTId", "$$tId"] },
          ],
        },
      };
      SendDta.Activitymatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        Activity: "Mint"
      };
    } else if (filter == "recentsold") {
      SendDta.tokenOwnerMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            // { '$eq':['$Status', 'list' ]},
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTId", "$$tId"] },
          ],
        },
      };
      SendDta.Activitymatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        Activity: "Buy"
      };
    }
    SendDta.filter = filter
  } else if (from == "Auction") {
    const { filter } = req.query
    // console.log("to cehck data",new Date(new Date().setDate(new Date().getDate())))
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          // { '$eq':['$Status', 'list' ]},
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$PutOnSaleType", "TimedAuction"] },
          { $gt: ["$EndClockTime", new Date()] },
          { $lt: ["$ClockTime", new Date()] },
          // { $lt: ["$updatedAt", new Date()] },
          //       {
          //       $lt: [
          //         "$updatedAt",
          //       new Date(new Date().setDate(new Date().getDate() - 30))
          //       ],
          //     }
          {
            $and: [
              { $lt: ["$updatedAt", new Date()] },
              {
                $gt: [
                  "$updatedAt",
                  new Date(new Date().setDate(new Date().getDate() - 30)),
                ],
              },
            ],
          },
        ],
      },
    };
    var TabNames =
      TabName == "All" ||
        TabName == "LatestDrops" ||
        TabName == "PriceLowToHigh" ||
        TabName == "PriceHighToLow"
        ? ""
        : TabName;
    SendDta.TokenMatch = {
      Category: TabNames ? TabNames : { $ne: "" },
      reported: { $eq: false },
    };
    // SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    if (filter == "BLTH") {
      SendDta.sort = { "NFTPrice": 1 };
      // SendDta.TokenMatch = {};
    } else if (filter == "BHTL") {
      SendDta.sort = { "NFTPrice": -1 };
      // SendDta.TokenMatch = {};
    } else if (filter == "OLD") {
      SendDta.sort = { "tokenowners_list.updatedAt": 1 };
      // SendDta.TokenMatch = {};
    } else if (filter == "Recent") {
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
      // SendDta.TokenMatch = {};
    }
    if (!SendDta?.sort) {
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    }
  } else if (from == "Sale") {
    const { filter } = req.query
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
          { $eq: ["$PutOnSaleType", "FixedPrice"] },
          { $ne: ["$NFTPrice", "0"] },
          {
            $and: [
              { $lt: ["$updatedAt", new Date()] },
              {
                $gt: [
                  "$updatedAt",
                  new Date(new Date().setDate(new Date().getDate() - 30)),
                ],
              },
            ],
          },
        ],
      },
    };
    var TabNames =
      TabName == "All" ||
        TabName == "LatestDrops" ||
        TabName == "PriceLowToHigh" ||
        TabName == "PriceHighToLow"
        ? ""
        : TabName;
    SendDta.TokenMatch = {
      Category: TabNames ? TabNames : { $ne: "" },
      reported: { $eq: false },
    };
    // SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    if (filter == "BLTH") {
      SendDta.sort = { "NFTPrice": 1 };
      // SendDta.TokenMatch = {};
    } else if (filter == "BHTL") {
      console.log('fgbfsdhkghksdbgds')
      SendDta.sort = { "NFTPrice": -1 };
      // SendDta.TokenMatch = {};
    } else if (filter == "OLD") {
      SendDta.sort = { "tokenowners_list.updatedAt": 1 };
      // SendDta.TokenMatch = {};
    } else if (filter == "LatestDrops") {
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    }
    console.log('gfhbgdhb', SendDta, filter)
  } else if (from == "collection") {
    SendDta.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          // { '$eq':['$Status', 'list' ]},
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] },
        ],
      },
    };
    if (TabName == "LTH") {
      SendDta.TokenMatch = {
        reported: { $eq: false },
        CollectionSymbol: { $eq: CollectionSymbol },
      };
      SendDta.sort = { "NFTPrice": 1 };
    } else if (TabName == "HTL") {
      SendDta.TokenMatch = {
        reported: { $eq: false },
        CollectionSymbol: { $eq: CollectionSymbol },
      };
      SendDta.sort = { "NFTPrice": -1 };
    } else if (TabName == "OLD") {
      SendDta.TokenMatch = {
        reported: { $eq: false },
        CollectionSymbol: { $eq: CollectionSymbol },
      };
      SendDta.sort = { "tokenowners_list.upadatedAt": 1 };
    } else if (TabName == "NOW") {
      SendDta.TokenMatch = {
        reported: { $eq: false },
        CollectionSymbol: { $eq: CollectionSymbol },
      }; SendDta.sort = { "tokenowners_list.upadatedAt": -1 };
    } else if (TabName == 'new') {
      SendDta.TokenMatch = {
        reported: { $eq: false },
        CollectionSymbol: { $eq: CollectionSymbol },
      }
    }
    else {
      var TabNames =
        TabName == "All" ||
          TabName == "LatestDrops" ||
          TabName == "PriceLowToHigh" ||
          TabName == "PriceHighToLow"
          ? ""
          : TabName;
      SendDta.TokenMatch = {
        Category: TabNames ? TabNames : { $ne: "" },
        reported: { $eq: false },
        CollectionSymbol: { $eq: CollectionSymbol },
      };
      SendDta.sort = { "tokenowners_list.updatedAt": -1 };
    }
  }
  SendDta.Tokens = Tokens;

  SendDta.TabName = TabName;
  var RetData;
  if (SendDta.Activitymatch) {
    RetData = await MongooseHelper.ExplorewithActivity(SendDta)
  }
  else {
    RetData = await MongooseHelper.TokenList(SendDta);
  }
  console.log("response auciton", from, SendDta, RetData)
  res.json(RetData);
};

//Get NFT Info
export const info = async (req, res) => {
  console.log("check Query", req.query);
  const { Owner, Id, TabName, page, MyAdd, limit } = req.query;
  var SendDta = {},
    Bid = {},
    highBid = {},
    myBid = {};
  SendDta.NFTOwner = Owner;
  SendDta.NFTId = Id;
  SendDta.TokenMatch = {
    NFTId: Id,
    reported: false,
  };
  SendDta.limit = parseInt(limit) ?? 1;
  SendDta.skip = ((page ? parseInt(page) : 1) - 1) * limit;
  SendDta.sort = { "tokenowners_list.updatedAt": 1 };
  SendDta.tokenOwnerMatch = {
    $expr: {
      $and: [
        { $ne: ["$NFTBalance", "0"] },
        //    { '$eq':['$Status', 'list' ]},
        { $eq: ["$HideShow", "visible"] },
        { $eq: ["$NFTId", "$$tId"] },
      ],
    },
  };
  SendDta.myowner = {
    $expr: {
      $and: [
        { $ne: ["$NFTBalance", "0"] },
        { $eq: ["$NFTOwner", MyAdd] },
        { $eq: ["$HideShow", "visible"] },
        { $eq: ["$NFTId", "$$tId"] },
      ],
    },
  };
  myBid.BidMatch = {
    $expr: {
      $and: [
        { $eq: ["$NFTId", Id] },
        { $eq: ["$TokenBidderAddress", MyAdd] },
        { $eq: ["$deleted", 1] },
        { $ne: ["$TokenBidderAddress", Owner] },
        {
          $or: [
            { $eq: ["$status", "pending"] },
            { $eq: ["$status", "partiallyComplete"] },
          ],
        },
      ],
    },
  };
  myBid.sort = { updatedAt: -1 };
  highBid.BidMatch = {
    $expr: {
      $and: [
        { $eq: ["$NFTId", Id] },
        { $eq: ["$deleted", 1] },
        { $ne: ["$TokenBidderAddress", Owner] },
        {
          $or: [
            { $eq: ["$status", "pending"] },
            { $eq: ["$status", "partiallyComplete"] },
          ],
        },
      ],
    },
  };
  highBid.sort = { TokenBidAmt: -1 };

  if (TabName != "owner") {
    SendDta.tokenOwnerMatch["$expr"]["$and"].push({
      $eq: ["$NFTOwner", Owner],
    });
  }
  if (TabName == "bid") {
    Bid.BidMatch = {
      $expr: {
        $and: [
          { $eq: ["$NFTId", Id] },
          { $eq: ["$deleted", 1] },
          {
            $or: [
              { $eq: ["$status", "pending"] },
              { $eq: ["$status", "partiallyComplete"] },
            ],
          },
        ],
      },
    };
    Bid.sort = { TokenBidAmount: -1 };
  }
  if (TabName == "activity") {
  }
  SendDta.Tokens = Tokens;
  SendDta.TabName = TabName;
  var explore = {
    DBName: TokenOwners,
    limit: 4,
    MyAdd: MyAdd,
    sort: { updatedAt: -1 },
    match: {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq: ["$NFTOwner", Owner] },
          { $eq: ["$HideShow", "visible"] },
        ],
      },
    },
  };
  var RetData = {};
  RetData.token = await MongooseHelper.TokenInfo(SendDta);
  RetData.Explore = await MongooseHelper.Explore(explore);
  Bid.DBName = Bids;
  myBid.DBName = Bids;
  highBid.DBName = Bids;
  RetData.Bid =
    TabName == "bid" ? await MongooseHelper.BidInfo(Bid, SendDta) : [];
  RetData.myBid = Owner != MyAdd ? await MongooseHelper.BidInfo(myBid, SendDta) : {};
  RetData.highBid = await MongooseHelper.BidInfo(highBid, SendDta);
  RetData.UnlockContent = [];
  // console.log('RetDataffawfawf', JSON.stringify(RetData, null, 2))
  res.json(Encryptdata(RetData));
};

//MYITEM Page List of NFTs
export const MyItemTokenlistfunc = async (req, res) => {
  const {
    TabName,
    limit,
    CustomUrl,
    WalletAddress,
    NFTOwner,
    page,
    from,
    cursor,
    filter,
    filterValue,
    searchValue
  } = req.query;
  console.log("limit Testing", req.query);
  var SendDta = {};
  SendDta.limit = parseInt(limit) ?? 1;
  SendDta.skip = ((page ? parseInt(page) : 1) - 1) * limit;
  SendDta.CustomUrl = CustomUrl;
  SendDta.from = from;
  var Follow = {};
  if (from == "myItem") {
    if (TabName == "owned" || TabName == "onsale" || TabName == "liked") {

      if (filter == "LatestDrops") {
        SendDta.sort = { updatedAt: -1 };
      }
      else if (filter == "OLD") {
        SendDta.sort = { updatedAt: 1 };
      }
      else if (filter == "BHTL") {
        SendDta.sort = { NFTPrice: -1 };
      }
      else if (filter == "BLTH") {
        SendDta.sort = { NFTPrice: 1 };
      }
      if (TabName == "owned") {
        SendDta.fromMatch = {
          $expr: {
            $and: [
              { $ne: ["$NFTBalance", "0"] },
              { $eq: ["$HideShow", "visible"] },
              { $eq: ["$NFTOwner", NFTOwner] },
            ],
          },
        };
        SendDta.refMatch = {
          $expr: {
            $and: [{ $eq: ["$NFTId", "$$tId"] }, { $eq: ["$reported", false] }],
          },
        };
        // SendDta.sort = {  updatedAt: -1 };
        SendDta.refTable = "tokens";
        SendDta.fromTable = TokenOwners;

        if (filterValue == "staked") {
          SendDta.refMatch.$expr.$and.push({ $eq: ["$isStaked", true] })
        } else if (filterValue == "not-staked") {
          SendDta.refMatch.$expr.$and.push({ $eq: ["$isStaked", false] })
        }

        if (!isEmpty(searchValue)) {
          SendDta.refMatch.$expr.$and.push({ $regexMatch: { input: "$NFTName", regex: searchValue, options: "i" } })
        }

      }
      else if (TabName == "onsale") {
        SendDta.fromMatch = {
          $expr: {
            $and: [
              { $ne: ["$NFTBalance", "0"] },
              // { '$eq':['$Status', 'list' ]},
              { $eq: ["$HideShow", "visible"] },
              { $eq: ["$PutOnSale", "true"] },
              { $eq: ["$PutOnSaleType", "FixedPrice"] },
              { $eq: ["$NFTOwner", NFTOwner] },
            ],
          },
        };
        SendDta.refMatch = {
          $expr: {
            $and: [{ $eq: ["$NFTId", "$$tId"] }, { $eq: ["$reported", false] }],
          },
        };
        // SendDta.sort = { updatedAt: -1 };
        SendDta.refTable = "tokens";
        SendDta.fromTable = TokenOwners;
      }
      else if (TabName == "liked") {
        var data = {};
        data.DBName = LikeDb;
        data.FinData = { "CustomUrl": CustomUrl }
        data.SelData = { 'NFTId': 1 };
        var resp = await MongooseHelper.Find(data)
        console.log("After Like", resp.msg)
        var Id = [];
        Id = resp.msg.map((val) => val.NFTId)
        if (resp.msg && resp.msg.length > 0) {
          SendDta.fromMatch = {
            $expr: {
              '$and': [
                { '$ne': ['$NFTBalance', '0'] },
                { '$eq': ['$HideShow', 'visible'] },
                { '$in': ['$NFTId', Id] }
              ]
            }
          }

          SendDta.refMatch = {
            $expr: {
              '$and': [
                { $eq: ['$NFTId', '$$tId'] },
                { $eq: ['$reported', false] }
              ]
            }
          }
          //  SendDta.sort = {'updatedAt':-1}
          SendDta.refTable = 'tokens'
          SendDta.fromTable = TokenOwners
        }
        // SendDta.sort = { updatedAt: -1 };
      }
      // liked
    }
    else if (TabName == 'favourite') {
      var data = {};
      data.DBName = LikeDb;
      data.FinData = { "CustomUrl": CustomUrl }
      data.SelData = { 'NFTId': 1 };
      var resp = await MongooseHelper.Find(data)
      console.log("After Like", resp.msg)
      var Id = [];
      Id = resp.msg.map((val) => val.NFTId)
      console.log('idssssss', Id)
      if (resp.msg && resp.msg.length > 0) {
        SendDta.fromMatch = {
          $expr: {
            '$and': [
              { '$ne': ['$NFTBalance', '0'] },
              { '$eq': ['$HideShow', 'visible'] },
              { '$in': ['$NFTId', Id] }
            ]
          }
        }

        SendDta.refMatch = {
          $expr: {
            '$and': [
              { $eq: ['$NFTId', '$$tId'] },
              { $eq: ['$reported', false] }
            ]
          }
        }
        //  SendDta.sort = {'updatedAt':-1}
        SendDta.refTable = 'tokens'
        SendDta.fromTable = TokenOwners
      }
      SendDta.fromTable = TokenOwners
      SendDta.sort = { updatedAt: -1 };

    }
    else if (TabName == "following") {
      Follow.Follow_Initial_Match = {
        $expr: {
          $and: [
            { $eq: ["$WalletAddress", NFTOwner] },
            { $eq: ["$CustomUrl", CustomUrl] },
          ],
        },
      };
      Follow.unwind = "$Following";
      Follow.from = "follow";
      Follow.usermatchAdd = "$Following.Address";
      Follow.usermatchPro = "$Following.CustomUrl";

      Follow.fromTable = userSchema;
    }
    else if (TabName == "follower") {
      Follow.Follow_Initial_Match = {
        $expr: {
          $and: [
            { $eq: ["$WalletAddress", NFTOwner] },
            { $eq: ["$CustomUrl", CustomUrl] },
          ],
        },
      };
      Follow.unwind = "$Follower";
      Follow.from = "follower";
      Follow.usermatchAdd = "$Follower.Address";
      Follow.usermatchPro = "$Follower.CustomUrl";
      Follow.fromTable = userSchema;
    }
    else if (TabName == "activity") {
      SendDta.sort = { updatedAt: -1 };
      SendDta.Tokens = ActivitySchema;
      SendDta.TabName = TabName
      SendDta.TokenMatch = {
        $expr: {
          $or: [{ $eq: ["$From", NFTOwner] }, { $eq: ["$To", NFTOwner] }],
        },
      };
    }
    else if (TabName == "collection") {
      Follow.Follow_Initial_Match = {
        $expr: { $eq: ["$CollectionCreator", NFTOwner] },
      };
      Follow.unwind = "$Following";
      Follow.from = "collection";
      Follow.fromTable = Collection;
    } else {
      SendDta.fromMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTOwner", NFTOwner] },
          ],
        },
      };
      SendDta.refMatch = {
        $expr: {
          $and: [
            { $eq: ["$NFTId", "$$tId"] },
            { $eq: ["$reported", false] },
            { $eq: ["$projectId", TabName] }
          ],
        },
      };
      SendDta.refTable = "tokens";
      SendDta.fromTable = TokenOwners;
      SendDta.sort = { updatedAt: -1 };
    }

  }
  var RetData =
    (TabName == "following" || TabName == "follower")
      ? await MongooseHelper.FollowUnFollowList(Follow, SendDta)
      : TabName == "activity"
        ? await MongooseHelper.ActivityList(SendDta)
        : TabName == "usercollection"
          ? await MongooseHelper.UserCollection(SendDta.UserCollection, undefined)
          : TabName == "collection"
            ? await MongooseHelper.CollectionList(Follow, SendDta)
            : await MongooseHelper.MyItemList({ ...SendDta, NFTOwner });
  //  var RetData = await MongooseHelper.MyItemList(SendDta);
  console.log("resssawd", RetData, TabName);
  res.json(RetData);
};

//Place Order
export const CreateOrder = async (req, res) => {
  try {
    const {
      click,
      CollectionNetwork,
      CollectionName,
      NFTId,
      NFTName,
      Category,
      NFTDescription,
      NFTOrginalImage,
      NFTThumpImage,
      UnlockContent,
      ContractAddress,
      ContractType,
      NFTRoyalty,
      NFTProperties,
      CompressedFile,
      CompressedThumbFile,
      NFTOrginalImageIpfs,
      NFTThumpImageIpfs,
      MetaData,
      NFTCreator,
      NFTQuantity,
      PutOnSale,
      PutOnSaleType,
      NFTPrice,
      CoinName,
      ClockTime,
      EndClockTime,
      HashValue,
      NFTOwner,
      activity,
      NFTBalance,
      EmailId
    } = req.body;
    console.log("all come thala vali", req.body);
    var TokenADd = await TokenOwnerADD(
      {
        CollectionNetwork,
        CollectionName,
        NFTId,
        NFTName,
        Category,
        NFTDescription,
        NFTOrginalImage,
        NFTThumpImage,
        UnlockContent,
        ContractAddress,
        ContractType,
        NFTRoyalty,
        NFTProperties,
        CompressedFile,
        CompressedThumbFile,
        NFTOrginalImageIpfs,
        NFTThumpImageIpfs,
        MetaData,
        NFTCreator,
        NFTQuantity,
        activity,
        from: "MarketPlace",
      },
      {
        PutOnSale,
        PutOnSaleType,
        NFTPrice,
        CoinName,
        ClockTime,
        EndClockTime,
        HashValue,
        NFTOwner,
        NFTBalance,
      }
    );

    // if (activity == "PutOnSale" && TokenADd.success == "success") var Send_Mail = await Node_Mailer({ Type: 'putonsale', EmailId: EmailId, Subject: 'Listing An NFT', OTP: '', click: click })
    // if (activity == "CancelOrder" && TokenADd.success == "success") var Send_Mail = await Node_Mailer({ Type: 'cancelorder', EmailId: EmailId, Subject: 'Cancel Price An NFT', OTP: '', click: click })
    // if(activity == "Lower" && TokenADd.success == "success") var Send_Mail   =   await Node_Mailer({Type:'lower',EmailId:EmailId,Subject:'Changing Price An NFT',OTP:'',click:click})
    await MongooseHelper.Activity({
      From:
        activity === "Mint"
          ? "NullAddress"
          : activity === "TransfersFiat"
            ? NFTCreator
            : NFTOwner,
      To: activity === "Mint" ? NFTCreator : NFTOwner,
      Activity: activity,
      NFTPrice: NFTPrice,
      Type: PutOnSale ? PutOnSaleType : "Not For Sale",
      CoinName: CoinName,
      NFTQuantity: NFTQuantity,
      HashValue: HashValue,
      NFTId: NFTId,
      ContractType: ContractType,
      ContractAddress: ContractAddress,
      CollectionNetwork: CollectionNetwork,
      Category: Category,
    });
    res.json(Encryptdata(TokenADd));
  } catch (e) {
    console.log("Dsadasd", e);
    return res.json({ success: "error", mgs: [], catch: e });
  }
};

//Buy NFT
export const BuyAccept = async (req, res) => {
  console.log('adswdawdadad', JSON.stringify(req.body, null, 2));
  let List = await BUY_ACCEPT_FUNC(req.body.item, req.body.newOwner);
  if (req.body.newOwner.activity == "Buy" && List.success == "success") {
    var Send_Mail = await Node_Mailer({ Type: 'buy_owner', EmailId: req.body.newOwner.New_EmailId, Subject: 'Buying An NFT', OTP: '', click: req.body.newOwner.click })
    // var Send_Mail   =   await Node_Mailer({Type:'sell_owner',EmailId:req.body.newOwner.Old_EmailId,Subject:'Sold Out',OTP:'',click:req.body.newOwner.click})
  }

  if (List?.success === "success") {
    console.log("loooooooooooooooooooooooooooo", { "NFTId": req.body.item.NFTId, "TokenBidderAddress": req.body.newOwner.NewTokenOwner, "status": "pending", NFTQuantity: { $eq: Number(req.body.newOwner.NFTQuantity) } });
    var checkBid = await Bids.findOne({ "NFTId": req.body.item.NFTId, "TokenBidderAddress": req.body.newOwner.NewTokenOwner, "status": "pending", NFTQuantity: { $eq: Number(req.body.newOwner.NFTQuantity) } })
    console.log("checkBid", checkBid);
    // if(checkBid){
    //   var upData = await Bids.findOneAndUpdate({_id:ObjectId(checkBid._id)},{"status" : "completed","Completed" : Number(req.body.newOwner.NFTQuantity),"Pending" : 0})
    // }
    if (req.body.newOwner.initialBuy == false) {
      var changeInitialBuy = await userSchema.findOneAndUpdate({ WalletAddress: req.body.newOwner.NewTokenOwner }, { initialBuy: true }, { new: true })
      console.log("heelelelellechangeInitialBuy", changeInitialBuy);
    }

    var setActivity = {
      From: req.body.newOwner.NFTOwner,
      To: req.body.newOwner.NewTokenOwner,
      Activity: req.body.newOwner.activity,
      NFTPrice: req.body.newOwner.TP,
      CoinName: req.body.newOwner.CN,
      NFTQuantity: req.body.newOwner.NFTQuantity,
      HashValue: req.body.newOwner.HashValue,
      NFTId: req.body.item.NFTId,
      CollectionNetwork: req.body.item.CollectionNetwork,
      ContractType: req.body.item.ContractType,
      ContractAddress: req.body.item.ContractAddress,
      Category: req.body.item.Category,
      royaltyReceiver: req.body.newOwner.royaltyReceiver,
      earnPercentage: req.body.newOwner.earnPercentage,
      Earning: req.body.newOwner.Earning,
      projectId: req.body.newOwner.projectId,
    }

    console.log("checkSetActivityyy", setActivity);
    await MongooseHelper.Activity(setActivity);
  }
  return res.json(List);
};

const BUY_ACCEPT_FUNC = async (item, newOwner) => {
  try {
    console.log("BUYACEPT", item, newOwner)
    const { NFTId, ContractAddress, ContractType, NFTCreator } = item;
    const {
      NFTPrice,
      HashValue,
      NFTQuantity,
      NewTokenOwner,
      PutOnSale,
      PutOnSaleType,
      NFTOwner,
      activity,
    } = newOwner;
    if (NFTOwner) {
      let data = {
        DBName: TokenOwners,
        FinData: { NFTOwner: NFTOwner, NFTId: NFTId },
        SelData: {},
      };
      let List = await MongooseHelper.FindOne(data);
      console.log("List", List);
      if (List.msg) {
        let Quantitys = Number(List.msg.NFTBalance) - Number(NFTQuantity);
        var TokenADd = await TokenOwnerADD(
          { NFTId, ContractAddress, ContractType, NFTCreator },
          {
            NFTOwner,
            PutOnSaleType,
            PutOnSale,
            NFTBalance: Quantitys.toString(),
          }
        );
        if (TokenADd.success === "success") {
          let datas = {
            DBName: TokenOwners,
            FinData: { NFTOwner: NewTokenOwner, NFTId: NFTId },
            SelData: {},
          };
          let Lists = await MongooseHelper.FindOne(datas);
          //   console.log("TokenADd buyAccept Lists",Lists , TokenADd)

          var TokenADd1 = await TokenOwnerADD(
            { NFTId, ContractAddress, ContractType, NFTCreator },
            {
              NFTOwner: NewTokenOwner,
              NFTQuantity: String(List?.msg?.NFTQuantity),
              PutOnSaleType: "NotForSale",
              PutOnSale: "false",
              NFTBalance: Lists?.msg?.NFTBalance
                ? String(Number(Lists?.msg?.NFTBalance) + Number(NFTQuantity))
                : NFTQuantity,
              HashValue,
            }
          );



          // console.log("TokenADd",TokenADd1)
          return TokenADd1;
        } else return TokenADd;
      }
    } else return List;
  } catch (e) {
    console.log("098902930284803284098238409", e);
    return { success: "error", mgs: [] };
  }
};

//Bid NFT
export const BidAction = async (req, res) => {
  try {
    console.log("TokenOwner_Nameaaa", req.body);
    const {
      activity,
      EmailId,
      Category,
      TokenBidderAddress,
      CollectionNetwork,
      TokenBidderAddress_Name,
      HashValue,
      TokenBidAmt,
      ContractType,
      ContractAddress,
      NFTId,
      from,
      NFTOwner,
      CoinName,
      click,
    } = req.body;
    const NFTQuantity = Number(req.body.NFTQuantity);
    let data = {
      DBName: Bids,
      FinData: {
        TokenBidderAddress: TokenBidderAddress,
        NFTId: NFTId,
        ContractAddress: ContractAddress,
        ContractType: ContractType,
        deleted: 1,
        Pending: { $gt: 0 },
        status: "pending"
      },
      SelData: {},
    };
    let List = await MongooseHelper.FindOne(data);
    console.log("Bid Find", List, NFTQuantity, req.body.NFTQuantity);
    if (List.success == "success") {
      let update = req.body;
      if (from == "Edit") {
        update.NFTQuantity = NFTQuantity;
        update.Pending = NFTQuantity - List.msg.Completed;
        update.status = "pending";

        let findingData = {
          NFTId,
          NFTOwner,
          "PutOnSale": "true",
          "PutOnSaleType": "TimedAuction",
          "NFTBalance": "1"
        }

        let finVal = {
          DBName: TokenOwners,
          FinData: findingData,
          Updata: { "NFTPrice": TokenBidAmt },
          save: { new: true },
        };
        let Finds = await MongooseHelper.FindOneAndUpdate(finVal);

      } else if (from == "Cancel") {
        console.log("comed here");
        update.Pending = List.msg.Pending - NFTQuantity;
        update.Cancel = List.msg.Cancel + NFTQuantity;
        update.status = "cancelled";
      } else if (from == "accept") {
        update.Pending = List.msg.Pending - NFTQuantity;
        update.status = List.msg.Pending == NFTQuantity ? "completed" : "pending";
        update.Completed =
          List.msg.Pending == NFTQuantity
            ? NFTQuantity
            : List.msg.Completed + NFTQuantity;
      }
      var finVal = {
        DBName: Bids,
        FinData: data.FinData,
        Updata: update,
        save: { new: true },
      };
      var Finds = await MongooseHelper.FindOneAndUpdate(finVal);
      console.log("Bid Findupdate", Finds, finVal, update)
      if (from == "accept") {
        var tok = await BUY_ACCEPT_FUNC(req.body.item, req.body.newOwner);
        if (req.body.newOwner.activity == "Accept" && List.success == "success") {
          // var Send_Mail = await Node_Mailer({ Type: 'accept', EmailId: req.body.newOwner.New_EmailId, Subject: 'Buying An NFT', click: req.body.newOwner.click })
          // var Send_Mail = await Node_Mailer({ Type: 'sell_owner', EmailId: req.body.newOwner.Old_EmailId, Subject: 'Sold An Nft', click: req.body.newOwner.click })
        }

        var setActivity = {
          From: req.body.newOwner.NFTOwner,
          To: req.body.newOwner.NewTokenOwner,
          Activity: req.body.newOwner.activity,
          NFTPrice: req.body.newOwner.TP,
          CoinName: req.body.newOwner.CN,
          NFTQuantity: req.body.newOwner.NFTQuantity,
          HashValue: req.body.newOwner.HashValue,
          NFTId: req.body.item.NFTId,
          CollectionNetwork: req.body.item.CollectionNetwork,
          ContractType: req.body.item.ContractType,
          ContractAddress: req.body.item.ContractAddress,
          Category: req.body.newOwner.Category,
          royaltyReceiver: req.body.newOwner.royaltyReceiver,
          earnPercentage: req.body.newOwner.earnPercentage,
          Earning: req.body.newOwner.Earning,
          projectId: req.body.newOwner.projectId,
        }

        await MongooseHelper.Activity(setActivity);
        res.json(tok);
      } else {
        if ((from == "Edit" || from == "Cancel") && Finds.success === "success") {
          if (activity == "Edit") var Send_Mail = await Node_Mailer({ Type: 'edit_bid', EmailId: EmailId, Subject: 'Edit Offer For A NFT', OTP: '', click: click })
          if (activity == "Cancel") var Send_Mail = await Node_Mailer({ Type: 'cancel_bid', EmailId: EmailId, Subject: 'Cancel Offer For A NFT', OTP: '', click: click })

          await MongooseHelper.Activity({
            From: NFTOwner,
            To: TokenBidderAddress,
            Activity: activity,
            NFTPrice: TokenBidAmt,
            CoinName: CoinName,
            NFTQuantity: NFTQuantity,
            HashValue: HashValue,
            NFTId: NFTId,
            ContractType: ContractType,
            ContractAddress: ContractAddress,
            CollectionNetwork: CollectionNetwork,
            Category: Category,
          });
          console.log('daaataa',)
        }
        res.json(Finds);
      }
    } else {
      let datas = {
        DBName: Bids,
        Data: req.body,
      };
      datas.Data.Pending = NFTQuantity;
      const updateBids = await Bids.updateOne({ NFTId, status: "pending" }, { status: "cancelled" })
      let List = await MongooseHelper.Save(datas);
      if (List.success === "success") {
        if (activity == "Bid") var Send_Mail = await Node_Mailer({ Type: 'bid', EmailId: EmailId, Subject: 'Make Offer For A NFT', OTP: '', click: click })

        let findingData = {
          NFTId,
          NFTOwner,
          "PutOnSale": "true",
          "PutOnSaleType": "TimedAuction",
          "NFTBalance": "1"
        }

        let finVal = {
          DBName: TokenOwners,
          FinData: findingData,
          Updata: { "NFTPrice": TokenBidAmt },
          save: { new: true },
        };
        let Finds = await MongooseHelper.FindOneAndUpdate(finVal);

        await MongooseHelper.Activity({
          From: NFTOwner,
          To: TokenBidderAddress,
          Activity: activity,
          NFTPrice: TokenBidAmt,
          CoinName: CoinName,
          NFTQuantity: NFTQuantity,
          HashValue: HashValue,
          NFTId: NFTId,
          Category: Category,
          ContractType: ContractType,
          ContractAddress: ContractAddress,
          CollectionNetwork: CollectionNetwork,
        });
      }
      console.log("Bid Findupdate", List, datas);
      res.json(List);
    }
  } catch (e) {
    console.log('eerroorr', e)
  }
};


export const Findupdatebalance = async (req, res) => {

  try {
    var ReqBody = req?.body;
    var NFTId = String(ReqBody?.NFTId); //changed
    var NFTBalance = Number(ReqBody?.NFTBalance);
    var NFTOwner = ReqBody?.NFTOwner.toLowerCase();
    let Currentowner = ReqBody?.Currentowner.toLowerCase();

    var FinData = { WalletAddress: Currentowner };

    const findalreadyexist = await MongooseHelper.FindOne({
      DBName: userSchema,
      FinData: FinData,
      SelData: {},
    });

    if (findalreadyexist == 'error') {

      let saveData = {}
      saveData._id = Currentowner;
      saveData.CustomUrl = Currentowner;
      saveData.WalletAddress = Currentowner

      const savedata = await MongooseHelper.Save({
        DBName: userSchema,
        Data: saveData,
      });
    }

    var finddata = { DBName: TokenOwners, FinData: { NFTOwner: NFTOwner, NFTId: NFTId, NFTBalance: '1' }, Updata: { NFTBalance: '0', NFTPrice: "", PutOnSale: "false" } }
    var checkExistingbalance = await MongooseHelper.FindOneAndUpdate(finddata)

    let savedata = await MongooseHelper.Save({
      DBName: TokenOwners, Data: {
        "NFTId": NFTId,
        "NFTOwner": Currentowner,
        "HashValue": checkExistingbalance?.data?.HashValue,
        "PutOnSale": "false",
        "PutOnSaleType": "NotForSale",
        "NFTPrice": "",
        "CoinName": checkExistingbalance?.data?.CoinName,
        "Status": "list",
        "NFTQuantity": "1",
        "NFTBalance": "1",
        "ClockTime": null,
        "EndClockTime": null,
        "HideShow": "visible",
        "deleted": 0,
        "burnToken": 0,
        "Platform": "our",
        "bannerpromotion": false,
      }
    })
    // update in token DB 
    let updatetokens = await MongooseHelper.FindOneAndUpdate({ DBName: Tokens, FinData: { NFTId: NFTId }, Updata: { NFTOwnerDetails: [savedata?.data?._id] } })

    return res.status(200).json({ success: true });

  } catch (e) {
    console.log("error onFindupdatebalance", error);
  }


}


export const getCurrentProject = async (req, res) => {
  const { action, _id, limit, skip } = req?.query;
  console.log("req?.query", req?.query);
  try {
    if (action == "getNfts") {
      const Resp = await Tokens.find({ isMinted: false, projectId: _id }).skip(parseInt(skip)).limit(parseInt(limit));

      return res.json(Encryptdata({
        success: Resp.length != 0 ? "success" : "error",
        data: Resp,
        msg: Resp.length != 0 ? "success" : "error",
      }))
    } else {

      if (action == "all") {
        var sendData = { data: { projectTitle: { $ne: "" } }, isavailable: { $sum: { $cond: { if: { $eq: ["$isMinted", false] }, then: 1, else: 0 } } }, }
      } else {
        var sendData = { data: { _id: ObjectId(_id) }, isavailable: { $sum: { $cond: { if: { $and: [{ $lt: ["$UnlockAt", new Date()] }, { $eq: ["$isMinted", false] }] }, then: 1, else: 0 } } }, }
      }

      const resp = await MongooseHelper.projectTokenCount(sendData);
      // const resp = await MongooseHelper.projectTokenCount(action == "all" ? { projectTitle: { $ne: "" } } : { _id: ObjectId(_id) });

      console.log("resp on getprojects", resp);
      return res.json(Encryptdata({
        success: resp.length != 0 ? "success" : "error",
        data: resp,
        msg: resp.length != 0 ? "success" : "error",
      }))
    }


  } catch (error) {
    console.log(" errro on getCurrentProject", error);
  }
}


export const onInitialMint = async (req, res) => {
  const { mintCount, _id, NFTId } = req.body
  try {

    if (NFTId) {
      var tokenDatas = await Tokens.find({ NFTId })
    } else {
      const GetData = await projectSchema.aggregate([
        { $match: { _id: ObjectId(_id) } },
        {
          $lookup: {
            from: "tokens",
            let: { galId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $toObjectId: "$projectId" }, "$$galId"] },
                      { $lt: ["$UnlockAt", new Date()] },
                      { $eq: ["$isMinted", false] },
                      { $eq: ["$status", "available"] }
                    ]
                  }
                }
              },
              { $limit: parseInt(mintCount) },
            ],
            as: "tokens"
          }
        },
        // { $unwind: "$tokens" },
        {
          $project: {
            "AllTokens": "$tokens"
          }
        },

      ])

      console.log('GetData', JSON.stringify(GetData, null, 2))

      var tokenDatas = GetData[0].AllTokens
    }

    var MetFile = {
      "name": "",
      "image": "",
      "description": "",
      "animation_url": "",
      "attributes": []
    }

    var hash = await Promise.all(tokenDatas?.map(async (dataa) => {

      const upStatus = await Tokens.findOneAndUpdate({ _id: ObjectId(dataa?._id) }, { $set: { status: "inProgress" } })

      if (isEmpty(dataa.NFTOrginalImageIpfs)) {
        var imageipfshash = await ipfs_add({ path: `public/nft/${dataa.NFTCreator}/Original/${dataa.NFTOrginalImage}` })
        var JSOnpat = "public/nft/" + dataa.NFTCreator + "/jsonfolder";
        var MetFilename = `${dataa.NFTName.toLowerCase().replace(/\s/g, "")}.txt`;
        console.log("MetFilename", MetFilename);
        MetFile.name = dataa?.NFTName
        MetFile.description = dataa.description ? dataa.description : "";
        MetFile.attributes = dataa?.NFTProperties ?? []
        MetFile.image = config.IPFS_IMG + imageipfshash
        await fs.promises.mkdir(JSOnpat, { recursive: true })
        await fs.promises.writeFile(`${JSOnpat}/${MetFilename}`, `${JSON.stringify(MetFile)}`,)
        var Metfilehash = await ipfs_add({ path: `${JSOnpat}/${MetFilename}` })

        console.log("Metfilehash", Metfilehash);
        console.log("imageipfshash", imageipfshash);

        if (Metfilehash) {
          var update_data = {};
          update_data.DBName = Tokens;
          update_data.FinData = { NFTId: dataa.NFTId }
          update_data.Updata = { NFTOrginalImageIpfs: imageipfshash, MetaData: Metfilehash }
          update_data.save = { new: true };
          var resp = await MongooseHelper.FindOneAndUpdate(update_data);
          console.log("resp", resp);
          if (resp.success) {
            return Metfilehash;
          }
        }
      }
      else {
        return dataa?.MetaData;
      }
    }))

    console.log("hashhash", hash);

    return res.json(Encryptdata({ status: true, MetaData: hash, data: tokenDatas }))

  } catch (error) {
    console.log("erro on getTokens", error);
    return res.json(Encryptdata({ status: false, MetaData: [], data: [] }))
  }
}


export const Buymint = async (req, res) => {
  console.log("req.body", req.body)
  try {
    const { changedToken, isWhiteList, NFTOwner, HashValue, NFTPrice, CoinName } = req.body
    const updateDB = await Promise.all(changedToken.map(async (val) => {

      const reqData = {
        DBName: TokenOwners,
        Data: {
          NFTId: val.NFTId,
          NFTOwner: NFTOwner,
          HashValue: HashValue,
          NFTPrice: NFTPrice,
          CoinName: CoinName,
          Status: "notlist",
          NFTQuantity: "1",
          NFTBalance: "1",
        }
      }

      const createTokwnOwner = await MongooseHelper.Save(reqData)
      console.log("createTokwnOwner", createTokwnOwner);

      await new ActivitySchema({
        From: "",
        To: NFTOwner,
        Activity: "Mint",
        NFTPrice: NFTPrice,
        CoinName: CoinName,
        NFTQuantity: "1",
        HashValue: HashValue,
        Type: "",
        NFTId: val.NFTId,
        ContractType: "721",
        ContractAddress: val.ContractAddress,
        CollectionNetwork: "BNB",
        projectId: val.projectId
      }).save()

      val.NFTOwnerDetails.push(createTokwnOwner?.data?._id)
      const tokenUpdata = {
        NFTId: val.NFTId,
        Hash: val.Hash,
        isMinted: val.isMinted,
        NFTOwnerDetails: val.NFTOwnerDetails,
        status: "success"
      }

      const setTokens = await Tokens.findOneAndUpdate({ _id: val._id }, { $set: tokenUpdata }, { new: true })
      return setTokens
    }))

    if (isWhiteList) {
      const checkUser = await userSchema.find({ WalletAddress: NFTOwner });
      if (checkUser?.length == 0) {
        const saveDatas = await new userSchema({ _id: NFTOwner, WalletAddress: NFTOwner, CustomUrl: NFTOwner }).save()
      }
    }

    const GetData = await projectSchema.aggregate([
      { $match: { isCompleted: false } },
      {
        $lookup: {
          from: "tokens",
          let: { galId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toObjectId: "$projectId" }, "$$galId"] },
                    { $eq: ["$isMinted", false] }]
                }
              }
            },
          ],
          as: "tokens"
        }
      },
      { $unwind: "$tokens" },
      {
        $project: {
          "AllTokens": "$tokens"
        }
      },

    ])


    if (GetData[0]?.AllTokens?.length == 0) {
      const updateProject = await projectSchema.findOneAndUpdate({ isCompleted: false }, { isCompleted: true })
    }

    return res.json(Encryptdata({
      success: "success",
      data: updateDB,
      status: true
    }))
  }
  catch (err) {
    console.log('buyerr', err);
    return res.json(Encryptdata({ status: false }))
  }
};

export const getGallery = async (req, res) => {

  const { action, projectId } = req.query
  try {
    if (action == "getOneProjects") {
      const getData = await gallery.find({ projectId, deleted: false });
      console.log('getDatagetData', getData);
      return res.json(Encryptdata({
        success: getData.length != 0 ? "success" : "error",
        data: getData,
        msg: getData.length != 0 ? "success" : "error",
      }))
    } else {
      const galleries = await gallery.find({}).sort({ updatedAt: 1 }).populate("projectId");
      return res.json(Encryptdata({
        success: galleries.length != 0 ? "success" : "error",
        data: galleries,
        msg: galleries.length != 0 ? "success" : "error",
      }))
    }

  } catch (error) {
    console.log("errr onr getGallery", error);
    return res.json(Encryptdata({
      success: "error",
      data: [],
      msg: "error",
    }))
  }
}


export const getGalleryTokens = async (req, res) => {
  const { galleryId, filters, limit, skip, priceCal, action } = req?.query
  try {
    console.log('req?.query---->', req?.query);
    if (action == "onSale") {
      var SendDta = {}

      SendDta.tokenOwnerMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTId", "$$tId"] },
          ],
        },
      };
      SendDta.Activitymatch = {
        $in: ["$Activity", ["Buy", "Accept"]]
      };

      SendDta.skip = 0
      SendDta.limit = 6
      const getData = await MongooseHelper.ExplorewithActivity(SendDta)
      return res.json(Encryptdata({
        success: "success",
        data: getData.data,
        msg: getData.msg
      }))

    }

    var sendData = {}

    sendData.Tokens = Tokens
    sendData.limit = parseInt(limit)
    sendData.skip = parseInt(skip)
    sendData.sort = { "tokenowners_list.updatedAt": -1 }
    sendData.TokenMatch = {
      $expr: {
        $and: [
          { $eq: ["$isMinted", true] }
        ]
      }
    }

    sendData.tokenOwnerMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq: ["$PutOnSale", "true"] },
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTId", "$$tId"] }
        ],
      },
    }

    if (galleryId) {
      sendData.TokenMatch.$expr.$and.push({
        $eq: [
          "$projectId",
          galleryId
        ]
      })
    } else {
      sendData.TokenMatch.$expr.$and.push({
        $ne: [
          "$projectId",
          ""
        ]
      })
    }

    if (!isEmpty(priceCal)) {
      if (isEmpty(priceCal.Min)) {
        return res.json(Encryptdata({
          success: "error",
          msg: "Minimum value required",
          data: []
        }))
      }

      if (isEmpty(priceCal.Max)) {
        return res.json(Encryptdata({
          success: "error",
          msg: "Maximum value required",
          data: []
        }))
      }

      sendData.tokenOwnerMatch.$expr.$and.push(
        {
          "$gte": [
            { $toDouble: { $cond: { if: { $eq: ["$NFTPrice", ""] }, then: "0", else: "$NFTPrice" } } },
            parseFloat(priceCal.Min)
          ]
        },
        {
          "$lte": [
            { $toDouble: { $cond: { if: { $eq: ["$NFTPrice", ""] }, then: "0", else: "$NFTPrice" } } },
            parseFloat(priceCal.Max)
          ]
        }
      )

      sendData.sort = { "tokenowners_list.NFTPrice": 1 }
    }

    if (filters && filters?.length != 0) {
      sendData.tokenOwnerMatch.$expr.$and.push(
        { $eq: ["$PutOnSale", "true"] },
        { $in: ["$PutOnSaleType", filters] }
      )
    }


    console.log("galleryId", galleryId);
    const getDataa = await MongooseHelper.CollectionListBySymbol(sendData)
    // console.log("getDataa_getDataa", getDataa);
    return res.json(Encryptdata({
      success: "success",
      data: getDataa.data,
      msg: getDataa.msg
    }))

  } catch (error) {
    console.log("err on getCollectionTokens", error);
  }
}

export const getActivitiesByNftId = async (req, res) => {
  const { NFTId } = req.query
  try {
    const getData = await ActivitySchema.find({ NFTId }).sort({ createdAt: -1 });
    const getBidData = await Bids.find({ NFTId }).sort({ createdAt: -1 });
    return res.json(Encryptdata({
      success: getData.length != 0 ? "success" : "error",
      activityData: getData,
      bidData: getBidData
    }))
  } catch (error) {
    console.log("err on error", error);
  }
}

export const searchQueryForMyitems = async (req, res) => {
  const { keyWord, NFTOwner, limit, tokenSkip, projectSkip, collectionSkip } = req.query
  try {
    console.log("req.rhdrdrgdrquery", req.query);
    const collectionData = {}
    const projectData = {}

    const tokenData = {
      fromMatch: {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTOwner", NFTOwner] },
          ],
        },
      },
      refTable: "tokens",
      fromTable: TokenOwners,
      sort: { updatedAt: -1 },
      limit: parseInt(limit) ?? 1,
      skip: parseInt(tokenSkip),
      refMatch: {
        $expr: {
          $and: [
            { $eq: ["$NFTId", "$$tId"] },
            { $eq: ["$reported", false] },
            { $regexMatch: { input: "$NFTName", regex: keyWord, options: "i" } }
          ],
        },
      },
      from: "search"
    }

    //project params
    projectData.fromMatch = {
      $expr: {
        $and: [
          { $ne: ["$NFTBalance", "0"] },
          { $eq: ["$HideShow", "visible"] },
          { $eq: ["$NFTOwner", NFTOwner] },
        ],
      },
    }
    projectData.refMatch = {
      $expr: {
        $and: [{ $eq: ["$NFTId", "$$tId"] }, { $eq: ["$reported", false] }],
      },
    }
    projectData.projectMatch = {
      $expr: {
        $and: [
          { $eq: ["$_id", "$$proId"] },
          { $regexMatch: { input: "$projectTitle", regex: keyWord, options: "i" } }
        ]
      }
    }
    projectData.skip = parseInt(projectSkip)
    projectData.limit = parseInt(limit)


    // //collection params
    // collectionData.fromMatch = {
    //   $expr: {
    //     $and: [
    //       { $ne: ["$NFTBalance", "0"] },
    //       { $eq: ["$HideShow", "visible"] },
    //       { $eq: ["$NFTOwner", NFTOwner] },
    //     ],
    //   },
    // }
    // collectionData.refMatch = {
    //   $expr: {
    //     $and: [{ $eq: ["$NFTId", "$$tId"] }, { $eq: ["$reported", false] }],
    //   },
    // }
    // collectionData.collectionMatch = {
    //   $expr: {
    //     $and: [
    //       { $eq: ["$_id", "$$galId"] },
    //       { $regexMatch: { input: "$galleryTitle", regex: keyWord, options: "i" } }
    //     ]
    //   }
    // }
    // collectionData.skip = parseInt(collectionSkip)
    // collectionData.limit = parseInt(limit)



    const getProjects = await MongooseHelper.getMyNftAndStackCount(projectData);
    const getTokens = await MongooseHelper.MyItemList(tokenData)
    // const getCollection = await MongooseHelper.myItemSearch(collectionData)

    var sendData = {}


    if (getProjects?.length != 0) {
      let uniqueSet = new Set();
      const projects = getProjects.filter(obj => {

        if (uniqueSet.has(obj.projectTitle)) {
          return false;
        }

        uniqueSet.add(obj.projectTitle);
        return true;
      });
      sendData.projects = projects
    } else sendData.projects = [];

    if (getTokens?.success == "success") {
      sendData.Tokens = getTokens.data ?? []
    } else sendData.Tokens = []


    // sendData.collections = getCollection

    return res.json(Encryptdata(sendData))
  } catch (error) {
    console.log("errr on searchQueryForMyitems", error);
  }
}

export const getProjects = async (req, res) => {
  const { action, title, limit, skip, projectId, keyWord } = req.query
  try {

    if (action == "getOne") {
      const getData = await projectSchema.findOne({ projectTitle: title })
      if (getData) {
        const getNfts = await Tokens.find({ projectId: getData?._id, isMinted: true });

        const getNftLength = getNfts.length
        const getStacked = getNfts.filter(val => val?.isStaked)?.length
        const getUnstaked = getNftLength - getStacked

        return res.json(Encryptdata({
          success: "success",
          data: getData,
          nftLength: getNftLength,
          staked: getStacked,
          unStaked: getUnstaked,
          msg: "success"
        }));

      } else {
        return res.json(Encryptdata({
          success: "error",
          data: {},
          msg: "project not found"
        }))
      }

    }

    else if (action == "getNfts") {
      var sendData = {}

      sendData.Tokens = Tokens
      sendData.limit = parseInt(limit)
      sendData.skip = parseInt(skip)
      sendData.sort = { "tokenowners_list.updatedAt": -1 }
      sendData.TokenMatch = {
        $expr: {
          $and: [
            { $eq: ["$isMinted", true] },
            { $eq: ["$projectId", projectId] }
          ]
        }
      }

      sendData.tokenOwnerMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTId", "$$tId"] },
            { $eq: ["$PutOnSale", "true"] },
          ],
        },
      }

      const getData = await MongooseHelper.CollectionListBySymbol(sendData);
      return res.json(Encryptdata({
        success: getData?.success,
        data: getData.data,
        msg: getData.msg
      }))
    }

    else {
      // const getData = await projectSchema.find({ projectTitle: { "$regex": keyWord, "$options": "ix" } }).sort({ updatedAt: -1 });

      var sendData = { data: { projectTitle: { "$regex": keyWord, "$options": "ix" } }, isavailable: { $sum: { $cond: { if: { $eq: ["$isMinted", false] }, then: 1, else: 0 } } }, }
      const getData = await MongooseHelper.projectTokenCount(sendData);

      const getNfts = await Tokens.find({ isMinted: true });

      const getNftLength = getNfts?.length;
      const getStacked = getNfts?.filter(val => val.isStaked)?.length ?? 0
      const getUnstaked = getNftLength - getStacked

      return res.json(Encryptdata({
        success: "success",
        data: getData,
        nftLength: getNftLength,
        staked: getStacked,
        unStaked: getUnstaked,
        msg: "success"
      }))

    }

  } catch (error) {
    console.log("err on getProjects", error);
  }
}


export const stackFunction = async (req, res) => {
  const { NFTId, walletAddress, action, Season, projectId, Hash, year } = req?.body
  try {


    if (action == "setStack") {

      const setData = await new stakeSchema(req.body).save();
      await TokenOwners.updateMany({ NFTId }, { $set: { "PutOnSale": "false", "PutOnSaleType": "staked" } })
      const getData = await Tokens.findOneAndUpdate({ NFTId }, { isStaked: true })
      return res.json({
        success: "success",
        msg: "saved successfully"
      })
    }

    if (action == "getRewardByWalletAddress") {
      const getData = await RewardSchema.find({ walletAddress, withdraw: true });
      console.log("getData", getData);
      var reward = 0
      if (getData.length != 0) {
        await Promise.all(getData.map((val) => {
          if (val.withdraw && val.amount) reward += parseFloat(val.amount);
        }))
      }

      const projectData = {}
      //project params
      projectData.fromMatch = {
        $expr: {
          $and: [
            { $ne: ["$NFTBalance", "0"] },
            { $eq: ["$HideShow", "visible"] },
            { $eq: ["$NFTOwner", walletAddress] },
          ],
        },
      }
      projectData.refMatch = {
        $expr: {
          $and: [{ $eq: ["$NFTId", "$$tId"] }, { $eq: ["$reported", false] }],
        },
      }
      projectData.projectMatch = {
        $expr: {
          $and: [
            { $eq: ["$_id", "$$proId"] }
          ]
        }
      }

      const getTotals = await MongooseHelper.getMyNftAndStackCount(projectData)

      return res.json({
        success: "success",
        rewardClaimed: reward,
        totalDetails: {
          totalNfts: getTotals?.length ?? 0,
          isStaked: getTotals?.filter((val) => val.isStaked)?.length ?? 0,
          isNotStaked: (getTotals?.length ?? 0) - (getTotals?.filter((val) => val.isStaked)?.length ?? 0)
        }
      })
    }

    if (action == "getProjectRewardDetail") {
      const getData = await RewardSchema.find({ walletAddress, projectId, season: Season, year, withdraw: false });
      console.log("getDataongetprojectreward", getData);
      if (getData.length != 0) {
        var pending = 0
        await Promise.all(getData.map((val) => {
          if (!val.withdraw && val.amount) pending += parseFloat(val.amount);
        }))
        return res.json({
          success: "success",
          data: getData,
          pendingReward: pending
        })
      } else {
        return res.json({
          success: "error",
          data: getData,
          pendingReward: 0
        })
      }
    }

    if (action == "onClaimReward") {
      const setData = await RewardSchema.updateMany({ walletAddress, projectId, season: Season, withdraw: false }, { $set: { withdraw: true, hash: Hash, withdrawedAt: new Date() } });
      return res.json({
        success: setData ? "success" : "error",
        msg: setData ? "Reward claimed" : "Reward not claimed"
      })
    }

    if (action == "onWithdraw") {
      const setData = await stakeSchema.findOneAndUpdate({ NFTId, walletAddress, withdraw: false }, { withdraw: true });
      const getData = await Tokens.findOneAndUpdate({ NFTId }, { isStaked: false });
      const changeToken = await TokenOwners.findOneAndUpdate({ NFTId, PutOnSaleType: "staked", "NFTBalance": "1" }, { $set: { PutOnSaleType: "NotForSale" } }, { new: true })
      console.log('changeToken---->', changeToken);
      return res.json({
        success: "success",
        msg: "Token withdrawed"
      })
    }

    if (action == "getStake") {
      const getData = await stakeSchema.findOne({ NFTId, walletAddress, withdraw: false });
      return res.json({
        success: getData ? "success" : "error",
        data: getData,
      })
    }

    if (action == "getRewards") {

      const getData = await RewardSchema.aggregate([
        {
          $match: {
            "projectId": projectId ? projectId : { $ne: "" }
          }
        },
        {
          $group: {
            "_id": "TotalAmount",
            totalprice: {
              $sum: { $toDouble: '$amount' }
            }
          }
        },

      ])

      return res.json({
        success: "success",
        data: getData[0]
      })
    }
  } catch (e) {
    console.log("erro oon stackFunction", e);
  }
}

export const setPendingTransaction = async (req, res) => {
  try {
    const saveData = await new PendingTrans(req.body).save();
    return res.send("pending")
  } catch (e) {
    console.log('err on setPendingTransaction---->', e);
  }
}

export const setTokenStatus = async (req, res) => {
  try {
    const { arrData, status } = req.body
    console.log('arrDataaaaa---->', arrData);
    await Promise.all(
      arrData?.map(async (val) => {

        const update = await Tokens.findOneAndUpdate({ _id: ObjectId(val?._id) }, { $set: { status } });
        console.log('update---->', update);
      })
    )
    res.json({
      status: true,
      data: "success"
    })
  } catch (e) {
    console.log('Error on setTokenStatus---->', e);
  }
}

export const saveTransaction = async (req, res) => {
  try {
    const saveData = await new Transactions(req.body).save();
    if (saveData) return res.json({
      status: true,
      data: "success"
    })
    else return res.json({
      status: false,
      data: "error"
    })
  } catch (e) {
    console.log('Erroro on saveTransaction---->', e);
    res.json({
      status: false,
      data: "error"
    })
  }
}


export const getProjectByNFTid = async (req, res) => {
  try {
    const { NFTid } = req?.query;
    const getData = await Tokens.findOne({ NFTId: NFTid }, { projectId: 1 }).populate("projectId");
    console.log('getDatagetProjectByNFTid---->', getData, req?.query);
    return res.json({
      status: !isEmpty(getData),
      success: isEmpty(getData) ? "error" : "success",
      data: getData?.projectId
    })
  } catch (e) {
    console.log('Error on getProjectByNFTid---->', e);
    return res.json({
      status: false,
      success: "error",
      data: {}
    })
  }
}