/// ---> Packagesaddcategory

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Web3 from 'web3'

import config from '../../config/serverConfig'

//// ---- >> Models

import Admin from "../../models/admin_models/admin.schema"
import referrals from '../../models/front_models/referral.schema'
import Projects from '../../models/admin_models/project.schema'
import mongoose from "mongoose";
import { Encryptdata, ImageAddFunc, compress_file_upload, containsDuplicates, getDaysOfDesiredMonth, isEmpty } from "../../helper/commonFUnction";
import Gallery from '../../models/admin_models/gallery.schema';
import fs from "fs"
import Tokens from '../../models/front_models/token.schema';
import * as MongooseHelper from "../../helper/mongooseHelper";
import projectSchema from "../../models/admin_models/project.schema";
import blogCategorySchema from "../../models/admin_models/blogCategory.schema";
import blogSchema from "../../models/admin_models/blog.schema";
import StakingSchema from '../../models/front_models/stake.schema'
import RewardSchema from '../../models/admin_models/reward.schema'
import whiteListSchema from "../../models/admin_models/whiteList.schema";
import ActivitySchema from "../../models/front_models/activity.schema"
import GasManager from "../../models/admin_models/gasManager.schema";
import GasTokens from "../../models/admin_models/gasTokens.schema";
const reader = require('xlsx')

var ObjectId = mongoose.Types.ObjectId;

/**
 * loginAdmin
 * URL :/adminlogin
 * METHOD: POST
 * BODY : {_email,password}
 */
export const loginAdmin = async (req, res) => {

  try {

    var ReqBody = req.body
    const { path } = req.body
    console.log("ReqBody", ReqBody);
    if (ReqBody && ReqBody.path == "login") {


      var checkPassword = ReqBody.password;

      var user = await Admin.findOne({ email: ReqBody.email })
      if (user) {
        console.log("user", user)

        if (user.deleted) return res.status(200).json({ "msg": "Admin is deleted", "data": false })

        const match = await bcrypt.compare(checkPassword, user.hashpassword);
        if (match) {
          var payload = { "mail": ReqBody.email, "password": ReqBody.password }
          console.log("payload", payload, config.SECRET_KEY)

          var tokenhash = jwt.sign(payload, config.SECRET_KEY)
          var token = `Bearer ${tokenhash}`

          console.log("token", token)
          res.status(200).json({ "msg": "successfully logged in", "data": true, "token": token, Type: user?.Type })
        }
        else {
          res.status(200).json({ "msg": "incorrect password", "data": false })
        }

      } else { res.status(200).json({ "msg": "user not found", "data": false }) }

    }
    else if (path == "getAll") {
      const getData = await Admin.find({ Type: { $ne: "Super admin" } });
      return res.json({
        success: "success",
        data: getData
      })
    }

  } catch (e) {
    console.log("err on login admdin", e);
  }


}

export const createAdmin = async (req, res) => {
  const { email, password, Type, action, deleted, _id } = req.body;
  try {
    if (action == "save") {
      const checkMail = await Admin.find({ email });

      if (checkMail.length != 0) return res.json({
        success: "error",
        msg: "Mail address already exist"
      })

      const createHash = bcrypt.hash(password, 5, async function (err, hash) {
        if (err) {
          console.log("error", err)
          return res.json({
            success: "error",
            msg: "error on encrypt"
          });
        } else {
          console.log("hashvalue", hash)

          const newuser = { "email": email, "hashpassword": hash, Type }
          console.log("newuser", newuser)

          const admin = await new Admin(newuser).save()
          return res.json({
            success: "success",
            data: admin,
            msg: "Admin Added"
          })
        }
      });
    }

    if (action == "delete") {
      const setData = await Admin.findOneAndUpdate({ _id: ObjectId(_id) }, { deleted: deleted });
      return res.json({
        success: "success",
        data: setData
      })
    }

  } catch (e) {
    console.log(" errron createAdmin", e);
    return res.json({
      success: "error",
      msg: "error on encrypt"
    });
  }
}


