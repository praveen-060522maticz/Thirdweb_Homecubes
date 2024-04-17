import Token from '../../../models/front_models/token.schema'
import Nfttags from '../../../models/front_models/nfttag.schema'
import { Find, FindOne, FindOneAndUpdate, Save, TokenList } from '../../../helper/mongooseHelper'
import { isEmpty, ImageAddFunc } from '../../../helper/commonFUnction'
import EmailTemplate from '../../../models/admin_models/emailtemplates.schema'
import Cms from '../../../models/admin_models/cms.schema'
import Currency from '../../../models/admin_models/currency.schema'
import TokenOwner from '../../../models/front_models/tokenowner.schema'
import * as MongooseHelper from '../../../helper/mongooseHelper'
import fs from 'fs';


export const getCmsList = async (req, res) => {
  const { page } = req.query
  try {
    var resp = await Cms.find(page ? { page: { $in: page } } : { deleted: false })
    if (resp) {
      console.log("data", resp)
      res.status(200).json({ "status": true, "data": resp })
    }
    else
      res.status(200).json({ "status": true, "data": resp })

  } catch (e) {
    console.log("ererer on getCmsList", e);
  }

}
export const getCurrencyList = async (req, res) => {

  console.log('currencyyyyyy');
  let data = {
    DBName: Currency, FinData: {}, SelData: { _id: 0 }
  }
  let List = await MongooseHelper.Find(data)
  console.log('currencyyy', List)
  res.json(List)

}


export const editcms = async (req, res) => {
  console.log("reqnody", req.body, req.files)
  const { action, _id } = req.body

  try {
    var files = req.files
    if (action == "add") {
      console.log("dgrtrdgtrdeyh", files);

      var ref = Date.now();

      const cmsimage = req?.files?.img ? await ImageAddFunc([

        {
          path: `public/cmsimg/`,
          files: req?.files?.img,
          filename:
            ref +
            "." +
            req?.files?.img.name.split(".")[
            req?.files?.img.name.split(".").length - 1
            ],
        }
      ]) : null

      console.log("fileName_fileName1", cmsimage)
      let savedata;

      if (req?.files != null) {
        savedata = {
          title: req.body.title,
          position: req.body.position,
          link: req.body.link,
          content: req.body.content,
          page: req.body.page,
          img: cmsimage
        }
      } else {
        savedata = {
          title: req.body.title,
          position: req.body.position,
          link: req.body.link,
          content: req.body.content,
          page: req.body.page,
        }
      }
      var isExists = await Cms.findOne({ "title": req.body.title });
      console.log("isexists", isExists)
      if (isExists) {
        res.status(200).json({ "status": false, "msg": "Cms Already Exists" })
      }
      else {
        var cmsadd = new Cms(savedata)
        await cmsadd.save()
        console.log("savecmsaddsave", cmsadd)
        if (cmsadd) {
          res.send({ "status": true, "msg": "cms data saved", data: cmsadd })
          // res.send("dsjidgasudvgausgd")
          //  res.json({"status":true,"data": result})
        }

        else {
          console.log("error");
          res.send({ message: "error" })
        }
      }
    }
    if (action === "delete") {

      await Cms.findOneAndUpdate({ "_id": _id }, { deleted: true }, { new: true }).then(() => {
        console.log("deleted");
        res.status(200).json({ "status": true })
      }).catch(err => {
        console.log("not deleted")
        res.status(200).json({ "status": false })
      })

    }

    if(action == "edit"){
      
    }

    if (files == undefined) {
      if (req.body.title) {
        console.log("heading", req.body.content);
        resp = await Cms.findOneAndUpdate({ "key": req.body.key }, { "content": req.body.content, "link": req.body.link, title: req.body.title }, { new: true })
      }
      else {
        resp = await Cms.findOneAndUpdate({ "key": req.body.key }, { "content": req.body.content, "link": req.body.link, title: req.body.title }, { new: true })
      }
      console.log("resp after cms", resp)

      if (resp) {
        res.status(200).json({ "status": true, "msg": "cms updated successfully" })
      }
      else
        res.status(200).json({ "status": false, "msg": "cms updation failed" })
    } else {

      var ref = Date.now();

      const cmsimage = req?.files?.img ? await ImageAddFunc([

        {
          path: `public/cmsimg/`,
          files: req?.files?.img,
          filename:
            ref +
            "." +
            req?.files?.img.name.split(".")[
            req?.files?.img.name.split(".").length - 1
            ],
        }
      ]) : null

      var resp = await Cms.findOneAndUpdate({ "key": req.body.key }, { $set: { "content": req.body.content, "link": req.body.link, "img": cmsimage, title: req.body.title } }, { new: true });
      console.log('resp---->', resp);
      if (resp) {
        console.log("resp after cms", resp)
        res.status(200).json({ "status": true, "msg": "cms updated successfully" })
      }
      else
        res.status(200).json({ "status": false, "msg": "cms updation failed" })


    }



  } catch (err) {
    console.log(err, "er in cms")
  }


}