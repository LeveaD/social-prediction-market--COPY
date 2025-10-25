// Minimal in-memory DB service used for development and tests.
// Replace with real DB logic (TypeORM/pg) in production.

type MessageRecord = {
	id: number;
	marketId?: string;
	userId?: string;
	text?: string;
	status?: string;
};

let _messages: Record<number, MessageRecord> = {};
let _nextId = 1;

export async function saveMessage(data: Partial<MessageRecord>) {
	if (data.id) {
		// update
		const id = data.id as number;
		_messages[id] = { ...( _messages[id] || { id } ), ...data } as MessageRecord;
		return _messages[id];
	}
	const id = _nextId++;
	const rec: MessageRecord = { id, ...data } as MessageRecord;
	_messages[id] = rec;
	return rec;
}

export async function hideMessage(id: number) {
	if (_messages[id]) {
		_messages[id].status = 'hidden';
		return true;
	}
	return false;
}

export async function addToModerationQueue(messageId: number, meta?: any) {
	// For now just log and store a minimal moderation record on the message
	if (_messages[messageId]) {
		(_messages[messageId] as any).moderation = meta || {};
		return true;
	}
	return false;
}

export default { saveMessage, hideMessage, addToModerationQueue };
