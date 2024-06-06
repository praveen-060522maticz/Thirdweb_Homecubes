import mongoose from 'mongoose';
import express from 'express'
import path from 'path';
import fileupload from 'express-fileupload';
import config from './config/serverConfig.js'
import frontRoute from './routes/front_routes/front.routes.js'
import adminRoute from './routes/admin_routes/admin.routes.js'
const cors = require("cors");
import compression from 'compression';
import { Decryptdata, Encryptdata, isEmpty, methodsArr } from './helper/commonFUnction.js';
import pendingTrans from './models/front_models/pendingTransactions.schema.js';
import * as nftCtrl from './controller/front_controller/nft.controller';
import Web3 from 'web3'
import { error } from 'console';
import logger from './config/logger.js';

const web3 = new Web3(
    // config.SOCKET_RPC
    new Web3.providers.WebsocketProvider(config.SOCKET_RPC)
);
// const contract = new web3.eth.Contract(StakeAbi, "0x4f9395bdA5E47566903b960895fdc2713890Fd41");
// console.log('contract.event---->', contract?.events);
// contract.events.allEvents({}, async (error, event) => {
//     console.log("Contract Event", event);
// })
//     .on("connected", () => {
//         console.log("Connected to the blockchain");
//     })
//     .on("changed", (event) => {
//         console.log("Event changed:", event.returnValues);
//     })
//     .on("error", (error) => {
//         console.error("Event error:", error);
//     });


let walletAddress = "0x3509fa4118410Be80952Ed8d9560Ecf3D90Eb0bB".toLowerCase();

