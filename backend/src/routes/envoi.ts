import express from 'express';
import { handleEnvoiInbound } from '../services/envoiService';

const router = express.Router();

router.post('/webhook', async (req: any, res: any) => {
  // Validate signature if configured
  const event = req.body;
  await handleEnvoiInbound(event);
  res.json({ok:true});
});

export default router;
