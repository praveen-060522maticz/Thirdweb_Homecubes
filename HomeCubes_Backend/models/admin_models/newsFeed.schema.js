const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let newsfeed = new Schema({
    feedTitle: {
        type: String,
        default: ""
    },
    feedDescription: {
        type: String,
        default: ""
    },
    projectId: {
        type: String,
        default: "",
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('newsfeed', newsfeed, 'newsfeed');