web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) {
        console.error('Error:', error);
        return;
    }

    // Get block details
    web3.eth.getBlock(blockHeader.number, true, (error, block) => {

        try {
            if (error) {
                console.error('Error:', error);
                return;
            }

            // Iterate through transactions in the block
            block.transactions.forEach(async tx => {
                // console.log("ahdikahwdihaoiwdhawoid",tx);
                // Check if the target address is involved in the transaction
                if (tx.from?.toLowerCase() === walletAddress || tx.to?.toLowerCase() === walletAddress) {
                    const getData = await web3.eth.getTransactionReceipt(tx?.hash);
                    console.log('getDatawdawdawda', JSON.stringify(getData, null, 2));

                    for (const log of getData.logs) {
                        try {
                            console.log('loggggg---->', log, web3.utils.hexToUtf8(log.data).split(""));
                            const method = extractAlphabets(web3.utils.hexToUtf8(log.data))
                            console.log('method---->', method);
                            if (methodsArr.includes(method)) {
                                if (method == "lazyMinting") {

                                    if (getData.status) {
                                        var ids = []
                                        for (let i = 0; i < getData.logs.length - 4; i++) {
                                            ids.push(web3.utils.hexToNumber(Number(getData.logs[i].topics[3])))
                                        }

                                        let From = web3.eth.abi.decodeParameter("address", log.topics[1]);
                                        let TimeStamp = web3.utils.hexToNumber(log?.topics?.[2])?.toString()
                                        var need_data = {
                                            status: getData.status,
                                            HashValue: getData.transactionHash,
                                            Tokenid: ids,
                                            from: From
                                        }

                                        setTimeout(async () => {
                                            var getPending = await pendingTrans.findOne({ From: From?.toLowerCase(), method, status: "pending", TimeStamp });

                                            getPending?.params?.[0]?.changedToken?.map((val, i) => {
                                                val.NFTId = ids[i]
                                                val.Hash = getData.transactionHash;
                                                return val
                                            })
                                            console.log('getPending?.params?.[0]---->', getPending?.params?.[0]);
                                            const triggerlazmint = await nftCtrl.Buymint({ body: getPending?.params?.[0] }, { json: function (para) { console.log('paraa---->', para); } });
                                            console.log('triggerlazmint---->', triggerlazmint);

                                            const changeStatus = await pendingTrans.findOneAndUpdate({ From: From?.toLowerCase(), method, status: "pending", TimeStamp }, { $set: { status: "success" } });
                                            console.log('changeStatus---->', changeStatus);
                                        }, 3000)
                                    }

                                    // console.log('mehotdLoggninf=g---->', need_data);
                                }
                                if (method == "orderPlace" || method == "cancelOrder" || method == "nftStack" || method == "nftWithdraw" || method == "claimReward") {
                                    setTimeout(async () => {
                                        let From = web3.eth.abi.decodeParameter("address", log.topics[1]);
                                        let TimeStamp = web3.utils.hexToNumber(log?.topics?.[2])?.toString();
                                        await handlePendingTrans(From, method, TimeStamp, (method == "nftStack" || method == "nftWithdraw" || method == "claimReward") ? "stackFunction" : "CreateOrder")
                                    }, 3000)
                                }
                                if (method == "bidNFT" || method == "editBid" || method == "cancelBid" || method == "cancelBidBySeller") {
                                    setTimeout(async () => {
                                        let From = web3.eth.abi.decodeParameter("address", log.topics[1]);
                                        let TimeStamp = web3.utils.hexToNumber(log?.topics?.[2])?.toString();
                                        await handlePendingTrans(From, method, TimeStamp, "BidAction")
                                    }, 3000)
                                }
                                if (method == "saleToken" || method == "saleWithToken") {
                                    var royalObject = {}

                                    var TokenCOunts = await Promise.all(getData.logs[method == "saleToken" ? 0 : 6]?.topics?.map((val, i) => {
                                        if (i == 1) {
                                            const address = web3.eth.abi.decodeParameter("address", val);
                                            console.log("__address", address);
                                            royalObject[i] = address
                                        }
                                        else if (i > 1) {
                                            console.log("aiwufaiwuf");
                                            const value = web3.utils.hexToNumberString(val);
                                            console.log("value__", value);
                                            royalObject[i] = value
                                        }
                                    }))

                                    let From = web3.eth.abi.decodeParameter("address", log.topics[1]);
                                    let TimeStamp = web3.utils.hexToNumberString("0x000000000000000000000000000000000000000000000000059e83d852340290");

                                    console.log("royalObject", royalObject);
                                    var need_data = {
                                        status: getData.status,
                                        HashValue: getData.transactionHash,
                                        royaltyInfo: royalObject
                                    }
                                    console.log("need_data", need_data, TimeStamp, From);

                                    setTimeout(async () => {
                                        var getPending = await pendingTrans.findOne({ From: From?.toLowerCase(), method, status: "pending", TimeStamp });
                                        console.log('getPending---->', getPending);
                                        if (getPending) {
                                            getPending.params[0].newOwner.royaltyReceiver = royalObject[1];
                                            getPending.params[0].newOwner.earnPercentage = web3.utils.fromWei(royalObject[2]);
                                            getPending.params[0].newOwner.Earning = web3.utils.fromWei(royalObject[3]);

                                            console.log('getPending?.params?.[0]---->', getPending?.params?.[0]);
                                            const triggerlazmint = await nftCtrl.BuyAccept({ body: getPending?.params?.[0] }, { json: function (para) { console.log('paraa---->', para); } });
                                            console.log('triggerlazmint---->', triggerlazmint);

                                            const changeStatus = await pendingTrans.findOneAndUpdate({ From: From?.toLowerCase(), method, status: "pending", TimeStamp }, { $set: { status: "success" } });
                                            console.log('changeStatus---->', changeStatus);
                                        }

                                    }, 3000)

                                }

                            }
                        } catch (e) {
                            console.log('eeeeeeeeeeeee---->', e);
                        }

                    }


                }
            });
        } catch (e) {
            console.log('getBlock---->', e);
        }


    });
});

const handlePendingTrans = async (From, method, TimeStamp, func) => {
    try {
        var getPending = await pendingTrans.findOne({ From: From?.toLowerCase(), method, status: "pending", TimeStamp });
        console.log('TimeStamp---->', TimeStamp, getPending?.TimeStamp);

        const triggerlazmint = await nftCtrl[func]({ body: getPending?.params?.[0], query: getPending?.params?.[0] }, { json: function (para) { console.log('paraa---->', para); }, send: function (para) { console.log('paraa---->', para); } });
        console.log('triggerlazmint---->', triggerlazmint);

        const changeStatus = await pendingTrans.findOneAndUpdate({ From: From?.toLowerCase(), method, status: "pending", TimeStamp }, { $set: { status: "success" } });
        console.log('changeStatus---->', changeStatus);
    } catch (e) {
        console.log('Eroro on handlePendingTrans---->', e);
    }
}


