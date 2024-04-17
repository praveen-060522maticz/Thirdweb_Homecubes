import Web3 from "web3";
import Web3Utils from "web3-utils";

import { useInstance } from "./useContractInstance.js";
import config from '../lib/config'

export const Mint = async (type,Sel,from, provider, ...data) => {
  console.log("i/p data to mint", ...data);
  var web3 = new Web3(data.provider);
  var Contract = await useInstance(provider);
  console.log("contractdata", Contract);

  try {
    var resp = await Contract.methods
      .minting(...data)
      .send({ from: from })
      .on("transactionHash", (transactionHash) => {
        console.log("hasdh", transactionHash);
        return transactionHash;
      });

    if (resp) {
      const receipt = await UseReceipt(
        { provider },
        resp.transactionHash ? resp.transactionHash : resp
      );

      if (receipt) {
        console.log("receipt", receipt);
        var tokenIDReceipt = {
          status: receipt.status,
          HashValue: receipt.transactionHash,
          tokenId: Web3Utils.hexToNumber(
            type == 721 ? receipt.logs[2].topics[3]: (Sel ? receipt.logs[3].topics[3] : receipt.logs[3].topics[2] )
          ),
        };
        console.log("rok id rept", tokenIDReceipt);
        return tokenIDReceipt;
      }
    }
  } catch (err) {
    console.log("err in mintin", err);
  }
};

export const Transfer = async (from, provider, ...data) => {
  console.log("i/p data to mint", ...data);
  var web3 = new Web3(data.provider);
  var Contract = await useInstance(provider);
  console.log("contractdata", Contract);

  try {
    var resp = await Contract.methods
      ._transferNFT(...data)
      .send({ from: from })
      .on("transactionHash", (transactionHash) => {
        console.log("hasdh", transactionHash);
        return transactionHash;
      });

    if (resp) {
      const receipt = await UseReceipt(
        { provider },
        resp.transactionHash ? resp.transactionHash : resp
      );

      if (receipt) {
        console.log("receipt", receipt);
        var tokenIDReceipt = {
          status: receipt.status,
          HashValue: receipt.transactionHash,
          tokenId: data[1],
        };
        console.log("rok id rept", tokenIDReceipt);
        return tokenIDReceipt;
      }
    }
  } catch (err) {
    console.log("err in mintin", err);
  }
};

export const UseReceipt = async (data, HashValue) => {
  var web3 = new Web3(data.provider);
  var receipt = await web3.eth.getTransactionReceipt(HashValue);
  if (receipt) {
    return receipt;
  } else {
    UseReceipt(HashValue);
  }
};

export const useServiceFee = async (data,chain) => {
  console.log("provider sfsfdsfsf", data);

  try {
    var Contract = await useInstance(data,chain);
    console.log("contractdata", Contract);

    var resp = await Contract.methods.getServiceFee().call();
    console.log('resoooopp',resp)
    if (resp) {
      var web3 = new Web3(data);

      var feeDetails = {
        buyerFee: web3.utils.fromWei(String(Number(resp[0]))),
        sellerFee: web3.utils.fromWei(String(Number(resp[1]))),
        // royaltyFee: web3.utils.fromWei(String(Number(resp[2]))),
      };

      console.log("resp obj", feeDetails);
      return feeDetails;
    }
  } catch (err) {
    console.log("servicefee err", err);
  }
};

export const SRoyalUserPercentage = async (data,id) => {
  console.log("provider sfsfdsfsf", data);

  try {
    var Contract = await useInstance(config.BNBProvider);
    var resp = await Contract.methods.getSplitRoyalty(id).call();
    console.log("sdashdhjskajdhsajhjda",id,resp)
      return resp;
    }
   catch (err) {
    console.log("servicefee err", err);
  }
};


export const useSetServiceFee = async (data, provider, address,chain) => {
  console.log("data,provider", data, provider);

  var payload = null;

  if (data) {
    var web3 = new Web3(provider);
    payload = {
      buyerFee: web3.utils.toWei(String(Number(data.buyerFee))),
      sellerFee: web3.utils.toWei(String(Number(data.sellerFee))),
    };
    console.log("payload fees", payload);
  }

  try {
    var Contract = await useInstance(provider,chain);
    console.log("contractdata", Contract);

    var resp = await Contract.methods
      .setServiceValue(payload.buyerFee, payload.sellerFee)
      .send({ from: address });
    if (resp) return true;
  } catch (err) {
    console.log("errr", err);
  }
};

export const useSetRoyaltyFee = async (data, provider, address) => {
  console.log("data,provider", data, provider, address);

  var payload = null;

  if (data) {
    var web3 = new Web3(provider);
    payload = {
      royaltyFee: web3.utils.toWei(String(Number(data))),
    };
    console.log("payload fees", payload);
  }

  try {
    var Contract = await useInstance(provider);
    console.log("contractdata", Contract);

    var resp = await Contract.methods
      .setRoyalty(payload.royaltyFee)
      .send({ from: address });
    if (resp) return true;
  } catch (err) {
    console.log("errr", err);
  }
};
