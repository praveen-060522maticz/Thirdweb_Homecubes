import { Schema, model } from "mongoose";

const referralReports = Schema({
    transactionId: { type: String, default: '' },
    fromAddress: { type: String, default: '' },
    referredByAddress: { type: String, default: '' },
    commissionAmt: { type: String, default: '' },
    percentage: { type: String, default: '' },
    mintTokenName: { type: String, default: '' },
    amount: {type: String, default: ''},
    mintedNft: [{type: String, default: ''}],
}, { timestamps: true })

module.exports = model('referralReports', referralReports)
