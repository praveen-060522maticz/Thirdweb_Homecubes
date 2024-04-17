const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let whitelist = new Schema({
	walletAddress: {
		type: String,
        default:''
	},
	whitelisted: {
        type: String,
        default:"true"
	},
	gmail: {
		type:String,
		default :''
	}
 

}, { timestamps: true });
module.exports = mongoose.model('whitelist', whitelist, 'whitelist');