export const createProject = async (req, res) => {
  var {
    projectTitle,
    projectDescription,
    maxNFTs,
    mintPrice,
    symbol,
    baseUri,
    royaltyReceiver,
    duration,
    aboutProject,
    aboutDescription,
    ProjectThumbnail,
    AboutProjectThumbnail,
    action,
    NFTRoyalty,
    projectId,
    NFTPrice,
    stepTitle,
    stepDescription,
    step,
    _id,
    changePrice,
    Hash,
    nonce,
    randomname,
    stepImage,
    deleted,
    contractAddress,
    imgfile,
    propertyValue,
    fundReceiverAddress,
    feeCollector,
    creatoraddress,
    color,
    size,
    mintToken,
    mintTokenName,
    ProjectBanner
  } = req.body
  try {

    console.log("createProject", req.body);

    if (action == "add") {
      const ref = Date.now();
      const checkTitle = await projectSchema.find({ projectTitle });

      console.log("checkDatacheckData", checkTitle);
      if (checkTitle.length == 0) {

        const ThumbImage = req?.files?.ProjectThumbnail ? await ImageAddFunc([
          {
            path: `public/projects/ProjectThumbnail/`,
            files: req?.files?.ProjectThumbnail,
            filename:
              ref +
              "." +
              req?.files?.ProjectThumbnail.name.split(".")[
              req?.files?.ProjectThumbnail.name.split(".").length - 1
              ],
          }
        ]) : null

        const BannerImage = req?.files?.ProjectBanner ? await ImageAddFunc([
          {
            path: `public/projects/ProjectBanner/`,
            files: req?.files?.ProjectBanner,
            filename:
              ref +
              "." +
              req?.files?.ProjectBanner.name.split(".")[
              req?.files?.ProjectBanner.name.split(".").length - 1
              ],
          }
        ]) : null

        console.log("ThumbImage", ThumbImage);

        var imgname = `${ref}.${req.files.imgfile.mimetype.includes('image') ? "webp" : req.files.imgfile.mimetype.includes('video') ? "webm" : "mp3"}`
        await ImageAddFunc([
          {
            path: `public/nft/${creatoraddress}/Original/`,
            files: req.files.imgfile,
            filename: imgname,
          },
        ])

        await compress_file_upload([
          {
            path: `public/nft/${creatoraddress}/Compressed/`,
            files: req.files.imgfile,
            filename:
              imgname,
          },
        ])

        const saveNewData = await new Projects({
          projectTitle,
          projectDescription,
          maxNFTs,
          mintPrice,
          symbol,
          baseUri,
          royaltyReceiver,
          duration,
          aboutProject,
          aboutDescription,
          NFTRoyalty,
          unlockAt: duration,
          ProjectThumbnail: ThumbImage,
          ProjectBanner: BannerImage,
          NFTPrice,
          contractAddress,
          imgfile: imgname,
          feeCollector,
          propertyValue,
          mintToken,
          mintTokenName
        }).save();


        req.body.imgname = imgname
        req.body.projectId = saveNewData?._id

        const setData = await saveMultiTokens(req.body)

        return res.json({
          success: "success",
          data: saveNewData,
          msg: "Saved successfully"
        })
      } else {
        return res.json({
          success: "error",
          data: {},
          msg: "Title is already entered"
        })
      }
    }

    if (action == "get") {
      const getProjects = await Projects.find({}).sort({ createdAt: -1 })
      return res.json({
        success: getProjects.length != 0 ? "success" : "error",
        data: getProjects,
        msg: getProjects.length != 0 ? "success" : "error"
      })
    }

    if (action == "getOne") {
      const getProjects = await Projects.findOne({ _id: projectId })
      return res.json({
        success: getProjects ? "success" : "error",
        data: getProjects,
        msg: getProjects ? "success" : "error"
      })
    }

    if (action == "saveStep") {
      const ref = Date.now();
      const stepimage = req?.files?.stepImage ? await ImageAddFunc([
        {
          path: `public/projects/steps/`,
          files: req?.files?.stepImage,
          filename:
            ref +
            "." +
            req?.files?.stepImage.name.split(".")[
            req?.files?.stepImage.name.split(".").length - 1
            ],
        }
      ]) : null

      const setData = {}
      setData.stepImage = stepimage
      setData.stepDescription = stepDescription
      setData.deleted = false
      setData.stepTitle = stepTitle
      setData.step = step

      const getData = await projectSchema.updateOne({ _id: ObjectId(projectId) }, { $push: { "roadMap": setData } }, { new: true })
      console.log("getData", getData);

      return res.json({
        success: getData ? "success" : "error",
        data: getData,
        msg: getData ? "success" : "error"
      })
    }

    if (action == "editStep") {
      const ref = Date.now();
      const stepimage = req?.files?.stepImage ? await ImageAddFunc([
        {
          path: `public/projects/steps/`,
          files: req?.files?.stepImage,
          filename:
            ref +
            "." +
            req?.files?.stepImage.name.split(".")[
            req?.files?.stepImage.name.split(".").length - 1
            ],
        }
      ]) : null

      const setData = {}
      setData.stepImage = stepimage ? stepimage : stepImage
      setData.stepDescription = stepDescription
      setData.deleted = false
      setData.stepTitle = stepTitle
      setData.step = step

      const getData = await projectSchema.findOneAndUpdate({ "roadMap.step": step, _id: ObjectId(projectId) }, { $set: { "roadMap.$": setData } }, { new: true })
      console.log("getData", getData);

      return res.json({
        success: getData ? "success" : "error",
        data: getData,
        msg: getData ? "success" : "error"
      })
    }

    if (action == 'edit') {
      const ref = Date.now();

      if (req?.files?.imgfile) {

        var nftImage = `${ref}.${req.files.imgfile.mimetype.includes('image') ? "webp" : req.files.imgfile.mimetype.includes('video') ? "webm" : "mp3"}`
        await ImageAddFunc([
          {
            path: `public/nft/${creatoraddress}/Original/`,
            files: req.files.imgfile,
            filename: nftImage,
          },
        ])

        await compress_file_upload([
          {
            path: `public/nft/${creatoraddress}/Compressed/`,
            files: req.files.imgfile,
            filename:
              nftImage,
          },
        ])
      }


      const getProjectData = await projectSchema.findOne({ _id: ObjectId(_id) })

      if (changePrice) {
        const setData = { Hash: Hash, Nonce: nonce, Randomname: randomname, NFTPrice }
        const upData = await Tokens.updateMany({ projectId: _id, isMinted: false }, { $set: setData })
      }

      if (!isEmpty(nftImage)) {
        const setData = { NFTOrginalImage: nftImage, CompressedFile: nftImage }
        const upData = await Tokens.updateMany({ projectId: _id, isMinted: false }, { $set: setData })
      }

      if (getProjectData?.maxNFTs != maxNFTs) {
        req.body.imgname = nftImage ? nftImage : imgfile;
        req.body.maxNFTs = maxNFTs - getProjectData?.maxNFTs
        req.body.projectId = _id
        const saveTokens = await saveMultiTokens(req.body, getProjectData?.maxNFTs)
      }


      const ThumbImage = req?.files?.ProjectThumbnail ? await ImageAddFunc([
        {
          path: `public/projects/ProjectThumbnail/`,
          files: req?.files?.ProjectThumbnail,
          filename:
            ref +
            "." +
            req?.files?.ProjectThumbnail.name.split(".")[
            req?.files?.ProjectThumbnail.name.split(".").length - 1
            ],
        }
      ]) : null

      console.log("ThumbImage", ThumbImage);

      const BannerImage = req?.files?.ProjectBanner ? await ImageAddFunc([
        {
          path: `public/projects/ProjectBanner/`,
          files: req?.files?.ProjectBanner,
          filename:
            ref +
            "." +
            req?.files?.ProjectBanner.name.split(".")[
            req?.files?.ProjectBanner.name.split(".").length - 1
            ],
        }
      ]) : null

      // const day = duration.split("")[0]
      // if (duration.includes("day")) {
      //   var createDate = new Date(new Date().setDate(new Date().getDate() + parseInt(day)))
      // } else if (duration.includes("min")) {
      //   var createDate = new Date(new Date().setMinutes(new Date().getMinutes() + parseInt(day)))
      // }

      // console.log("createDate", createDate);
      const saveNewData = await projectSchema.findOneAndUpdate({ _id }, {
        $set: {
          projectTitle,
          projectDescription,
          maxNFTs,
          mintPrice,
          symbol,
          baseUri,
          royaltyReceiver,
          duration,
          aboutProject,
          aboutDescription,
          NFTRoyalty,
          unlockAt: duration,
          NFTPrice,
          propertyValue,
          feeCollector,
          ProjectThumbnail: ThumbImage || ProjectThumbnail,
          ProjectBanner: BannerImage || ProjectBanner,
          imgfile: nftImage ? nftImage : imgfile,
          mintToken,
          mintTokenName
        }

      })


      console.log("saveNewData", saveNewData);

      return res.json({
        success: "success",
        data: saveNewData,
        msg: "Saved successfully"
      })
    }

    if (action == "hideStep") {
      const getData = await projectSchema.findOneAndUpdate({ "roadMap.step": step, _id: ObjectId(projectId) }, { $set: { "roadMap.$.deleted": deleted } }, { new: true });
      return res.json({
        success: getData ? "success" : "error",
        data: getData,
        msg: getData ? "success" : "error"
      })
    }

    if (action == "getProjects") {
      const getData = await projectSchema.find({}, { label: "$projectTitle", value: "$projectTitle" });
      return res.json({
        success: getData.length != 0 ? "success" : "error",
        data: getData,
      })
    }

    if (action == "checkSymbol") {
      const check = await projectSchema.find({ symbol });

      return res.json({
        success: check?.length != 0 ? "error" : "success",
        msg: check?.length != 0 ? "Symbol already exist" : "ok"
      })
    }

    if (action == "addCms") {
      const ref = Date.now()

      const checkTitle = await projectSchema.find({ _id: ObjectId(projectId), "CMS.stepTitle": stepTitle })

      if (checkTitle?.length != 0) return res.json({
        success: "error",
        msg: "Title already exist"
      })

      const dataImg = req?.files?.img ? await ImageAddFunc([
        {
          path: `public/projects/steps/`,
          files: req?.files?.img,
          filename:
            ref +
            "." +
            req?.files?.img.name.split(".")[
            req?.files?.img.name.split(".").length - 1
            ],
        }
      ]) : null


      const setData = {}
      setData.stepDescription = stepDescription
      setData.stepTitle = stepTitle
      setData.img = dataImg

      const getData = await projectSchema.updateOne({ _id: ObjectId(projectId) }, { $push: { "CMS": setData } }, { new: true })
      console.log("getData", getData);

      return res.json({
        success: getData ? "success" : "error",
        data: getData,
        msg: getData ? "success" : "error"
      })
    }

    if (action == "editCms") {
      const ref = Date.now()

      const dataImg = req?.files?.img ? await ImageAddFunc([
        {
          path: `public/projects/steps/`,
          files: req?.files?.img,
          filename:
            ref +
            "." +
            req?.files?.img.name.split(".")[
            req?.files?.img.name.split(".").length - 1
            ],
        }
      ]) : null

      const setData = {}
      setData.stepDescription = stepDescription
      setData.stepTitle = stepTitle
      setData.img = dataImg ? dataImg : req?.body?.img


      const getData = await projectSchema.findOneAndUpdate({ "CMS.stepTitle": stepTitle, _id: ObjectId(projectId) }, { $set: { "CMS.$": setData } }, { new: true })
      console.log("getData", getData);

      return res.json({
        success: getData ? "success" : "error",
        data: getData,
        msg: getData ? "success" : "error"
      })
    }

  } catch (error) {
    res.json({
      success: "error",
      data: {},
      msg: "Not saved"
    })
    console.log("err on createProject", error);
  }
}

