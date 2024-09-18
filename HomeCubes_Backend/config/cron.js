var cron = require('node-cron');
import Web3 from "web3";
import config from '../config/serverConfig';
import ABI from '../ABI/TRADE.json'
import { UseWeb3, contrat_connection, getAddress, sleep } from '../helper/commonFUnction';
import mongoose from 'mongoose';
import Bids from '../models/front_models/bid.schema'
import TokenOwners from "../models/front_models/tokenowner.schema";
import Transactions from '../models/front_models/transactions.schema';
import Web3Utils from 'web3-utils';
import pendingTrans from '../models/front_models/pendingTransactions.schema.js';
import * as nftCtrl from '../controller/front_controller/nft.controller';
import fetch from "node-fetch";

var ObjectId = mongoose.Types.ObjectId;

const web3 = new Web3(config.SEPOLIA_RPC);

// cron.schedule('0 */3 * * *', async () => CancelBidByExeFunction());
cron.schedule('*/20 * * * * *', async () => CancelBidByExeFunction());
cron.schedule('*/5 * * * * *', async () => cancelTimedAuction());
// cron.schedule('*/5 * * * * *', async () => TransactionCron());

const get_receipt = async (HashValue) => {
    try {
        var receipt = await web3.eth.getTransactionReceipt(HashValue);
        if (receipt) {
            return receipt
        }
        else {
            get_receipt(HashValue)
        }
    } catch (error) {
        console.log('Erro on get_receipt---->', error);
    }

}


export const CancelBidByExeFunction = async () => {
    console.log('ge---->',);
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
                const getEndDateWith5Days = new Date(tokenOwner?.EndClockTime).setDate(new Date(tokenOwner?.EndClockTime).getDate() + 2)
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
        console.log('Datatatt---->', new Date());
        const getData = await TokenOwners.updateMany({ PutOnSaleType: "TimedAuction", PutOnSale: "true", EndClockTime: { $lt: new Date() } }, { PutOnSaleType: "NotForSale", PutOnSale: "false" })
        // console.log('getDatagetData---->', getData);
    } catch (e) {
        console.log("err on cancelTimedAuction", e);
    }
}

