import config from './config'

const localArr = ["demo", "local", "demossl", "localIp", "demossl2", "clientStage"]

var net = {}
if (localArr.includes(config.env)) {
    net = {
        97: {   // binance testnet

            chain: "Binance",
            rpcUrl: "https://endpoints.omniatech.io/v1/bsc/testnet/public",
            networkVersion: '97',
            chainId: '97',
            currencySymbol: "BNB",
            tokenSymbol: "CAKE",
            tokenAddress: '0x7CAB80ce0E55F46378E493B584eE61aD68878f11'.toLowerCase(),
            singleContract: '0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf'.toLowerCase(),
            multipleContract: '0x641e7A8F7e414eE6F05C8B0528877e680e4693E6'.toLowerCase(),
            tradeContract: "0xeA7AE9464eF470DBbD43488F0875FD54521576b1".toLowerCase(),
            // tradeContract: "0xEcbb872F7bC77D4539097Dbc44EF122a21931BC7".toLowerCase(),
            tradeContract: "0x06634158F0a6fdb7686b67d128d5b8d498349cD9".toLowerCase(),//mohan
            adminAddress: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "BSC_TESTNET",
            stakeContract: "0x966D215D56b06E3469Df0D9fD80A5cB78f9A1EAA"
        },
        43113: {  // Avalanche_Testnet 

            chain: "AVAX",
            rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
            networkVersion: '43113',
            chainId: '43113',
            currencySymbol: "ETH",
            tokenSymbol: "CAKE",
            siteUrl: "https://testnet.snowtrace.io",
            tokenAddress: "0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A".toLowerCase(),
            deadaddress: '0x000000000000000000000000000000000000dEaD'.toLowerCase(),
            tradeContract: '0x600A3fEed87E3a2f9EFe61eAd7F1dAe8eA60a59d'.toLowerCase(),
            singleContract: '0x9A9EBc3A48D9ddc54A2D6A3599642aBA4363E7e1'.toLowerCase(),
            multipleContract: '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase(),
            adminAddrsss: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "FUJI"

        },
        11155111: {  // Avalanche_Testnet 

            chain: "BNB", //sepolia
            rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo",
            networkVersion: '43113',
            chainId: '11155111',
            currencySymbol: "ETH",
            tokenSymbol: "CAKE",
            siteUrl: "https://testnet.snowtrace.io",
            tokenAddress: "0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A".toLowerCase(),
            deadaddress: '0x000000000000000000000000000000000000dEaD'.toLowerCase(),

            tradeContract: "0xDe6d921983D19DB4db96a01753b4637C9Fd99Edc".toLowerCase(),
            // tradeContract: '0x783FB9DD2C69101cd0E080403279b9fE7E6ac780'.toLowerCase(), // sepolia openzepline
            // tradeContract: '0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208'.toLowerCase(),
            // tradeContract: '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase(),
            // tradeContract: '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase(), // sepolia old
            // tradeContract: '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase(),
            singleContract: '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase(),
            multipleContract: '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase(),
            adminAddrsss: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "FUJI",
            // stakeContract : "0x6fc5B10eAc3adeE4513d27341a30C73005d37F55".toLowerCase(),// sepolia old
            // stakeContract : "0x0e409bf120da9b6BBB8c777CEef5a20C57a60750".toLowerCase()

            // stakeContract : "0x4f9395bdA5E47566903b960895fdc2713890Fd41".toLowerCase()
            // stakeContract: "0x5eFe07C7A4F632b2c8Cd40aA2f4a70EC71d32348".toLowerCase() // sepolia openzepline
            stakeContract: "0x9605Abafe5f6EE8B9EB671083d4412415e0f54F2"
        }
    }
}
if (config.env == "production") {
    net = {
        97: {   // binance testnet

            chain: "Binance",
            rpcUrl: "https://endpoints.omniatech.io/v1/bsc/testnet/public",
            networkVersion: '97',
            chainId: '97',
            currencySymbol: "BNB",
            tokenSymbol: "CAKE",
            tokenAddress: '0x7CAB80ce0E55F46378E493B584eE61aD68878f11'.toLowerCase(),
            singleContract: '0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf'.toLowerCase(),
            multipleContract: '0x641e7A8F7e414eE6F05C8B0528877e680e4693E6'.toLowerCase(),
            tradeContract: "0xEcbb872F7bC77D4539097Dbc44EF122a21931BC7".toLowerCase(),
            adminAddress: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "BSC_TESTNET",
            stakeContract: "0x966D215D56b06E3469Df0D9fD80A5cB78f9A1EAA"
        },
        43113: {  // Avalanche_Testnet 

            chain: "AVAX",
            rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
            networkVersion: '43113',
            chainId: '43113',
            currencySymbol: "ETH",
            tokenSymbol: "CAKE",
            siteUrl: "https://testnet.snowtrace.io",
            tokenAddress: "0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A".toLowerCase(),
            deadaddress: '0x000000000000000000000000000000000000dEaD'.toLowerCase(),
            tradeContract: '0x600A3fEed87E3a2f9EFe61eAd7F1dAe8eA60a59d'.toLowerCase(),
            singleContract: '0x9A9EBc3A48D9ddc54A2D6A3599642aBA4363E7e1'.toLowerCase(),
            multipleContract: '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase(),
            adminAddrsss: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "FUJI"

        },
        11155111: {  // Avalanche_Testnet 

            chain: "BNB", //sepolia
            rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo",
            networkVersion: '43113',
            chainId: '11155111',
            currencySymbol: "ETH",
            tokenSymbol: "CAKE",
            siteUrl: "https://testnet.snowtrace.io",
            tokenAddress: "0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A".toLowerCase(),
            deadaddress: '0x000000000000000000000000000000000000dEaD'.toLowerCase(),

            tradeContract: "0xDe6d921983D19DB4db96a01753b4637C9Fd99Edc".toLowerCase(),
            // tradeContract: '0x783FB9DD2C69101cd0E080403279b9fE7E6ac780'.toLowerCase(), // sepolia openzepline
            // tradeContract: '0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208'.toLowerCase(),
            // tradeContract: '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase(),
            // tradeContract: '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase(), // sepolia old
            // tradeContract: '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase(),
            singleContract: '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase(),
            multipleContract: '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase(),
            adminAddrsss: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "FUJI",
            // stakeContract : "0x6fc5B10eAc3adeE4513d27341a30C73005d37F55".toLowerCase(),// sepolia old
            // stakeContract : "0x0e409bf120da9b6BBB8c777CEef5a20C57a60750".toLowerCase()

            // stakeContract : "0x4f9395bdA5E47566903b960895fdc2713890Fd41".toLowerCase()
            // stakeContract: "0x5eFe07C7A4F632b2c8Cd40aA2f4a70EC71d32348".toLowerCase() // sepolia openzepline
            stakeContract: "0x9605Abafe5f6EE8B9EB671083d4412415e0f54F2"
        }
    }
}

export const network = net