const saveMultiTokens = async (data, count) => {
  const { symbol, projectDescription, imgname, baseUri, Hash, contractAddress, NFTRoyalty, color, size, creatoraddress, NFTPrice, nonce, randomname, projectId, mintTokenName } = data
  const ref = Date.now()

  const getArr = Array(Number(data.maxNFTs)).fill().map((val, ind) => {

    var send_data = {
      CollectionNetwork: "BNB",
      CollectionName: "",
      NFTId: ref + ind,
      NFTName: `${symbol}00${count ? parseInt(count) + ind + 1 : ind + 1}`,
      "Category": "",
      NFTDescription: projectDescription,
      NFTOrginalImage: imgname,
      NFTThumpImage: "",
      UnlockContent: "",
      CollectionSymbol: "",
      ContractAddress: contractAddress,
      ContractType: "721",
      NFTRoyalty: NFTRoyalty,
      NFTProperties: color ? [{ [color]: size }] : [],
      CompressedFile: imgname,
      CompressedThumbFile: "",
      NFTOrginalImageIpfs: "",
      NFTThumpImageIpfs: "",
      MetaData: "",
      MetFile: "",
      NFTCreator: creatoraddress,
      NFTQuantity: "1",
      PutOnSale: "false",
      PutOnSaleType: "",
      NFTPrice: NFTPrice,
      CoinName: mintTokenName,
      Hash: Hash,
      NFTOwner: [creatoraddress],
      activity: "",
      NFTBalance: "1",
      ownBalance: "1",
      Nonce: nonce,
      CollectionId: "",
      Randomname: randomname,
      projectId: projectId,
      Category: "",
      baseUri,
      NFTOwnerDetails: [],
      status: "available",
    }

    return send_data
  })

  console.log("getArr", getArr);
  const saveToken = await Tokens.insertMany(getArr);
  console.log("saveToken", saveToken);

  return "saved"
}

