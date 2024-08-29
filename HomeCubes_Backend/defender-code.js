const { DefenderRelayProvider } = require('defender-relay-client/lib/web3');
const Web3 = require('web3');


const ForwarderAbi = [
    {
       "inputs":[
          {
             "internalType":"string",
             "name":"name",
             "type":"string"
          }
       ],
       "stateMutability":"nonpayable",
       "type":"constructor"
    },
    {
       "inputs":[
          {
             "internalType":"address",
             "name":"account",
             "type":"address"
          }
       ],
       "name":"AddressInsufficientBalance",
       "type":"error"
    },
    {
       "inputs":[
          {
             "internalType":"uint48",
             "name":"deadline",
             "type":"uint48"
          }
       ],
       "name":"ERC2771ForwarderExpiredRequest",
       "type":"error"
    },
    {
       "inputs":[
          {
             "internalType":"address",
             "name":"signer",
             "type":"address"
          },
          {
             "internalType":"address",
             "name":"from",
             "type":"address"
          }
       ],
       "name":"ERC2771ForwarderInvalidSigner",
       "type":"error"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"requestedValue",
             "type":"uint256"
          },
          {
             "internalType":"uint256",
             "name":"msgValue",
             "type":"uint256"
          }
       ],
       "name":"ERC2771ForwarderMismatchedValue",
       "type":"error"
    },
    {
       "inputs":[
          {
             "internalType":"address",
             "name":"target",
             "type":"address"
          },
          {
             "internalType":"address",
             "name":"forwarder",
             "type":"address"
          }
       ],
       "name":"ERC2771UntrustfulTarget",
       "type":"error"
    },
    {
       "inputs":[

       ],
       "name":"FailedInnerCall",
       "type":"error"
    },
    {
       "inputs":[
          {
             "internalType":"address",
             "name":"account",
             "type":"address"
          },
          {
             "internalType":"uint256",
             "name":"currentNonce",
             "type":"uint256"
          }
       ],
       "name":"InvalidAccountNonce",
       "type":"error"
    },
    {
       "inputs":[

       ],
       "name":"InvalidShortString",
       "type":"error"
    },
    {
       "inputs":[
          {
             "internalType":"string",
             "name":"str",
             "type":"string"
          }
       ],
       "name":"StringTooLong",
       "type":"error"
    },
    {
       "anonymous":false,
       "inputs":[

       ],
       "name":"EIP712DomainChanged",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "internalType":"address",
             "name":"signer",
             "type":"address"
          },
          {
             "indexed":false,
             "internalType":"uint256",
             "name":"nonce",
             "type":"uint256"
          },
          {
             "indexed":false,
             "internalType":"bool",
             "name":"success",
             "type":"bool"
          }
       ],
       "name":"ExecutedForwardRequest",
       "type":"event"
    },
    {
       "inputs":[

       ],
       "name":"eip712Domain",
       "outputs":[
          {
             "internalType":"bytes1",
             "name":"fields",
             "type":"bytes1"
          },
          {
             "internalType":"string",
             "name":"name",
             "type":"string"
          },
          {
             "internalType":"string",
             "name":"version",
             "type":"string"
          },
          {
             "internalType":"uint256",
             "name":"chainId",
             "type":"uint256"
          },
          {
             "internalType":"address",
             "name":"verifyingContract",
             "type":"address"
          },
          {
             "internalType":"bytes32",
             "name":"salt",
             "type":"bytes32"
          },
          {
             "internalType":"uint256[]",
             "name":"extensions",
             "type":"uint256[]"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "components":[
                {
                   "internalType":"address",
                   "name":"from",
                   "type":"address"
                },
                {
                   "internalType":"address",
                   "name":"to",
                   "type":"address"
                },
                {
                   "internalType":"uint256",
                   "name":"value",
                   "type":"uint256"
                },
                {
                   "internalType":"uint256",
                   "name":"gas",
                   "type":"uint256"
                },
                {
                   "internalType":"uint48",
                   "name":"deadline",
                   "type":"uint48"
                },
                {
                   "internalType":"bytes",
                   "name":"data",
                   "type":"bytes"
                },
                {
                   "internalType":"bytes",
                   "name":"signature",
                   "type":"bytes"
                }
             ],
             "internalType":"struct ERC2771Forwarder.ForwardRequestData",
             "name":"request",
             "type":"tuple"
          }
       ],
       "name":"execute",
       "outputs":[

       ],
       "stateMutability":"payable",
       "type":"function"
    },
    {
       "inputs":[
          {
             "components":[
                {
                   "internalType":"address",
                   "name":"from",
                   "type":"address"
                },
                {
                   "internalType":"address",
                   "name":"to",
                   "type":"address"
                },
                {
                   "internalType":"uint256",
                   "name":"value",
                   "type":"uint256"
                },
                {
                   "internalType":"uint256",
                   "name":"gas",
                   "type":"uint256"
                },
                {
                   "internalType":"uint48",
                   "name":"deadline",
                   "type":"uint48"
                },
                {
                   "internalType":"bytes",
                   "name":"data",
                   "type":"bytes"
                },
                {
                   "internalType":"bytes",
                   "name":"signature",
                   "type":"bytes"
                }
             ],
             "internalType":"struct ERC2771Forwarder.ForwardRequestData[]",
             "name":"requests",
             "type":"tuple[]"
          },
          {
             "internalType":"address payable",
             "name":"refundReceiver",
             "type":"address"
          }
       ],
       "name":"executeBatch",
       "outputs":[

       ],
       "stateMutability":"payable",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"address",
             "name":"owner",
             "type":"address"
          }
       ],
       "name":"nonces",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "components":[
                {
                   "internalType":"address",
                   "name":"from",
                   "type":"address"
                },
                {
                   "internalType":"address",
                   "name":"to",
                   "type":"address"
                },
                {
                   "internalType":"uint256",
                   "name":"value",
                   "type":"uint256"
                },
                {
                   "internalType":"uint256",
                   "name":"gas",
                   "type":"uint256"
                },
                {
                   "internalType":"uint48",
                   "name":"deadline",
                   "type":"uint48"
                },
                {
                   "internalType":"bytes",
                   "name":"data",
                   "type":"bytes"
                },
                {
                   "internalType":"bytes",
                   "name":"signature",
                   "type":"bytes"
                }
             ],
             "internalType":"struct ERC2771Forwarder.ForwardRequestData",
             "name":"request",
             "type":"tuple"
          }
       ],
       "name":"verify",
       "outputs":[
          {
             "internalType":"bool",
             "name":"",
             "type":"bool"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    }
 ]
