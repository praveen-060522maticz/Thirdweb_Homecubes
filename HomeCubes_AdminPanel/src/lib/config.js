let key = {};
let IPFS_IMG = "https://ipfs.io/ipfs/";
// let IPFS_IMG = "https://naifty.infura-ipfs.io/ipfs/";
var networkVersion = "";
var BNBProvider = "";
let Back_Url = "";
let decimalValues = 1000000000000000000;
var FRONT_URL = "";
var ImG = "";
var EnvName = "clientStage";
var networkTransUrl = ''

var Front_market_Url = ''

if (EnvName === "local") {
  Back_Url = "http://localhost:3030/v1/admin";
  Front_market_Url = "http://localhost:3000/naiftyadmin";
  var image_url = "http://localhost:3030/token";
  ImG = "http://localhost:3030";
  // var tradeAddress = "0xD370f5D497cc4b2344a9936f24E47284693d96D5"; // bnb
  // var singleAddress = "0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf"; // bnb
  // var tradeAddress = "0x19D4c0f9155C6517580f850D4D097AF0448a1B39"; // seplia old

  // var tradeAddress = "0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208".toLowerCase(); // seplia

  // var tradeAddress = "0x783FB9DD2C69101cd0E080403279b9fE7E6ac780".toLowerCase(); // seplia openzepline
  // var tradeAddress = "0xDe6d921983D19DB4db96a01753b4637C9Fd99Edc".toLowerCase()  //removed seplia openzepline
  var tradeAddress = "0xeA7AE9464eF470DBbD43488F0875FD54521576b1".toLowerCase()  //removed seplia openzepline praveen

  // var tradeAddress = "0xEcbb872F7bC77D4539097Dbc44EF122a21931BC7".toLowerCase()  //removed seplia openzepline
  // var tradeAddress = "0x06634158F0a6fdb7686b67d128d5b8d498349cD9".toLowerCase()  // audit bsc testnet
  // var tradeAddress = "0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac".toLowerCase(); // seplia
  // var tradeAddress = "0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3"; // seplia
  var singleAddress = "0x575cd9E4099A38B536673F557063f9A546870d11"; // seplia
  var multipeAddress = "0x0b6369b506e811df30ab7c0ce0ae00b8690b76be";
  var networkVersion = "0x61"
  var chainId = 97;
  var ETHCHAIN = 11155111
  var BNBCHAIN = 97
  var chainlist = [97, 11155111]
  var versions = ["0x61", "0xa869"]
  var BNBversion = "0x61"
  var ETHversion = "0xa869"
  var ETHTRADE = '0x5b6AaF50abD17EA1faE897c487B71CDf75d90769'.toLowerCase()
  var BNBTRADE = "0x419Ee320F99287A93B4362C4A45679E30736d05a".toLowerCase()
  var ETHprovider = "https://eth-sepolia.g.alchemy.com/v2/demo";
  var BNBprovider = "https://endpoints.omniatech.io/v1/bsc/testnet/public";
  // var Back_Url_Token = "https://naifty.io/v1";
  var Back_Url_Token = "http://localhost:3030/v1";
  var COIN_NAME = "BNB"
  networkTransUrl = "https://sepolia.etherscan.io/tx/"
  // var stakeAddress = "0x4f9395bdA5E47566903b960895fdc2713890Fd41"
  // var stakeAddress = "0x5eFe07C7A4F632b2c8Cd40aA2f4a70EC71d32348" // openxep
  // var stakeAddress = "0x9605Abafe5f6EE8B9EB671083d4412415e0f54F2" // removed openzep sepolia
  var stakeAddress = "0x966D215D56b06E3469Df0D9fD80A5cB78f9A1EAA" // removed openzep bnb
}