export const collectionFunctions = async (req, res) => {
  const {
    galleryTitle,
    galleryDescription,
    projectId,
    action,
    _id,
    galleryThumbImage,
    ImageName
  } = req.body



  console.log("req.bodyreq.body", req.body);
  console.log("reqqq.files", req.files);

  try {

    if (action == "add") {
      var ref = Date.now();
      const ThumbImage = req?.files?.galleryThumbImage ? await ImageAddFunc([
        {
          path: `public/collection/${projectId}/`,
          files: req?.files?.galleryThumbImage,
          filename:
            ref +
            "." +
            req?.files?.galleryThumbImage.name.split(".")[
            req?.files?.galleryThumbImage.name.split(".").length - 1
            ],
        }
      ]) : null

      console.log("ThumbImage", ThumbImage);

      const saveGallery = await new Gallery({
        galleryTitle,
        galleryDescription,
        galleryThumbImage: ThumbImage,
        projectId
      }).save()

      return res.json({
        success: "success",
        data: saveGallery,
        msg: "Successfully saved"
      })
    }

    if (action == "get") {
      const getGallery = await Gallery.find({ deleted: false }).sort({ createdAt: - 1 })
      return res.json({
        success: getGallery.length != 0 ? "success" : "error",
        data: getGallery,
        msg: getGallery.length != 0 ? "success" : "error"
      })
    }


    if (action == "getAllCol") {
      const getGallery = await Gallery.find({ deleted: false, projectId }).sort({ createdAt: - 1 })
      return res.json({
        success: getGallery.length != 0 ? "success" : "error",
        data: getGallery,
        msg: getGallery.length != 0 ? "success" : "error"
      })
    }

    if (action == "getOne") {
      const getGallery = await Gallery.findOne({ _id: ObjectId(_id) })
      return res.json({
        success: getGallery != 0 ? "success" : "error",
        data: getGallery,
        msg: getGallery != 0 ? "success" : "error"
      })
    }

    if (action == 'edit') {

      if (req?.files?.galleryThumbImage) {
        var ref = Date.now();
        var ThumbImage = await ImageAddFunc([
          {
            path: `public/collection/${projectId}/`,
            files: req?.files?.galleryThumbImage,
            filename:
              ref +
              "." +
              req?.files?.galleryThumbImage.name.split(".")[
              req?.files?.galleryThumbImage.name.split(".").length - 1
              ],
          }
        ])

        req.body.galleryThumbImage = ThumbImage;
      }

      const UPdata = {
        galleryTitle: galleryTitle,
        galleryDescription: galleryDescription,
        galleryThumbImage: ThumbImage ? ThumbImage : galleryThumbImage
      }
      console.log("_id", _id);
      const updata = await Gallery.findByIdAndUpdate({ _id }, { $set: UPdata }, { new: true })
      console.log("udatatatattaatataa", updata);

      return res.json({
        success: updata ? "success" : "error",
        data: updata,
        msg: updata ? "Successfully Edited" : "Error on Editing"
      })
    }

    if (action == "addImages") {
      const { galleryImages } = req?.files
      var files
      galleryImages?.length == undefined ? files = [galleryImages] : files = galleryImages
      var ref = Date.now()
      console.log("filesse", files);
      await Promise.all(files.map(async (val, index) => {
        const ImageName = await ImageAddFunc([
          {
            path: `public/collection/${_id}/`,
            files: val,
            filename:
              ref + index +
              "." +
              val.name.split(".")[
              val.name.split(".").length - 1
              ],
          }
        ])

        const setImagesInDb = await Gallery.updateOne({ _id: ObjectId(_id) }, { $push: { "galleryImages": ImageName } })
      }))

      return res.json({
        success: "success",
        msg: 'successfully uploaded'
      })
    }

    if (action == "deleteImage") {
      const setImagesInDb = await Gallery.updateOne({ _id: ObjectId(_id) }, { $pull: { "galleryImages": ImageName } })
      return res.json({
        success: "success",
        msg: 'successfully deleted'
      })
    }

    if (action == "deleteGallery") {
      const getGallery = await Gallery.findOneAndUpdate({ _id: ObjectId(_id) }, { $set: { deleted: true } })
      return res.json({
        success: getGallery ? "success" : "error",
        data: getGallery,
        msg: getGallery ? "success" : "error"
      })
    }

  } catch (error) {
    console.log("errro on collectionFunctions", error);
    return res.json({
      success: "error",
      msg: "Not updated"
    })
  }
}

export const bulkUploadFunc = async (req, res) => {
  console.log("req", req.body);
  console.log("reqfils", req.files);
  var send_data = {
    CollectionNetwork: "",
    CollectionName: "",
    NFTId: "",
    NFTName: "",
    "Category": "",
    NFTDescription: "",
    NFTOrginalImage: "",
    NFTThumpImage: "",
    UnlockContent: "",
    CollectionSymbol: "",
    ContractAddress: "",
    ContractType: "",
    NFTRoyalty: "",
    NFTProperties: "",
    CompressedFile: "",
    CompressedThumbFile: "",
    NFTOrginalImageIpfs: "",
    NFTThumpImageIpfs: "",
    MetaData: "",
    MetFile: "",
    NFTCreator: "",
    NFTQuantity: "",
    PutOnSale: "",
    PutOnSaleType: "",
    NFTPrice: "",
    CoinName: "",
    ClockTime: "",
    EndClockTime: "",
    HashValue: "",
    NFTOwner: "",
    activity: "",
    NFTBalance: "",
    ownBalance: ""
  }
  const {
    creatoraddress,
    contractaddress,
    royalty,
    Hash,
    nonce,
    randomname,
    price,
    coinname,
    CollectionId,
    projectId
  } = req.body

  const {
    imgfile,
    excelfile
  } = req.files

  try {

    var imagefile;
    if (imgfile.length == undefined) {
      imagefile = [imgfile];
    }
    else {
      imagefile = imgfile;
    }
    console.log("projectIdprojectId", projectId);
    const getTokenLenth = await Tokens.find({ projectId })
    const getProjects = await projectSchema.findOne({ _id: ObjectId(projectId) })
    console.log("getTokenLenthsekfuhsed", getTokenLenth, getProjects, imagefile.length, getProjects.maxNFTs, (imagefile.length + getTokenLenth) > parseInt(getProjects.maxNFTs));
    if ((parseInt(imagefile.length) + parseInt(getTokenLenth.length)) > parseInt(getProjects.maxNFTs)) return res.json(Encryptdata({
      success: "error",
      status: false,
      msg: "NFT count greater than max count"
    }))

    var imagenames = await Promise.all(imagefile.map((item) => item.name))
    console.log("imagenames", imagenames);
    var ref = Date.now()
    var data = []

    await fs.promises.mkdir('public/BulkListing', { recursive: true });
    await excelfile.mv(`public/BulkListing/${excelfile.name}`)

    const file = reader.readFile(`public/BulkListing/${excelfile.name}`)

    const sheets = file.SheetNames

    var dddd = await Promise.all(sheets.map(async (item, i) => {


      const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]]
      )
      console.log("temp", temp);
      await Promise.all(temp.map(async (ress, index) => {

        var image = await Promise.all(imagefile.filter((item) => item.name == ress.imagename))
        var checkDuplicateImgName = await Promise.all(data.filter((item) => item.imagename == ress.imagename))
        console.log("data", data);
        if (checkDuplicateImgName.length != 0) return res.json(Encryptdata({
          success: "error",
          status: false,
          msg: `Nft name must be unique in excel`
        }))

        console.log("image", image);
        if (image.length > 0) {
          var imgname = `${ref}${index}.${image[0].mimetype.includes('image') ? "webp" : image[0].mimetype.includes('video') ? "webm" : "mp3"}`
          ress.saveimagename = imgname
          await ImageAddFunc([
            {
              path: `public/nft/${creatoraddress}/Original/`,
              files: image[0],
              filename:
                imgname,
            },
          ])

          await compress_file_upload([
            {
              path: `public/nft/${creatoraddress}/Compressed/`,
              files: image[0],
              filename:
                imgname,
            },
          ])
          console.log("res", ress);
          data.push(ress)
        }
        else {
          return res.json(Encryptdata({
            success: "error",
            status: false,
            msg: "Cannot find image for " + index + " Record"
          }))
        }


      }))
    }))

    var nftnames = await Promise.all(data.map((item) => item.Nftname))
    console.log("NFTNAMES", nftnames);

    var samename = await containsDuplicates(nftnames)

    if (samename) {
      return res.json(Encryptdata({
        success: "error",
        status: false,
        msg: `Nft name must be unique in excel`
      }))
    }


    console.log("NAMECHECKSSS", samename)
    var nftnamecheck = await Nftnamevalidation(nftnames)
    var excelimagenames = await Promise.all(data.map((item) =>
      imagenames.includes(item.imagename)
    ))
    console.log("escelname", excelimagenames, data, imagenames, nftnames, nftnamecheck);

    if (excelimagenames.includes(false)) {
      await Promise.all(imagenames.map(item => {
        fs.unlink(`public/nft/${creatoraddress}/Original/NFT/${item}`)
        fs.unlink(`public/nft/${creatoraddress}/Compressed/NFT/${item}`)

      }))
      return res.json(Encryptdata({
        success: "error",
        status: false,
        msg: "image and Excel data mismatched"
      }))
    }
    else {
      if (nftnamecheck.includes(false)) {
        return res.json(Encryptdata({
          success: "error",
          status: false,
          msg: `Nft name already exist in ${nftnamecheck.indexOf(false)} record `
        }))
      }
      else {
        var retdata = [];
        var sss = await Promise.all(
          data.map(async (item, index) => {
            var props = {}
            props[item.color] = item.size
            send_data.CollectionNetwork = "BNB"
            send_data.CollectionName = ""
            send_data.NFTId = ref + index
            send_data.NFTName = item.Nftname
            send_data.Category = item.category?.toLowerCase()
            send_data.NFTDescription = item?.description ? item.description : ""
            send_data.NFTOrginalImage = item.saveimagename
            send_data.ContractAddress = contractaddress
            send_data.ContractType = "721"
            send_data.NFTRoyalty = royalty
            send_data.NFTProperties = [props]
            send_data.CompressedFile = item.saveimagename,
              send_data.NFTCreator = creatoraddress,
              send_data.NFTQuantity = "1",
              send_data.PutOnSale = "false"
            send_data.PutOnSaleType = "",
              send_data.NFTPrice = price,
              send_data.CoinName = coinname,
              send_data.NFTOwner = [creatoraddress]
            send_data.activity = ""
            send_data.NFTBalance = "1"
            send_data.ownBalance = "1"
            send_data.Hash = Hash
            send_data.Nonce = nonce,
              send_data.CollectionId = CollectionId,
              send_data.Randomname = randomname
            send_data.projectId = projectId
            console.log("AFTERSENDDTA");

            var save = await createtokenanddetails(send_data)
            retdata.push(save)
          })
        )
        if (retdata.length > 0) {

          const upDate = await projectSchema.findOneAndUpdate({ _id: ObjectId(projectId) }, { isCompleted: false })

          console.log(retdata, "rettdaa")
          return res.json(Encryptdata({
            success: "success",
            status: true,
            msg: "Successfully Minted",
            exceldata: retdata
          }))
        }
      }

    }

  } catch (error) {
    console.log("errr on bulkUploadFunc", error);
    return res.json(Encryptdata({
      success: "error",

    }))

  }
}


