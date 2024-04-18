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
console.log("Mongo Uri : ", config.MONGOURI);
import cron from './config/cron.js'
import Web3 from 'web3'
import web3Util from 'web3-utils'
const ABI = require("./ABI/ERC721.json");
const StakeAbi = require("./ABI/StakeAbi.json");
import CryptoJS from 'crypto-js'

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

// let walletAddress = "0x3509fa4118410Be80952Ed8d9560Ecf3D90Eb0bB".toLowerCase();

// web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
//     if (error) {
//         console.error('Error:', error);
//         return;
//     }

//     // Get block details
//     web3.eth.getBlock(blockHeader.number, true, (error, block) => {
//         if (error) {
//             console.error('Error:', error);
//             return;
//         }

//         // Iterate through transactions in the block
//         block.transactions.forEach(async tx => {
//             // Check if the target address is involved in the transaction
//             if (tx.from?.toLowerCase() === walletAddress || tx.to?.toLowerCase() === walletAddress) {
//                 console.log('Transaction:', tx);
//                 const getData = await web3.eth.getTransactionReceipt(tx.hash);
//                 console.log('getData', JSON.stringify(getData, null, 2));

//                 getData.logs.forEach(async log => {
//                     console.log('loggggg---->',log);
//                     const method = extractAlphabets(await web3.utils.hexToUtf8(log.data))
//                     console.log('method---->',method);
//                     if (methodsArr.includes(method)) {

//                     }
//                 })
//             }
//         });
//     });
// });


// const getrans = async () => {
//     try {
//         const nWeb3 = new Web3(config.SEPOLIA_RPC)
//         const getData = await nWeb3.utils.hexToUtf8("0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a4f72646572506c61636500000000000000000000000000000000000000000000")
//         let dddd = extractAlphabets(getData);
//         console.log('dddd---->', dddd);
//         // const getDaaaata = await nWeb3.eth.getTransactionReceipt('0xd615d9395c025a89c54915a2278bde8fa07b01e534a5619fe4edd7f8d49b3d85');
//         // console.log('getDaaaata---->',getDaaaata);
//     } catch (e) {
//         console.log('eee---->', e);
//     }
// }
// getrans()
// db connection

function extractAlphabets(inputString) {
    const regex = /[a-zA-Z]+/g;
    const matches = inputString.match(regex);
    const result = matches ? matches.join('') : '';
    return result;
}


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

app.listen(config.PORT, async () => {
    console.log('Port Successflly Running', config.PORT)
}).on('error', (e) => {
    console.log('Error happened: ', e.message)
})
