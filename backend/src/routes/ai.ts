import { Router } from 'express';

const router = Router();

// Minimal AI route stub to satisfy imports during build.
router.get('/', (req, res) => res.json({ok:true, msg: 'ai route'}));

export default router;
