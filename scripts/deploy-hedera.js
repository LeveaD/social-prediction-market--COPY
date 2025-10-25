const { Client, AccountId, PrivateKey, ContractCreateTransaction, ContractExecuteTransaction, ContractFunctionParameters, FileCreateTransaction, FileAppendTransaction, Hbar } = require('@hashgraph/sdk');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = process.env.HEDERA_OPERATOR_KEY;

if (!operatorId || !operatorKey) {
  console.error('Hedera operator ID and key not found in environment variables.');
  process.exit(1);
}

async function deployContract() {
  try {
    const client = Client.forTestnet();
    client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromStringECDSA(operatorKey));

    console.log('Deploying contract to Hedera...');

    // First, deploy the Reputation contract
    console.log('Deploying Reputation contract...');
    const reputationBytecode = fs.readFileSync(path.join(__dirname, '../artifacts/contracts/Reputation.sol/Reputation.json'));
    const reputationJson = JSON.parse(reputationBytecode);
    const reputationBytecodeHex = reputationJson.bytecode;

    const reputationFileCreateTx = new FileCreateTransaction()
      .setContents(reputationBytecodeHex)
      .setKeys([PrivateKey.fromStringECDSA(operatorKey).publicKey])
      .freezeWith(client);

    const reputationFileCreateSubmit = await reputationFileCreateTx.execute(client);
    const reputationFileCreateRx = await reputationFileCreateSubmit.getReceipt(client);
    const reputationBytecodeFileId = reputationFileCreateRx.fileId;

    console.log('Reputation bytecode file created with ID:', reputationBytecodeFileId.toString());

    const reputationContractCreateTx = new ContractCreateTransaction()
      .setBytecodeFileId(reputationBytecodeFileId)
      .setGas(2000000);

    const reputationContractCreateSubmit = await reputationContractCreateTx.execute(client);
    const reputationContractCreateRx = await reputationContractCreateSubmit.getReceipt(client);
    const reputationContractId = reputationContractCreateRx.contractId;

    console.log('Reputation contract deployed with ID:', reputationContractId.toString());

    // Now deploy the PredictionMarket contract with the Reputation contract address
    console.log('Deploying PredictionMarket contract...');
    const contractBytecode = fs.readFileSync(path.join(__dirname, '../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json'));

    const contractJson = JSON.parse(contractBytecode);
    const bytecode = contractJson.bytecode;

    const fileCreateTx = new FileCreateTransaction()
      .setContents(bytecode)
      .setKeys([PrivateKey.fromStringECDSA(operatorKey).publicKey])
      .freezeWith(client);

    const fileCreateSubmit = await fileCreateTx.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;

    console.log('PredictionMarket bytecode file created with ID:', bytecodeFileId.toString());

    // Deploy the contract with constructor parameters
    const contractCreateTx = new ContractCreateTransaction()
      .setBytecodeFileId(bytecodeFileId)
      .setGas(15000000)
      .setMaxTransactionFee(new Hbar(20))
      .setConstructorParameters(new ContractFunctionParameters().addAddress(reputationContractId.toSolidityAddress()));

    const contractCreateSubmit = await contractCreateTx.execute(client);
    const contractCreateRx = await contractCreateSubmit.getReceipt(client);
    const contractId = contractCreateRx.contractId;

    console.log('PredictionMarket contract deployed successfully!');
    console.log('Contract ID:', contractId.toString());
    console.log('Reputation Contract ID:', reputationContractId.toString());

    // Save contract IDs to a file for later use
    fs.writeFileSync(path.join(__dirname, '../contracts/deployed-contract.json'), JSON.stringify({
      predictionMarketContractId: contractId.toString(),
      reputationContractId: reputationContractId.toString(),
      network: 'testnet'
    }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Contract deployment failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

deployContract();