const Nftnamevalidation = async (data) => {
  var retdata = []
  await Promise.all(data.map(async (item) => {
    var resp = await Tokens.findOne({ NFTName: item })
    if (resp) {
      retdata.push(false)
    }
    else {
      retdata.push(true)
    }
  }))

  return retdata

}

const createtokenanddetails = async (data) => {
  console.log("DATAINEXCEL", data);
  try {
    const {
      click,
      CollectionNetwork,
      CollectionName,
      NFTId,
      NFTName,
      Category,
      Hash,
      Nonce,
      Randomname,
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
      ownBalance,
      CollectionId,
      projectId,
      UnlockAt,
      baseUri
    } = data;
    var saved = {
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
      Hash,
      Nonce,
      Randomname,
      activity,
      PutOnSale,
      PutOnSaleType,
      NFTPrice,
      CoinName,
      ClockTime,
      EndClockTime,
      HashValue,
      NFTOwner,
      NFTBalance,
      NFTOwnerDetails: [],
      Status: "list",
      CollectionId,
      projectId,
      UnlockAt,
      baseUri
    }

    var TokenADd = await MongooseHelper.Save({ DBName: Tokens, Data: saved });
    return TokenADd;

  } catch (err) {
    console.log('errorres', err);
  }
}

export const getNftsByProjectId = async (req, res) => {
  const { _id } = req.query
  console.log("_id", _id);
  try {
    const resp = await Tokens.find({ "projectId": _id });

    console.log("resp", resp);

    return res.json(Encryptdata({
      success: resp.length != 0 ? "success" : "error",
      data: resp,
      msg: resp.length != 0 ? "Success" : "error"
    }))


  } catch (error) {

    console.log("err on getNftsByProjectId", error);
    return res.json(Encryptdata({
      success: "error",
      data: [],
      msg: "error on getNftsByProjectId"
    }))

  }
}


export const createNft = async (req, res) => {
  try {


    const {
      creatoraddress,
      contractaddress,
      royalty,
      Hash,
      nonce,
      randomname,
      price,
      coinname,
      CollectionId,
      projectId,
      Nftname,
      description,
      color,
      size,
      category,
      UnlockAt,
      baseUri,
      NFTDescription
    } = req.body

    const {
      imgfile
    } = req.files

    const validateName = await Nftnamevalidation([Nftname])

    if (validateName.includes(false)) {
      return res.json(Encryptdata({
        success: "error",
        status: false,
        msg: `Nft name already exist`
      }))
    }

    const ref = Date.now()
    var imgname = `${ref}.${imgfile.mimetype.includes('image') ? "webp" : imgfile.mimetype.includes('video') ? "webm" : "mp3"}`
    await ImageAddFunc([
      {
        path: `public/nft/${creatoraddress}/Original/`,
        files: imgfile,
        filename: imgname,
      },
    ])

    await compress_file_upload([
      {
        path: `public/nft/${creatoraddress}/Compressed/`,
        files: imgfile,
        filename:
          imgname,
      },
    ])

    var send_data = {
      CollectionNetwork: "BNB",
      CollectionName: "",
      NFTId: ref,
      NFTName: Nftname,
      "Category": "",
      NFTDescription: NFTDescription,
      NFTOrginalImage: imgname,
      NFTThumpImage: "",
      UnlockContent: "",
      CollectionSymbol: "",
      ContractAddress: contractaddress,
      ContractType: "721",
      NFTRoyalty: royalty,
      NFTProperties: color ? [{ [color]: size }] : [],
      CompressedFile: imgname,
      CompressedThumbFile: "",
      NFTOrginalImageIpfs: "",
      NFTThumpImageIpfs: "",
      MetaData: "",
      MetFile: "",
      NFTCreator: creatoraddress,
      NFTQuantity: "1",
      PutOnSale: "false",
      PutOnSaleType: "",
      NFTPrice: price,
      CoinName: coinname,
      Hash: Hash,
      NFTOwner: [creatoraddress],
      activity: "",
      NFTBalance: "1",
      ownBalance: "1",
      Nonce: nonce,
      CollectionId: CollectionId,
      Randomname: randomname,
      projectId: projectId,
      Category: category?.toLowerCase(),
      UnlockAt: UnlockAt,
      baseUri
    }

    var save = await createtokenanddetails(send_data)

    if (save.success == "success") {

      const upDate = await projectSchema.findOneAndUpdate({ _id: ObjectId(projectId) }, { isCompleted: false })

      console.log(save, "rettdaa")
      return res.json(Encryptdata({
        success: "success",
        status: true,
        msg: "Successfully Minted",
        exceldata: save
      }))
    } else {
      return res.json(Encryptdata({
        success: "success",
        status: true,
        msg: "Token not minted",
        exceldata: save
      }))
    }

  } catch (error) {
    console.log("errr on createNft", error);
  }
}

