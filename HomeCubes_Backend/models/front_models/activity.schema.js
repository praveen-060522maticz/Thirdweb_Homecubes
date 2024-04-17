import { model, Schema } from "mongoose";

const activity = Schema(
    {
        From: { type: String, default: "" },
        To: { type: String, default: "" },
        Activity: { type: String, default: "" },
        NFTPrice: { type: String, default: "" },
        CoinName: { type: String, default: "" },
        NFTQuantity: { type: String, default: "" },
        HashValue: { type: String, default: "" },
        Type: { type: String, default: "" },
        NFTId: { type: String, default: "" },
        ContractType: { type: String, default: "" },
        ContractAddress: { type: String, default: "" },
        CollectionNetwork: { type: String, default: "" },
        CollectionSymbol: { type: String, default: "" },
        Category: { type: String, default: "" },
        royaltyReceiver: { type: String, default: "" },
        earnPercentage: { type: String, default: "" },
        Earning: { type: String, default: "" },
        projectId: { type: String, default: "", ref: "project" },

    },
    { timestamps: true }
);

module.exports = model('activity', activity)