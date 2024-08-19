import userSchema from '../../../models/front_models/user.schema'
import Faq from '../../../models/admin_models/faq.schema'
import faqcontent from '../../../models/admin_models/faqcontents.schema'
import Subscribers from '../../../models/front_models/subscriber.schema'
import SocialLinks from '../../../models/front_models/social.schema'
import collection from '../../../models/front_models/collection.schema'
import { Find, Aggregate } from '../../../helper/mongooseHelper'
import config from '../../../config/serverConfig'
import nodemailer from 'nodemailer'
import fs from 'fs-extra';
import { Encryptdata } from '../../../helper/commonFUnction'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId



//-------------------------------------------
// export const getFaqList = async (req, res) => {
//   console.log("get social links")
//   var resp = await Faq.find({})
//   if (resp) {
//     console.log("data", resp)
//     res.status(200).json({ "status": true, "data": resp })
//   }
//   else
//     res.status(200).json({ "status": true, "data": resp })

// }

//-------------------------------------
export const AddEditDeleteFAq = async (req, res) => {
  try {
    console.log("resdfs", req.body)

    var data = req.body;

    if (data.action == "add") {

      var payload = {
        "question": data.question,
        "answer": data.answer,
        enable: true
      }
      var isExists = await Faq.findOne({ "question": data.question });
      console.log("isexists", isExists)
      if (isExists) {
        res.status(200).json({ "status": false, "msg": "faq Already Exists" })
      }
      else {
        var faq = new Faq(payload);
        var resp = await faq.save()
        if (resp) {
          console.log("resp faq", resp)
          res.status(200).json({ "status": true, "msg": "faq added successfully!" })
        } else
          res.status(200).json({ "status": false, "msg": "Cannot Add FAQ!" })
      }

    }
    else if (data.action == "edit") {

      var resp = await Faq.findByIdAndUpdate({ "_id": data.id }, { "answer": data.answer, question: data.question }, { new: true })
      if (resp) {
        console.log("resp edit", resp)
        res.status(200).json({ "status": true, "msg": "faq edited successfully!" })
      } else
        res.status(200).json({ "status": false, "msg": "Cannot edit FAQ!" })



    }
    else if (data.action == "all") {
      var resp = await Faq.find({}).sort({ updatedAt: -1 })
      if (resp) {
        console.log("data", resp)
        res.status(200).json({ "status": true, "data": resp })
      }
      else
        res.status(200).json({ "status": true, "data": resp })
    }
    else {
      var resp = await Faq.findOneAndDelete({ "question": data.question })
      if (resp) {
        console.log("socal success", resp)
        res.status(200).json({ "status": true, "msg": "FAQ deleted successfully!" })
      } else
        res.status(200).json({ "status": false, "msg": "failed to delete" })

    }
  } catch (e) {
    console.log('eadddfaq---->', e);
  }

}

export const getFaqcontentsList = async (req, res) => {
  console.log("get social links")
  var resp = await faqcontent.find({}).sort({ createdAt: - 1 })
  if (resp) {
    console.log("data", resp)
    res.status(200).json({ "status": true, "data": resp })
  }
  else
    res.status(200).json({ "status": true, "data": resp })

}
export const AddDelEditFAqcontent = async (req, res) => {
  console.log("resdghghs", req.body)

  var data = req.body;

  if (data.action == "add") {

    var payload = {
      faqcontent: data.faqcontent,
    }
    console.log(payload);
    var faq = new faqcontent(payload);
    var resp = await faq.save()
    if (resp) {
      console.log("resp faq", resp)
      res.status(200).json({ "status": true, "msg": "faq added successfully!" })
    } else
      res.status(200).json({ "status": false, "msg": "Cannot Add FAQ!" })


  }
  else if (data.action == "edit") {
    console.log(data);
    var resp = await faqcontent.findOneAndUpdate({ "_id": data.id }, { "faqcontent": data.faqcontent }, { new: true })
    console.log(resp);
    if (resp) {
      console.log("resp edit", resp)
      res.status(200).json({ "status": true, "msg": "faq edited successfully!" })
    } else
      res.status(200).json({ "status": false, "msg": "Cannot edit FAQ!" })



  } else {
    var resp = await faqcontent.findOneAndDelete({ "faqcontent": data.faqcontent })
    if (resp) {
      console.log("socal success", resp)
      res.status(200).json({ "status": true, "msg": "FAQ deleted successfully!" })
    } else
      res.status(200).json({ "status": false, "msg": "failed to delete" })

  }

}

