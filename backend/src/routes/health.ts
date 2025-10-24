import express from 'express';
import AppDataSource from '../data-source';

const router = express.Router();

// GET /health - returns basic readiness info and DB connectivity
router.get('/', async (_req: any, res: any) => {
  const result: any = { ok: true, db: { initialized: false, ok: false } };
  try {
    result.db.initialized = !!AppDataSource.isInitialized;
    if (AppDataSource.isInitialized) {
      // run a lightweight query
      const r = await AppDataSource.query('SELECT 1 as ok');
      result.db.ok = Array.isArray(r) && r.length > 0 && (r[0].ok === 1 || r[0].ok === '1');
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: (err as any).message || err });
  }
});

export default router;
