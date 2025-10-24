// Minimal in-memory stubs for DB service used for build/smoke testing.
export async function saveMessage(msg: any) {
	const id = Math.random().toString(36).slice(2);
	return { ...msg, id };
}

export async function hideMessage(id: string) {
	// no-op stub
	return true;
}

export async function addToModerationQueue(id: string, meta: any) {
	// no-op stub
	return true;
}
