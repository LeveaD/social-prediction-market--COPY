import { Client, AccountId, PrivateKey, ContractExecuteTransaction, ContractFunctionParameters } from '@hashgraph/sdk';

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = process.env.HEDERA_OPERATOR_KEY;

const client = Client.forTestnet();
if (operatorId && operatorKey && typeof operatorKey === 'string' && !operatorKey.includes('__PLACEHOLDER')) {
  try {
    // PrivateKey.fromString will validate the key format and avoid runtime errors
    client.setOperator(operatorId, PrivateKey.fromString(operatorKey));
  } catch (e: any) {
    console.warn('Invalid Hedera operator key provided; skipping operator set', e?.message || e);
  }
} else {
  console.warn('Hedera operator not configured; running in degraded mode');
}

export async function issueVerification(userId: string) {
  // Minimal stub: generate a verification challenge, store to DB, return URL
  const challenge = `challenge:${userId}:${Date.now()}`;
  // store to DB (not shown)
  return { challenge, url: `https://your-frontend/verify?challenge=${encodeURIComponent(challenge)}` };
}

export async function verifyCallback(payload: any) {
  // validate payload signature, set user.verified = true in DB
  // stub returns true for now
  return true;
}

/**
 * Call the on-chain PredictionMarket.resolveMarket(marketId, winningOutcome)
 * Requires environment variable PREDICTION_MARKET_CONTRACT_ID to be set to the
 * Hedera contract ID (e.g. 0.0.12345 or 0xabc... depending on deployment)
 */
export async function resolveMarketOnchain(marketId: number, winningOutcome: boolean) {
  const contractId = process.env.PREDICTION_MARKET_CONTRACT_ID;
  if (!contractId) {
    throw new Error('PREDICTION_MARKET_CONTRACT_ID not set in env');
  }

  // Encode function parameters and execute contract
  const functionParams = new ContractFunctionParameters()
    .addUint256(marketId)
    .addBool(winningOutcome);

  const tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(200_000)
    .setFunction('resolveMarket', functionParams)
    .execute(client);

  const receipt = await tx.getReceipt(client);
  return receipt;
}
