/*
  Deploy compiled contracts to Hedera using @hashgraph/sdk.
  Usage: set HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY in env, then run:
    node scripts/deploy-hedera.js

  This script expects Hardhat artifacts to exist at artifacts/contracts/<Contract>.sol/<Contract>.json
*/
const fs = require('fs');
const path = require('path');
const {
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  PrivateKey
} = require('@hashgraph/sdk');

async function main() {
  const operatorId = process.env.HEDERA_OPERATOR_ID;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY;
  const network = process.env.HEDERA_NETWORK || 'testnet';

  if (!operatorId || !operatorKey) {
    console.error('Set HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY in env before running');
    process.exit(1);
  }

  const client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
  client.setOperator(operatorId, PrivateKey.fromString(operatorKey));

  const artifactsDir = path.join(__dirname, '..', 'artifacts', 'contracts');

  // deploy Reputation
  const reputationArtifactPath = path.join(artifactsDir, 'Reputation.sol', 'Reputation.json');
  const predictionArtifactPath = path.join(artifactsDir, 'PredictionMarket.sol', 'PredictionMarket.json');

  if (!fs.existsSync(reputationArtifactPath) || !fs.existsSync(predictionArtifactPath)) {
    console.error('Compiled artifacts not found. Run `npx hardhat compile` first.');
    process.exit(1);
  }

  const reputationArtifact = JSON.parse(fs.readFileSync(reputationArtifactPath, 'utf8'));
  const predictionArtifact = JSON.parse(fs.readFileSync(predictionArtifactPath, 'utf8'));

  const reputationBytecode = reputationArtifact.bytecode.startsWith('0x') ? reputationArtifact.bytecode.slice(2) : reputationArtifact.bytecode;
  const predictionBytecode = predictionArtifact.bytecode.startsWith('0x') ? predictionArtifact.bytecode.slice(2) : predictionArtifact.bytecode;

  console.log('Uploading Reputation bytecode...');
  const repFileTx = await new FileCreateTransaction().setContents(Buffer.from(reputationBytecode, 'hex')).execute(client);
  const repFileReceipt = await repFileTx.getReceipt(client);
  const repFileId = repFileReceipt.fileId;
  console.log('Reputation bytecode fileId:', repFileId.toString());

  console.log('Creating Reputation contract...');
  const repCreateTx = await new ContractCreateTransaction().setBytecodeFileId(repFileId).setGas(200_000).execute(client);
  const repCreateReceipt = await repCreateTx.getReceipt(client);
  const reputationContractId = repCreateReceipt.contractId;
  console.log('Reputation contract deployed at:', reputationContractId.toString());

  // Now deploy PredictionMarket with constructor arg = reputation address
  console.log('Uploading PredictionMarket bytecode...');
  const predFileTx = await new FileCreateTransaction().setContents(Buffer.from(predictionBytecode, 'hex')).execute(client);
  const predFileReceipt = await predFileTx.getReceipt(client);
  const predFileId = predFileReceipt.fileId;
  console.log('PredictionMarket bytecode fileId:', predFileId.toString());

  // The constructor takes an address. On Hedera EVM, addresses are 20-byte EVM addresses.
  // The solidity artifacts use Ethereum-style addresses; to keep compatibility, we pass the
  // Solidity-compatible address derived from the Hedera ContractId (this step may need
  // adjustment depending on target environment / EVM compatibility layer).

  const constructorParams = new ContractFunctionParameters().addAddress(reputationContractId.toString());

  console.log('Creating PredictionMarket contract (with reputation address param)...');
  const predCreateTx = await new ContractCreateTransaction()
    .setBytecodeFileId(predFileId)
    .setGas(400_000)
    .setConstructorParameters(constructorParams)
    .execute(client);

  const predCreateReceipt = await predCreateTx.getReceipt(client);
  const predictionContractId = predCreateReceipt.contractId;
  console.log('PredictionMarket contract deployed at:', predictionContractId.toString());

  // Save results to frontend contract file (similar to existing deploy.js)
  const out = {
    reputation: { address: reputationContractId.toString(), abi: reputationArtifact.abi },
    predictionMarket: { address: predictionContractId.toString(), abi: predictionArtifact.abi }
  };

  fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'src', 'contracts.json'), JSON.stringify(out, null, 2));
  console.log('Saved contract addresses and ABIs to frontend/src/contracts.json');
}

main().catch((err) => {
  console.error('Deploy failed', err);
  process.exit(1);
});
