import { model, Schema } from "mongoose";

const transactions = Schema(
    {
        status: { type: String, default: "not started" },
        transactionStatus: { type: String, default: "not started" },
        transactionData: { type: Object, default: () => { } },
        From: { type: String, default: "" },
        method: { type: String, default: "" },
        params: { type: Array, default: [] },
        TimeStamp: { type: String, default: Date.now() },
        msg :{ type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = model('transactions', transactions)