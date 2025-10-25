const axios = require('axios');
require('dotenv').config();

/**
 * Simple Hedera Mirror Node indexer that polls contract logs for a given contract id
 * Reads HEDERA_PREDICTION_MARKET_ADDRESS from .env (format: 0.0.x or EVM 0x...)
 * Poll interval: 10 seconds
 */

const MIRROR_NODE = process.env.MIRROR_NODE_URL || 'https://testnet.mirrornode.hedera.com/api/v1';
const CONTRACT_ID = process.env.HEDERA_PREDICTION_MARKET_ADDRESS;
const POLL_INTERVAL_MS = 10000;
let lastTimestamp = null;

if (!CONTRACT_ID || CONTRACT_ID === '__PLACEHOLDER__') {
  console.error('Hedera contract address not set. Please set HEDERA_PREDICTION_MARKET_ADDRESS in backend/.env');
  process.exit(1);
}

console.log('Starting Hedera mirror indexer');
console.log('Mirror node:', MIRROR_NODE);
console.log('Contract:', CONTRACT_ID);

async function fetchLogs() {
  try {
    const params = {
      limit: 50,
      order: 'asc'
    };
    if (lastTimestamp) {
      params.timestamp = `gt:${lastTimestamp}`;
    }

    const url = `${MIRROR_NODE}/contracts/${CONTRACT_ID}/results/logs`;
    const res = await axios.get(url, { params, timeout: 10000 });

    if (!res.data || !res.data.logs) {
      console.log('No logs found in response');
      return;
    }

    const logs = res.data.logs;
    for (const log of logs) {
      console.log('--- New Log ---');
      console.log('consensusTimestamp:', log.consensus_timestamp || log.timestamp || log.consensus);
      console.log('data:', log.data || log.topics || log);
      lastTimestamp = log.consensus_timestamp || log.timestamp || lastTimestamp;
    }

  } catch (err) {
    console.error('Error fetching logs:', err.message || err);
  }
}

(async function start() {
  // initial fetch
  await fetchLogs();
  setInterval(fetchLogs, POLL_INTERVAL_MS);
})();