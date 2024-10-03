import * as MongooseHelper from "../../helper/mongooseHelper";
import userSchema from "../../models/front_models/user.schema";
import * as commonFun from "../../helper/commonFUnction";
import { ImageAddFunc } from "../../helper/commonFUnction";
import { Node_Mailer } from "../../helper/commonFUnction";
import { JWT_SIGN } from "../../helper/credentialsSetup";
import config from "../../config/serverConfig";
import Sociallinks from '../../models/front_models/social.schema'
import subscribers from '../../models/front_models/subscriber.schema'
import Contactus from "../../models/admin_models/contactus.schema";
export const UserRegister = async (req, res) => {
  console.log("Setup is working", req.body);
  var {
    Type,
    WalletAddress,
    WalletType,
    EmailId,
    DisplayName,
    Profile,
    Cover,
    Youtube,
    Facebook,
    Twitter,
    Instagram,
    Bio,
    CustomUrl,
    User,
    Nationality,
    mobileNumber,
    Address,
    parentAddress,
    Name,
    SurName
  } = req.body;
  if (req.files) {
    var profile = req?.files?.Profile
      ? await ImageAddFunc([
        {
          path: `public/user/${WalletAddress}/profile/`,
          files: req.files.Profile,
          filename:
            Date.now() +
            "." +
            req.files.Profile.name.split(".")[
            req.files.Profile.name.split(".").length - 1
            ],
        },
      ])
      : null;

    var cover = req?.files?.Cover
      ? await ImageAddFunc([
        {
          path: `public/user/${WalletAddress}/cover/`,
          files: req.files.Cover,
          filename:
            Date.now() +
            "1." +
            req.files.Cover.name.split(".")[
            req.files.Cover.name.split(".").length - 1
            ],
        },
      ])
      : null;

    var kycFile = req?.files?.kycFile
      ? await ImageAddFunc([
        {
          path: `public/user/${WalletAddress}/kyc/`,
          files: req.files.kycFile,
          filename:
            Date.now() +
            "1." +
            req.files.kycFile.name.split(".")[
            req.files.kycFile.name.split(".").length - 1
            ],
        },
      ])
      : null;

  }
  var saveData = {
    DisplayName: DisplayName,
    EmailId: EmailId,
    Youtube: Youtube,
    Facebook: Facebook,
    Twitter: Twitter,
    Instagram: Instagram,
    Bio: Bio,
    CustomUrl: CustomUrl,
    Profile: profile ?? Profile,
    Cover: cover ?? Cover,
    WalletAddress: WalletAddress,
    WalletType: WalletType,
    kycFile: kycFile,
    parentAddress
  };
  if (Type == "Cuscheck") {
    let FinData = { CustomUrl: CustomUrl };
    var cuscheck = await MongooseHelper.FindOne({
      DBName: userSchema,
      FinData: FinData,
      SelData: {},
    });
    if (!cuscheck?.msg) {
      res.json({ staus: false });
    } else {
      res.json({ staus: true, msg: "Custom url is already Exist" });
    }
  }


  var FinData = {};
  if (Type == "InitialConnect") {
    if (WalletAddress) {
      var FinData = { WalletAddress: WalletAddress };
    } else {
      res.json({ success: "error", msg: "Address Empty" });
    }
    if (!commonFun.isEmpty(FinData)) {
      const FIndAlreadyExits = await MongooseHelper.FindOne({
        DBName: userSchema,
        FinData: FinData,
        SelData: {},
      });
      console.log("dataaa", FIndAlreadyExits);
      if (FIndAlreadyExits.success === "success") {
        console.log('FIndAlreadyExits?.msg?.parentAddress---->', FIndAlreadyExits?.msg?.parentAddress);
        if ((FIndAlreadyExits?.msg?.parentAddress == FIndAlreadyExits?.msg?.WalletAddress) || FIndAlreadyExits?.msg?.parentAddress == "") {
          const finVal = {
            DBName: userSchema,
            FinData: { WalletAddress: WalletAddress },
            Updata: { $set: { parentAddress } },
            save: { new: true },
          };
          console.log('finValfinValfinVal---->', finVal);
          const Finddata = await MongooseHelper.FindOneAndUpdate(finVal);
        }

        const token = JWT_SIGN(FIndAlreadyExits?.msg?._id);
        res.json({
          success: "success",
          data: FIndAlreadyExits.msg,
          token: token,
          msg: `Wallet connected successfully`,
          already: true,
        });
      } else {
        const token = JWT_SIGN(WalletAddress);
        saveData._id = WalletAddress;
        saveData.CustomUrl = WalletAddress;
        console.log("code log else created", saveData);
        const savedata = await MongooseHelper.Save({
          DBName: userSchema,
          Data: saveData,
        });

        if (savedata.success === "success") {
          res.json({
            success: "success",
            data: savedata.msg,
            token: token,
            msg: `connected successfully`
          });
        } else {
          res.json({ success: "error", msg: "Can't Save WalletAddress" });
        }
      }
    }
  } else if (Type == "getProfile") {
    if (CustomUrl) {
      FinData = { CustomUrl: CustomUrl };
    } else {
      res.json({ success: "error", msg: "Custom Url Empty" });
    }
    console.log("asdgfsdg", FinData, commonFun.isEmpty(FinData));
    if (!commonFun.isEmpty(FinData)) {
      const FIndAlreadyExits = await MongooseHelper.FindOne({
        DBName: userSchema,
        FinData: FinData,
        SelData: {},
      });
      console.log("gssdfg", FIndAlreadyExits);
      if (FIndAlreadyExits.success === "success") {
        FIndAlreadyExits?.msg?.Follower?.includes(User);
        var follower = FIndAlreadyExits?.msg?.Follower?.some(
          (val) => val?.Address === User
        );
        FIndAlreadyExits.msg.follow = follower ? "unfollow" : "follow";
        console.log("fshdhdhg", FIndAlreadyExits?.msg, User, follower);
        res.json({
          success: "success",
          data: FIndAlreadyExits.msg,
          follow: follower ? "follow" : "unfollow",
          msg: `connected successfully`,
        });
      } else {
        res.json({ success: "error", msg: "User Not Found" });
      }
    }
  } else if (Type == "profile") {

    var FinData = { WalletAddress: WalletAddress };
    var FindMAIL = { EmailId: EmailId };
    var Findcustom = { CustomUrl: CustomUrl };
    const customExits = await userSchema.findOne(FindMAIL);
    const customexist = await userSchema.findOne(Findcustom);
    console.log("VVVASDDDFDF", customExits, customexist);
    if (customExits && customExits.WalletAddress != WalletAddress) {
      return res.json({ success: "false", msg: "Email id Already exist" });
    }
    if (customexist && customexist.WalletAddress != WalletAddress) {
      return res.json({ success: "false", msg: "custom URL Already exist" });
    }
    // if(customExits == null && customexist == null){

    var finVal = {
      DBName: userSchema,
      FinData: FinData,
      Updata: { $set: saveData },
      save: { new: true },
    };
    const Finddata = await MongooseHelper.FindOneAndUpdate(finVal);
    if (customExits) {
      console.log("dataisexcestincustomExists", customExits)
      await Node_Mailer({
        Type: "changeprofile",
        EmailId: EmailId,
        Subject: "Profile Update",
        OTP: "",
        click: `${config.SITE_URL}/profile/${saveData?.CustomUrl}`,
      });
    } else {
      await greetingmail(EmailId, DisplayName)
    }
    const token = JWT_SIGN(Finddata.msg._id, Finddata.msg.EmailId);
    console.log("tokentoken", token);

    res.json({
      success: Finddata.success == "success" ? "success" : "error",
      token: token,
      data: Finddata.msg,
      msg:
        Finddata.success == "success"
          ? `Updated Successfully`
          : "updation failed",
    });
    // }
  } else if (Type == "cover") {
    var FinData = { WalletAddress: WalletAddress };
    const customExits = await MongooseHelper.FindOne({
      DBName: userSchema,
      FinData: { WalletAddress: WalletAddress },
      SelData: { CustomUrl: 1, EmailId: 1 },
    });
    var finVal = {
      DBName: userSchema,
      FinData: { WalletAddress: WalletAddress },
      Updata: { $set: { Cover: saveData.Cover } },
      save: { new: true },
    };
    const Finddata = await MongooseHelper.FindOneAndUpdate(finVal);
    res.json({
      success: Finddata.success == "success" ? "success" : "error",
      data: Finddata.msg,
      msg:
        Finddata.success == "success"
          ? `Cover Image Updated Successfully`
          : "updation failed",
    });
  } else if (Type == "profileimage") {
    console.log("fgsdfgsdg", saveData);
    var FinData = { WalletAddress: WalletAddress };
    var finVal = {
      DBName: userSchema,
      FinData: { WalletAddress: WalletAddress },
      Updata: { $set: { Profile: saveData.Profile } },
      save: { new: true },
    };
    const Finddata = await MongooseHelper.FindOneAndUpdate(finVal);
    res.json({
      success: Finddata.success == "success" ? "success" : "error",
      data: Finddata.msg,
      msg:
        Finddata.success == "success"
          ? `Profile Image Updated Successfully`
          : "updation failed",
    });
  } else if (Type == "KYC") {

    const checkMail = await userSchema.find({ EmailId })
    if ((checkMail.length != 0) && (checkMail[0]?.WalletAddress != WalletAddress)) return res.json({
      success: "error",
      msg: "Email id already exist",
    });

    var FinData = { WalletAddress: WalletAddress };
    var finVal = {
      DBName: userSchema,
      FinData: { WalletAddress: WalletAddress },
      Updata: {
        $set: {
          kycFile: saveData.kycFile,
          termsAccepted: true,
          Nationality,
          mobileNumber,
          Address,
          KycStatus: "submit",
          EmailId,
          Name,
          SurName
        }
      },
      save: { new: true },
    };
    const Finddata = await MongooseHelper.FindOneAndUpdate(finVal);
    res.json({
      success: Finddata.success == "success" ? "success" : "error",
      data: Finddata.msg,
      msg:
        Finddata.success == "success"
          ? `Kyc Updated Successfully`
          : "updation failed",
    });
  }

};

