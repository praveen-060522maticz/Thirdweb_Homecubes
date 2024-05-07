

/// ---> Packages

import * as MongooseHelper from '../../../helper/mongooseHelper'
import Category from '../../../models/admin_models/category.schema'
import Admin from "../../../models/admin_models/admin.schema"
import Article from '../../../models/admin_models/article.schema'
import bcrypt from "bcrypt";
import fs from 'fs'
import jwt from "jsonwebtoken";
import config from '../../../config/serverConfig'
import About from '../../../models/admin_models/aboutuser.schema'
import Contactus from '../../../models/admin_models/contactus.schema';
import newsFeedSchema from '../../../models/admin_models/newsFeed.schema';
import { Encryptdata, ImageAddFunc } from '../../../helper/commonFUnction';
import mongoose from "mongoose";

var ObjectId = mongoose.Types.ObjectId;



export const addaboutuser = async (req, res) => {
  const { stepTitle,
    stepContent, projectId, oldTitle, investmentContent, title, content, stepImage,
    _id
  } = req.body
  try {
    console.log("aboutuser", req.files, req.body);
    var data = req.body;

    if (data.action == "add") {

      var payload = {
        "title": data.title,
        "content": data.content
      }
      var isExists = await About.findOne({ "title": data.title });
      console.log("isexists", isExists)
      if (isExists) {
        res.status(200).json({ "status": false, "msg": "About Already Exists" })
      }
      else {
        var Aboutus = new About(payload);
        var resp = await Aboutus.save()
        if (resp) {
          console.log("resp faq", resp)
          res.status(200).json({ "status": true, "msg": "About added successfully!" })
        } else
          res.status(200).json({ "status": false, "msg": "Cannot Add About!" })
      }

    }
    else if (data.action == "edit") {

      var resp = await About.findOneAndUpdate({ _id: new ObjectId(projectId) }, { title, content }, { new: true })
      if (resp) {
        console.log("resp edit", resp)
        res.status(200).json({ "status": true, "msg": "About edited successfully!" })
      } else
        res.status(200).json({ "status": false, "msg": "Cannot edit About!" })

    }

    else if (data.action == "all") {
      var resp = await About.find({})
      if (resp) {
        console.log("data", resp)
        res.status(200).json({ "status": true, "data": resp })
      }
      else
        res.status(200).json({ "status": true, "data": resp })
    }
    else if (data.action == "saveStep") {
      const ref = Date.now();
      const stepImage = req?.files?.stepImage ? await ImageAddFunc([
        {
          path: `public/aboutus/steps/`,
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
      setData.stepImage = stepImage
      setData.stepContent = stepContent
      setData.deleted = false
      setData.stepTitle = stepTitle

      const getData = await About.updateOne({ _id: ObjectId(projectId) }, { $push: { "steps": setData } }, { new: true })
      console.log("getData", getData);

      return res.json({
        success: getData ? "success" : "error",
        data: getData,
        msg: getData ? "success" : "error"
      })
    }
    else if (data.action == "editStep") {
      const ref = Date.now();
      const stepimage = req?.files?.stepImage ? await ImageAddFunc([
        {
          path: `public/aboutus/steps/`,
          files: req?.files?.stepImage,
          filename:
            ref +
            "." +
            req?.files?.stepImage.name.split(".")[
            req?.files?.stepImage.name.split(".").length - 1
            ],
        }
      ]) : stepImage

      const setData = {}
      setData.stepImage = stepimage
      setData.stepContent = stepContent
      setData.deleted = false
      setData.stepTitle = stepTitle

      const getData = await About.findOneAndUpdate({ "steps.stepTitle": oldTitle, _id: ObjectId(projectId) }, { $set: { "steps.$": setData } }, { new: true })
      console.log("getData", getData);


      return res.json({
        success: getData ? "success" : "error",
        data: getData,
        msg: getData ? "success" : "error"
      })
    }
    else if (data.action == "saveInvest") {
      const setinvestData = {
        investmentContent: investmentContent
      }

      const getinvestData = await About.updateOne({ _id: ObjectId(projectId) }, { $push: { "investment": investmentContent } }, { new: true })
      console.log("getinvestData", getinvestData);

      return res.json({
        success: getinvestData ? "success" : "error",
        data: getinvestData,
        msg: getinvestData ? "success" : "error"
      })
    }
    else if (data.action == "getOne") {
      const getProjects = await About.findOne({ _id: projectId })
      return res.json({
        success: getProjects ? "success" : "error",
        data: getProjects,
        msg: getProjects ? "success" : "error"
      })
    }


    // if (req.body.filter === "delete") {
    //   try {
    //     var headding = req.body.heading;
    //     await About.findOne({ name: headding }).then(data => {
    //       var imgpath = data.img;

    //       fs.unlink(`./public/${imgpath}`, (err) => {
    //         if (err) {
    //           throw err;
    //         }

    //         console.log("Delete image successfully.");
    //       });

    //       fs.rmdir(`./public/${imgpath.split('/')[0]}`, (err) => {
    //         if (err) throw err;
    //         console.log("directory removed");
    //       })
    //     })


    //     await About.findOneAndDelete({ "name": headding }).then(() => {
    //       console.log("deleted");
    //       res.status(200).json({ "status": true })
    //     }).catch(err => {
    //       console.log("not deleted")
    //       res.status(200).json({ "status": false })
    //     })
    //   }
    //   catch (err) {
    //     console.log(err);
    //   }


    // }
    // else if (req.body.action === "edit") {
    //   console.log("edit content", req.files)
    //   if (req.files === null || req.files === undefined) {
    //     try {
    //       var data = { "description": req.body.content }
    //       var resp = await About.findOneAndUpdate({ name: req.body.heading }, data, { new: true })
    //       console.log("resp", resp)
    //       res.status(200).json({ "status": true })

    //     }
    //     catch (err) {
    //       res.status(200).json({ "status": false })
    //       console.log("err", err)
    //     }
    //   } else {
    //     try {
    //       console.log("edit gfg", req.files)
    //       // var imgpath ;
    //       var img = req.files.img;
    //       var heading = req.body.heading;
    //       var date = Date.now()
    //       var dirname = `./public/${date}/`;
    //       console.log("img", img, heading, dirname)
    //       await About.findOne({ name: heading }).then(async (data) => {
    //         var imgs = data.img;

    //         await fs.unlink(`./public/${imgs}`, (err) => {
    //           if (err) {
    //             throw err;
    //           }

    //           console.log("Delete image successfully.");
    //         });
    //         var dd = await img.mv(dirname + date + '.webp')
    //         var imgpath = `${dirname}/${date}.webp`;
    //         var article = {
    //           "description": req.body.content,
    //           "img": imgpath
    //         }
    //         console.log(article, "articl;e")


    //         var resp = await About.findOneAndUpdate({ name: heading }, article, { new: true })
    //         res.status(200).json({ "status": true })



    //       })

    //     }
    //     catch (err) {
    //       res.status(200).json({ "status": false })
    //       console.log("err", err)
    //     }
    //   }

    // }

    // else {

    //   var imgpath;
    //   var data = req.files.img;
    //   var heading = req.body.heading
    //   var name = Date.now()
    //   var dirname = `./public/${name}/`;
    //   try {
    //     console.log("dddd");
    //     await fs.mkdir(dirname, async (err) => {
    //       if (err) { throw err }
    //       else {
    //         await data.mv(dirname + name + '.webp').then(() => {
    //           console.log(data.name, "moved");
    //           imgpath = `${name}/${name}.webp`;
    //         }).catch(err => {
    //           console.log(err)
    //         })
    //         var article = {
    //           "name": heading,
    //           "description": req.body.content,
    //           "img": imgpath
    //         }

    //         var artcilesave = new About(article)
    //         await artcilesave.save()
    //         console.log("save", artcilesave)
    //         res.status(200).json({ "status": true })
    //       }
    //     })
    //     console.log("fff");

    //   }
    //   catch (err) {
    //     res.status(200).json({ "status": false })
    //     console.log(err)
    //   }

    // }
  }
  catch (err) {
    console.log("errin addaboutuser", err);
    res.status(200).json({ "status": false })
  }

}

export const getaboutuser = async (req, res) => {

  try {
    var resp = await About.find({ enable: true })
    console.log("DATAAA", resp);
    res.status(200).json({ "status": true, "data": resp })
  }
  catch (err) {
    res.status(200).json({ "status": false, "data": [] })
    console.log(err)
  }


}

export const loginAdmin = async (req, res) => {
  console.log("i/p data", req.body)
  var ReqBody = req.body.data;

  if (ReqBody && ReqBody.path == "login") {


    var checkPassword = ReqBody.password;

    var user = await Admin.findOne({ email: ReqBody.email })
    if (user) {
      console.log("user", user)
      const match = await bcrypt.compare(checkPassword, user.hashpassword);
      if (match) {
        var payload = { "mail": ReqBody.email, "password": ReqBody.password }
        console.log("payload", payload, config.SECRET_KEY)

        var tokenhash = jwt.sign(payload, config.SECRET_KEY)
        var token = `Bearer ${tokenhash}`

        console.log("token", token)
        res.status(200).json({ "msg": "successfully logged in", "data": true, "token": token })
      }
      else {
        res.status(200).json({ "msg": "incorrect password", "data": false })
      }

    } else { res.status(200).json({ "msg": "user not found", "data": false }) }

  }
  else if (ReqBody && ReqBody.path == "register") {


    // var pass = ReqBody.password;
    // var hashpwd = "";
    // await bcrypt.hash(pass, 5, async function(err, hash) {
    //     if(err)
    //         console.log("error",err)
    //     else{
    //         console.log("hashvalue",hash)
    //         hashpwd = hash;

    //         var newuser = {"email":ReqBody.email,"password":ReqBody.password,"hashpassword":hashpwd}
    //         console.log("newuser",newuser)

    //         var admin = await new Admin(newuser).save()
    //         if(admin){
    //             console.log("savd admin",admin)
    //         }

    //     }
    // });





  }


}

//homecubes

export const newsAndFeed = async (req, res) => {
  const { projectId, action, feedDescription, feedTitle, _id, deleted } = req.body
  console.log(' req.bodyafaw', req.body);
  try {
    if (action == "get") {
      const getData = await newsFeedSchema.find({ projectId }).sort({ createdAt: -1 });
      return res.json(Encryptdata({
        success: "success",
        data: getData,
        msg: 'success'
      }))
    }

    if (action == "getFront") {
      const getData = await newsFeedSchema.find({ projectId, deleted: false }).sort({ createdAt: -1 });
      return res.json(Encryptdata({
        success: "success",
        data: getData,
        msg: 'success'
      }))
    }

    if (action == "add") {

      const checkTitle = await newsFeedSchema.find({ feedTitle, deleted: false });

      if (checkTitle.length != 0) return res.json({
        success: "error",
        msg: "Titile already exist"
      });

      const saveData = await new newsFeedSchema({
        feedDescription,
        feedTitle,
        projectId
      }).save()

      return res.json(Encryptdata({
        success: "success",
        data: saveData,
        msg: "saved successfully"
      }))
    }

    if (action == "edit") {
      const setData = await newsFeedSchema.findOneAndUpdate({ _id: ObjectId(_id) }, { $set: { feedTitle, feedDescription } }, { new: true });
      if (setData) return res.json(Encryptdata({
        success: "success",
        data: setData,
        msg: "updated successfully"
      }));

      else return res.json(Encryptdata({
        success: "error",
        data: setData,
        msg: "Project id not defined"
      }));
    }

    if (action == "delete") {
      const setData = await newsFeedSchema.findOneAndUpdate({ _id: ObjectId(_id) }, { deleted })
      return res.json({
        success: "success",
        msg: "succes"
      })
    }
  } catch (e) {
    console.log("errr on newfeed", e);
    return res.json({
      success: "error",
      msg: "error on newsfeed"
    })
  }
}

//contaus
export const addcontactus = async (req, res) => {
  console.log("resdfs", req.body)

  var data = req.body;

  if (data.action == "add") {

    var payload = {
      "Name": data.Name,
      "email": data.email,
      "messages": data.messages
    }
    var isExists = await Contactus.findOne({ "email": data.email });
    console.log("isexists", isExists)
    if (isExists) {
      res.status(200).json({ "status": false, "msg": "contact email Already Exists" })
    }
    else {
      var contact = new Contactus(payload);
      var resp = await contact.save()
      if (resp) {
        console.log("resp contact", resp)
        res.status(200).json({ "status": true, "msg": "contact added successfully!" })
      } else
        res.status(200).json({ "status": false, "msg": "Cannot Add contact!" })
    }

  }
  else if (data.action == "edit") {

    var resp = await Contactus.findByIdAndUpdate({ "_id": data.id }, { "Name": data.Name, "email": data.email, "messages": data.messages }, { new: true })
    if (resp) {
      console.log("resp edit", resp)
      res.status(200).json({ "status": true, "msg": "contact edited successfully!" })
    } else
      res.status(200).json({ "status": false, "msg": "Cannot edit contact!" })


  }
  else if (data.action == "all") {
    var resp = await Contactus.find({ delete: false })
    if (resp) {
      console.log("data", resp)
      res.status(200).json({ "status": true, "data": resp })
    }
    else
      res.status(200).json({ "status": true, "data": resp })
  }
  else {
    var resp = await Contactus.findOneAndUpdate({ "_id": data._id }, { delete: true })
    if (resp) {
      console.log("socal success", resp)
      res.status(200).json({ "status": true, "msg": "contact deleted successfully!" })
    } else
      res.status(200).json({ "status": false, "msg": "contact failed to delete" })

  }
}