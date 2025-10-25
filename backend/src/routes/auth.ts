import express from 'express';
import crypto from 'crypto';
import { PublicKey } from '@hashgraph/sdk';

const router = express.Router();

// In-memory nonce store: nonce -> { accountId, expires }
const nonces: Record<string, { accountId?: string; expires: number }> = {};

function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

// GET /api/auth/nonce?accountId=0.0.x
router.get('/nonce', (req, res) => {
  const accountId = req.query.accountId as string | undefined;
  const nonce = generateNonce();
  nonces[nonce] = { accountId, expires: Date.now() + 5 * 60 * 1000 }; // 5 minutes
  res.json({ nonce });
});

// POST /api/auth/verify
// body: { accountId, publicKey, signature, nonce }
router.post('/verify', async (req, res) => {
  try {
    const { accountId, publicKey, signature, nonce } = req.body;
    if (!nonce || !signature || !publicKey) return res.status(400).json({ error: 'missing fields' });

    const stored = nonces[nonce];
    if (!stored) return res.status(400).json({ error: 'invalid or expired nonce' });
    if (stored.expires < Date.now()) return res.status(400).json({ error: 'nonce expired' });

    // Optionally check accountId matches stored.accountId if provided
    if (stored.accountId && accountId && stored.accountId !== accountId) {
      return res.status(400).json({ error: 'accountId mismatch' });
    }

  // Verify signature using Hedera PublicKey helper
  let pk: any;
    try {
      pk = PublicKey.fromString(publicKey);
    } catch (err) {
      return res.status(400).json({ error: 'invalid publicKey format' });
    }

    const message = Buffer.from(nonce);
    const sig = Buffer.from(signature.replace(/^0x/, ''), 'hex');

    const verified = pk.verify(message, sig);
    if (!verified) return res.status(401).json({ error: 'invalid signature' });

    // Authentication success - create a simple session token (in-memory)
    const sessionToken = crypto.randomBytes(24).toString('hex');
    // In a real app store session in DB or issue JWT. Here we return basic success payload.
    // Clean up nonce
    delete nonces[nonce];

    res.json({ ok: true, accountId, sessionToken });
  } catch (err: any) {
    console.error('auth verify error', err);
    res.status(500).json({ error: err.message || 'server error' });
  }
});

export default router;
