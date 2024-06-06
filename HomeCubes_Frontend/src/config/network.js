import config from './config'

var net = {}
if (config.env == "demo" || config.env == "local" || config.env == "demossl") {
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
            tradeContract: "0xD370f5D497cc4b2344a9936f24E47284693d96D5".toLowerCase(),
            adminAddress: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "BSC_TESTNET"

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
            tradeContract: '0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208'.toLowerCase(),
            // tradeContract: '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase(),
            // tradeContract: '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase(), // sepolia old
            // tradeContract: '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase(),
            singleContract: '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase(),
            multipleContract: '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase(),
            adminAddrsss: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "FUJI",
            // stakeContract : "0x6fc5B10eAc3adeE4513d27341a30C73005d37F55".toLowerCase(),// sepolia old
            // stakeContract : "0x0e409bf120da9b6BBB8c777CEef5a20C57a60750".toLowerCase()
            stakeContract : "0x4f9395bdA5E47566903b960895fdc2713890Fd41".toLowerCase()
        }
    }
}
if (config.env == "production") {
    net = {
        56: {   // binance mainnet

            chain: "Binance",
            rpcUrl: "https://bsc-dataseed.binance.org/",
            networkVersion: '56',
            chainId: '56',
            currencySymbol: "BNB",
            tokenSymbol: "WBNB",
            tokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'.toLowerCase(),
            singleContract: '0x36A083414dfF06C5a86821b07F289E9a1583ebE2'.toLowerCase(),
            multipleContract: '0x89f0CDEB3e83b97aae9A1a66c348BA8e29893a65'.toLowerCase(),
            tradeContract: "0xC9Cfa2dd1Ed7Bc29C7d9B990b2DE7Ee630478ec4".toLowerCase(),
            adminAddress: "0xB36c21475963A515c399D5726fcF843454884CF1".toLowerCase(),
            chainName: "BSC"

        },
        1: {  //ETH mainnet

            chain: "ETH",
            rpcUrl: "https://mainnet.infura.io/v3/8bd0c393365f4c559c7ca6179a12fea6",
            networkVersion: '1',
            chainId: '1',
            currencySymbol: "ETH",
            tokenSymbol: "WETH",
            tokenAddress: "0xB36c21475963A515c399D5726fcF843454884CF1".toLowerCase(),
            deadaddress: '0x000000000000000000000000000000000000dEaD'.toLowerCase(),
            tradeContract: '0xC9Cfa2dd1Ed7Bc29C7d9B990b2DE7Ee630478ec4'.toLowerCase(),
            singleContract: '0x36A083414dfF06C5a86821b07F289E9a1583ebE2'.toLowerCase(),
            multipleContract: '0x89f0CDEB3e83b97aae9A1a66c348BA8e29893a65'.toLowerCase(),
            adminAddrsss: "0xB36c21475963A515c399D5726fcF843454884CF1".toLowerCase(),
            chainName: "ETH"

        },
        // 11155111: {  // Avalanche_Testnet 
        //     chain: "BNB", //sepolia
        //     rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo",
        //     networkVersion: '43113',
        //     chainId: '11155111',
        //     currencySymbol: "ETH",
        //     tokenSymbol: "CAKE",
        //     siteUrl: "https://testnet.snowtrace.io",
        //     tokenAddress: "0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A".toLowerCase(),
        //     deadaddress: '0x000000000000000000000000000000000000dEaD'.toLowerCase(),
        //     tradeContract: '0x274C7D841002A74c3E4EABEcDB504e3af3f1f05A'.toLowerCase(),
        //     // tradeContract: '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase(), // sepolia old
        //     // tradeContract: '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase(),
        //     singleContract: '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase(),
        //     multipleContract: '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase(),
        //     adminAddrsss: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
        //     chainName: "FUJI",
        //     // stakeContract : "0x6fc5B10eAc3adeE4513d27341a30C73005d37F55".toLowerCase(),// sepolia old
        //     stakeContract : "0xfA5F554A995cfE5aaEdEf31fE6a11c77b8576614".toLowerCase()
        // }

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
            tradeContract: '0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208'.toLowerCase(),
            // tradeContract: '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase(),
            // tradeContract: '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase(), // sepolia old
            // tradeContract: '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase(),
            singleContract: '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase(),
            multipleContract: '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase(),
            adminAddrsss: "0x025c1667471685c323808647299e5dbf9d6adcc9".toLowerCase(),
            chainName: "FUJI",
            // stakeContract : "0x6fc5B10eAc3adeE4513d27341a30C73005d37F55".toLowerCase(),// sepolia old
            // stakeContract : "0x0e409bf120da9b6BBB8c777CEef5a20C57a60750".toLowerCase()
            stakeContract : "0x4f9395bdA5E47566903b960895fdc2713890Fd41".toLowerCase()
        }
    }
}

export const network = net