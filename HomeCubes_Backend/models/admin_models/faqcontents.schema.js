const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let faqcont = new Schema({
	
	faqcontent:{
		type:String,
		required:true,
	},

});
module.exports = mongoose.model('faqcontent',faqcont,'faqcontent');
