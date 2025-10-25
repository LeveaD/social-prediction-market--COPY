import { Client, AccountId, PrivateKey, PublicKey } from '@hashgraph/sdk';
import AppDataSource from '../data-source';
import { User } from '../models/user';

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = process.env.HEDERA_OPERATOR_KEY;

const client = Client.forTestnet();
if (operatorId && operatorKey) {
  client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromStringECDSA(operatorKey));
}

export async function issueVerification(userId: string) {
  const challenge = `challenge:${userId}:${Date.now()}`;

  // Store challenge in DB
  const userRepository = AppDataSource.getRepository(User);
  let user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    user = userRepository.create({ id: userId, verified: false, hederaChallenge: challenge });
  } else {
    user.hederaChallenge = challenge;
  }
  await userRepository.save(user);

  return { challenge, url: `http://10.37.135.113:8080/verify?challenge=${encodeURIComponent(challenge)}` };
}

export async function verifyCallback(payload: any) {
  try {
    const { userId, signature, challenge } = payload;

    // Get user from DB
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user || user.hederaChallenge !== challenge) {
      return false;
    }

    // Verify signature using Hedera SDK
    const message = challenge;
    const publicKey = PublicKey.fromStringECDSA(operatorKey!); // Using operator key for demo - in real app, use user's public key
    const isValid = publicKey.verify(Buffer.from(message), Buffer.from(signature, 'hex'));

    if (isValid) {
      user.verified = true;
      user.hederaChallenge = null; // Clear challenge after verification
      await userRepository.save(user);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Hedera verification error:', error);
    return false;
  }
}