const getrans = async () => {
    try {
        // const nWeb3 = new Web3(config.SEPOLIA_RPC)
        // const getData = await nWeb3.utils.hexToNumber("0x00000000000000000000000000000000000000000000000000000000cc14ee7e")
        // // let dddd = extractAlphabets(getData);
        // console.log('dddd---->', getData);
        // const getDaaaata = await nWeb3.eth.getTransactionReceipt('0xd615d9395c025a89c54915a2278bde8fa07b01e534a5619fe4edd7f8d49b3d85');
        // console.log('getDaaaata---->',getDaaaata);

        // console.log('Transaction:', tx);
        const getData = await web3.eth.getTransactionReceipt("0x3d80d6a83ce6fcac8fc314021361cd94584d92a01ded12d2d75877bc2a3710e1");
        console.log('getDatawdawdawda', JSON.stringify(getData, null, 2));

        for (const log of getData.logs) {
            try {
                console.log('loggggg---->', log, web3.utils.hexToUtf8(log.data).split(""));
                const method = extractAlphabets(web3.utils.hexToUtf8(log.data))
                console.log('method---->', method);
                if (methodsArr.includes(method)) {
                    if (method == "lazyMinting") {

                        if (getData.status) {
                            var ids = []
                            for (let i = 0; i < getData.logs.length - 4; i++) {
                                ids.push(web3.utils.hexToNumber(Number(getData.logs[i].topics[3])))
                            }

                            let From = web3.eth.abi.decodeParameter("address", log.topics[1]);
                            var need_data = {
                                status: getData.status,
                                HashValue: getData.transactionHash,
                                Tokenid: ids,
                                from: From
                            }

                            setTimeout(async () => {
                                var getPending = await pendingTrans.findOne({ From: From?.toLowerCase(), method });

                                getPending?.params?.[0]?.changedToken?.map((val, i) => {
                                    val.NFTId = ids[i]
                                    val.Hash = getData.transactionHash;
                                    return val
                                })
                                console.log('getPending?.params?.[0]---->', getPending?.params?.[0]);
                                const triggerlazmint = await nftCtrl.Buymint({ body: getPending?.params?.[0] }, { json: function (para) { console.log('paraa---->', para); } });
                                console.log('triggerlazmint---->', triggerlazmint);
                            }, 3000)


                        }

                        console.log('mehotdLoggninf=g---->', need_data);
                    }
                }

                if (method == "orderPlace" || method == "cancelOrder" || method == "nftStack") {
                    setTimeout(async () => {
                        let From = web3.eth.abi.decodeParameter("address", log.topics[1]);
                        let TimeStamp = web3.utils.hexToNumber(log?.topics?.[2])?.toString();
                        await handlePendingTrans(From, method, TimeStamp, method == "nftStack" ? "stackFunction" : "CreateOrder")
                    }, 3000)
                }
                if (method == "saleToken" || method == "saleWithToken") {
                    var royalObject = {}

                    var TokenCOunts = await Promise.all(getData.logs[method == "saleToken" ? 0 : 6]?.topics?.map((val, i) => {
                        if (i == 1) {
                            const address = web3.eth.abi.decodeParameter("address", val);
                            console.log("__address", address);
                            royalObject[i] = address
                        }
                        else if (i > 1) {
                            console.log("aiwufaiwuf");
                            const value = web3.utils.hexToNumberString(val);
                            console.log("value__", value);
                            royalObject[i] = value
                        }
                    }))

                    let From = web3.eth.abi.decodeParameter("address", log.topics[1]);
                    let TimeStamp = web3.utils.hexToNumberString("0x000000000000000000000000000000000000000000000000059e83d852340290");

                    console.log("royalObject", royalObject);
                    var need_data = {
                        status: getData.status,
                        HashValue: getData.transactionHash,
                        royaltyInfo: royalObject
                    }
                    console.log("need_data", need_data, TimeStamp, From);

                    setTimeout(async () => {
                        var getPending = await pendingTrans.findOne({ From: From?.toLowerCase(), method, status: "pending", TimeStamp });
                        console.log('getPending---->', getPending);
                        if (getPending) {
                            getPending.params[0].newOwner.royaltyReceiver = royalObject[1];
                            getPending.params[0].newOwner.earnPercentage = web3.utils.fromWei(royalObject[2]);
                            getPending.params[0].newOwner.Earning = web3.utils.fromWei(royalObject[3]);

                            console.log('getPending?.params?.[0]---->', getPending?.params?.[0]);
                            const triggerlazmint = await nftCtrl.BuyAccept({ body: getPending?.params?.[0] }, { json: function (para) { console.log('paraa---->', para); } });
                            console.log('triggerlazmint---->', triggerlazmint);

                            const changeStatus = await pendingTrans.findOneAndUpdate({ From: From?.toLowerCase(), method, status: "pending", TimeStamp }, { $set: { status: "success" } });
                            console.log('changeStatus---->', changeStatus);
                        }

                    }, 3000)

                }

            } catch (e) {
                console.log('eeeeeeeeeeeee---->', e);
            }

        }


        // getData.logs.forEach(async log => {
        //     console.log('loggggg---->',log);
        //     const method = extractAlphabets(await web3.utils.hexToUtf8(log.data))
        //     console.log('method---->',method);
        //     if (methodsArr.includes(method)) {

        //     }
        // })
    } catch (e) {
        console.log('eee---->', e);
    }
}
// db connection

