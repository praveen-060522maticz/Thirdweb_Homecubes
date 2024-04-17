import { Schema, model } from 'mongoose'

const reward = new Schema({
    walletAddress: { type: String, default: '' },
    NFTId: { type: String, default: '' },
    amount: { type: String, default: '' },
    hash: { type: String, default: '' },
    xlFile: { type: String, default: '' },
    season: { type: String, default: '' },
    projectId: { type: String, default: '', ref: "project" },
    withdraw: { type: Boolean, default: false },
    withdrawedAt: { type: Date, default: null }
}, { timestamps: true })

module.exports = model('reward', reward, "reward")