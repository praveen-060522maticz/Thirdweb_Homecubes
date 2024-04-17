const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let faq = new Schema({
	question: {
		type: String
	},
	answer: {
		type: String,
		required: true,
	},
	deleted: {
		type: Boolean,
		default: false
	}

}, { timestamps: true });
module.exports = mongoose.model('faq', faq, 'faq');
