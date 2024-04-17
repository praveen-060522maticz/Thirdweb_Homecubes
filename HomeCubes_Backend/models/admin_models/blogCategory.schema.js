const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogCategory = new Schema({
    title: {
        type: String, default: ""
    },
    image: {
        type: String, default: ""
    },
    slug: {
        type: String, default: ""
    },
    description: {
        type: String, default: ""
    },
    deleted: {
        type: Boolean, default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('blogCategory', blogCategory, 'blogCategory');