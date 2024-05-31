import React from "react";
import { useActiveAccount, useActiveWallet, useActiveWalletChain, useActiveWalletConnectionStatus, useConnectedWallets, useDisconnect, useSetActiveWallet, useSwitchActiveWalletChain } from "thirdweb/react";
import { client } from "../App";
import { estimateGas, getContract, hexToNumber, prepareContractCall, readContract, resolveMethod, sendAndConfirmTransaction, toWei } from "thirdweb";
import { defineChain, sepolia } from "thirdweb/chains";
import { useSelector } from "react-redux";
import { network } from "../config/network";
import config from "../config/config";
import DETH from '../Abi/erc20.json';
import TradeAbi from '../Abi/trade.json';
import StakeAbi from '../Abi/stakeAbi.json';
import ERC721 from '../Abi/erc721.json'
import ERC1155 from '../Abi/erc1155.json'
import { toast } from "react-toastify";
import { hexToNumberString } from "web3-utils";
import { getErrorForToast, sleep } from "./common";

let spareAmount = "25000000000000000000"


export default function useThirdWeb() {

    const smartAccount = useActiveAccount();
    const { disconnect } = useDisconnect();
    const connectedWallets = useConnectedWallets();

    // useSetActiveWallet()


    const { Network } = useSelector(
        (state) => state.LoginReducer
    );
    const { accountAddress, web3, web3p, coinBalance, USDTaddress, BNBUSDT } = useSelector(state => state.LoginReducer.AccountDetails);
    const { sellerFees, buyerFees } = useSelector(state => state.LoginReducer.ServiceFees);
    const { payload, token, gasFee } = useSelector((state) => state.LoginReducer.User);
console.log('FFAFAFAADADADDD---->',gasFee);

    const getGasFeePer = (key) => {
        try {
            console.log('afhsoifhsoifhsoef---->',key,gasFee);
            switch (key) {
                case "lazyMinting":
                    return parseInt(gasFee?.["lazyMintFee"] || 10)
                case "orderPlace":
                    return parseInt(gasFee?.["placeOrderFee"]|| 10)
                case "cancelOrder":
                    return parseInt(gasFee?.["cancelOrderFee"]|| 10)
                case "saleToken":
                    return parseInt(gasFee?.["saleFee"]|| 10)
                case "saleWithToken":
                    return parseInt(gasFee?.["saleFee"]|| 10)
                case "bidNFT":
                    return parseInt(gasFee?.["bidFee"]|| 10)
                case "editBid":
                    return parseInt(gasFee?.["editBidFee"]|| 10)
                case "cancelBid":
                    return parseInt(gasFee?.["cancelBidFee"]|| 10)
                case "cancelBidBySeller":
                    return parseInt(gasFee?.["cancelBid"]|| 10)
                case "acceptBId":
                    return parseInt(gasFee?.["acceptBidFee"]|| 10)
                default:
                    return parseInt(gasFee?.["lazyMintFee"]|| 10);
            }
        } catch (e) {
            console.log('Erro n getGasFeePer---->', e);
            return 1;
        }

    }
    const getSmartAccount = () => {
        return smartAccount;
    }

    const disconnectWallet = () => {
        if (connectedWallets.length == 0) return
        return disconnect(connectedWallets[0])
    }

    const createContract = (props) => {
        return getContract({
            client,
            chain: sepolia,
            ...props
        });
    }

    const getAdminAccountOfSmartWallet = async () => {
        try {
            console.log('getSmartAccount().address---->', getSmartAccount().address);
            const contract = createContract({ address: getSmartAccount().address })
            return await ReadContract(contract, "getAllAdmins", [])
        } catch (e) {
            console.log('Error getAdminAccountOfSM---->', e);
        }
    }

    const ReadContract = async (contract, method, ...params) => {
        try {
            return await readContract({
                contract,
                method: resolveMethod(method),
                params: params
            });
        } catch (e) {
            console.log('Error on ReadContract---->', e);
            return false;
        }
    }

    const valuuu = async () => {
        try {
            console.log('getSmartAccount().address---->', getSmartAccount().address);
            const contract = getContract({
                client,
                chain: defineChain(11155111),
                address: getSmartAccount().address
            });
            console.log('contracaaaaaaaat---->', contract?.account);
            const valllll = await readContract({
                contract,
                method: resolveMethod("getAllAdmins"),
                params: []
            });


            console.log('Vallllllll---->', valllll);
        } catch (error) {
            console.log('Errrr---->', error);
        }

    }


    const WriteContract = async (tx) => {
        try {
            console.log('smartAccountsmartAccount---->', smartAccount, tx);
            return await sendAndConfirmTransaction({
                transaction: tx,
                account: smartAccount,
            });
        } catch (e) {
            console.log('Erroro---->WriteCnonte', e);
            return false
        }
    }

    const prepareContract = async (contract, method, value, ...params) => {
        try {
            return prepareContractCall({
                contract,
                method: resolveMethod(method),
                params: params,
                value
            });
        } catch (e) {
            console.log('error on WriteContract---->', e);
            return false
        }
    }

    const getGasEstimate = async (tx) => {
        try {
            console.log('txtxtx---->', tx,smartAccount);
            return await estimateGas({
                transaction: tx,
                from: smartAccount.address
            })
        } catch (e) {
            console.log('Error on getGasEstimate---->', e.toString());
            toast.error(getErrorForToast(e.toString()) || "Error on transaction")
            return false
        }
    }

    const getGasPriceObjInThirdweb = async (contract, value, method) => {
        try {
            var gasprice = parseInt(await web3.eth.getGasPrice());
            console.log("gasprice",gasprice);
            var gas_estimate = await getGasEstimate(contract);
            console.log("gas_estimate",gas_estimate);
            let aggresiveGas = gasprice + (gasprice * 50 / 100);
            console.log("aggresiveGas",aggresiveGas);
            let aggressiveEst = (parseInt(aggresiveGas) * parseInt(gas_estimate)) / 1e18 // aggresiva ges estimate
            console.log("aggressiveEst",aggressiveEst,getGasFeePer(method),BNBUSDT);
            let getMethodFee = ((aggressiveEst * BNBUSDT) * getGasFeePer(method)) / 100; // getPrice of added gas persentage
            console.log('aggressiveEst---->',aggresiveGas,aggressiveEst,getMethodFee);
            let totalGasAmount = (aggressiveEst  * BNBUSDT) + getMethodFee // adding percentage to the gas fee
            let totalValue = (parseInt(value) / 1e18) * BNBUSDT
            let totalAmount = totalGasAmount + totalValue
            console.log('--afawdfawfawfawfawfw-->', { gasprice, gas_estimate, totalAmount, totalValue, totalGasAmount, aggresiveGas });
            return { gasprice, gas_estimate, totalAmount, totalValue, totalGasAmount, aggresiveGas }
        } catch (e) {
            console.log('getGasPriceObjInThirdweb---->', e);
            return false
        }

    }

    const trasferGasFees = async (amount) => {
        try {
            var id = toast.loading("Paying gas...")
            let Contract = createContract({ address: config.TradeContract, abi: TradeAbi })
            const prePareForCall = await prepareContract(Contract, "transferStaticToken", 0, accountAddress, amount);
            const receipt = await WriteContract(prePareForCall);
            console.log('receiptreceipt---->', receipt);
            toast.update(id, { isLoading: false, type: "success", autoClose: 1000, render: "Success" })
            if (receipt) return true
        } catch (e) {
            console.log('Error on trasferGasFees---->', e);
            toast.update(id, { isLoading: false, type: "success", autoClose: 1000, render: "Success" })
            return false
        }
    }

    const signTypedDataInThirdweb = async (data) => {
        try {
            return await smartAccount.signTypedData(data)
        } catch (e) {
            console.log('Error SignTypedData---->', e);
            return false
        }
    }

    const getAllowance = async (token) => {
        try {
            let TokenContract = createContract({ address: token, abi: DETH })
            let allowance = await ReadContract(TokenContract, "allowance", accountAddress, config.TradeContract);
            return parseInt(allowance)
        } catch (e) {
            console.log('Error on getAllowance---->', e);
        }
    }

    const checkBalance = async (token, amount) => {
        try {
            let TokenContract = createContract({ address: token, abi: DETH })
            let balance = await ReadContract(TokenContract, "balanceOf", accountAddress);
            console.log('balancebalance---->', balance);
            return parseFloat(balance) > parseFloat(amount)
        } catch (e) {
            console.log('Erorr on checkbalance---->', e);
        }
    }

    const useContractCall = async (method, value, data, ...params) => {
        try {
            console.log('method, value, data, ...params---->', method, value, data, ...params);
            const getApproveStatus = await validateApproveforUSDT(spareAmount, data == "stake") // validation for allowance.
            if (!getApproveStatus) return false;

            var ConnectContract = createContract( // create contract instance using address and abi.
                {
                    address:
                        method == "setApprovalForAll" ?
                            params[0] :
                            method == "approve" ?
                                data :
                                data == "stake" ?
                                    network[Network]?.stakeContract :
                                    config.TradeContract,
                    abi: (method == "setApprovalForAll" || method == "approve") ?
                        ERC721 :
                        data == "stake" ?
                            StakeAbi : TradeAbi,
                }
            );
            console.log('ConnectContract---->', ConnectContract);

            const prePareForgas = await prepareContract(ConnectContract, method, 0, ...params); // preparing contract for gas estimation
            console.log('prePare---->', prePareForgas);
            if (!prePareForgas) return false

            var gas = await getGasPriceObjInThirdweb(prePareForgas, value, method); // getting gas price and all the price.

            if (!gas?.gas_estimate) return false
            if (method != 'approve' && method != "setApprovalForAll") {
                console.log('gasgasgas---->', gas);
                if (method == "bidNFT" || method == "editBid") params[params.length - 3] = web3.utils.toWei(String(gas.totalGasAmount)); // gas price for transaction
                params[params.length - 2] = gasFee?.collectAddress || config.TradeContract;
                params[params.length - 1] = web3.utils.toWei(String(gas.totalAmount)); // gas price + value for all the transaction
            }

            let validateBal = await checkBalance(USDTaddress, gas.totalAmount) // Checking if the address have enough amount to do the transaction.
            if (!validateBal) {
                toast.error("Insufficient amount for transaction") // returns error if false.
                return false
            }

            let additionalParams = method == "setApprovalForAll" ?
                [data == "stake" ? network[Network]?.stakeContract : config.TradeContract, true] : params;
            console.log('...params aftere get gas---->', ...params, additionalParams);

            const prePareForCall = await prepareContract(ConnectContract, method, 0, ...additionalParams); // prepare contract for final transaction

            const receipt = await WriteContract(prePareForCall); // Write transaction in block
            if (!receipt) return false

            if (method == 'approve' || method == "setApprovalForAll") { // getting gas amount for other contract intraction.
                console.log('method---->', method);
                const trans = await trasferGasFees(web3.utils.toWei(String(gas.totalAmount)))
            }
            console.log('receipt---->', receipt);

            if (method == "lazyMinting") {
                var ids = []

                for (let i = 0; i < receipt?.logs?.length; i++) {
                    if (i % 2 != 0) {
                        ids.push(hexToNumber(receipt.logs[i].topics[3]));
                        console.log('llllllllll---->', hexToNumber(receipt.logs[i].topics[3]), ids, data);
                        if (ids.length == data) {
                            break;
                        }
                    }
                }
                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash,
                    Tokenid: ids
                }
                return need_data
            } else if (method == "saleToken" || method == "saleWithToken") {

                var royalObject = {}

                var TokenCOunts = receipt.logs[data]?.topics?.map((val, i) => {
                    if (i == 1) {
                        const address = web3p.eth.abi.decodeParameter("address", val);
                        console.log("__address", address);
                        royalObject[i] = address
                    }
                    else if (i > 1) {
                        console.log("aiwufaiwuf");
                        const value = hexToNumberString(val);
                        console.log("value__", value);
                        royalObject[i] = value
                    }
                })

                console.log("royalObject", receipt.logs[data]?.topics, royalObject);
                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash,
                    royaltyInfo: royalObject
                }
                console.log("need_data_saleToken", need_data);
                sleep(3000)
                return need_data

            } else if (method == "acceptBId") {
                var royalObject = {}

                var TokenCOunts = receipt.logs[1]?.topics?.map((val, i) => {
                    if (i == 1) {
                        const address = web3p.eth.abi.decodeParameter("address", val);
                        console.log("__address", address);
                        royalObject[i] = address
                    }
                    else if (i > 1) {
                        console.log("aiwufaiwuf");
                        const value = hexToNumberString(val);
                        console.log("value__", value);
                        royalObject[i] = value
                    }
                })


                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash,
                    royaltyInfo: royalObject
                }
                console.log('need_data accept---->', need_data);
                sleep(3000)

                return need_data

            } else {
                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash
                }
                return need_data
            }

        } catch (e) {
            console.log('Error on useContractCall---->', e);
            return false;
        }
    }

    const validateApproveforUSDT = async (amount, stake) => {
        try {

            let TokenContract = createContract({ address: USDTaddress, abi: DETH })
            let allowance = await ReadContract(TokenContract, "allowance", accountAddress, stake ? network[Network]?.stakeContract : config.TradeContract);
            console.log('allowance---->', allowance, amount);

            if (parseInt(allowance) < (parseFloat(amount) ?? 0) || allowance == 0) {  //This condition triggers, if the address doesn't have enough allowance.
                var id = toast.loading("Approve token...");
                var contractobj = await prepareContract(TokenContract, "approve", 0, stake ? network[Network]?.stakeContract : config.TradeContract, "1000000000000000000000000000000000000000000000000")
                var contract_Method_Hash = await WriteContract(contractobj)
                if (contract_Method_Hash) {
                    toast.update(id, { type: "success", isLoading: false, closeButton: true, render: "Approved successfully", autoClose: 1000 })
                    return true
                }
                else return false
            }
            else if (allowance >= (parseFloat(amount ?? 0))) return true; // if the address have enough approve and allowance it returns true
            else {                                                        // if the address doesn't have enough allowance.
                toast.error("Insufficient amount for transaction");
                return false;
            }
        } catch (e) {
            console.log('validateApproveforUSDT---->', e);
            if (id) toast.update(id, { type: "error", isLoading: false, closeButton: true, render: "Approved Failed", autoClose: 1000 });
            return false
        }
    }


    return {
        getSmartAccount,
        disconnectWallet,
        createContract,
        ReadContract,
        WriteContract,
        useContractCall,
        prepareContract,
        getGasEstimate,
        signTypedDataInThirdweb,
        getAllowance,
        checkBalance,
        getAdminAccountOfSmartWallet,
        valuuu
    };
}