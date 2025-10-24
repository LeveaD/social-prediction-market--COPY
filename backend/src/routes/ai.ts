import { Router } from 'express';

const router = Router();

// Minimal AI route stub for build/smoke testing
router.get('/', (req, res) => {
	res.json({ ok: true, info: 'ai route' });
});

export default router;
