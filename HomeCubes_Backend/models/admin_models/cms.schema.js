const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let cms = new Schema({
	title:{
		type:String
	},
	content:{
		type:String,
		default:"",
	},
	key:{
		type:String,
		default:""
	},
	link:{
		type:String,
		default:"",
	},
	position:{
		type:Number,
		default:"",
	},
	page:{
		type:String,
		default:""
	},
	deleted : {
		type:String,
		default:false,
	},
	img : {
		type : String,
		default :""
	}
},{timestamps:true});
module.exports = mongoose.model('cms',cms,'cms');
