import { Client, AccountId, PrivateKey } from '@hashgraph/sdk';

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
  return { challenge, url: `https://your-frontend/verify?challenge=${encodeURIComponent(challenge)}`};
}

export async function verifyCallback(payload: any) {
  // validate payload signature, set user.verified = true in DB
  // stub returns true for now
  return true;
}
