import { model, Schema } from "mongoose";

const pendingTransactions = Schema(
    {
        status: { type: String, default: "pending" },
        From: { type: String, default: "" },
        method: { type: String, default: "" },
        params: { type: Array, default: [] },
        TimeStamp: { type: String, default: Date.now() }
    },
    { timestamps: true }
);

module.exports = model('pendingTransactions', pendingTransactions)