import { model, Schema } from 'mongoose'

const gallery = new Schema({
    galleryTitle: {
        type: String,
        default: '',
    },
    galleryThumbImage: {
        type: String,
        default: '',
    },
    galleryDescription: {
        type: String,
        default: '',
    },
    projectId: {
        type: String,
        default: '',
        require: true,
        ref: "project"
    },
    galleryImages: {
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true, timeseries: true })

module.exports = model('gallery', gallery)