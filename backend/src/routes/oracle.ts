import express from 'express';
import { postOutcomeToChain } from '../services/oracleService';

const router = express.Router();

// POST /api/oracle/postOutcome
router.post('/postOutcome', async (req: any, res: any) => {
  const { marketId, outcome } = req.body || {};
  if (typeof marketId === 'undefined' || typeof outcome === 'undefined') {
    return res.status(400).json({ error: 'marketId and outcome required' });
  }

  try {
    const tx = await postOutcomeToChain(Number(marketId), outcome);
    return res.json({ ok: true, txHash: tx.hash });
  } catch (err: any) {
    console.error('postOutcome failed', err?.message || err);
    return res.status(500).json({ error: 'post failed', detail: err?.message || String(err) });
  }
});

export default router;
