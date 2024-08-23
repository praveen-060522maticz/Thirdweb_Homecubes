import { Schema, model } from 'mongoose'

const token = new Schema({
    NFTId: { type: String, default: '' },
    NFTName: { type: String, default: '' },
    Category: { type: String, default: '' },

    NFTOrginalImage: { type: String, default: '' },
    NFTThumpImage: { type: String, default: '' },
    NFTOrginalImageIpfs: { type: String, default: '' },
    NFTThumpImageIpfs: { type: String, default: '' },
    MetaData: { type: String, default: '' },
    CompressedFile: { type: String, default: '' },
    CompressedThumbFile: { type: String, default: '' },
    UnlockContent: { type: String, default: '' },
    ContractAddress: { type: String, default: '' },
    ContractType: { type: String, default: '' },
    ContractName: { type: String, default: '' },
    CollectionNetwork: { type: String, default: '' },
    NFTRoyalty: { type: String, default: '' },
    NFTProperties: { type: Array, default: [] },
    NFTCreator: { type: String, default: '' },
    HideShow: { type: String, default: '' },
    NFTQuantity: { type: String, default: '' },
    reported: { type: Boolean, default: false },
    NFTDescription: { type: String, default: '' },
    isMessageapprove: { type: String, default: 'false' },
    isPricenotification: { type: String, default: 'false' },
    isPromotion: { type: String, default: 'false' },
    isMinted: { type: Boolean, default: false },
    islegalalert: { type: String, default: 'false' },
    NFTOwnerDetails: [{
        type: Schema.Types.ObjectId,
        ref: 'tokenowner'
    }],
    likecount: { type: Number, default: 0 },
    ReportBy: [{
        Address: '',
        CustomUrl: '',
        Message: ''
    }],
    UnlockAt: { type: Date, default: null },
    isStaked: { type: Boolean, default: false },
    CollectionSymbol: { type: String, default: '' },
    CollectionId: { type: String, default: '', ref: "gallery" },
    Hash: { type: String, default: '' },
    Nonce: { type: String, default: '' },
    Randomname: { type: String, default: '' },
    NFTPrice: { type: String, default: '' },
    projectId: { type: String, default: '', ref: "project" },
    baseUri: { type: String, default: '' },

    status:{ type: String, default: '' }, // available,inProgress,success
}, { timestamps: true })

module.exports = model('token', token)