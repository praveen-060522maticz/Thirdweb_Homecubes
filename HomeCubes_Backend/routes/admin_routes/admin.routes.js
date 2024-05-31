import { Router } from 'express'
import * as adminctrl from '../../controller/admin_controller/admin_controller'
import { verifyToken } from '../../helper/credentialsSetup';

import * as cmsCtrl from '../../controller/admin_controller/cms_controller/cms.controller'
import * as userCtrl from '../../controller/admin_controller/user_controller/user.controller'
import * as tokenCtrl from '../../controller/admin_controller/token_controller/token.controller'
const routers = Router()

routers.route('/adminlogin').post(adminctrl.loginAdmin)
routers.route("/addfaq").post( userCtrl.AddEditDeleteFAq);
routers.route('/getSubscribers').get(userCtrl.getSubscriberList);
routers.route('/sendSubscribeMail').post(userCtrl.SendMails);
routers.route('/getcmslist').get(tokenCtrl.getCmsList);
routers.route('/editcms').post(tokenCtrl.editcms);
routers.route('/addfaqcontent').post(userCtrl.AddDelEditFAqcontent);
routers.route('/getfaqcontentslist').get(userCtrl.getFaqcontentsList);
routers.route('/addaboutuser').post(cmsCtrl.addaboutuser)
routers.route('/currencylist').get(tokenCtrl.getCurrencyList);
routers.route("/createProject").post(adminctrl.createProject);
routers.route("/collectionFunctions").post(adminctrl.collectionFunctions);
routers.route("/bulkMinting").post(adminctrl.bulkUploadFunc);
routers.route("/getNftsByProjectId").get(adminctrl.getNftsByProjectId);
routers.route("/KycList").get(userCtrl.KycList);
routers.route("/newsAndFeed").post(cmsCtrl.newsAndFeed);
routers.route("/createNft").post(adminctrl.createNft);
routers.route("/getTokenCount").get(adminctrl.getTokenCount);
routers.route('/getaboutuser').get(cmsCtrl.getaboutuser)

routers.route('/addtoken').post(tokenCtrl.AddToken);

//contactus
routers.route('/addcontactus').post(cmsCtrl.addcontactus)
routers.route('/blogCategories').get(adminctrl.blogCategories)
routers.route('/blogsFunction').post(adminctrl.blogsFunction)
routers.route('/saveCkeditorImage').post(adminctrl.saveCkeditorImage)
routers.route('/stakingFunctions').post(adminctrl.stakingFunctions)
routers.route('/editTokens').post(adminctrl.editTokens);
routers.route("/addwhitelists").post( adminctrl.Addwhitelists);
routers.route("/truefalseaddress").post( adminctrl.truefalseaddress);
routers.route("/createAdmin").post(verifyToken,adminctrl.createAdmin);
routers.route("/getReportsFunc").post(verifyToken,adminctrl.getReportsFunc);
routers.route("/gasManagerFunc").post(adminctrl.gasManagerFunc);

export default routers