mongoose.connect(config.MONGOURI, (err) => {
    if (err) process.exit(1);
    console.log("Db connected Successfully")
})

const cacheTime = 86400000 * 3
const app = express()
// get post content
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
app.use(cors());
// app.use(cookieParser());
app.use(compression());
// app.use(morgan('combined'));

app.use(fileupload())
app.use('/', express.static(path.join(__dirname, 'public'), {
    maxAge: cacheTime
}))


//cors
app.use(async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.header('no-referrer-when-downgrade', '*');
    res.header('no-referrer', '*');

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    var method = req.method
    console.log("req?.body", req?.query, method);

    if (method == "GET" || method == "get") {

        if (req.query.data) {
            try {
                req.query = Decryptdata(req.query.data);
                console.log("sdfsd", req.query);
                return next()
            } catch (error) {
                console.log("err on query data ", error);
                return res.status(403).json({
                    success: "error",
                    status: false,
                    msg: "Decrypt Data unAuthorised"
                })
            }

        }
        else return next()
    }
    if (method == "POST" || method == "post") {
        var contentype = req?.headers?.['content-type']
        console.log("sdfsdgsdgsd", req?.body, contentype);
        var data = {}
        if (req.body.data && Object.keys(req.body).length <= 1) {
            try {
                console.log('req_body_data', req?.body?.data)
                req.body = Decryptdata(req.body.data);
                // console.log("decrypted_decrypted", req.body)

            } catch (error) {
                console.log("err on decrypt", error);
                return res.status(403).json({
                    success: "error",
                    status: false,
                    msg: "Decrypt Data unAuthorised"
                })
            }

        } else if (!isEmpty(req?.body)) {
            try {
                await Promise.all(Object.keys(req?.body).map(async (val) => {
                    data[val] = Decryptdata(req?.body[val])
                }))
                // console.log("lll", data);
                req.body = data
            } catch (error) {
                console.log("err on formdaat decrypt", error);
                return res.json({
                    success: "error",
                    status: false,
                    msg: "Decrypt Data unAuthorised"
                })

            }

        }
        return next()

    }
    else return next()
});

app.get('/', (req, res) => {
    res.write(`<a href = ${config.SITE_URL}>Click To Redirect The Homecubes</a>`)
})
//routes Declaration
app.use('/v1/front', frontRoute)
app.use('/v1/admin', adminRoute)
// listening port
app.get('*', (req, res) => {
    res.write("<b>404 - Not Found</b>")
})

app.on("error", (err) => {
    error("ERRRORR ON SERVER")
    logger.error(`Here is Error on server ${err}`)
})

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message.toString()}`);
    logger.error(err.stack.toString());
    process.exit(1); // or handle gracefully
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1); // or handle gracefully
});

app.listen(config.PORT, async () => {
    console.log('Port Successflly Running', config.PORT)
}).on('error', (e) => {
    console.log('Error happened: ', e.message)
})