export const editTokens = async (req, res) => {

  var {
    creatoraddress,
    contractaddress,
    royalty,
    Hash,
    nonce,
    randomname,
    price,
    coinname,
    CollectionId,
    projectId,
    Nftname,
    description,
    color,
    size,
    category,
    UnlockAt,
    baseUri,
    NFTName,
    NFTOrginalImage
  } = req.body
  try {

    const validateName = await Nftnamevalidation([Nftname])

    if (validateName.includes(false)) {
      return res.json(Encryptdata({
        success: "error",
        status: false,
        msg: `Nft name already exist`
      }))
    }

    const ref = Date.now()
    var imgname = req?.files?.imgfile ? `${ref}.webp` : NFTOrginalImage

    if (req?.files?.imgfile) {

      await ImageAddFunc([
        {
          path: `public/nft/${creatoraddress}/Original/`,
          files: req?.files?.imgfile,
          filename: imgname,
        },
      ])

      await compress_file_upload([
        {
          path: `public/nft/${creatoraddress}/Compressed/`,
          files: req?.files?.imgfile,
          filename: imgname,
        },
      ])

    }
    req.body.NFTOrginalImage = imgname
    const Resp = await Tokens.findOneAndUpdate({ _id: ObjectId(req.body._id) }, { ...req.body })

    return res.json({
      success: "success",
      data: Resp,
      msg: "Edited Successfully."
    })

  } catch (e) {
    console.log("editTokens", e);
    return res.json({
      success: "error",
      msg: "Error on editing"
    })
  }
}

export const getTokenCount = async (req, res) => {
  const { _id } = req.query
  try {
    var sendData = { data: { _id: ObjectId(_id) }, isavailable: { $sum: { $cond: { if: { $and: [{ $lt: ["$UnlockAt", new Date()] }, { $eq: ["$isMinted", false] }] }, then: 1, else: 0 } } }, }
    const getData = await MongooseHelper.projectTokenCount(sendData);
    return res.json({
      success: "success",
      data: getData
    })
  } catch (e) {
    console.log("errr on getTokenCount", e);
  }
}

export const blogCategories = async (req, res) => {
  const { action, title, _id, deleted } = req.query
  try {
    if (action == "add") {
      const checkTitle = await blogCategorySchema.find({ title });

      if (checkTitle.length != 0) return res.json({
        success: "success",
        data: checkTitle,
        msg: "Title already exist"
      })

      const setData = await new blogCategorySchema(req.query).save();

      return res.json({
        success: "success",
        data: setData,
        msg: "Category Added"
      })
    }

    if (action == "get" || action == "getFront") {
      var value = {}
      if (action == "getFront") value.deleted = false
      console.log('value---->', value);
      const getData = await blogCategorySchema.find(value, { title: 1, deleted: 1, label: "$title", value: "$title" }).sort({ createdAt: - 1 });
      console.log("getData", getData);

      return res.json({
        success: getData.length != 0 ? "success" : "error",
        data: getData
      })
    }

    if (action == "edit") {
      const getData = await blogCategorySchema.findOneAndUpdate({ _id: ObjectId(_id) }, { title });
      return res.json({
        success: "success",
        msg: "Edited successfully"
      })
    }

    if (action == "delete") {
      const deletData = await blogCategorySchema.findByIdAndUpdate({ _id }, { deleted });
      return res.json({
        success: deletData ? "success" : "error",
        msg: deletData ? "success" : "error",
      })
    }
  } catch (e) {
    console.log("err on blogCategories", e);
    return res.json({
      success: "error",
      msg: "Not updated",
    })
  }
}