export const coverimagevalidations = async (req, res) => {
  let errors = {};
  let file = req.files;
  let imageFormat = /\.(png|PNG|gif|WEBP|webp|JPEG|jpg|JPG)$/;
  if (file == null) {
    errors.file = "Image is Required";
  } else if (!imageFormat.test(req.files.image.name)) {
    errors.file = "Please select valid image.";
  } else if (10000000 < req.files.image.size) {
    // 10 MB
    errors.file = "Too large. Please upload within 5MB";
  }
  if (!isEmpty(errors)) {
    return errors;
  }
};

export const sociallinks = async (req, res) => {
  try {
    var links = await MongooseHelper.Find({
      DBName: Sociallinks,
      FinData: { selected: true },
    });
    console.log("links", links.msg[0]);
    res.json({ success: links.success, msg: links.msg });
  } catch (error) {
    console.log(" erreo n sociallinks", error);
  }

};

export const Newsletter = async (req, res) => {
  try {
    console.log("Newsletter", req.body);
    var email = req.body.email;
    var Exists = await MongooseHelper.FindOne({
      DBName: subscribers,
      FinData: { email: email },
      SelData: {},
    });
    if (Exists.success == "success") {
      res.json(commonFun.Encryptdata({ success: "error", msg: "Email Id already exists" }));
    } else {
      var new_subscriber = await MongooseHelper.Save({
        DBName: subscribers,
        Data: { email: email },
      });
      console.log("save", new_subscriber);
      res.json(commonFun.Encryptdata({ success: new_subscriber.success, msg: new_subscriber.success }));
    }
  } catch (error) {
    console.log(" erron Newsletter", error);
  }

};

export const addcontactus = async (req, res) => {
  console.log("resdfs", req.body)

  var data = req.body;

  if (data.action == "add") {

    var payload = {
      "Name": data.Name,
      "email": data.email,
      "comment": data.comment
    }
    console.log("payload", payload)
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
        res.status(200).json({ "status": true, "msg": "contact added successfully", data: resp })
      } else
        res.status(200).json({ "status": false, "msg": "Cannot Add contact" })
    }

  }
  else if (data.action == "all") {
    var resp = await Contactus.find({})
    if (resp) {
      console.log("data", resp)
      res.status(200).json({ "status": true, "data": resp })
    }
    else
      res.status(200).json({ "status": true, "data": resp })
  }

}