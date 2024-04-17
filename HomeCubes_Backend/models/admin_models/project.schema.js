const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let project = new Schema({
    projectTitle: {
        type: String,
        default: "",
    },
    projectDescription: {
        type: String,
        default: "",
    },
    maxNFTs: {
        type: String,
        default: ""
    },
    mintPrice: {
        type: String,
        default: "",
    },
    NFTPrice: {
        type: String,
        default: "",
    },
    symbol: {
        type: String,
        default: "",
    },
    baseUri: {
        type: String,
        default: "",
    },
    royaltyReceiver: {
        type: String,
        default: "",
    },
    duration: {
        type: String,
        default: "",
    },
    NFTRoyalty: {
        type: String,
        default: ''
    },
    aboutProject: {
        type: String,
        default: "",
    },
    aboutDescription: {
        type: String,
        default: "",
    },
    ProjectThumbnail: {
        type: String,
        default: "",
    },
    AboutProjectThumbnail: {
        type: String,
        default: "",
    },
    contractAddress: {
        type: String,
        default: "",
    },
    imgfile: {
        type: String,
        default: "",
    },
    fundReceiverAddress:{
        type: String,
        default: "",
    },
    propertyValue: {
        type: String,
        default: "",
    },
    unlockAt: {
        type: Date,
        default: new Date(),
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    roadMap: {
        type: Array, default: []
    },
    CMS: {
        type: Array, default: []
    },
}, { timestamps: true });
module.exports = mongoose.model('project', project, 'project');
