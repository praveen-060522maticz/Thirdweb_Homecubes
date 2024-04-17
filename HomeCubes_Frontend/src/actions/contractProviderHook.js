import { useSelector } from 'react-redux';
import ERC721 from '../Abi/erc721.json'
import ERC1155 from '../Abi/erc1155.json'
import DETH from '../Abi/erc20.json'
import Market from '../Abi/market.json'
import config from '../config/config'
import Web3 from 'web3';
import Web3Utils from 'web3-utils'
import { network } from '../config/network';
import bnblocal from '../Abi/bnblocal.json'
import TradeAbi from '../Abi/trade.json';
import StakeAbi from '../Abi/stakeAbi.json'
import { NftbalanceUpdate } from './axioss/nft.axios';
// var web3s=new Web3(network[Network].rpcUrl)
// console.log("web3s@123",network);


export default function useContractProviderHook() {
    const { Network } = useSelector(
        (state) => state.LoginReducer
    );

    var web3s = new Web3(network[Network]?.rpcUrl)
    const { accountAddress, web3, web3p, coinBalance } = useSelector(state => state.LoginReducer.AccountDetails);
    const { sellerFees, buyerFees } = useSelector(state => state.LoginReducer.ServiceFees);

    console.log("sellerFees, buyerFees", sellerFees, buyerFees);
    const Contract_Base_Validation = () => {
        if (!web3) return 'Connect Your Wallet...'
        if (!accountAddress) return 'Connect Your Wallet...'
        // if (!coinBalance) return "You Don't have Enough Balance."
        else return ''
    }

    const contrat_connection = async (...data) => {
        console.log('ddddaaattaaaa', ...data, web3, accountAddress, web3p);
        if (web3) {
            var contract_value = await new web3.eth.Contract(
                ...data
            );
            return contract_value;
        }
    }

    const GetApproveStatus = async (data, Addr) => {

        try {
            var ConnectContract = await contrat_connection(ERC721, Addr)
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .isApprovedForAll(accountAddress, network[Network]?.tradeContract)
                    .call()
            return contract_Method_Hash

        }
        catch (e) {
            return 'error'
        }
    }

    const GetGasFees = async (encoded, contractaddress, value) => {
        try {
            var gasPrice = await web3.eth.getGasPrice();
            // console.log('skjfffffffssssss@124',chain,TradeAddress);
            var gasdata;
            if (value) {
                gasdata = await web3.eth.estimateGas({
                    from: accountAddress,
                    to: contractaddress,
                    value: value,
                    data: encoded,
                });
            }
            else {
                gasdata = await web3.eth.estimateGas({
                    from: accountAddress,
                    to: contractaddress,
                    data: encoded,
                });
            }

            console.log('hdgdgkdggd', gasPrice, gasdata)
            return ({ gasdata: gasdata, gasPrice: gasPrice });
        }
        catch (err) {
            console.log('errorrr', err);
            return undefined;
        }
    }

    const SetApproveStatus = async (data, Addr) => {
        console.log("SETAPPROVETRADE", network[Network]?.tradeContract, accountAddress);
        console.log("sdefsedffe", data, Addr);
        try {


            // .send method

            var ConnectContract = await contrat_connection(data == 'Single' ? ERC721 : ERC1155, Addr)
            var contractobj = await
                ConnectContract
                    .methods
                    .setApprovalForAll(network[Network]?.tradeContract, true)

            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .setApprovalForAll(network[Network]?.tradeContract, true)
                    .send({
                        from: accountAddress,
                        gas: web3.utils.toHex(gas_estimate),
                        gasPrice: web3.utils.toHex(gasprice),
                    }).on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })
            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);

            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data;

        }
        catch (e) {
            console.log("ERR", e);
            return false
        }
    }
    const get_receipt = async (HashValue) => {
        var receipt = await web3.eth.getTransactionReceipt(HashValue);
        console.log("sdsadshadsadhfsa", receipt, HashValue, network[Network]?.rpcUrl)
        if (receipt) {
            return receipt
        }
        else {
            get_receipt(HashValue)
        }
    }
    const minting_721_1155 = async (...data) => {
        console.log("Multipledata", data);
        try {
            const ConnectContract = await contrat_connection(Market, network[Network]?.tradeContract)
            var contractobj = await
                ConnectContract
                    .methods
                    .minting(...data)
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .minting(...data)
                    .send({
                        from: accountAddress,
                        gas: web3.utils.toHex(gas_estimate),
                        gasPrice: web3.utils.toHex(gasprice)
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            const receipt = await get_receipt(contract_Method_Hash?.transactionHash ? contract_Method_Hash?.transactionHash : contract_Method_Hash);
            console.log('reciepppttttt', receipt)
            var TokenCOunts = Web3Utils.hexToNumber(receipt.logs[2]?.topics[2])
            if (TokenCOunts) {
                var need_data = {
                    status: receipt?.status,
                    HashValue: receipt?.transactionHash,
                    tokenCounts: TokenCOunts
                }
                return need_data
            }
        }
        catch (e) {
            console.log("Contract Error", e)
            return false
        }


    }
    const approve_721_1155 = async (token_address, ...data) => {

        console.log("approve data", token_address, ...data)
        try {
            const ConnectContract = await contrat_connection(DETH, token_address)
            var contractobj = await
                ConnectContract
                    .methods
                    .approve(...data)
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .approve(...data)
                    .send({
                        from: accountAddress,
                        gas: web3.utils.toHex(gas_estimate),
                        gasPrice: web3.utils.toHex(gasprice)
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            console.log("contract_Method_Hash", contract_Method_Hash, receipt);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        }
        catch (e) {
            console.log("err in approve", e)
            return false
        }
    }
    const Token_Balance_Calculation = async (token_Address, data) => {

        try {
            console.log('adddrreeeessss', token_Address, data)
            const ConnectContract = await contrat_connection(DETH, token_Address)
            var bidAMt = await ConnectContract.methods.balanceOf(data).call();

            return Number(web3.utils.fromWei(String(bidAMt)))
        }
        catch (e) {

            return 0
        }
    }
    var buy_bid_price_calculation = (val, decimal) => {
        console.log("val", val, decimal)
        var toMid = val * 1000000
        var serfee = (toMid / 100000000) * (web3p.utils.fromWei(String(buyerFees ? buyerFees : 1)) * 1000000)
        var totfee = serfee + toMid
        var tot2cont = web3.utils.toWei(String(Number(totfee / 1000000)).length > 18 ? String(Number(totfee / 1000000).toFixed(18)) : String(Number(totfee / 1000000)))
        var dec = decimal == 18 ? 18 : 18 - (decimal);
        var aprrove = ((tot2cont) / 10 ** dec)
        return (aprrove)
    }
    const cancel_order_721_1155 = async (data) => {
        try {
            var ConnectContract = await contrat_connection(Market, network[Network]?.tradeContract)
            var contractobj = await
                ConnectContract
                    .methods
                    .cancelOrder(data)
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .cancelOrder(data)
                    .send({
                        from: accountAddress,
                        gas: web3.utils.toHex(gas_estimate),
                        gasPrice: web3.utils.toHex(gasprice),
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })
            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data;
        }
        catch (e) {
            return false
        }

    }
    var price_calculation = (data, roy) => {
        try {
            var price = web3.utils.toWei(data);
            // var weii = price*1e6
            // var ser_per = (weii/100000000)*((Wallet_Details.sellerfee/config.decimalvalues)*1000000)
            // var roy_per = (weii/100000000)*((roy)*1000000)
            // var mulWei = ((weii) - (ser_per+roy_per));
            // var getVal = Number(mulWei)/1e6;
            //console..log("you will get lower",price,weii,ser_per,roy_per,getVal);
            var service_from_val = ((price * (sellerFees)) / 1e20)
            var royal_from_val = ((price * (roy * 1e18)) / 1e20)
            var my_val = 0, my_val_royal = 0, getVal = 0;
            if (String(service_from_val).includes('.') && String(service_from_val).split('.').pop().length > 18)
                my_val = service_from_val.toFixed(18)
            else
                my_val = service_from_val

            if (String(royal_from_val).includes('.') && String(royal_from_val).split('.').pop().length > 18)
                my_val_royal = royal_from_val.toFixed(18)
            else
                my_val_royal = royal_from_val
            var whole_val = (((price)) - my_val) / 1e18
            if (String(whole_val).includes('.') && String(whole_val).split('.').pop().length > 18)
                getVal = whole_val.toFixed(18)
            else
                getVal = whole_val
            //console(data, getVal, sellerFees, my_val, my_val_royal)
            return getVal

        }
        catch (e) {
            return false
        }
    }
    const place_order_721_1155 = async (...data) => {
        try {
            console.log("network[Network]?.tradeContract", ...data);
            var ConnectContract = await contrat_connection(Market, network[Network]?.tradeContract)
            var contractobj = await
                ConnectContract.methods
                    .orderPlace(...data)
            console.log("contractobj", contractobj);
            var gasprice = await web3.eth.getGasPrice();
            console.log("gasprice", gasprice);
            var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
            console.log("gas_estimate", gas_estimate);
            var contract_Method_Hash = await
                ConnectContract.methods
                    .orderPlace(...data)
                    .send({
                        from: accountAddress,
                        gas: web3.utils.toHex(gas_estimate),
                        gasPrice: web3.utils.toHex(gasprice)
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })
            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        }
        catch (e) {
            console.log("enakenemnfsd", e)
            return false
        }

    }
    const buy_721_1155 = async (Send, CoinName, ...data) => {
        try {

            console.log("buy_721_1155logssss", Send, CoinName, ...data, network[Network]?.tradeContract);
            const ConnectContract = await contrat_connection(Market, network[Network]?.tradeContract)
            console.log("ConnectContractbuy", ConnectContract);
            if (CoinName === "BNB" || CoinName === "ETH") {
                var contractobj = await
                    ConnectContract
                        .methods
                        .saleToken(...data)
                var gasprice = await web3.eth.getGasPrice();

                var gas_estimate = await contractobj.estimateGas({ from: accountAddress, value: Send })

                var contract_Method_Hash = await
                    ConnectContract
                        .methods
                        .saleToken(...data)
                        .send({
                            from: accountAddress,
                            value: Send,
                            gas: web3.utils.toHex(gas_estimate),
                            gasPrice: web3.utils.toHex(gasprice),
                        })
                        .on('transactionHash', (transactionHash) => {
                            return transactionHash
                        })
            }
            else {
                console.log("salewith token", data);
                var contractobj = await
                    ConnectContract
                        .methods
                        .saleWithToken(CoinName, ...data)
                var gasprice = await web3.eth.getGasPrice();
                var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
                var contract_Method_Hash = await
                    ConnectContract
                        .methods
                        .saleWithToken(CoinName, ...data)
                        .send({
                            from: accountAddress,
                            gas: web3.utils.toHex(gas_estimate),
                            gasPrice: web3.utils.toHex(gasprice)
                        })
                        .on('transactionHash', (transactionHash) => {
                            return transactionHash
                        })
            }
            console.log("contract_Method_Hash", contract_Method_Hash);

            var topIndex = 0
            if (CoinName !== "BNB") topIndex = 6;

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            console.log("receipt_buy", receipt);

            var royalObject = {}

            var TokenCOunts = receipt.logs[topIndex]?.topics?.map((val, i) => {
                if (i == 1) {
                    const address = web3p.eth.abi.decodeParameter("address", val);
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

            console.log("royalObject", receipt.logs[topIndex]?.topics, royalObject);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
                royaltyInfo: royalObject
            }
            console.log("need_data", need_data);
            return need_data
        }
        catch (e) {
            console.log("error on buy 721 1155", e);
            return false
        }

    }
    const allowance_721_1155 = async (token_Address, data, trade) => {

        try {
            const ConnectContract = await contrat_connection(DETH, token_Address)
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .allowance(data, trade)
                    .call()

            console.log("cheackapprovecalla", contract_Method_Hash);
            return contract_Method_Hash.toString()

        }

        catch (e) {
            return false
        }

    }
    const accept_721_1155 = async (...data) => {
        try {
            console.log("ehjusehfrefrwasDATA", ...data);
            if (web3 != null) {
                const ConnectContract = await contrat_connection(Market, network[Network]?.tradeContract)
                console.log("ConnectContract", ConnectContract);
                var contractobj = await
                    ConnectContract
                        .methods
                        .acceptBId(...data)
                var gasprice = await web3.eth.getGasPrice();
                var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
                var contract_Method_Hash = await
                    ConnectContract
                        .methods
                        .acceptBId(...data)
                        .send({
                            from: accountAddress,
                            gas: web3.utils.toHex(gas_estimate),
                            gasPrice: web3.utils.toHex(gasprice),
                        })
                        .on('transactionHash', (transactionHash) => {
                            return transactionHash
                        })
                const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                console.log("receipt_buy", receipt);

                var royalObject = {}

                var TokenCOunts = receipt.logs[0]?.topics?.map((val, i) => {
                    if (i == 1) {
                        const address = web3p.eth.abi.decodeParameter("address", val);
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
            }
        }
        catch (e) {
            console.log("ehjusehfrefrwas", e);
            return false
        }

    }

    const GetOwner = async (data, Addr, Tokenaddr) => {
        console.log('functioninputtt', data, Addr, Tokenaddr)
        try {
            var ConnectContract = await contrat_connection(data == 'Single' ? ERC721 : ERC1155, Addr)
            console.log('coooonnnnn', ConnectContract)
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .ownerOf(Tokenaddr)
                    .call()
            return contract_Method_Hash

        }
        catch (e) {
            console.log('errrorrrr', e)
            return 'error'
        }
    }

    const GetContractOwner = async (data, Addr) => {
        console.log('functioninputtt', Addr)
        try {
            var ConnectContract = await contrat_connection(data == 'Single' ? ERC721 : ERC1155, Addr)
            console.log('coooonnnnn', ConnectContract)
            var contractowner = await
                ConnectContract
                    .methods
                    .owner()
                    .call()
            return contractowner

        }
        catch (e) {
            console.log('errrorrrr', e, String(e))
            return 'error'
        }
    }

    const Current_NFT_Balance = async (ownerdet, data) => {

        try {
            var currbalance;
            if ((data.ContractType === "721" || data.ContractType === 721)) {
                console.log("dataindsddas", ERC721, data?.ContractAddress)
                const ConnectContract = await contrat_connection(ERC721, data?.ContractAddress)
                currbalance = await ConnectContract.methods.ownerOf(ownerdet?.NFTId).call();

                console.log('ballllaanneceeee1111', currbalance)
                if ((String(currbalance).toLowerCase()) == (String(ownerdet?.NFTOwner).toLowerCase())) {
                    console.log('ballllaanneceeee22222', currbalance)
                    return currbalance;
                }
                else {
                    let payload = {
                        NFTId: ownerdet?.NFTId,
                        NFTOwner: ownerdet?.NFTOwner,
                        NFTBalance: "0",
                        Currentowner: currbalance,
                        type: '721'
                    }
                    console.log("datainbalanceceheck721", payload)
                    let response = await NftbalanceUpdate(payload);
                    console.log("afterbalancecheck", response)

                    return String(currbalance);
                }
            }
        }
        catch (e) {
            console.log('errorrrr,e', e)
            return ""
        }
    }

    const lazyminting_721_1155 = async (count, type, coin, Send, ...data) => {
        console.log("VANTHADATA", accountAddress, type, coin, Send, ...data)
        var ConnectContract = "";
        try {

            ConnectContract = await contrat_connection(TradeAbi, config.TradeContract)
            var contract_Method_Hash
            if (coin == "BNB" || coin == "ETH") {
                console.log("METODASS", ConnectContract.methods)
                contract_Method_Hash = await
                    ConnectContract
                        .methods
                        .lazyMinting(...data)
                        .send({
                            from: accountAddress,
                            value: Send
                        })
                        .on('transactionHash', (transactionHash) => {
                            return transactionHash
                        })
            } else {
                console.log("METODASStoken", ConnectContract.methods)
                contract_Method_Hash = await
                    ConnectContract
                        .methods
                        .lazyMinting(...data)
                        .send({
                            from: accountAddress
                        })
                        .on('transactionHash', (transactionHash) => {
                            return transactionHash
                        })
            }

            console.log("contract_Method_Hash", contract_Method_Hash);

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            console.log("BUYMINTHASH", receipt)
            var ids = []
            if (count != "") {
                for (let i = 0; i < count; i++) {
                    ids.push(web3s.utils.hexToNumber(Number(receipt.logs[i].topics[3])))
                }
                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash,
                    Tokenid: ids
                }
                return need_data
            }
            else {
                var route = String(receipt.logs[0].data)
                var sliceee = route.slice(2)
                var lengthuh = sliceee.length / 2

                var TokenID = web3s.utils.hexToNumber("0x" + sliceee.slice(0, lengthuh))

                console.log("qweqweqweqweqwe", TokenID);
                ids.push(TokenID)
                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash,
                    Tokenid: ids
                }
                return need_data
            }

        }
        catch (err) {
            console.log("err in lazymint", err)
            return { status: false }
        }

    }

    const nftStakingAndWithdrawAndClaim = async (method, ...data) => {
        try {
            console.log("...data", ...data);
            var ConnectContract = await contrat_connection(StakeAbi, network[Network].stakeContract)
            console.log("METODASS", ConnectContract.methods)
            var contract_Method_Hash = await
                ConnectContract
                    .methods[method](...data)
                    .send({
                        from: accountAddress
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    });

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            console.log("BUYMINTHASH", receipt)

            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        } catch (e) {
            console.log("err on nftStaking", e);
            return { status: false }
        }

    }

    const getStackPools = async () => {
        try {
            var ConnectContract = await contrat_connection(StakeAbi, network[Network].stakeContract)
            console.log("ConnectContract", ConnectContract);

            var getCount = await ConnectContract
                .methods
                .poolCount()
                .call()
            console.log("getCount", getCount);
            const getData = await Promise.all([...Array(Number(getCount))].map(async (val, i) => {
                console.log("gighesges", i);
                var poolStatus = await ConnectContract
                    .methods
                    .poolStatus(i + 1)
                    .call()
                console.log("poolStatus", poolStatus);
                const obj = {
                    poolId: i + 1,
                    lockPeriod: Web3Utils.fromWei(poolStatus.lockPeriod),
                    rewardToken: poolStatus.rewardToken,
                    _enablestack: poolStatus._enablestack
                }
                return obj
            }))

            console.log("getData", getData);
            return {
                status: true,
                data: getData
            }
        } catch (e) {
            console.log("erro ongetStackPools ", e);
            return { status: false }
        }

    }

    const getStackApproveStatus = async (Addr) => {
        var ConnectContract = await contrat_connection(ERC721, Addr)
        var contract_Method_Hash = await
            ConnectContract
                .methods
                .isApprovedForAll(accountAddress, network[Network]?.stakeContract)
                .call()
        console.log("contract_Method_Hash", contract_Method_Hash);
        return contract_Method_Hash
    }

    const setApproveForStack = async (Addr) => {
        // console.log("sdefsedffe", Addr);
        try {
            var ConnectContract = await contrat_connection(ERC721, Addr)
            var contractobj = await
                ConnectContract
                    .methods
                    .setApprovalForAll(network[Network]?.stakeContract, true)

            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .setApprovalForAll(network[Network]?.stakeContract, true)
                    .send({
                        from: accountAddress,
                        gas: web3.utils.toHex(gas_estimate),
                        gasPrice: web3.utils.toHex(gasprice),
                    }).on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })
            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);

            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data;

        }
        catch (e) {
            console.log("ERR", e);
            return false
        }
    }

    const BidNFt_Contract = async (value, Method, ...data) => {
        try {
            console.log("...data", ...data);
            var ConnectContract = await contrat_connection(TradeAbi, config.TradeContract)
            console.log("METODASS", ConnectContract.methods)

            var contractobj = await
                ConnectContract
                    .methods[Method](...data)

            var gasprice = await web3.eth.getGasPrice();

            var gas_estimate = await contractobj.estimateGas({ from: accountAddress, value: value })

            var contract_Method_Hash = await
                ConnectContract
                    .methods[Method](...data)
                    .send({
                        from: accountAddress,
                        value: value,
                        gas: web3.utils.toHex(gas_estimate),
                        gasPrice: web3.utils.toHex(gasprice)
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    });

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            console.log("BUYMINTHASH", receipt)

            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        } catch (e) {
            console.log('erro on BidnftContract---->', e);
            return false
        }
    }
    return {
        Contract_Base_Validation,
        GetApproveStatus,
        SetApproveStatus,
        minting_721_1155,
        approve_721_1155,
        Token_Balance_Calculation,
        buy_bid_price_calculation,
        cancel_order_721_1155,
        price_calculation,
        place_order_721_1155,
        buy_721_1155,
        allowance_721_1155,
        accept_721_1155,
        GetOwner,
        GetContractOwner,
        Current_NFT_Balance,
        lazyminting_721_1155,
        getStackPools,
        getStackApproveStatus,
        setApproveForStack,
        nftStakingAndWithdrawAndClaim,
        BidNFt_Contract
    };




}
