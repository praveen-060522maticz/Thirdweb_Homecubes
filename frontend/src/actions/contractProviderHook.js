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
import ForwardAbi from '../Abi/forwardABI.json'
import { toast } from 'react-toastify'
import { NftbalanceUpdate } from './axioss/nft.axios';
import { usePrivy, useWallets, useSignTypedData } from '@privy-io/react-auth';
import { getBNBvalue, getErrorForToast } from './common';
import randomInteger from 'random-int';

// var web3s=new Web3(network[Network].rpcUrl)
// console.log("web3s@123",network);

let spareAmount = "25000000000000000000"

export default function useContractProviderHook() {
    const { Network } = useSelector(
        (state) => state.LoginReducer
    );

    var web3s = new Web3(network[Network]?.rpcUrl)
    const { accountAddress, web3, web3p, web3auth, coinBalance, USDTaddress, BNBUSDT } = useSelector(state => state.LoginReducer.AccountDetails);
    const { sellerFees, buyerFees } = useSelector(state => state.LoginReducer.ServiceFees);
    const { gasFee } = useSelector((state) => state.LoginReducer.User);
    const { wallets, ready } = useWallets();
    const { signTypedData } = usePrivy()

    console.log('FFAFAFAADwalletADADDD---->', gasFee);

    console.log("sellerFees, buyerFees", sellerFees, buyerFees);
    const Contract_Base_Validation = () => {
        if (!web3) return 'Connect Your Wallet...'
        if (!accountAddress) return 'Connect Your Wallet...'
        // if (!coinBalance) return "You Don't have Enough Balance."
        else return ''
    }

    const contrat_connection = async (conWallet, ...data) => {

        console.log('ddddaaattaaaa', ...data, web3, accountAddress, web3p);
        // if (web3) {
        console.log('walgzesgseletswallets---->', conWallet);
        // const getWallet = wallets[0]
        const provider = await conWallet.getWeb3jsProvider();
        const newWeb3 = new Web3(provider)
        var contract_value = new newWeb3.eth.Contract(
            ...data
        );
        return contract_value;
        // }
    }

    const _signcall = async (wallet, amount) => {
        try {

            var randomNum = randomInteger(10000000, 100000000);
            var provider = await wallet.getEthereumProvider();
            const web3D = new Web3(config.RPC_URL)
            console.log('provider---->', provider, await wallet?.getWeb3jsProvider());
            const _nonce = Date.now();
            var tot = _nonce + Number(randomNum);
            const result = web3D.utils.soliditySha3(wallet?.address, amount, config?.KEY, tot);
            console.log('result---->', result, wallet?.address, amount, config?.KEY, tot);
            const signhash = await provider.request({
                method: 'personal_sign',
                params: [result, wallet?.address],
            });
            if (signhash) {
                return ({ signhash: signhash, tot: tot })
            } else return undefined

        } catch (error) {
            console.log("error on _signcall", error);
            return undefined
        }
    }


    const GetApproveStatus = async (data, Addr, conWallet) => {

        try {
            var ConnectContract = await contrat_connection(conWallet, ERC721, Addr)
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .isApprovedForAll(accountAddress, network[Network]?.tradeContract)
                    .call()
            return contract_Method_Hash

        }
        catch (e) {
            console.log('Error on GetApproveStatus---->', e);
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

    const SetApproveStatus = async (data, Addr, wallet) => {
        console.log("SETAPPROVETRADE", network[Network]?.tradeContract, accountAddress);
        console.log("sdefsedffe", data, Addr);
        try {


            // .send method

            var ConnectContract = await contrat_connection(wallet, data == 'Single' ? ERC721 : ERC1155, Addr)
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
                        from: accountAddress
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
                        // gas: Web3Utils.toHex(gas_estimate),
                        // gasPrice: Web3Utils.toHex(gasprice)
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
    const approve_721_1155 = async (wallet, token_address, ...data) => {

        console.log("approve data", token_address, ...data)
        try {
            const ConnectContract = await contrat_connection(wallet, DETH, token_address)
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
                        // gas: Web3Utils.toHex(parseFloat(gas_estimate).toString()),
                        // gasPrice: Web3Utils.toHex(parseFloat(gasprice).toString())
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
    const Token_Balance_Calculation = async (token_Address, data, conWallet) => {

        try {
            console.log('adddrreeeessss', token_Address, data)
            const ConnectContract = await contrat_connection(conWallet, DETH, token_Address)
            var bidAMt = await ConnectContract.methods.balanceOf(data).call();

            return Number(Web3Utils.fromWei(String(bidAMt)))
        }
        catch (e) {

            return 0
        }
    }
    var buy_bid_price_calculation = (val, decimal) => {
        try {
            console.log("val", val, decimal)
            var toMid = val * 1000000
            var serfee = (toMid / 100000000) * (Web3Utils.fromWei(String(buyerFees ? buyerFees : 1)) * 1000000)
            var totfee = serfee + toMid
            var tot2cont = Web3Utils.toWei(String(Number(totfee / 1000000)).length > 18 ? String(Number(totfee / 1000000).toFixed(18)) : String(Number(totfee / 1000000)))
            var dec = decimal == 18 ? 18 : 18 - (decimal);
            var aprrove = ((tot2cont) / 10 ** dec)
            return (aprrove)
        } catch (e) {
            console.log('Error on byubidcalcu---->', e);
            return false
        }

    }
    const cancel_order_721_1155 = async (wallet, data) => {
        try {
            var ConnectContract = await contrat_connection(wallet, Market, network[Network]?.tradeContract)
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
                        // gas: Web3Utils.toHex(parseFloat(gas_estimate).toString()),
                        // gasPrice: Web3Utils.toHex(parseFloat(gasprice).toString()),
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
            console.log('Erro on cancel_order_721_1155---->', e);
            return false
        }

    }
    var price_calculation = (data, roy) => {
        try {
            var price = Web3Utils.toWei(data);
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
    const place_order_721_1155 = async (wallet, ...data) => {
        try {
            console.log("network[Network]?.tradeContract", ...data);
            var ConnectContract = await contrat_connection(wallet, Market, network[Network]?.tradeContract)
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
                        // gas: Web3Utils.toHex(gas_estimate),
                        // gasPrice: Web3Utils.toHex(gasprice)
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
    const buy_721_1155 = async (wallet, Send, CoinName, ...data) => {
        try {

            console.log("buy_721_1155logssss", Send, CoinName, ...data, network[Network]?.tradeContract);
            const ConnectContract = await contrat_connection(wallet, Market, network[Network]?.tradeContract)
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
                            // gas: Web3Utils.toHex(gas_estimate),
                            // gasPrice: Web3Utils.toHex(gasprice),
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
    const allowance_721_1155 = async (token_Address, data, trade, conWallet) => {

        try {
            const ConnectContract = await contrat_connection(conWallet, DETH, token_Address)
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
    const accept_721_1155 = async (wallet, ...data) => {
        try {
            console.log("ehjusehfrefrwasDATA", ...data);
            if (web3 != null) {
                const ConnectContract = await contrat_connection(wallet, Market, network[Network]?.tradeContract)
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
                            // gas: Web3Utils.toHex(parseFloat(gas_estimate).toString()),
                            // gasPrice: Web3Utils.toHex(parseFloat(gasprice).toString()),
                        })
                        .on('transactionHash', (transactionHash) => {
                            return transactionHash
                        })
                const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                console.log("receipt_buy", receipt);

                var royalObject = {}

                var TokenCOunts = receipt.logs[data[0] == "Coin" ? 0 : 6]?.topics?.map((val, i) => {
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

    const Current_NFT_Balance = async (ownerdet, data, conWallet) => {

        try {
            var currbalance;
            if ((data.ContractType === "721" || data.ContractType === 721)) {
                console.log("dataindsddas", ERC721, data?.ContractAddress, conWallet)
                const ConnectContract = await contrat_connection(conWallet, ERC721, data?.ContractAddress)
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
            return "false"
        }
    }

    const lazyminting_721_1155 = async (wallet, count, coin, Send, ...data) => {
        console.log("VANTHADATA", accountAddress, wallet, count, coin, Send, ...data)
        var ConnectContract = "";
        try {

            ConnectContract = await contrat_connection(wallet, TradeAbi, config.TradeContract)
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
                    ids.push(Web3Utils.hexToNumber(Number(receipt.logs[i].topics[3])))
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

                var TokenID = Web3Utils.hexToNumber("0x" + sliceee.slice(0, lengthuh))

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

    const nftStakingAndWithdrawAndClaim = async (wallet, method, ...data) => {
        try {
            console.log("...data", ...data);
            if (method == "claimReward") {

            }
            var ConnectContract = await contrat_connection(wallet, StakeAbi, network[Network].stakeContract)
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

    const getStackApproveStatus = async (Addr, wallet) => {
        var ConnectContract = await contrat_connection(wallet, ERC721, Addr)
        var contract_Method_Hash = await
            ConnectContract
                .methods
                .isApprovedForAll(accountAddress, network[Network]?.stakeContract)
                .call()
        console.log("contract_Method_Hash", contract_Method_Hash);
        return contract_Method_Hash
    }

    const setApproveForStack = async (wallet, Addr) => {
        // console.log("sdefsedffe", Addr);
        try {
            var ConnectContract = await contrat_connection(wallet, ERC721, Addr)
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
                        // gas: Web3Utils.toHex(parseFloat(gas_estimate).toString()),
                        // gasPrice: Web3Utils.toHex(parseFloat(gasprice).toString()),
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

    const BidNFt_Contract = async (wallet, value, Method, ...data) => {
        try {
            console.log("...data", ...data);
            var ConnectContract = await contrat_connection(wallet, TradeAbi, config.TradeContract)
            console.log("METODASS", ConnectContract.methods)

            var contractobj = await
                ConnectContract
                    .methods[Method](...data)

            var gasprice = await web3.eth.getGasPrice();

            var gas_estimate = await contractobj.estimateGas({ from: accountAddress, value: data[2] == "Coin" ? value : 0 })

            var contract_Method_Hash = await
                ConnectContract
                    .methods[Method](...data)
                    .send({
                        from: accountAddress,
                        value: data[2] == "Coin" ? value : 0,
                        // gas: Web3Utils.toHex(parseFloat(gas_estimate).toString()),
                        // gasPrice: Web3Utils.toHex(parseFloat(gasprice).toString())
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

    const getAllowance = async (token, wallets) => {
        try {
            let allowance = await allowance_721_1155(token, accountAddress, config.TradeContract, wallets);
            return parseInt(allowance)
        } catch (e) {
            console.log('Error on getAllowance---->', e);
        }
    }

    const getGasFeePer = (key) => {
        try {
            console.log('afhsoifhsoifhsoef---->', key, gasFee);
            switch (key) {
                case "lazyMinting":
                    return parseInt(gasFee?.["lazyMintFee"] || 10)
                case "orderPlace":
                    return parseInt(gasFee?.["placeOrderFee"] || 10)
                case "cancelOrder":
                    return parseInt(gasFee?.["cancelOrderFee"] || 10)
                case "saleToken":
                    return parseInt(gasFee?.["saleFee"] || 10)
                case "saleWithToken":
                    return parseInt(gasFee?.["saleFee"] || 10)
                case "bidNFT":
                    return parseInt(gasFee?.["bidFee"] || 10)
                case "editBid":
                    return parseInt(gasFee?.["editBidFee"] || 10)
                case "cancelBid":
                    return parseInt(gasFee?.["cancelBidFee"] || 10)
                case "cancelBidBySeller":
                    return parseInt(gasFee?.["cancelBid"] || 10)
                case "acceptBId":
                    return parseInt(gasFee?.["acceptBidFee"] || 10)
                default:
                    return parseInt(gasFee?.["lazyMintFee"] || 10);
            }
        } catch (e) {
            console.log('Erro n getGasFeePer---->', e);
            return 1;
        }

    }


    const getGasPriceObj = async (conWallet, contract, method, value, paramForEstimate, ...paramForMethod) => {
        try {
            var contractobj = await
                contract
                    .methods[method](...paramForMethod).encodeABI();
            console.log('paramsForest---->', ...paramForMethod, contractobj, paramForEstimate);
            const provider = await conWallet.getEthereumProvider();
            const nWeb3 = new Web3(provider)

            var gasprice = parseInt(await nWeb3.eth.getGasPrice());
            // var gas_estimate = await contractobj.estimateGas(paramForEstimate);
            var gas_estimate = await nWeb3.eth.estimateGas({ ...paramForEstimate, data: contractobj });

            // let aggresiveGas = gasprice + (gasprice * 50 / 100);
            // console.log("aggresiveGas",aggresiveGas);
            // let aggressiveEst = (parseInt(aggresiveGas) * parseInt(gas_estimate)) / 1e18 // aggresiva ges estimate
            // console.log("aggressiveEst",aggressiveEst,getGasFeePer(method),BNBUSDT);
            // let getMethodFee = ((aggressiveEst * BNBUSDT) * getGasFeePer(method)) / 100; // getPrice of added gas persentage
            // console.log('aggressiveEst---->',aggresiveGas,aggressiveEst,getMethodFee);
            // let totalGasAmount = (aggressiveEst  * BNBUSDT) + getMethodFee // adding percentage to the gas fee
            // let totalValue = (parseInt(value) / 1e18) * BNBUSDT
            // let totalAmount = totalGasAmount + totalValue
            // console.log('--afawdfawfawfawfawfw-->', { gasprice, gas_estimate, totalAmount, totalValue, totalGasAmount, aggresiveGas });
            // return { gasprice, gas_estimate, totalAmount, totalValue, totalGasAmount, aggresiveGas }

            let aggresiveGas = gasprice + (gasprice * (25 / 100));
            // console.log("aggresiveGas", aggresiveGas,gasprice,gas_estimate,gasprice * 20 / 100);
            let aggressiveEst = (parseInt(aggresiveGas) * parseInt(gas_estimate)) / 1e18 // aggresiva ges estimate
            console.log("aggressiveEst", gasprice, aggressiveEst, getGasFeePer(method), BNBUSDT);


            let getMethodFee = aggressiveEst * getGasFeePer(method) / 100; // getPrice of added gas persentage
            console.log('aggressiveEst---->', aggresiveGas, aggressiveEst, getMethodFee);
            let totalGasAmount = (aggressiveEst + getMethodFee) * BNBUSDT // adding percentage to the gas fee
            let totalValue = (parseInt(value) / 1e18) * BNBUSDT
            let totalAmount = (totalGasAmount + totalValue)
            console.log('--afawdfawfawfawfawfw-->', { gasprice, gas_estimate, totalAmount, totalValue, totalGasAmount, aggresiveGas });
            return { gasprice, gas_estimate, totalAmount, totalValue, totalGasAmount, aggressiveEst }

            //old openzep
            // let aggresiveGas = gasprice + (gasprice * 20 / 100)
            // let totalGasAmount = ((parseInt(aggresiveGas) * gas_estimate) / 1e18) * BNBUSDT;
            // let totalValue = (parseInt(value) / 1e18) * BNBUSDT
            // let totalAmount = totalGasAmount + totalValue
            // return { gasprice, gas_estimate, totalAmount, totalValue, totalGasAmount, aggresiveGas }
        } catch (e) {
            // console.log('Error on getGasPriceObj---->', e,"--------------------------------",JSON.stringify(e));
            const ll = JSON?.stringify(e);
            const bb = JSON?.parse(ll);
            console.log('SBBBDDBBD---->', bb);
            toast.error((bb?.cause?.message || bb?.innerError?.message).length > 100 ? (bb?.message || "Error on transaction") : (bb?.cause?.message || bb?.innerError?.message || "Error on transaction"))
        }
    }


    const EIP712Domain = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
    ];

    const ForwardRequest = [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'gas', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint48' },
        { name: 'data', type: 'bytes' },
    ];

    function getMetaTxTypeData(chainId, verifyingContract) {
        return {
            types: {
                EIP712Domain,
                ForwardRequest,
            },
            domain: {
                name: 'ERC2771Forwarder',
                version: '1',
                chainId,
                verifyingContract,
            },
            primaryType: 'ForwardRequest',
        }
    };

    async function signTypedDataOP(connectedWallet, data) {
        try {
            // only metamask
            // const getHash = await new Promise((resolve, reject) => {
            //     web3.currentProvider.sendAsync({ method: "eth_signTypedData_v4", params: [from, JSON.stringify(data)], from: from }, function (err, res) {
            //         if (err) return reject(err.message)
            //         else return resolve(res)
            //     })
            // })
            // console.log('getHash---->', getHash);
            // return getHash

            console.log('web3web3aawdd---->', web3);
            // console.log('DAADAFAD`---->', data, { method: "eth._signTypedData_v4", params: [connectedWallet.address, JSON.stringify(data)], from: connectedWallet.address });
            const provider = await connectedWallet.getEthereumProvider();
            const newWeb3 = new Web3(provider)
            console.log('newWeb3---->', connectedWallet, newWeb3, data);
            const getHash =
                connectedWallet.walletClientType == "privy" ?
                    await signTypedData(data) // for embedded wallets
                    :
                    await provider.request({ // for external wallets ex: metamask
                        method: 'eth_signTypedData_v4',
                        params: [connectedWallet.address, JSON.stringify(data)],
                    })
            console.log('getHash---->', getHash);
            return getHash
        } catch (error) {
            console.log("err on signTypedData", error);
            toast.error(getErrorForToast(error.toString()))
            return false
        }

    }


    const gasLessTransaction = async (method, value, count, conWallet, ...params) => {

        try {
            console.log('method, value, data, ...params---->', method, value, count, ...params);

            if (method != 'approve' && method != "setApprovalForAll") {
                const getApproveStatus = await validateApproveforUSDT(spareAmount, count == "stake", conWallet, USDTaddress)
                if (!getApproveStatus) return false;

                console.log('asdfesfse---->', method, value, count, params);

                var ConnectContract = await contrat_connection(
                    conWallet,
                    method == "setApprovalForAll" ?
                        ERC721 :
                        count == "stake" ?
                            StakeAbi : TradeAbi,
                    method == "setApprovalForAll" ?
                        params[0] :
                        count == "stake" ?
                            network[Network]?.stakeContract :
                            config.TradeContract);

                let additionalParams = method == "setApprovalForAll" ?
                    [count == "stake" ? network[Network]?.stakeContract : config.TradeContract, true] : params;

                var gas = await getGasPriceObj(
                    conWallet,
                    ConnectContract,
                    method,
                    value,
                    {
                        from: conWallet?.address, value: value,
                        to: method == "setApprovalForAll" ? params[0] :
                            method == "approve" ? USDTaddress :
                                count == "stake" ? network[Network]?.stakeContract : config.TradeContract
                    },
                    ...additionalParams);

                if (!gas?.gas_estimate) return false

                console.log('gasgasgas---->', gas);
                // if (method == "bidNFT" || method == "editBid") params[params.length - 2] = Web3Utils.toWei(String(gas.totalGasAmount?.toFixed(14)));
                params[params.length - 1] = Web3Utils.toWei(String(gas.totalAmount?.toFixed(14)));
            }

            console.log('paramsForest',
                (method == "setApprovalForAll" ?
                    ERC721 :
                    method == "approve" ?
                        DETH :
                        count == "stake" ?
                            StakeAbi : TradeAbi).find(val => val.name == method),
                // method == "setApprovalForAll" ?
                //     [count == "stake" ? network[Network]?.stakeContract : config.TradeContract, true]
                //     :
                //     method == "approve" ?
                //         [params[1], params[2]] :
                //         [...params]
                method == "setApprovalForAll" ?
                    [count == "stake" ? network[Network]?.stakeContract : config.TradeContract, true]
                    : [...params]
            );

            let encodeData = await web3.eth.abi.encodeFunctionCall(
                (method == "setApprovalForAll" ?
                    ERC721 :
                    method == "approve" ?
                        DETH :
                        count == "stake" ?
                            StakeAbi : TradeAbi).find(val => val.name == method),
                // method == "setApprovalForAll" ?
                //     [count == "stake" ? network[Network]?.stakeContract : config.TradeContract, true]
                //     :
                //     method == "approve" ?
                //         [params[1], params[2]] :
                //         [...params]
                method == "setApprovalForAll" ?
                    [count == "stake" ? network[Network]?.stakeContract : config.TradeContract, true]
                    : [...params]
            );

            var ConnectContract = await contrat_connection(conWallet, ForwardAbi, config.FORWARDER_ADDRESS);
            const deadline = new Date().setMinutes(new Date().getMinutes() + 5);

            const nonce = await ConnectContract.methods.nonces(conWallet.address).call()
            var input = {
                to: method == "setApprovalForAll" ? params[0] :
                    method == "approve" ? params[0] :
                        count == "stake" ? network[Network]?.stakeContract : config.TradeContract,
                from: conWallet.address,
                data: encodeData,
                value: value.toString(),
                gas: 1e6,
                nonce: parseInt(nonce),
                deadline
            }

            console.log('nonce---->', nonce);
            const typeData = getMetaTxTypeData(config.CHAIN_ID, config.FORWARDER_ADDRESS);
            const toSign = { ...typeData, message: input };
            console.log('toSign---->', toSign);
            const signature = await signTypedDataOP(conWallet, toSign);
            if (!signature) return false;
            const setData = { ...input, signature }
            console.log('setData---->', setData);

            if (method != "setApprovalForAll") return {
                status: "pending",
                data: setData
            }; // returning for backend

            const getData = await fetch(config.RELAYER_URL, {
                method: 'POST',
                body: JSON.stringify({
                    apiKey: config.RELAYER_API_KEY,
                    apiSecret: config.RELAYER_API_SECRET,
                    request: setData
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
                    for (let i = 0; i < count; i++) {
                        ids.push(Web3Utils.hexToNumber(Number(receipt.logs[i].topics[3])))
                    }
                    var need_data = {
                        status: receipt.status,
                        HashValue: receipt.transactionHash,
                        Tokenid: ids
                    }
                    return need_data
                    // return {status:"pending"}
                } else if (method == "saleToken" || method == "saleWithToken") {

                    var royalObject = {}

                    var TokenCOunts = receipt.logs[count]?.topics?.map((val, i) => {
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

                } else {
                    var need_data = {
                        status: receipt.status,
                        HashValue: receipt.transactionHash
                    }
                    return need_data
                }
            } else if (parseData?.status == "pending") {
                return {
                    status: "pending"
                }
            } else {
                return false
            }
        } catch (e) {
            console.log("err on gasLessTransaction", e);
            toast.error(getErrorForToast(e.toString()))
            return false;
        }



    }

    const validateApproveforUSDT = async (amount, stake, conWallet, tokenAddress) => {
        try {

            var ContractCreate = await contrat_connection(conWallet, DETH, tokenAddress);

            let allowance = await allowance_721_1155(tokenAddress, conWallet.address, stake ? network[Network]?.stakeContract : config.TradeContract, conWallet)

            // let TokenContract = getThirdweb.createContract({ address: USDTaddress, abi: DETH })
            // let allowance = await getThirdweb.ReadContract(TokenContract, "allowance", accountAddress, stake ? network[Network]?.stakeContract : config.TradeContract);
            console.log('allowance---->', amount, stake, conWallet, tokenAddress, allowance);

            if (allowance <= (parseFloat(amount) ?? 0) || allowance == 0) {
                var id = toast.loading("Approve token...");
                // const getApprove = await gasLessTransaction("approve", 0, 0, stake ? network[Network]?.stakeContract : config.TradeContract, "1000000000000000000000000000000000000000000000000")

                // var contractobj = await getThirdweb.prepareContract(TokenContract, "approve", 0, stake ? network[Network]?.stakeContract : config.TradeContract, "1000000000000000000000000000000000000000000000000")

                var contractobj = await
                    ContractCreate
                        .methods
                        .approve(stake ? network[Network]?.stakeContract : config.TradeContract, "1000000000000000000000000000000000000000000000000");
                var gasprice = await web3.eth.getGasPrice();
                var gas_estimate = await contractobj.estimateGas({ from: conWallet.address })
                // var gas_estimate = await getThirdweb.getGasEstimate(contractobj)
                // console.log('gas_estimate---->', gas_estimate);

                // var contract_Method_Hash = await getThirdweb.WriteContract(contractobj)
                // if (contract_Method_Hash) {
                //     toast.update(id, { type: "success", isLoading: false, closeButton: true, render: "Approved successfully", autoClose: 1000 })
                //     return true
                // }
                // else return false
                var contract_Method_Hash = await
                    ContractCreate
                        .methods
                        .approve(stake ? network[Network]?.stakeContract : config.TradeContract, "1000000000000000000000000000000000000000000000000")
                        .send({
                            from: conWallet.address,
                            // gas: web3.utils.toHex(gas_estimate),
                            // gasPrice: web3.utils.toHex(gasprice),
                        }).on('transactionHash', (transactionHash) => {
                            return transactionHash
                        });
                console.log('contract_Method_Hash---->', contract_Method_Hash);
                toast.update(id, { type: "success", isLoading: false, closeButton: true, render: "Approved successfully", autoClose: 1000 })
                return true
            }
            else if (allowance >= (parseFloat(amount ?? 0))) return true;
            else return false;
            // return false;
        } catch (e) {
            console.log('Error when approve contract---->', e);
            if (id) toast.update(id, { type: "error", isLoading: false, closeButton: true, render: "Approved Failed", autoClose: 1000 });
            return false
        }
    }

    const connectPrivyWalllet = async (type) => {
        try {
            var accountDetails = {}
            const wallet = wallets[0];
            const provider = await wallet.getEthereumProvider();
            console.log('providerprovider---->', provider);
            const web3 = new Web3(provider);
            const web3p = new Web3(config.RPC_URL)
            const address = wallet.address

            accountDetails.accountAddress = address?.toString()?.toLowerCase();
            localStorage.setItem("accountInfo", address)
            localStorage.setItem('walletConnectType', type);

            accountDetails.coinBalance = await web3p.eth.getBalance(address) / 1e18
            accountDetails.web3p = web3p;
            accountDetails.web3 = web3;
            accountDetails.tokenBalance = 0
            accountDetails.BNBUSDT = parseFloat(await getBNBvalue("BNBUSDT"))
            console.log("acocococococo", accountDetails);
            let CONTRACT = new web3p.eth.Contract(TradeAbi, config.TradeContract);

            accountDetails.USDTaddress = CONTRACT.methods?.["staticToken"] ? await CONTRACT.methods?.staticToken()?.call() : config.STATIC_TOKEN
            console.log("acocococococo", accountDetails);
            return accountDetails;
        } catch (e) {
            console.log('Error on connectPrivyWalllet---->', e);
        }
    }

    const TransferToken = async (wallet, ...data) => {
        try {
            var ConnectContract = await contrat_connection(wallet, TradeAbi, network[Network]?.tradeContract)
            var contractobj = await
                ConnectContract
                    .methods
                    .TransferToken(...data)
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: accountAddress })
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .TransferToken(...data)
                    .send({
                        from: accountAddress,
                        gas: Web3Utils.toHex(parseFloat(gas_estimate).toString()),
                        gasPrice: Web3Utils.toHex(parseFloat(gasprice).toString()),
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
            console.log('Erro on transferToken---->', e);
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
        BidNFt_Contract,
        gasLessTransaction,
        validateApproveforUSDT,
        getAllowance,
        connectPrivyWalllet,
        contrat_connection,
        TransferToken,
        _signcall
    };




}
