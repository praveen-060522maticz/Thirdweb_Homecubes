import { model, Schema } from "mongoose";

const GasTokens = Schema(
    {
        selected: { type: Boolean, default: true },
        contractAddress: { type: String, default: "" },
        Name: { type: String, default: "" },
        symbol: { type: String, default: "" },
        decimal: { type: String, default: "" }
    },
    { timestamps: true }
);

module.exports = model("GasTokens",GasTokens,"GasTokens");