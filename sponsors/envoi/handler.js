/**
 * Envoi handler: transforms Envoi events into the backend webhook format
 * This handler is an example that would run on the Envoi side (or as a middleware)
 * and forward decoded events to your backend at /api/envoi/webhook.
 */
const axios = require('axios');

const BACKEND_URL = process.env.ENVOI_WEBHOOK_TARGET || 'http://localhost:4000/api/envoi/webhook';
const API_KEY = process.env.ENVOI_API_KEY || '';

module.exports.handleEvent = async function (decodedEvent) {
  // decodedEvent example: { eventName, contractAddress, txHash, blockNumber, timestamp, args }
  const payload = {
    eventName: decodedEvent.eventName,
    contractAddress: decodedEvent.contractAddress,
    transactionHash: decodedEvent.txHash || decodedEvent.transactionHash,
    blockNumber: decodedEvent.blockNumber,
    timestamp: decodedEvent.timestamp || Date.now(),
    args: decodedEvent.args || decodedEvent.returnValues || {}
  };

  const headers = {};
  if (API_KEY) headers['x-api-key'] = API_KEY;

  try {
    await axios.post(BACKEND_URL, payload, { headers, timeout: 5000 });
    return { ok: true };
  } catch (err) {
    console.error('Failed to forward Envoi event to backend', err && err.message);
    return { ok: false, error: err && err.message };
  }
};
