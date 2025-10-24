import { aiClassify } from '../services/aiClient';
import { saveMessage, hideMessage, addToModerationQueue } from '../services/db';

export async function handleChatMessage(marketId: string, userId: string, text: string) {
  // Persist message initially as pending
  const message = await saveMessage({marketId, userId, text, status:'pending'});

  // Call AI microservice
  const aiRes = await aiClassify({ text, userId, marketId });

  // Threshold example: score > 0.8 => bot
  if (aiRes.score > 0.8 || aiRes.label === 'bot') {
    // hide and add to moderation queue
    await hideMessage(message.id);
    await addToModerationQueue(message.id, {reason: aiRes.explanation || 'bot-like'});
    return {status:'flagged', messageId: message.id, ai: aiRes};
  } else {
    // mark as visible
    await saveMessage({ id: message.id, status: 'visible' });
    return {status:'ok', messageId: message.id, ai: aiRes};
  }
}
