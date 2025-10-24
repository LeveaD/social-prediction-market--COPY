import { Router } from 'express';

const router = Router();

// Minimal oracle route stub
router.get('/', (req, res) => res.json({ok:true, msg: 'oracle route'}));

export default router;
