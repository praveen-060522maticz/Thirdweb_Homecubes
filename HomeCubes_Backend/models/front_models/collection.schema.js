import { model, Schema } from 'mongoose'

const collection = new Schema({
    CollectionName: {
        type: String,
        default: '',
    }, CollectionProfileImage: {
        type: String,
        default: '',
    }, CollectionCoverImage: {
        type: String,
        default: '',
    }, CollectionSymbol: {
        type: String,
        default: '',
    }, CollectionBio: {
        type: String,
        default: '',
    }, CollectionType: {
        type: String,
        default: '',
    }, CollectionNetwork: {
        type: String,
        default: '',
    }, CollectionCreator: {
        type: String,
        default: '',
    }
    , Category: {
        type: String,
        default: '',
    }, CollectionContractAddress: {
        type: String,
        default: '',
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, timeseries: true })

module.exports = model('collection', collection)