const ForwarderAddress = "0x84732a7d2bC9336ECB59e651DCCcF9B42B6bc0d3";

async function relay(forwarder, request, signature, whitelist) {
    try {
        // Decide if we want to relay this request based on a whitelist
        const accepts = !whitelist || whitelist.includes(request.to);
        if (!accepts) throw new Error(`Rejected request to ${request.to}`);

        // Validate request on the forwarder contract
        const valid = await forwarder.methods.verify(request).call();
        if (!valid) throw new Error(`Invalid requesttttt`);

        // Send meta-tx through relayer to the forwarder contract
        const gasLimit = (parseInt(request.gas) + 50000).toString();
      
      var obj = {}
      
      if(request?.gas_estimate){
          obj.gas= Web3.utils.toHex(request?.gas_estimate),
          obj.gasPrice= Web3.utils.toHex(request?.gasprice),
          obj.value=Number(request.value)
      }else{
        obj.gasLimit = (parseInt(request.gas) + 50000).toString();
        obj.value=Number(request.value)
      }
      console.log("Obj",obj,request);
        return await forwarder.methods
            .execute(request).send(obj)
            .on('transactionHash', (transactionHash) => {
                return transactionHash
            })
    } catch (e) {
        throw new Error(e.toString() + "intrans")
    }

}

async function handler(event) {
    try {
        // Parse webhook payload
        if (!event.request || !event.request.body) throw new Error(`Missing payload`);
        const { request, signature } = event.request.body;
        console.log(`Relaying`, request);

        // Initialize Relayer provider and signer, and forwarder contract
        const credentials = { ...event };
        const provider = new DefenderRelayProvider(credentials, { speed: 'fast' });
        const web3 = new Web3(provider);
        const [from] = await web3.eth.getAccounts();
        const forwarder = new web3.eth.Contract(ForwarderAbi, ForwarderAddress, { from });

        // Relay transaction!
        const tx = await relay(forwarder, request, signature);
        //console.log(`Sent meta-tx: ${tx.hash}`);

        return { tx };
    } catch (e) {
        throw new Error(e.toString())
    }

}

module.exports = {
    handler,
    relay,
}