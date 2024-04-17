const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSection = new Schema(
    {
        name: { type: String, require: "" },
        email: { type: String, default: "" },
        comment: { type: String, default: "" },
        walletAddress: { type: String, required: "", ref: "user" },
    },
    { timestamps: true }
);


let blog = new Schema({
    blog_category: {
        type: String, default: ""
    },
    author: {
        type: String, default: ""
    },
    title: {
        type: String, default: ""
    },
    content: {
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
    },
    comments: [commentSection],
    like: {
        type: Array, "default": []
    },
    trending: {
        type: Boolean, default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('blog', blog, 'blog');