import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController';

const router = Router();

// POST /api/chat/:marketId
router.post('/:marketId', async (req, res) => {
  const marketId = req.params.marketId;
  const { userId, text } = req.body;
  try {
    const result = await handleChatMessage(marketId, userId, text);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'server error'});
  }
});

export default router;
