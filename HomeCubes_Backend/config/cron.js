var cron = require('node-cron');
import Bids from '../models/front_models/bid.schema'
import TokenOwners from "../models/front_models/tokenowner.schema";
import Web3 from "web3";
import config from '../config/serverConfig';
import ABI from '../ABI/TRADE.json'
import { UseWeb3, contrat_connection, getAddress } from '../helper/commonFUnction';
import mongoose from 'mongoose';
var ObjectId = mongoose.Types.ObjectId;


cron.schedule('0 */3 * * *', async () => CancelBidByExeFunction());
cron.schedule('*/5 * * * * *', async () => cancelTimedAuction());

export const CancelBidByExeFunction = async () => {
    try {

        const getPendingData = await Bids.aggregate([
            { $match: { "status": "pending" } },
            {
                $lookup: {
                    from: "tokenowners",
                    let: { tid: { $toObjectId: "$TokenOwner_id" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$tid"] } } }
                    ],
                    as: "TokenOwner"
                }

            },
            { $unwind: "$TokenOwner" }
        ])
        console.log('getPendingData---->', getPendingData);

        if (getPendingData?.length != 0) {
            await Promise.all(getPendingData?.map(async (val) => {
                const tokenOwner = val.TokenOwner
                const getEndDateWith5Days = new Date(tokenOwner?.EndClockTime).setDate(new Date(tokenOwner?.EndClockTime).getDate() + 1)
                const getObj = new Date(getEndDateWith5Days)
                const nowObj = new Date();
                console.log('Datatee---->', getObj, nowObj);

                if (getObj < nowObj) {
                    const CONTRACT = await contrat_connection(ABI, config.TradeAddress)
                    const web3 = await UseWeb3()
                    const walletaddress = await getAddress()
                    console.log('CONTRACT---->', walletaddress);

                    const encodeObj = await CONTRACT.methods.cancelBidByExe(val.NFTId, val.ContractAddress).encodeABI()
                    console.log('encodeObj---->', encodeObj);

                    const txCount = await web3.eth.getTransactionCount(walletaddress);
                    console.log('txCount---->', txCount);

                    const txObject = {
                        nonce: web3.utils.toHex(txCount),
                        gasLimit: await web3.eth.estimateGas({
                            "data": encodeObj,
                            "from": walletaddress,
                            "to": config.TradeAddress
                        }),
                        data: encodeObj,
                        to: config.TradeAddress
                    };

                    console.log('txObject---->', txObject);

                    const signedTx = await web3.eth.accounts.signTransaction(txObject, config.adminPrivKey);
                    var data = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                    console.log('data---->', data);
                    if (data.status) {
                        const updateBid = await Bids.findOneAndUpdate({ _id: ObjectId(val._id) }, { status: 'cancelled', Hash: data.transactionHash })
                    }

                }
            }))
        }
    } catch (e) {
        console.log('eeeee---->', e);
    }
}


export const cancelTimedAuction = async () => {
    try {
        // console.log('Datatatt---->', new Date());
        const getData = await TokenOwners.updateMany({ PutOnSaleType: "TimedAuction", PutOnSale: "true", EndClockTime: { $lt: new Date() } }, { PutOnSaleType: "NotForSale", PutOnSale: "false" })
        // console.log('getDatagetData---->', getData);
    } catch (e) {
        console.log("err on cancelTimedAuction", e);
    }
}