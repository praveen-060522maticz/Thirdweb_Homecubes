// import ERC721 from '../../src/Abi/erc721.json'
// import ERC1155 from '../../src/Abi/erc1155.json'
// import TRADE from '../../src/Abi/market.json'
// import profile from '../../assets/images/avatar.png'
var EnvName = 'demossl';
var key = {};
key.ONEDAYINSECONDS = 0
key.env = EnvName
key.BLOCKS_PER_YEAR = 0
key.RPAD_ADDRESS = ''
key.ROUTER = ''
key.EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
key.MOBILE = /^\d{10}$/
key.NumOnly = /^\d+$/
key.PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
key.OnlyAlbhabets = /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/
key.notSpecil = /^[a-zA-Z0-9]+$/
key.OnlyAlphSpecial = /^[A-Za-z_@.#&+-]*$/
key.IPFS = 'https://ipfs.io/ipfs/'
key.DecimalAlloweddigits = /^([0-9]+[\.]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?|[0-9]+)$/
key.limit = 50
key.NumDigitOnly = /[^0-9\.]/g
key.NumberOnly = /[^0-9]/g

key.CLIENT_ID = "296d2b4d857384234936383fea3b685f"
key.SECRET_KEY = "9ycsZKfzHSGblpwkrqx3d_KW38QyEYviIRZmbZMd-AdPRqac-rutFHgv0Dl0c5HAqBAGr64bujLoOsYoaa0wNA"
key.FACTORYADDRESS = "0x204e6475FB6611171EB7fa323dAb82da42bC72B8"
key.STATIC_TOKEN = "0xc6aBa068A91d327B259327523f71f51221943186"

key.RELAYER_API_KEY = "AdZVXDaY8mTHi7NoDRJWz3yf29x2b8nQ"
key.RELAYER_API_SECRET = "wCgeKerDJpaTBu1oYFHasGRnWNNbSG2CSAVcBYwVGj23xNmWczmUdUWpckhFbEW3"
key.RELAYER_ADDRESS = "0xA40F308Ad28b520f1cd0a9A58e3b551F73602246"
key.FORWARDER_ADDRESS = "0x84732a7d2bC9336ECB59e651DCCcF9B42B6bc0d3"
key.RELAYER_URL = "https://api.defender.openzeppelin.com/actions/ca840de3-fa75-4118-bbee-9b51da6fc43e/runs/webhook/6b8630f5-37d9-4a4c-b68f-d102e14e71a4/3M79HzfiKyX7zMjHivtAHR"

const ip = "200.140.70.76"

if (EnvName === "demo") {
    key.KEY = 'MNBVCZX1234)(*'
    key.FRONT_URL = 'https://homecube.maticz.in/'
    key.BACK_URL = 'https://api-homecubes.maticz.in/v1/front'
    key.ADMIN_URL = 'https://api-homecubes.maticz.in/v1/admin'
    key.IMG_URL = 'https://api-homecubes.maticz.in'
    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    // key.profile         =    profile
    // key.TradeContract   =   '0xD370f5D497cc4b2344a9936f24E47284693d96D5'.toLowerCase() // bnb
    // key.TradeContract = '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase() //sepolia
    // key.TradeContract = '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase() //sepolia old
    // key.TradeContract = '0xA40F308Ad28b520f1cd0a9A58e3b551F73602246'.toLowerCase() //sepolia
    key.TradeContract = '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase() //sepolia
    key.ERC721 = '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase() // sepolia
    // key.ERC721          =   '0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf'.toLowerCase() //bnb
    key.ERC1155 = '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
    key.erc20Address = '0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A'.toLowerCase()
    // key.RPC_URL         =   "https://data-seed-prebsc-1-s1.binance.org:8545/"
    // key.RPC_URL         =   "https://api.avax-test.network/ext/bc/C/rpc"
    key.chain_Id_List = [97, 11155111]
    key.BNBCHAIN = 97
    key.ETHCHAIN = 11155111
    key.RPC_URL = "https://ethereum-sepolia.publicnode.com"
    key.CHAIN_ID = 11155111
    key.COIN_NAME = "BNB"
    key.Block_URL = {
        ETH: "https://testnet.snowtrace.io/",
        BNB: "https://testnet.bscscan.com/"
    }
}
else if (EnvName === "stage") {
}
else if (EnvName === "production") {
    key.KEY = 'MNBVCZX1234)(*'
    key.FRONT_URL = 'http://localhost:3000'
    key.BACK_URL = 'https://api.homecubes.io/v1/front'
    key.ADMIN_URL = 'https://api.homecubes.io/v1/admin'
    key.IMG_URL = 'https://api.homecubes.io'
    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    // key.profile         =    profile
    // key.TradeContract   =   '0xD370f5D497cc4b2344a9936f24E47284693d96D5'.toLowerCase() // bnb
    // key.TradeContract = '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase() //sepolia
    // key.TradeContract = '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase() //sepolia old
    // key.TradeContract = '0x274C7D841002A74c3E4EABEcDB504e3af3f1f05A'.toLowerCase() //sepolia
    key.TradeContract = '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase() //sepolia
    key.ERC721 = '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase() // sepolia
    // key.ERC721          =   '0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf'.toLowerCase() //bnb
    key.ERC1155 = '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
    key.erc20Address = '0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A'.toLowerCase()
    // key.RPC_URL         =   "https://data-seed-prebsc-1-s1.binance.org:8545/"
    // key.RPC_URL         =   "https://api.avax-test.network/ext/bc/C/rpc"
    key.chain_Id_List = [97, 11155111]
    key.BNBCHAIN = 97
    key.ETHCHAIN = 11155111
    key.RPC_URL = "https://ethereum-sepolia.publicnode.com"
    key.CHAIN_ID = 11155111
    key.COIN_NAME = "BNB"
    key.Block_URL = {
        ETH: "https://testnet.snowtrace.io/",
        BNB: "https://testnet.bscscan.com/"
    }
}
else if (EnvName === "demossl") {
    key.KEY = 'MNBVCZX1234)(*'
    key.FRONT_URL = 'https://home-cubes-frontend-2.pages.dev//'
    key.BACK_URL = 'https://backend-homecubes.maticz.in/v1/front'
    key.ADMIN_URL = 'https://backend-homecubes.maticz.in/v1/admin'
    key.IMG_URL = 'https://backend-homecubes.maticz.in'
    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    // key.profile         =    profile
    // key.TradeContract   =   '0xD370f5D497cc4b2344a9936f24E47284693d96D5'.toLowerCase() // bnb
    // key.TradeContract = '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase() //sepolia old one
    // key.TradeContract = '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase() //sepolia old one
    key.TradeContract = '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase() //sepolia
    // key.TradeContract = '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase() //sepolia
    key.ERC721 = '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase() // sepolia
    // key.ERC721          =   '0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf'.toLowerCase() //bnb
    key.ERC1155 = '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
    key.erc20Address = '0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A'.toLowerCase()
    // key.RPC_URL         =   "https://data-seed-prebsc-2-s1.binance.org:8545/"
    key.chain_Id_List = [97, 11155111]
    key.BNBCHAIN = 97
    key.ETHCHAIN = 11155111
    key.RPC_URL = "https://ethereum-sepolia.publicnode.com"
    key.CHAIN_ID = 11155111
    key.COIN_NAME = "BNB"
    key.Block_URL = {
        ETH: "https://testnet.snowtrace.io/",
        BNB: "https://testnet.bscscan.com/"
    }
}
else if (EnvName == "localIp") {
    key.KEY = 'MNBVCZX1234)(*'
    key.FRONT_URL = `http://localhost:3000`
    key.BACK_URL = `http://${ip}:3030/v1/front`
    key.ADMIN_URL = `http://${ip}:3030/v1/admin`
    key.IMG_URL = `http://${ip}:3030`
    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    // key.profile         =    profile
    // key.TradeContract   =   '0xD370f5D497cc4b2344a9936f24E47284693d96D5'.toLowerCase() // bnb
    // key.TradeContract = '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase() //sepolia
    // key.TradeContract = '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase() //sepolia old
    // key.TradeContract = '0x274C7D841002A74c3E4EABEcDB504e3af3f1f05A'.toLowerCase() //sepolia
    // key.TradeContract = '0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208'.toLowerCase() //sepolia
    key.TradeContract = '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase() //sepolia
    key.ERC721 = '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase() // sepolia
    // key.ERC721          =   '0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf'.toLowerCase() //bnb
    key.ERC1155 = '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
    key.erc20Address = '0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A'.toLowerCase()
    // key.RPC_URL         =   "https://data-seed-prebsc-1-s1.binance.org:8545/"
    // key.RPC_URL         =   "https://api.avax-test.network/ext/bc/C/rpc"
    key.chain_Id_List = [97, 11155111]
    key.BNBCHAIN = 97
    key.ETHCHAIN = 11155111
    key.RPC_URL = "https://ethereum-sepolia.publicnode.com"
    key.CHAIN_ID = 11155111
    key.COIN_NAME = "BNB"
    key.Block_URL = {
        ETH: "https://testnet.snowtrace.io/",
        BNB: "https://testnet.bscscan.com/"
    }
}
else {
    key.KEY = 'MNBVCZX1234)(*'
    key.FRONT_URL = 'http://localhost:3000'
    key.BACK_URL = 'http://localhost:3030/v1/front'
    key.ADMIN_URL = 'http://localhost:3030/v1/admin'
    key.IMG_URL = 'http://localhost:3030'
    key.DEADADDRESS = '0x000000000000000000000000000000000000dEaD'.toLowerCase()
    // key.profile         =    profile
    // key.TradeContract   =   '0xD370f5D497cc4b2344a9936f24E47284693d96D5'.toLowerCase() // bnb
    // key.TradeContract = '0xD87ddfE179fE3e2Aea84041118a7E6C7EC975fe3'.toLowerCase() //sepolia
    // key.TradeContract = '0x19D4c0f9155C6517580f850D4D097AF0448a1B39'.toLowerCase() //sepolia old
    // key.TradeContract = '0x274C7D841002A74c3E4EABEcDB504e3af3f1f05A'.toLowerCase() //sepolia
    // key.TradeContract = '0xc3d37F7F03B39e2Ba9208b21C5E441d1Df014208'.toLowerCase() //sepolia
    key.TradeContract = '0x3F71bbA2674E355C975EaD8e9d7cCb73FC1296ac'.toLowerCase() //sepolia
    key.ERC721 = '0x575cd9E4099A38B536673F557063f9A546870d11'.toLowerCase() // sepolia
    // key.ERC721          =   '0x6fbcF768b6E0cf9ED6Cc38ad41EDb939E925deaf'.toLowerCase() //bnb
    key.ERC1155 = '0x4958A36d8d71abd35D5434EF78023B3284D93e63'.toLowerCase()
    key.erc20Address = '0xEb4fFed6B324b5FdC4d72AD3dA75bf1Fb2bB004A'.toLowerCase()
    // key.RPC_URL         =   "https://data-seed-prebsc-1-s1.binance.org:8545/"
    // key.RPC_URL         =   "https://api.avax-test.network/ext/bc/C/rpc"
    key.chain_Id_List = [97, 11155111]
    key.BNBCHAIN = 97
    key.ETHCHAIN = 11155111
    key.RPC_URL = "https://ethereum-sepolia.publicnode.com"
    key.CHAIN_ID = 11155111
    key.COIN_NAME = "BNB"
    key.Block_URL = {
        ETH: "https://testnet.snowtrace.io/",
        BNB: "https://testnet.bscscan.com/"
    }
}
export default key;
