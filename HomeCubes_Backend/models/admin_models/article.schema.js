import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
let newsSchema = new Schema({
	
	heading:{
		type:String,
		required:true,
	},
    content :{
        type:String,
		required:true,
    },
	url : {
		type : String,
		required : true
	},
	date:{
		type:Date,
		require :true
	},
	img :{
		type:String,
		required:true,
	}


},{timestamps:true});
export default model('Article',newsSchema,'Article');