if (EnvName === "clientStage") {
  Back_Url = "https://staging-backend.homecubes.io/v1/admin";
  Front_market_Url = "https://localhost:3000/naiftyadmin";
  var image_url = "https://staging-backend.homecubes.io/token";
  ImG = "https://staging-backend.homecubes.io";
  // var tradeAddress = "0xD370f5D497cc4b2344a9936f24E47284693d96D5"; // bnb
  // var singleAddress = "0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf"; // bnb
  // var tradeAddress = "0x19D4c0f9155C6517580f850D4D097AF0448a1B39"; // seplia old

  // var tradeAddress = "0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208".toLowerCase(); // seplia

  // var tradeAddress = "0x783FB9DD2C69101cd0E080403279b9fE7E6ac780".toLowerCase(); // seplia openzepline
  // var tradeAddress = "0xDe6d921983D19DB4db96a01753b4637C9Fd99Edc".toLowerCase()
  // var tradeAddress = "0xEcbb872F7bC77D4539097Dbc44EF122a21931BC7".toLowerCase()
  var tradeAddress = "0xeA7AE9464eF470DBbD43488F0875FD54521576b1".toLowerCase()  // audit bsc testnet
  // var tradeAddress = "0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac".toLowerCase(); // seplia
  // var tradeAddress = "0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3"; // seplia
  var singleAddress = "0x575cd9E4099A38B536673F557063f9A546870d11"; // seplia
  var multipeAddress = "0x0b6369b506e811df30ab7c0ce0ae00b8690b76be";
  var networkVersion = "0x61"
  var chainId = 97;
  var ETHCHAIN = 11155111
  var BNBCHAIN = 97
  var chainlist = [97, 11155111]
  var versions = ["0x61", "0xa869"]
  var BNBversion = "0x61"
  var ETHversion = "0xa869"
  var ETHTRADE = '0x5b6AaF50abD17EA1faE897c487B71CDf75d90769'.toLowerCase()
  var BNBTRADE = "0x419Ee320F99287A93B4362C4A45679E30736d05a".toLowerCase()
  var ETHprovider = "https://eth-sepolia.g.alchemy.com/v2/demo";
  var BNBprovider = "https://endpoints.omniatech.io/v1/bsc/testnet/public";
  // var Back_Url_Token = "https://naifty.io/v1";
  var Back_Url_Token = "https://staging-backend.homecubes.io/v1";
  var COIN_NAME = "BNB"
  networkTransUrl = "https://sepolia.etherscan.io/tx/"
  // var stakeAddress = "0x4f9395bdA5E47566903b960895fdc2713890Fd41"
  // var stakeAddress = "0x5eFe07C7A4F632b2c8Cd40aA2f4a70EC71d32348" // openxep
  // var stakeAddress = "0x9605Abafe5f6EE8B9EB671083d4412415e0f54F2"
  var stakeAddress = "0x966D215D56b06E3469Df0D9fD80A5cB78f9A1EAA" // removed openzep bnb
}

if (EnvName === "stage") {
  // Back_Url = "https://api-homecubes.maticz.in/v1/admin";
  // Front_market_Url = "https://homecube.maticz.in/";
  // var image_url = "http://localhost:3030/token";
  // ImG = "https://api-homecubes.maticz.in";

  Back_Url = "https://homecubesbackend.maticz.in/v1/admin";
  Front_market_Url = "https://homecube.maticz.in/";
  var image_url = "http://localhost:3030/token";
  ImG = "https://homecubesbackend.maticz.in";

  // var tradeAddress = "0xD370f5D497cc4b2344a9936f24E47284693d96D5"; // bnb
  // var singleAddress = "0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf"; // bnb
  // var tradeAddress = "0x19D4c0f9155C6517580f850D4D097AF0448a1B39"; // seplia old
  // var tradeAddress = "0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208".toLowerCase(); // seplia
  // var tradeAddress = "0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208".toLowerCase(); // seplia
  // var tradeAddress = "0x783FB9DD2C69101cd0E080403279b9fE7E6ac780".toLowerCase(); // seplia op remove
  var tradeAddress = "0xeA7AE9464eF470DBbD43488F0875FD54521576b1".toLowerCase(); // seplia openzep removed
  // var tradeAddress = "0xDe6d921983D19DB4db96a01753b4637C9Fd99Edc".toLowerCase(); // seplia openzep removed
  // var tradeAddress = "0x06634158F0a6fdb7686b67d128d5b8d498349cD9".toLowerCase()  // audit bsc testnet


  // var tradeAddress = "0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac".toLowerCase(); // seplia
  // var tradeAddress = "0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3"; // seplia
  var singleAddress = "0x575cd9E4099A38B536673F557063f9A546870d11"; // seplia
  var multipeAddress = "0x0b6369b506e811df30ab7c0ce0ae00b8690b76be";
  var networkVersion = "0x61"
  var chainId = 97;
  var ETHCHAIN = 11155111
  var BNBCHAIN = 97
  var chainlist = [97, 11155111]
  var versions = ["0x61", "0xa869"]
  var BNBversion = "0x61"
  var ETHversion = "0xa869"
  var ETHTRADE = '0x5b6AaF50abD17EA1faE897c487B71CDf75d90769'.toLowerCase()
  var BNBTRADE = "0x419Ee320F99287A93B4362C4A45679E30736d05a".toLowerCase()
  var ETHprovider = "https://eth-sepolia.g.alchemy.com/v2/demo";
  var BNBprovider = "https://endpoints.omniatech.io/v1/bsc/testnet/public";
  // var Back_Url_Token = "https://naifty.io/v1";
  var Back_Url_Token = "https://homecubesbackend.maticz.in/v1";
  var COIN_NAME = "BNB"
  networkTransUrl = "https://sepolia.etherscan.io/tx/"
  var stakeAddress = "0x966D215D56b06E3469Df0D9fD80A5cB78f9A1EAA"

}

