const { Client, AccountId, PrivateKey, AccountInfoQuery } = require('@hashgraph/sdk');

require('dotenv').config();

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = process.env.HEDERA_OPERATOR_KEY;

if (!operatorId || !operatorKey) {
  console.error('Hedera operator ID and key not found in environment variables.');
  process.exit(1);
}

async function testHederaConnection() {
  try {
    const client = Client.forTestnet();
    client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromStringECDSA(operatorKey));

    console.log('Testing Hedera connection...');

    // Get account info to test connection
    const query = new AccountInfoQuery()
      .setAccountId(AccountId.fromString(operatorId));

    const accountInfo = await query.execute(client);
    console.log('Hedera connection successful!');
    console.log('Account ID:', accountInfo.accountId.toString());
    console.log('Balance:', accountInfo.balance.toString());

    process.exit(0);
  } catch (error) {
    console.error('Hedera connection failed:', error.message);
    process.exit(1);
  }
}

testHederaConnection();
