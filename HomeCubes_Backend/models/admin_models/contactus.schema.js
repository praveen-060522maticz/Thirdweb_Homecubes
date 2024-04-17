const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let contact = new Schema({
	Name:{
		type:String,
        default:""
	},
	email:{
		type:String,
        default:""
	},
    comment:{
		type:String,
        default:""
	},
    delete:{
		type:Boolean,
		delete:false
	},

});
module.exports = mongoose.model('contact',contact,'contact');