export const blogsFunction = async (req, res) => {
  const { action, slug, title, content, description, image, deleted, _id, walletAddress, blog_category, name, email, comment, keyWord } = req.body;
  try {
    const ref = Date.now()

    if (action == "get" || action == "getFront") {
      const getData = await blogSchema.find(action == "get" ? {} : { deleted: false }).sort({ createdAt: - 1 })
      return res.json({
        success: getData.length != 0 ? "success" : "error",
        data: getData,
        msg: getData.length != 0 ? "success" : "error"
      })
    }

    if (action == "add") {
      const checkSlug = await blogSchema.find({ slug });

      if (checkSlug.length != 0) return res.json({
        success: "error",
        msg: "Slug already exist"
      })

      const Image = req?.files?.image ? await ImageAddFunc([
        {
          path: `public/blogImg/`,
          files: req?.files?.image,
          filename:
            ref +
            "." +
            req?.files?.image?.name.split(".")[
            req?.files?.image?.name.split(".")?.length - 1
            ],
        },
      ]) : null


      const setData = {
        slug, title, image: Image, content, description, blog_category
      }

      const saveData = await new blogSchema(setData).save();

      return res.json({
        success: saveData ? "success" : "error",
        data: saveData,
        msg: "Saved successfully"
      })
    }

    if (action == "edit") {
      const Image = req?.files?.image ? await ImageAddFunc([
        {
          path: `public/blogImg/`,
          files: req?.files?.image,
          filename:
            ref +
            "." +
            req?.files?.image?.name.split(".")[
            req?.files?.image?.name.split(".")?.length - 1
            ],
        },
      ]) : image


      const setData = {
        slug, title, image: Image, content, description, blog_category
      }

      const saveData = await blogSchema.findOneAndUpdate({ _id: ObjectId(_id) }, setData)

      return res.json({
        success: saveData ? "success" : "error",
        data: saveData,
        msg: "Saved successfully"
      })
    }

    if (action == "delete") {
      const deletData = await blogSchema.findByIdAndUpdate({ _id: ObjectId(_id) }, { deleted });
      console.log("deletDatadeletData", deletData);
      return res.json({
        success: deletData ? "success" : "error",
        msg: deletData ? "success" : "error",
      })
    }

    if (action == "getRecent") {
      const getData = await blogSchema.find({ blog_category }).sort({ updatedAt: -1 })
      return res.json({
        success: getData.length != 0 ? "success" : "error",
        data: getData,
        msg: getData.length != 0 ? "success" : "error"
      })
    }

    if (action == "addComment") {
      const setData = {
        name, email, comment, walletAddress
      }
      const addComment = await blogSchema.updateOne({ _id: ObjectId(_id) }, { $push: { "comments": setData } }, { new: true })
      return res.json({
        success: addComment ? "success" : "error",
        msg: addComment ? "success" : "error",
        data: addComment ?? {}
      })
    }

    if (action == "getComment") {
      const getData = await blogSchema.findOne({ _id: ObjectId(_id) }).populate("comments.walletAddress");

      return res.json({
        success: getData ? "success" : "error",
        data: getData,
        msg: getData ? "success" : "error"
      })
    }

    if (action == "getBlogByCategory") {
      const getData = await blogSchema.find(blog_category == "All" ? {} : { blog_category })
      return res.json({
        success: getData.length != 0 ? "success" : "error",
        data: getData,
        msg: getData.length != 0 ? "success" : "error"
      })
    }

    if (action == "onSearchTitle") {

      const getData = await blogSchema.find({ title: { "$regex": keyWord, "$options": "ix" } })
      return res.json({
        success: getData.length != 0 ? "success" : "error",
        data: getData,
        msg: getData.length != 0 ? "success" : "error"
      })
    }

  } catch (error) {
    console.log("err on blogsFunction", error);
  }
}

export const saveCkeditorImage = async (req, res) => {
  try {
    console.log("awawdwa", req.files);
    const ref = Date.now()
    const saveFile = await ImageAddFunc([
      {
        path: `public/blogImg/`,
        files: req.files?.imgFile,
        filename:
          ref +
          "." +
          req.files?.imgFile?.name.split(".")[
          req.files?.imgFile?.name.split(".")?.length - 1
          ],
      },
    ])

    return res.json({
      success: "success",
      imgFile: saveFile
    })
  } catch (error) {
    console.log("errr on saveCkeditorImage", error);
    res.json({
      success: "error",
      imgFile: ""
    })
  }
}

export const stakingFunctions = async (req, res) => {
  const { action, Season, projectId, rewardArr, year } = req.body
  console.log("req.queryreq.query", req.body);
  const ref = Date.now();
  try {
    if (action == "getDetails") {

      var date = getDaysOfDesiredMonth(
        Season == "Season 1" ? 3 :
          Season == "Season 2" ? 6 :
            Season == "Season 3" ? 9 :
              Season == "Season 4" ? 12 : 3,
        parseInt(year)
      );

      // if (Season == "Season 1") date = getDaysOfDesiredMonth(3); // next march last date
      // else if (Season == "Season 2") date = getDaysOfDesiredMonth(6); // next may last date
      // else if (Season == "Season 3") date = getDaysOfDesiredMonth(9); // next june last date
      // else if (Season == "Season 4") date = getDaysOfDesiredMonth(12); // next oct last date
      console.log("date", date, new Date(date.newStartDate), new Date(date.dateFormat));
      // const getData = await StakingSchema.aggregate([
      //   {
      //     $match: {
      //       // $expr:
      //       // {
      //       //   $and: [
      //       //     { $gt: ["$startDate", new Date(date.newStartDate)] },
      //       //     {
      //       //       $or:
      //       //         [{ $gt: ["$endDate", new Date(date.newStartDate)] },
      //       //         { $lt: [new Date(date.dateFormat), "$endDate"] }]
      //       //     },

      //       //     { $eq: ["$projectId", projectId] }
      //       //   ]
      //       // }
      //       $expr:
      //       {
      //         $and: [
      //           { $eq: ["$withdraw", false] },
      //           {
      //             $or: [
      //               { $gt: ["$startDate", new Date(date.newStartDate)] },
      //               { $gt: ["$startDate", new Date(date.dateFormat)] },
      //               { $lt: [new Date(date.dateFormat), "$endDate"] },
      //               { $lt: [new Date(date.newStartDate), "$endDate"] },
      //             ]
      //           },
      //           { $eq: ["$projectId", projectId] }
      //         ]

      //       }
      //     }
      //   },

      // ])

      const getData = await StakingSchema.aggregate([
        {
          $match: {
            $and: [
              { withdraw: false },
              { projectId: projectId },
              {
                $or: [
                  {
                    $and: [
                      { startDate: { $gte: new Date(date.newStartDate) } },
                      { startDate: { $lt: new Date(date.dateFormat) } },
                    ]
                  },
                  {
                    $and: [
                      { endDate: { $gte: new Date(date.newStartDate) } },
                      { endDate: { $lt: new Date(date.dateFormat) } },
                    ]
                  },
                  {
                    $and: [
                      { startDate: { $lt: new Date(date.newStartDate) } },
                      { endDate: { $gt: new Date(date.dateFormat) } },
                    ]
                  },
                ]
              }
            ]
          }
        }
      ])
      return res.json({
        success: getData.length != 0 ? "success" : "error",
        data: getData
      })
    }

    if (action == "rewardDistribution") {


      const saveFile = await req?.files?.xlFile ? await ImageAddFunc([
        {
          path: `public/rewardFile/`,
          files: req?.files?.xlFile,
          filename:
            ref +
            "." +
            req?.files?.xlFile?.name?.split(".")[
            req?.files?.xlFile?.name?.split(".")?.length - 1
            ],
        },
      ]) : null

      const arr = JSON.parse(rewardArr)

      const setArr = await Promise.all(arr.map((val) => {
        val.projectId = projectId;
        val.xlFile = saveFile
        val.season = Season
        val.year = year
        delete val._id
        return val
      }))
      console.log("setArr", setArr);
      await Promise.all(
        setArr.map(async (val) => {
          const upData = await StakingSchema.findOneAndUpdate({ NFTId: val.NFTId, walletAddress: val.walletAddress, withdraw: false }, { lastRewardDay: new Date(), lastReward: val.amount });

          return val
        })
      )

      console.log("setArr", setArr);
      const setData = await RewardSchema.insertMany(setArr);

      return res.json({
        success: setData ? "success" : "error",
        msg: setData ? "saved successfully" : "Error"
      })
    }

    if (action == "getRewards") {
      const getData = await RewardSchema.find({ projectId, season: Season });

      return res.json({
        success: "success",
        data: getData
      })
    }
  } catch (e) {
    console.log("err on stakingFunctions", e);

  }
}

