
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const gasManager = new Schema({

    collectAddress: {
        type: String,
        default: ""
    },
    approveFee: {
        type: String,
        default: ""
    },
    cancelOrderFee:{
        type: String,
        default: ""
    },
    placeOrderFee:{
        type: String,
        default: ""
    },
    saleFee:{
        type: String,
        default: ""
    },
    acceptBidFee:{
        type: String,
        default: ""
    },
    lazyMintFee:{
        type: String,
        default: ""
    },
    stakeFee:{
        type: String,
        default: ""
    },
    withdrawtFee:{
        type: String,
        default: ""
    },
    bidFee:{
        type: String,
        default: ""
    },
    cancelBidFee:{
        type: String,
        default: ""
    },
    editBidFee:{
        type: String,
        default: ""
    },
    gasToken:{
        type: String,
        default: ""
    },


},{
    timestamps:true
})


const GasManager = mongoose.model("gasManager", gasManager, "gasManager");
export default GasManager;