if (EnvName === "demo") {

  Back_Url = "https://backend-homecubes.maticz.in/v1/admin";
  Front_market_Url = "https://home-cubes-frontend-2.pages.dev/";
  var image_url = "http://localhost:3030/token";
  ImG = "https://backend-homecubes.maticz.in";
  // var tradeAddress = "0xD370f5D497cc4b2344a9936f24E47284693d96D5"; // bnb
  // var singleAddress = "0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf"; // bnb
  // var tradeAddress = "0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3"; // seplia
  // var tradeAddress = "0x19D4c0f9155C6517580f850D4D097AF0448a1B39"; // seplia old
  // var tradeAddress = "0x274C7D841002A74c3E4EABEcDB504e3af3f1f05A".toLowerCase(); // seplia
  // var tradeAddress = "0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac".toLowerCase(); // seplia
  // var tradeAddress = "0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208".toLowerCase(); // seplia

  // var tradeAddress = "0x783FB9DD2C69101cd0E080403279b9fE7E6ac780".toLowerCase(); // seplia 
  // var tradeAddress = "0xDe6d921983D19DB4db96a01753b4637C9Fd99Edc".toLowerCase(); // seplia openzep removed
  var tradeAddress = "0x06634158F0a6fdb7686b67d128d5b8d498349cD9".toLowerCase()  // audit bsc testnet
  var singleAddress = "0x575cd9E4099A38B536673F557063f9A546870d11"; // seplia
  var multipeAddress = "0x0b6369b506e811df30ab7c0ce0ae00b8690b76be";
  var networkVersion = "0x61"
  var chainId = 11155111;
  var ETHCHAIN = 11155111
  var BNBCHAIN = 97
  var chainlist = [97, 11155111]
  var versions = ["0x61", "0xa869"]
  var BNBversion = "0x61"
  var ETHversion = "0xa869"
  var ETHTRADE = '0x5b6AaF50abD17EA1faE897c487B71CDf75d90769'.toLowerCase()
  var BNBTRADE = "0x419Ee320F99287A93B4362C4A45679E30736d05a".toLowerCase()
  var ETHprovider = "https://eth-sepolia.g.alchemy.com/v2/demo";
  var BNBprovider = "https://endpoints.omniatech.io/v1/bsc/testnet/public";
  // var Back_Url_Token = "https://naifty.io/v1";
  var Back_Url_Token = "https://backend-homecubes.maticz.in/v1";
  networkTransUrl = "https://sepolia.etherscan.io/tx/"
  var COIN_NAME = "BNB"
  // var stakeAddress = "0x5eFe07C7A4F632b2c8Cd40aA2f4a70EC71d32348" // openxep
  var stakeAddress = "0x9605Abafe5f6EE8B9EB671083d4412415e0f54F2"

}