//whitelists
export const Addwhitelists = async (req, res) => {
  console.log("resdfs", req.body)

  var data = req.body;

  if (data.action == "add") {

    var payload = {
      "walletAddress": data.walletAddress,
      "gmail": data.gmail
    }

    var isExists = await whiteListSchema.findOne({ "walletAddress": data.walletAddress });
    console.log("isexists", isExists)
    if (isExists) {
      res.status(200).json({ "status": false, "msg": "walletAddress Already Exists" })
    }
    else {
      var whitelisted = new whiteListSchema(payload);
      var resp = await whitelisted.save()
      if (resp) {
        console.log("respwhitelisted", resp)
        res.status(200).json({ "status": true, "msg": "whitelisted added successfully!" })
      } else
        res.status(200).json({ "status": false, "msg": "Cannot Add whitelisted!" })
    }

  }

  else if (data.action == "all") {
    var resp = await whiteListSchema.find({}).sort({ createdAt: -1 })
    if (resp) {
      console.log("data", resp)
      res.status(200).json({ "status": true, "data": resp })
    }
    else
      res.status(200).json({ "status": true, "data": resp })
  }
  else if (data.action == "getProjectsoption") {
    const getData = await projectSchema.find({}, { label: "$projectTitle", value: "$projectTitle" });
    return res.json({
      success: getData.length != 0 ? "success" : "error",
      data: getData,
    })
  }
  else if (data.action == "getAll") {
    //   var userorders = await Find({
    //     DBName: orders,
    //     FinData: { UserId: ObjectId(userid), Status: "completed" },
    //     SelData: {},

    // })
    const getisminted = await Tokens.find({ projectId: ObjectId(data.projecttitle), isMinted: false }).sort({ createdAt: - 1 })
    console.log("getisminted", getisminted);
    if (getisminted) {


      // var Send_Mail = await Node_Mailer({ Type: 'edit_bid', EmailId: EmailId, Subject: 'Edit Offer For A NFT', click: click })

      res.json({ success: "success", msg: "submitted successfully", data: getisminted })
    }
    else {
      res.json({ success: "error" })
    }
  }
  else if (data.action == "send") {
    const listsemail = await whiteListSchema.find({ gmail: data.gmail })
    console.log("listsemail", listsemail, data.gmail);
    var Sendmail = await send_mail({ type: 'giveaway', EmailId: data.gmail, subject: 'nft mail send successfully', Content: "your mail sended" })
    console.log("dddmaiasd", Sendmail);
  }
}

export const truefalseaddress = async (req, res) => {
  console.log("reqbody", req.body)


  var truefalse = await whiteListSchema.findOneAndUpdate({ "walletAddress": req.body.walletName }, { "whitelisted": req.body.whitelisteds }, { new: true });
  if (truefalse)
    res.status(200).json({ "status": true, "msg": "truefalse visibility changed" })

  else res.status(200).json({ "status": false, "msg": "failed to change" })
}


export const getReportsFunc = async (req, res) => {
  const { action, projectId } = req.body
  try {
    if (action == "collectionMint") {
      const getData = await ActivitySchema.find({ projectId, Activity: "Mint" });
      console.log('getDatsfsefesa---->', getData);
      return res.json({
        success: "success",
        data: getData
      })
    }

    if (action == "activityReport") {
      const getData = await ActivitySchema.aggregate([
        {
          $lookup: {
            from: "tokens",
            let: { tId: "$NFTId" },
            pipeline: [
              { $match: { $expr: { $eq: ['$NFTId', '$$tId'] } } }
            ],
            as: "Tokens",
          }
        },
        { $unwind: '$Tokens' },
        { $match: { "Tokens.projectId": projectId } },
        { $sort: { "createdAt": -1 } },
        {
          $project: {
            "Tokens": 0
          }
        }
      ])

      return res.json({
        success: "success",
        data: getData
      })
    }

    if (action == "royaltyReport") {
      const getData = await ActivitySchema.find({ projectId, Activity: { $in: ["Accept", "Buy"] } });
      return res.json({
        success: "success",
        data: getData
      })
    }
  } catch (e) {
    console.log("err om getReportFunc", e);
  }
}

export const gasManagerFunc = async (req, res) => {
  try {
    const { action, } = req.body;
    if (action == "get") {
      const resp = await GasManager.findOne({});
      return res.json({
        success: resp ? "success" : "error",
        data: resp,
        msg: resp ? "Gas fee fetched" : "No gas Fetched"
      })
    }

    if (action == "edit") {
      const resp = await GasManager.findOneAndUpdate({}, req.body);
      return res.json({
        success: resp ? "success" : "error",
        data: resp,
        msg: resp ? "Updated successfully" : "not updated"
      })
    }

    if (action == "add") {
      const resp = await new GasManager(req.body).save();
      return res.send(resp)
    }
  } catch (e) {
    console.log('Errorn gasManagerFunc---->', e);
  }
}

export const gasTokensFunctions = async (req, res) => {
  try {
    const { action, name, contractAddress, symbol, decimal } = req.body;

    if (action == "get") {
      const Resp = await GasTokens.find({}, { value: "$symbol", label: "$symbol", "contractAddress": 1, Name: 1, symbol: 1, decimal: 1 });
      return res.json({
        status: Resp ? true : false,
        msg: Resp ? "Success" : "error",
        data: Resp
      })
    }

    else if (action == "add") {

      const check = await GasTokens.findOne({ contractAddress });
      if (!isEmpty(check)) return res.json({
        status: true,
        msg: "already",
        data: check
      })

      const Resp = await new GasTokens({
        Name: name,
        contractAddress,
        symbol,
        decimal
      }).save()

      return res.json({
        status: Resp ? true : false,
        msg: Resp ? "Success" : "error",
        data: Resp
      })
    }

  } catch (e) {
    console.log('Error  on gasTokensFunctions---->', e);
  }
}