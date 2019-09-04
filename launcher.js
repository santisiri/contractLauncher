let Web3 = require('web3');
let solc = require('solc');
let fs = require('fs');

const NODE_SERVER = 'http://localhost:7545';
const CONTRACT_FILE = 'Basic.sol';
const CONTRACT_CLASS = 'Basic';

let ownerAddress;

console.log(`* Setting app Web3 provider ${NODE_SERVER}...`);
web3 = new Web3(new Web3.providers.HttpProvider(NODE_SERVER));

console.log(`* Read smart contract from file system...`);
const code = fs.readFileSync(CONTRACT_FILE, 'utf8').toString();

console.log(`* Configuring compiler settings...`);
const input = {
  language: 'Solidity',
	sources: {
		[CONTRACT_FILE]: {
			content: code,
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*' ]
			}
		}
	}
}

console.log(`* Compile smart contract with solc...`);
const output = JSON.parse(solc.compile(JSON.stringify(input)))
output ? console.log(output) : console.log(`[WARNING] Error compiling output.`);

console.log(`* Getting ABI of contract...`);
contractABI = output.contracts[CONTRACT_FILE][CONTRACT_CLASS].abi;
contractABI ? console.log(contractABI) : console.log(`[WARNING] Couldn't get contract ABI.`);

console.log(`* Getting bytecode of contract...`);
const contract = new web3.eth.Contract(contractABI);
const bytecode = output.contracts[CONTRACT_FILE][CONTRACT_CLASS].evm.bytecode.object;
bytecode ? console.log(bytecode) : console.log(`[WARNING] No bytecode was found.`);

console.log(`* Verifying accounts for this node...`)
web3.eth.getAccounts().then((res, error) => { 
  if (res) {
    ownerAddress = res[0];
    console.log(`* Owner address: ${ownerAddress}.`);
    console.log(`* Deploy contract...`);
    contract.deploy({
      data: bytecode,
    })
      .send({
        from: ownerAddress,
        gas: 4000000,
        gasPrice: '3000000000',
      })
      .then((instance) => {
        console.log(`Address: ${instance.options.address}`);
      });
    
    return;
  }
  console.log(error);
});