if (EnvName === "production") {
  Back_Url = "https://api.homecubes.io/v1/admin";
  Front_market_Url = "https://app.homecubes.io/";
  var image_url = "http://localhost:3030/token";
  ImG = "https://api.homecubes.io";
  // var tradeAddress = "0xD370f5D497cc4b2344a9936f24E47284693d96D5"; // bnb
  // var singleAddress = "0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf"; // bnb
  // var tradeAddress = "0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3"; // seplia
  // var tradeAddress = "0x19D4c0f9155C6517580f850D4D097AF0448a1B39"; // seplia old
  // var tradeAddress = "0x274C7D841002A74c3E4EABEcDB504e3af3f1f05A".toLowerCase(); // seplia
  // var tradeAddress = "0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac".toLowerCase();
  // var tradeAddress = "0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208".toLowerCase(); // seplia
  // var tradeAddress = "0xDe6d921983D19DB4db96a01753b4637C9Fd99Edc".toLowerCase()
  // key.TradeContract = "0xEcbb872F7bC77D4539097Dbc44EF122a21931BC7".toLowerCase()
  var tradeAddress = "0x06634158F0a6fdb7686b67d128d5b8d498349cD9".toLowerCase()  // audit bsc testnet

  var singleAddress = "0x575cd9E4099A38B536673F557063f9A546870d11"; // seplia
  var multipeAddress = "0x0b6369b506e811df30ab7c0ce0ae00b8690b76be";
  var networkVersion = "0x61"
  var chainId = 11155111;
  var ETHCHAIN = 11155111
  var BNBCHAIN = 97
  var chainlist = [97, 11155111]
  var versions = ["0x61", "0xa869"]
  var BNBversion = "0x61"
  var ETHversion = "0xa869"
  var ETHTRADE = '0x5b6AaF50abD17EA1faE897c487B71CDf75d90769'.toLowerCase()
  var BNBTRADE = "0x419Ee320F99287A93B4362C4A45679E30736d05a".toLowerCase()
  var ETHprovider = "https://eth-sepolia.g.alchemy.com/v2/demo";
  var BNBprovider = "https://endpoints.omniatech.io/v1/bsc/testnet/public";
  // var Back_Url_Token = "https://naifty.io/v1";
  var Back_Url_Token = "https://api.homecubes.io/v1";
  networkTransUrl = "https://sepolia.etherscan.io/tx/"
  var COIN_NAME = "BNB"
  // var stakeAddress = "0x4f9395bdA5E47566903b960895fdc2713890Fd41"
  var stakeAddress = "0x966D215D56b06E3469Df0D9fD80A5cB78f9A1EAA"
}

key = {
  AdminAPI: `${Back_Url}`,
  Back_Url: `${Back_Url_Token}`,
  chainId: chainId,
  BNBProvider: BNBprovider,
  ETHprovider: ETHprovider,
  ETHCHAIN: ETHCHAIN,
  BNBCHAIN: BNBCHAIN,
  chainlist: chainlist,
  bnbver: BNBversion,
  ethver: ETHversion,
  versionlist: versions,
  ENVname: EnvName,
  networkTransUrl: networkTransUrl,
  tradeAddress: tradeAddress,
  singleAddress: singleAddress,
  multipeAddress: multipeAddress,
  ImG: ImG,
  IPFS_IMG: IPFS_IMG,
  ETHTRADE: ETHTRADE,
  BNBTRADE: BNBTRADE,
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  AdminAddress: "0x025c1667471685c323808647299e5DbF9d6AdcC9".toLowerCase(),
  noimg: require("../assets/images/No_image.webp"),
  FRONT_URL: FRONT_URL,
  Front_market_Url: Front_market_Url,
  networkVersion: networkVersion,
  KEY: 'MNBVCZX1234)(*',
  NumDigitOnly: /[^0-9\.]/g,
  COIN_NAME: COIN_NAME,
  stakeAddress: stakeAddress,
  DEADADDRESS: '0x000000000000000000000000000000000000dEaD'.toLowerCase()
};

export default key;
