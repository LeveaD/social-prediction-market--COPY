import { Router } from 'express';
import { handleEnvoiInbound } from '../services/envoiService';

const router = Router();

router.post('/webhook', async (req, res) => {
  // Validate signature if configured
  const event = req.body;
  await handleEnvoiInbound(event);
  res.json({ok:true});
});

export default router;