export const FollowUnFollowFunc = async (req, res) => {
  const { MyItemAddr, ClickAddr, From, MyItemCustomUrl, ClickCustomUrl } = req.body
  console.log('fgfggg', req.body)
  if (MyItemAddr && ClickAddr) {
    // remove follower
    var update = { $pull: { Follower: { Address: ClickAddr, CustomUrl: ClickCustomUrl } } }
    var finVal = { DBName: userSchema, FinData: { $and: [{ WalletAddress: MyItemAddr }, { CustomUrl: MyItemCustomUrl }, { Follower: { $elemMatch: { Address: ClickAddr, CustomUrl: ClickCustomUrl } } }] }, Updata: update, save: { new: true } }
    var Find = await MongooseHelper.FindOneAndUpdate(finVal)
    console.log("HGSHADSGA 1", Find)

    if (Find.success == "success") {
      //remove following
      var update_following = { $pull: { Following: { Address: MyItemAddr, CustomUrl: MyItemCustomUrl } } }
      var finVal_following = { DBName: userSchema, FinData: { $and: [{ WalletAddress: ClickAddr }, { CustomUrl: ClickCustomUrl }, { Following: { $elemMatch: { Address: MyItemAddr, CustomUrl: MyItemCustomUrl } } }] }, Updata: update_following, save: { new: true } }
      var Find_following = await MongooseHelper.FindOneAndUpdate(finVal_following)
      console.log("HGSHADSGA 2", Find_following)
      if (Find_following.success == "success") {
        res.json({ success: Find_following.success, msg: 'unfollow' })
      }
    }
    else {
      // add follower

      var update = { $push: { Follower: { Address: ClickAddr, CustomUrl: ClickCustomUrl } } }
      var finVal = { DBName: userSchema, FinData: { $and: [{ WalletAddress: MyItemAddr }, { CustomUrl: MyItemCustomUrl }] }, Updata: update, save: { new: true } }
      var Find = await MongooseHelper.FindOneAndUpdate(finVal)
      console.log("HGSHADSGA 4", Find)

      if (Find.success == "success") {
        // add following

        var update_following = { $push: { Following: { Address: MyItemAddr, CustomUrl: MyItemCustomUrl } } }
        var finVal_following = { DBName: userSchema, FinData: { $and: [{ WalletAddress: ClickAddr }, { CustomUrl: ClickCustomUrl }] }, Updata: update_following, save: { new: true } }
        var Find_following = await MongooseHelper.FindOneAndUpdate(finVal_following)
        console.log("HGSHADSGA 3", Find, Find_following)

        if (Find_following.success == "success") {
          res.json({ success: Find_following.success, msg: 'follow' })
        }

      }
    }
  }


}
export const getSubscriberList = async (req, res) => {
  console.log("get subscroiber controller")
  var resp = await Subscribers.find({}).sort({ createdAt: -1 })
  if (resp) {
    console.log("data", resp)
    res.status(200).json({ "status": true, "data": resp })
  }
  else
    res.status(200).json({ "status": true, "data": resp })


}

export const SendMails = async (req, res) => {
  try {
    let reqBody = req.body;
    let bodyOfContent = reqBody.boc;
    let subject = reqBody.subject;
    let subscribers = await Subscribers.find({ maySent: true }, { _id: 0, email: 1 });
    console.log("subscriberws to send ", subscribers.length)

    var all = []
    await Promise.all(
      subscribers.map(async (item) => {
        var data = await sendMailNodeMailer({ toEmail: item.email, htmlContent: bodyOfContent, subject: subject || 'News Letter' })
        all.push(data)
      })
    )

    var finds = all.filter(item => item.Success == false)

    res.status(200).json({ success: finds.length == 0 ? 'success' : "error", msg: finds.length == 0 ? "Sended successfully" : "error on something" });
  } catch (err) {
    console.log("mailerr", err);
    res.status(200).json({ success: "error", data: "Error on mail" });
  }


  // if(Send_Mail) res.json ({"success" : "success"})
  // else res.json ({"success" : "error"})
}

const sendMailNodeMailer = async (payload) => {
  console.log("data in sendnode mailer ", payload)
  try {
    let reqBody = payload;
    let toEmail = reqBody.toEmail;
    let htmlContent = reqBody.htmlContent;
    let subject = reqBody.subject;
    console.log("chking toEmal", toEmail, htmlContent, subject);
    if (toEmail == '' || toEmail == undefined || toEmail == null)
      return { Success: true, Message: 'To email address must' };
    if (htmlContent == '' || htmlContent == undefined || htmlContent == null)
      return { Success: true, Message: 'Html content must' };
    if (subject == '' || subject == undefined || subject == null)
      return { Success: true, Message: 'Subject content must' };

    console.log("check data in mail")
    console.log("Message sent: nodemailer", config.keyEnvBased.emailGateway.nodemailer);
    let transporter = await nodemailer.createTransport(config.keyEnvBased.emailGateway.nodemailer);
    console.log("checking.....", toEmail, subject,);
    let info = await transporter.sendMail({
      from: config.keyEnvBased.emailGateway.nodemailer.auth.user,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return { Success: true, Message: 'Mail sent successfully!' };
  } catch (error) {
    console.log("Error in Sendmailer Function", error);
    return { Success: false, Message: 'Oops something went wrong!' };
  }
}

export const KycList = async (req, res) => {
  const { action, _id, KycStatus, comment } = req.query;
  try {
    if (action == "get") {
      const getKycList = await userSchema.find({ KycStatus: { $ne: "false" } }).sort({ createdAt: -1 });
      return res.json(Encryptdata({
        success: "success",
        data: getKycList
      }))
    }

    if (action == "changeStatus") {
      const setData = await userSchema.findOneAndUpdate({ _id: _id }, { KycStatus, comment });
      return res.json(Encryptdata({
        success: "success",
        data: setData
      }))
    }
  } catch (error) {
    console.log("err on getKycList", error);
  }
}

//contaus
