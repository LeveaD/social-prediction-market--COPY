import express from 'express';

const router = express.Router();

// Minimal local stub for AI classification. In production this should point to the AI service.
router.post('/classify', async (req: any, res: any) => {
  const { text } = req.body || {};
  // naive heuristic: very short text = likely human, long repeated text could be spam
  const score = typeof text === 'string' && text.length > 200 ? 0.9 : 0.1;
  const label = score > 0.8 ? 'bot' : 'human';
  res.json({ score, label, explanation: 'local-stub' });
});

export default router;
