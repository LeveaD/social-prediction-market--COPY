import axios from 'axios';

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000/classify';

export async function aiClassify(payload: {text:string, userId?:string, marketId?:string}) {
  try {
    const r = await axios.post(AI_URL, payload, { timeout: 3000 });
    return r.data; // expects {score: float, label: string, explanation?: string}
  } catch (err) {
    console.error('AI service failed', err.message);
    // fail-open: low score, but queue for review
    return { score: 0.0, label: 'unknown', explanation: 'ai_error' };
  }
}
