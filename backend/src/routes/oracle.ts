import { Router } from 'express';

const router = Router();

// Minimal Oracle route stub for build/smoke testing
router.get('/', (req, res) => {
	res.json({ ok: true, info: 'oracle route' });
});

export default router;
