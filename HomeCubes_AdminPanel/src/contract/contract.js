import React from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import randomInteger from 'random-int';
import TradeAbi from '../ABI/trade.json';
import config from '../lib/config';
import TokenAbi from '../ABI/TokenAbi.json';


export default function useContractHook() {
    const { providers, UserAccountAddr, web3, web3p } = useSelector((state) => state.wallet_detail)

    const _signcall = async (NFTFormValue) => {
        try {

            if (web3) {
                const passwords = require('secure-random-password');
                var randomNum = randomInteger(10000000, 100000000);

                var TokenPrice = NFTFormValue.NFTPrice

                var password;
                try {
                    password = passwords.randomPassword({ length: 10, characters: [passwords.lower, passwords.upper, passwords.digits] });
                }
                catch (err) {
                    console.log('error on passwords.randomPassword', err)
                }
                console.log("passwordddd", password, TokenPrice);

                var web3RpcPro = new Web3(providers.providers);

                const to = UserAccountAddr
                const _amount = (TokenPrice == "" || TokenPrice == undefined) ? 0 : web3.utils.toWei(String(TokenPrice));
                console.log("ajhghjas", _amount);
                const _nonce = Date.now();
                var tot = _nonce + Number(randomNum);
                console.log("qwewqeqwewqeqweasdas", to, _amount, password, tot);
                const result = web3RpcPro.utils.soliditySha3(to, _amount, password, tot);
                console.log("asdsadasfdafaf", result);
                const signhash = await web3.eth.personal.sign(result, to);
                console.log("Signature", result, signhash)
                if (signhash) {
                    return ({ signhash: signhash, tot: tot, password: password })
                }

            }
        } catch (error) {
            console.log("error on _signcall", error);
        }
    }

    const contrat_connection = async (...data) => {
        console.log('ddddaaattaaaa', ...data, web3, UserAccountAddr, web3p);
        if (web3) {
            var contract_value = await new web3.eth.Contract(
                ...data
            );
            return contract_value;
        }
    }

    const createCollection = async (data) => {
        console.log("dadawdawd", ...data);
        try {
            const ConnectContract = await contrat_connection(TradeAbi, config.tradeAddress)
            console.log("ConnectContract", ConnectContract, UserAccountAddr, config.tradeAddress);

            var contractobj = await
                ConnectContract
                    .methods
                    .createCollection(...data)
            console.log("contractobj", contractobj);
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: UserAccountAddr })
            console.log("dfsfgsdfg", gas_estimate, gasprice);
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .createCollection(...data)
                    .send({
                        from: UserAccountAddr,
                        gasLimit: parseInt(gas_estimate),
                        gasPrice: gasprice,
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            console.log("receiptafawdawdawd", receipt);
            // const receipt = await get_receipt(contract_Method_Hash?.transactionHash ? contract_Method_Hash?.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
                contractaddress: web3p.eth.abi.decodeParameter("address", receipt?.logs?.[0]?.topics?.[1])
            }
            return need_data
        } catch (e) {
            console.log("err on create collection", e);
            return {
                status: false
            }
        }
    }

    const get_receipt = async (HashValue) => {
        var receipt = await web3.eth.getTransactionReceipt(HashValue);
        if (receipt) {
            return receipt
        }
        else {
            get_receipt(HashValue)
        }
    }

    const changeReceiver = async (...data) => {
        try {
            const ConnectContract = await contrat_connection(TradeAbi, config.tradeAddress)
            console.log("ConnectContract", ConnectContract);

            var contractobj = await
                ConnectContract
                    .methods
                    .changeRoyaltyReceiver(...data)
            console.log("contractobj", contractobj);
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: UserAccountAddr })
            console.log("dfsfgsdfg", gas_estimate, gasprice);
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .changeRoyaltyReceiver(...data)
                    .send({
                        from: UserAccountAddr,
                        gasLimit: parseInt(gas_estimate),
                        gasPrice: gasprice,
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            // const receipt = await get_receipt(contract_Method_Hash?.transactionHash ? contract_Method_Hash?.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        } catch (error) {
            console.log("err on changeReceiver", error);
        }
    }

    const adminlazyminting_721_1155 = async (count, type, coin, Send, ...data) => {
        console.log("vvvdfddfffv", ...data)
        var ConnectContract = "";
        try {

            ConnectContract = await contrat_connection(TradeAbi, config.tradeAddress)
            var contract_Method_Hash
            console.log("METODASS", ConnectContract.methods)
            contract_Method_Hash = await
                ConnectContract
                    .methods
                    .adminLazyMinting(...data)
                    .send({
                        from: UserAccountAddr
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            console.log("contract_Method_Hash", contract_Method_Hash);

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            console.log("BUYMINTHASH", receipt)
            var ids = []
            if (count != "") {
                for (let i = 0; i < count; i++) {
                    ids.push(web3.utils.hexToNumber(Number(receipt.logs[i].topics[3])))
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

                var TokenID = web3.utils.hexToNumber("0x" + sliceee.slice(0, lengthuh))

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

    const getTokenName = async (data) => {
        try {
            const tokenContract = await contrat_connection(TokenAbi, data);
            console.log('tokenContract---->', tokenContract, "ajjwkjawkh", data);
            const getname = await tokenContract.methods.name().call()
            const getdeci = await tokenContract.methods.decimals().call()
            const getSymbol = await tokenContract.methods.symbol().call()
            console.log('tokenContract---->', tokenContract, getname);
            return { name: getname, decimal: getdeci, symbol: getSymbol }
        } catch (e) {
            console.log('Error on gettoken---->', e);
            return false
        }
    }

    const setGasToken = async (data) => {
        try {

            const ConnectContract = await contrat_connection(TradeAbi, config.tradeAddress)
            console.log("ConnectContract", data,config?.stakeAddress);

            var contractobj = await
                ConnectContract
                    .methods
                    .setStaticToken(data,config?.stakeAddress)
            console.log("contractobj", contractobj);
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: UserAccountAddr })
            console.log("dfsfgsdfg", gas_estimate, gasprice);
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .setStaticToken(data,config?.stakeAddress)
                    .send({
                        from: UserAccountAddr,
                        gasLimit: parseInt(gas_estimate),
                        gasPrice: gasprice,
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            // const receipt = await get_receipt(contract_Method_Hash?.transactionHash ? contract_Method_Hash?.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        } catch (error) {
            console.log("err on changeReceiver", error);
            return  {
                status: false
            }
        }
    }

    const AddTokenType = async (...data) => {
        try {

            const ConnectContract = await contrat_connection(TradeAbi, config.tradeAddress)
            console.log("ConnectContract", ConnectContract);

            var contractobj = await
                ConnectContract
                    .methods
                    .addTokenType(...data)
            console.log("contractobj", contractobj);
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: UserAccountAddr })
            console.log("dfsfgsdfg", gas_estimate, gasprice);
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .addTokenType(...data)
                    .send({
                        from: UserAccountAddr,
                        gasLimit: parseInt(gas_estimate),
                        gasPrice: gasprice,
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            // const receipt = await get_receipt(contract_Method_Hash?.transactionHash ? contract_Method_Hash?.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        } catch (error) {
            console.log("err on changeReceiver", error);
        }
    }

    const getContractBalance = async (data) => {
        try {
            const tokenContract = await contrat_connection(TokenAbi, data);
            console.log('tokenContract---->', tokenContract, data);
            const resp = await tokenContract.methods.balanceOf(config.tradeAddress).call();
            console.log('respadad balance---->', resp);
            return resp
        } catch (e) {
            console.log('Erro on getContractBalance---->', e);
            return false
        }

    }

    const withDrawProfit = async (data) => {
        try {
            const ConnectContract = await contrat_connection(TradeAbi, config.tradeAddress);

            var contractobj = await
                ConnectContract
                    .methods
                    .withdrawAdminGasProfit(...data)
            console.log("contractobj", contractobj);
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: UserAccountAddr })
            console.log("dfsfgsdfg", gas_estimate, gasprice);
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .withdrawAdminGasProfit(...data)
                    .send({
                        from: UserAccountAddr,
                        gasLimit: parseInt(gas_estimate),
                        gasPrice: gasprice,
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            console.log("receiptafawdawdawd", receipt);
            // const receipt = await get_receipt(contract_Method_Hash?.transactionHash ? contract_Method_Hash?.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash
            }
            return need_data
        } catch (e) {
            console.log('Erro on withDrawProfit---->', e);
            return {
                status: false
            }
        }
    }

    const getReffaralFees = async (data) => {
        try {
            const tokenContract = await contrat_connection(TradeAbi, config.tradeAddress)
            console.log('tokenContract---->', tokenContract, data);
            const resp = await tokenContract.methods.referralFees().call();
            console.log('respadad balance---->', resp);
            return resp
        } catch (e) {
            console.log('Erro on getReffaralFees---->', e);
            return false
        }

    }

    const changeRefferalFee = async (data) => {
        try {
            const ConnectContract = await contrat_connection(TradeAbi, config.tradeAddress)
            console.log("ConnectContract", ConnectContract);

            var contractobj = await
                ConnectContract
                    .methods
                    .referralFeeEdit(data)
            console.log("contractobj", contractobj);
            var gasprice = await web3.eth.getGasPrice();
            var gas_estimate = await contractobj.estimateGas({ from: UserAccountAddr })
            console.log("dfsfgsdfg", gas_estimate, gasprice);
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .referralFeeEdit(data)
                    .send({
                        from: UserAccountAddr,
                        gasLimit: parseInt(gas_estimate),
                        gasPrice: gasprice,
                    })
                    .on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            // const receipt = await get_receipt(contract_Method_Hash?.transactionHash ? contract_Method_Hash?.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        } catch (error) {
            console.log("err on changeReceiver", error);
        }
    }

    return {
        _signcall,
        createCollection,
        changeReceiver,
        adminlazyminting_721_1155,
        setGasToken,
        getTokenName,
        AddTokenType,
        getContractBalance,
        withDrawProfit,
        getReffaralFees,
        changeRefferalFee
    }

}