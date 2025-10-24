// Minimal DB service stubs so other modules can import functions during build.
export async function saveMessage(message: any) {
	// placeholder - integrate with TypeORM/Postgres later
	return null;
}

export async function hideMessage(id: number) {
	return null;
}

export async function addToModerationQueue(messageId: any, meta?: any) {
	return null;
}
