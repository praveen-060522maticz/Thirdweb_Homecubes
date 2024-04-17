import { Router} from 'express'
import * as userCtrl from '../../controller/front_controller/user.controller'
import { verifyToken } from '../../helper/credentialsSetup';
const routers = Router()

routers.route('/create').post(userCtrl.UserRegister);
routers.route('/newsletter').post(userCtrl.Newsletter);
routers.route('/addcontactus').post(userCtrl.addcontactus);

export default routers