import { Router} from 'express'
import * as nftCtrl from '../../controller/front_controller/nft.controller'
import { verifyToken } from '../../helper/credentialsSetup';
const routers = Router()

routers.route('/ValidateTokenName').post(verifyToken,nftCtrl.validateNFTName);
routers.route('/nftimageupload').post(nftCtrl.nftImageUpload);
routers.route('/createnft').post(verifyToken,nftCtrl.createNewNFT);

routers.route('/Tokenlistfunc').get(nftCtrl.Tokenlistfunc);
routers.route('/info').get(nftCtrl.info)
routers.route('/myItemList').get(nftCtrl.MyItemTokenlistfunc);
routers.route('/CreateOrder').post(verifyToken,nftCtrl.CreateOrder)

routers.route('/BuyAccept').post(verifyToken,nftCtrl.BuyAccept)
routers.route('/BidAction').post(verifyToken,nftCtrl.BidAction);
routers.route('/findupdatebalance').post(nftCtrl.Findupdatebalance)

routers.route('/getCurrentProject').get(nftCtrl.getCurrentProject)
routers.route('/onInitialMint').post(nftCtrl.onInitialMint)
routers.route('/Buymint').post(nftCtrl.Buymint)
routers.route('/getGallery').get(nftCtrl.getGallery)
routers.route('/getGalleryTokens').get(nftCtrl.getGalleryTokens)
routers.route('/getActivitiesByNftId').get(nftCtrl.getActivitiesByNftId);
routers.route('/searchQueryForMyitems').get(nftCtrl.searchQueryForMyitems);
routers.route('/getProjects').get(nftCtrl.getProjects);
routers.route('/stackFunction').post(nftCtrl.stackFunction);


export default routers