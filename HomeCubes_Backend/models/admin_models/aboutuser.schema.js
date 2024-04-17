import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;
let newsSchema = new Schema({

	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	steps: {
		type: Array,
		default: []
	},
	investment: {
		type: Array,
		default: []
	},
	enable: {
		type: Boolean,
		default: false
	}


}, { timestamps: true });
export default model('Aboutus', newsSchema, 'Aboutus');