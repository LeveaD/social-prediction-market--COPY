import { Router } from 'express';
import { issueVerification, verifyCallback } from '../services/hedraService';

const router = Router();

// start verification for a user (returns a url or challenge)
router.post('/start', async (req, res) => {
  const { userId } = req.body;
  const out = await issueVerification(userId);
  res.json(out);
});

// webhook/callback from Hedera (example)
router.post('/callback', async (req, res) => {
  const payload = req.body;
  const ok = await verifyCallback(payload);
  res.json({ok});
});

export default router;
