import dotenv from 'dotenv'
dotenv.config({ path: `./env/.env.${process.env.NODE_ENV}` })

var EnvName = process.env.NODE_ENV;
console.log('EnvName : api : ', EnvName);
const Key = {
    PORT: process.env.PORT,
    MONGOURI: process.env.MONGOURI,
    SECRET_KEY: process.env.SECRET_KEY,
    ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
    IPFS_IMG: 'https://ipfs.io/ipfs/',
    EndPoint: 'https://ipfs.infura.io:5001',
    // keyEnvBased: {},
    IPFSPASS: process.env.IPFSPASS,
    IPFSKEY: process.env.IPFSKEY,
    CLIENT_ID: process.env.CLIENT_ID,
    CLEINT_SECRET: process.env.CLEINT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    SITE_URL: process.env.SITE_URL,
    MoralisserverUrl: process.env.MoralisserverUrl,
    MoralisappId: process.env.MoralisappId,
    provider: process.env.provider,
    Rpc_url: process.env.RPC_URL,
    ETHRPC: process.env.ETHRPC,
    BNBRPC: process.env.BNBRPC,
    ETHCHAIN: process.env.ETHCHAIN,
    BNBCHAIN: process.env.BNBCHAIN,
    // Chain       :   EvmChain.BSC
    SEPOLIA_RPC: process.env.SEPOLIA_RPC,
    ContractAdd: process.env.ContractAdd,
    TradeAddress: process.env.TradeAddress,
    adminPrivKey: process.env.adminPrivKey,
    SOCKET_RPC: process.env.SOCKET_RPC,
    RELAYER_API_KEY: process.env.RELAYER_API_KEY,
    RELAYER_API_SECRET: process.env.RELAYER_API_SECRET,
    RELAYER_ADDRESS: process.env.RELAYER_ADDRESS,
    FORWARDER_ADDRESS: process.env.FORWARDER_ADDRESS,
    RELAYER_URL: process.env.RELAYER_URL,
}



Key.keyEnvBased = {
    emailGateway: {
        fromMail: process.env.user,
        nodemailer: {
            host: "smtp.zeptomail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        }
    }
}

export default Key;