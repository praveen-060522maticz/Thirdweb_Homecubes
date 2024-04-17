const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let nfttag = new Schema({
	nfttag:{
		type:String
	},
	
	Date:{
		type:Date,
		default: Date.now()
	},
	
});

module.exports = mongoose.model('nfttag',nfttag,'nfttag');
