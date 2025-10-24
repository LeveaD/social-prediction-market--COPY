import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as crypto from 'crypto';

import { resolveMarketOnchain } from './hedraService';

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

type EnvoiEvent = {
  eventName: string;
  contractAddress?: string;
  transactionHash?: string;
  blockNumber?: number;
  timestamp?: string | number;
  args?: Record<string, any>;
};

export async function handleEnvoiInbound(event: EnvoiEvent) {
  // Basic validation of required fields
  if (!event || !event.eventName) {
    throw new Error('Invalid Envoi event: missing eventName');
  }

  // Persist a simple log for auditability
  const logLine = `${new Date().toISOString()} | ${event.eventName} | ${JSON.stringify(event)}\n`;
  fs.appendFileSync(path.join(LOG_DIR, 'envoi-events.log'), logLine);

  // Route to specialized processors
  switch (event.eventName) {
    case 'PredictionPlaced':
    case 'BetPlaced':
      await processPredictionPlaced(event);
      break;
    case 'MarketResolved':
      await processMarketResolved(event);
      break;
    default:
      // unknown event - just log for now
      break;
  }
}

async function processPredictionPlaced(ev: EnvoiEvent) {
  // Example processing: persist to DB / notify websocket / update caches.
  // For now we append a separated log and optionally forward to an internal API.
  const line = `PREDICTION | ${Date.now()} | ${JSON.stringify(ev)}\n`;
  fs.appendFileSync(path.join(LOG_DIR, 'predictions.log'), line);

  // If you want to forward to another internal service, set ENVOI_FORWARD_URL
  const forwardUrl = process.env.ENVOI_FORWARD_URL;
  if (forwardUrl) {
    try {
      await axios.post(forwardUrl, ev, { timeout: 5000 });
    } catch (err) {
      // ignore forwarding errors for now but log them
      fs.appendFileSync(path.join(LOG_DIR, 'envoi-errors.log'), `${new Date().toISOString()} | forward failed | ${err}\n`);
    }
  }
}

async function processMarketResolved(ev: EnvoiEvent) {
  // Expected args: { marketId: <number>, winningOutcome: <bool> }
  const args = ev.args || {};
  const marketId = typeof args.marketId === 'number' ? args.marketId : Number(args.marketId);
  const winningOutcome = !!args.winningOutcome;

  // Example: record resolved market and optionally call on-chain resolver (if backend must trigger)
  const line = `MARKET_RESOLVED | ${Date.now()} | marketId=${marketId} | winning=${winningOutcome} | ${JSON.stringify(ev)}\n`;
  fs.appendFileSync(path.join(LOG_DIR, 'market-resolved.log'), line);

  // Optionally, if you want the backend to call the contract (owner flow), call resolveMarketOnchain
  if (process.env.BACKEND_SHOULD_CALL_RESOLVE === 'true') {
    try {
      await resolveMarketOnchain(marketId, winningOutcome);
    } catch (err) {
      fs.appendFileSync(path.join(LOG_DIR, 'envoi-errors.log'), `${new Date().toISOString()} | onchain resolve failed | ${err}\n`);
    }
  }
}

/**
 * Helper to validate an HMAC signature if Envio provides one. If you want signature
 * verification, set ENVOI_WEBHOOK_SECRET in your backend .env and perform HMAC SHA256
 * over the raw body. Note: express.json() will have parsed the body already. To verify
 * raw bodies, you'd need to capture raw bytes in middleware. This helper exists for
 * reference and is not currently wired to the express route.
 */
export function verifyEnvoiSignature(rawBody: Buffer, signature: string | undefined) {
  const secret = process.env.ENVOI_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}

export default { handleEnvoiInbound };
