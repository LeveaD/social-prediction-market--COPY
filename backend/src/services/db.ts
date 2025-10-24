import AppDataSource from '../data-source';
import { Message } from '../models/message';
import { ModerationQueue } from '../models/moderationQueue';

let useDb = false;
let msgRepo: any = null;
let modRepo: any = null;

async function init() {
  // Ensure DataSource is initialized and repository references are set.
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
    } catch (e) {
      console.warn('Could not initialize DB, falling back to in-memory store', (e as any).message || e);
      return;
    }
  }

  // At this point the DataSource should be initialized (or init returned above).
  useDb = true;
  msgRepo = AppDataSource.getRepository(Message);
  modRepo = AppDataSource.getRepository(ModerationQueue);
}

// in-memory fallback
let _msgId = 1;
const messages: Record<number, any> = {};

export async function saveMessage(payload: any) {
  await init();
  if (useDb && msgRepo) {
    if (payload && payload.id) {
      await msgRepo.update(payload.id, payload);
      return msgRepo.findOneBy({ id: payload.id });
    }
    const m = msgRepo.create(payload);
    return msgRepo.save(m);
  }

  if (payload && payload.id) {
    const id = payload.id;
    messages[id] = { ...(messages[id] || {}), ...payload };
    return messages[id];
  }
  const id = _msgId++;
  const msg = { id, ...payload, createdAt: new Date() };
  messages[id] = msg;
  return msg;
}

export async function hideMessage(id: number) {
  await init();
  if (useDb && msgRepo) {
    await msgRepo.update(id, { status: 'hidden' });
    return true;
  }
  if (!messages[id]) return false;
  messages[id].status = 'hidden';
  return true;
}

export async function addToModerationQueue(messageId: number, meta: any) {
  await init();
  if (useDb && modRepo) {
    const it = modRepo.create({ messageId, reason: meta.reason || 'automated' });
    await modRepo.save(it);
    return true;
  }
  // fallback: store in-memory
  messages[messageId] = { ...(messages[messageId] || {}), moderation: meta };
  return true;
}

export async function getMessage(id: number) {
  await init();
  if (useDb && msgRepo) return msgRepo.findOneBy({ id });
  return messages[id];
}

export async function getModerationQueue() {
  await init();
  if (useDb && modRepo) return modRepo.find();
  return [];
}