export const TransactionCron = async () => {
    try {
        const getTransaction = await Transactions.find({ transactionStatus: "not started" });
        console.log('getTransaction---->', getTransaction);
        if (getTransaction?.length != 0) {

            for (let index = 0; index < getTransaction.length; index++) {
                const val = getTransaction[index];
                try {
                    const method = val.method
                    const getData = await fetch(config.RELAYER_URL, {
                        method: 'POST',
                        body: JSON.stringify({
                            apiKey: config.RELAYER_API_KEY,
                            apiSecret: config.RELAYER_API_SECRET,
                            request: val?.transactionData
                        }),
                        headers: { 'Content-Type': 'application/json' },
                    });

                    let parseData = await getData.json()
                    console.log('parseData---->', parseData);

                    if (parseData?.status == "success") {
                        let parseResult = JSON.parse(parseData?.result);
                        let contract_Method_Hash = parseResult?.tx;
                        const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                        console.log("BUYMINTHASH", receipt)

                        if (method == "lazyMinting") {
                            var ids = []
                            for (let i = 0; i < receipt.logs.length - 4; i++) {
                                ids.push(Web3Utils.hexToNumber(Number(receipt.logs[i].topics[3])))
                            }
                            var need_data = {
                                status: receipt.status,
                                HashValue: receipt.transactionHash,
                                Tokenid: ids
                            }
                            val?.params?.[0]?.changedToken?.map((val, i) => {
                                val.NFTId = ids[i]
                                val.Hash = receipt.transactionHash;
                                val.isMinted = true
                                return val
                            })
                            console.log('valval---->', val);

                            if (val?.params?.[0]) {
                                const triggerlazmint = await nftCtrl.Buymint({ body: val?.params?.[0] }, { json: function (para) { console.log('paraa---->', para); } });
                                console.log('triggerlazmint---->', triggerlazmint);

                                const changeStatus = await Transactions.findOneAndUpdate({ _id: ObjectId(val?._id) }, { $set: { status: "completed", transactionStatus: "success", msg: contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash } });
                                console.log('changeStatus---->', changeStatus);
                            }
                            // return need_data
                            // return {status:"pending"}
                        } else if (method == "saleToken" || method == "saleWithToken") {

                            var royalObject = {}

                            var TokenCOunts = receipt.logs[count]?.topics?.map((val, i) => {
                                if (i == 1) {
                                    const address = web3.eth.abi.decodeParameter("address", val);
                                    console.log("__address", address);
                                    royalObject[i] = address
                                }
                                else if (i > 1) {
                                    console.log("aiwufaiwuf");
                                    const value = Web3Utils.hexToNumberString(val);
                                    console.log("value__", value);
                                    royalObject[i] = value
                                }
                            })

                            console.log("royalObject", receipt.logs[count]?.topics, royalObject);
                            var need_data = {
                                status: receipt.status,
                                HashValue: receipt.transactionHash,
                                royaltyInfo: royalObject
                            }
                            console.log("need_data", need_data);
                            return need_data
                            // return { status: "pending" }
                        } else if (method == "acceptBId") {
                            var royalObject = {}

                            var TokenCOunts = receipt.logs[6]?.topics?.map((val, i) => {
                                if (i == 1) {
                                    const address = web3.eth.abi.decodeParameter("address", val);
                                    console.log("__address", address);
                                    royalObject[i] = address
                                }
                                else if (i > 1) {
                                    console.log("aiwufaiwuf");
                                    const value = Web3Utils.hexToNumberString(val);
                                    console.log("value__", value);
                                    royalObject[i] = value
                                }
                            })


                            var need_data = {
                                status: receipt.status,
                                HashValue: receipt.transactionHash,
                                royaltyInfo: royalObject
                            }
                            return need_data

                        } else {
                            var need_data = {
                                status: receipt.status,
                                HashValue: receipt.transactionHash
                            }
                            return need_data
                        }
                    } else if (parseData?.status == "pending") {
                        // return {
                        //     status: "pending"
                        // }
                        const pendingObj = {
                            From: val.From,
                            method: val.method,
                            params: val.params,
                            TimeStamp: val.TimeStamp,
                        }
                        const setPending = await nftCtrl.setPendingTransaction({ body: pendingObj }, { json: function (para) { console.log('paraa---->', para); }, send: function (para) { console.log('paraa---->', para) } });
                        const changeStatus = await Transactions.findOneAndUpdate({ _id: ObjectId(val?._id) }, { $set: { status: "completed", transactionStatus: "pending", msg: JSON.stringify(parseData) } });
                    } else {
                        // return false

                        const changeStatus = await Transactions.findOneAndUpdate({ _id: ObjectId(val?._id) }, { $set: { status: "completed", transactionStatus: "error", msg: JSON.stringify(parseData) } });
                        nftCtrl.setTokenStatus({ body: { arrData: val?.params?.[0]?.changedToken, status: "available" } }, { json: function (para) { console.log('paraa---->', para); }, send: function (para) { console.log('paraa---->', para) } })
                    }
                } catch (e) {
                    console.log('Erro on map dtatatata---->', e);
                }
            }

            // const doTrans = await Promise.all(
            //     getTransaction.map(async (val) => {
            //         try {
            //             const method = val.method
            //             const getData = await fetch(config.RELAYER_URL, {
            //                 method: 'POST',
            //                 body: JSON.stringify({
            //                     apiKey: config.RELAYER_API_KEY,
            //                     apiSecret: config.RELAYER_API_SECRET,
            //                     request: val?.transactionData
            //                 }),
            //                 headers: { 'Content-Type': 'application/json' },
            //             });

            //             let parseData = await getData.json()
            //             console.log('parseData---->', parseData);

            //             if (parseData?.status == "success") {
            //                 let parseResult = JSON.parse(parseData?.result);
            //                 let contract_Method_Hash = parseResult?.tx;
            //                 const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            //                 console.log("BUYMINTHASH", receipt)

            //                 if (method == "lazyMinting") {
            //                     var ids = []
            //                     for (let i = 0; i < receipt.logs.length - 4; i++) {
            //                         ids.push(Web3Utils.hexToNumber(Number(receipt.logs[i].topics[3])))
            //                     }
            //                     var need_data = {
            //                         status: receipt.status,
            //                         HashValue: receipt.transactionHash,
            //                         Tokenid: ids
            //                     }
            //                     val?.params?.[0]?.changedToken?.map((val, i) => {
            //                         val.NFTId = ids[i]
            //                         val.Hash = receipt.transactionHash;
            //                         val.isMinted = true
            //                         return val
            //                     })
            //                     console.log('valval---->', val);

            //                     if (val?.params?.[0]) {
            //                         const triggerlazmint = await nftCtrl.Buymint({ body: val?.params?.[0] }, { json: function (para) { console.log('paraa---->', para); } });
            //                         console.log('triggerlazmint---->', triggerlazmint);

            //                         const changeStatus = await Transactions.findOneAndUpdate({ _id: ObjectId(val?._id) }, { $set: { status: "completed", transactionStatus: "success", msg: contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash } });
            //                         console.log('changeStatus---->', changeStatus);
            //                     }
            //                     // return need_data
            //                     // return {status:"pending"}
            //                 } else if (method == "saleToken" || method == "saleWithToken") {

            //                     var royalObject = {}

            //                     var TokenCOunts = receipt.logs[count]?.topics?.map((val, i) => {
            //                         if (i == 1) {
            //                             const address = web3.eth.abi.decodeParameter("address", val);
            //                             console.log("__address", address);
            //                             royalObject[i] = address
            //                         }
            //                         else if (i > 1) {
            //                             console.log("aiwufaiwuf");
            //                             const value = Web3Utils.hexToNumberString(val);
            //                             console.log("value__", value);
            //                             royalObject[i] = value
            //                         }
            //                     })

            //                     console.log("royalObject", receipt.logs[count]?.topics, royalObject);
            //                     var need_data = {
            //                         status: receipt.status,
            //                         HashValue: receipt.transactionHash,
            //                         royaltyInfo: royalObject
            //                     }
            //                     console.log("need_data", need_data);
            //                     return need_data
            //                     // return { status: "pending" }
            //                 } else if (method == "acceptBId") {
            //                     var royalObject = {}

            //                     var TokenCOunts = receipt.logs[6]?.topics?.map((val, i) => {
            //                         if (i == 1) {
            //                             const address = web3.eth.abi.decodeParameter("address", val);
            //                             console.log("__address", address);
            //                             royalObject[i] = address
            //                         }
            //                         else if (i > 1) {
            //                             console.log("aiwufaiwuf");
            //                             const value = Web3Utils.hexToNumberString(val);
            //                             console.log("value__", value);
            //                             royalObject[i] = value
            //                         }
            //                     })


            //                     var need_data = {
            //                         status: receipt.status,
            //                         HashValue: receipt.transactionHash,
            //                         royaltyInfo: royalObject
            //                     }
            //                     return need_data

            //                 } else {
            //                     var need_data = {
            //                         status: receipt.status,
            //                         HashValue: receipt.transactionHash
            //                     }
            //                     return need_data
            //                 }
            //             } else if (parseData?.status == "pending") {
            //                 // return {
            //                 //     status: "pending"
            //                 // }
            //                 const pendingObj = {
            //                     From: val.From,
            //                     method: val.method,
            //                     params: val.params,
            //                     TimeStamp: val.TimeStamp,
            //                 }
            //                 const setPending = await nftCtrl.setPendingTransaction({ body: pendingObj }, { json: function (para) { console.log('paraa---->', para); }, send: function (para) { console.log('paraa---->', para) } });
            //                 const changeStatus = await Transactions.findOneAndUpdate({ _id: ObjectId(val?._id) }, { $set: { status: "completed", transactionStatus: "pending", msg: JSON.stringify(parseData) } });
            //             } else {
            //                 // return false

            //                 const changeStatus = await Transactions.findOneAndUpdate({ _id: ObjectId(val?._id) }, { $set: { status: "completed", transactionStatus: "error", msg: JSON.stringify(parseData) } });
            //                 nftCtrl.setTokenStatus({ body: { arrData: val?.params?.[0]?.changedToken, status: "available" } }, { json: function (para) { console.log('paraa---->', para); }, send: function (para) { console.log('paraa---->', para) } })
            //             }
            //         } catch (e) {
            //             console.log('Erro on map dtatatata---->', e);
            //         }

            //     })
            // )
        }
        await sleep(3000)
        TransactionCron()
    } catch (e) {
        console.log('Error on TransactionCron---->', e);
    }
}

TransactionCron()