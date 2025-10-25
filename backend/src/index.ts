// Load .env located next to the compiled files when possible (backend/.env)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
import 'reflect-metadata';
import app from './app';
import AppDataSource from './data-source';

const PORT = process.env.PORT || 4000;

async function main(){
  try {
    // try to initialize our DataSource (reads DATABASE_URL or PG_* env vars)
    await AppDataSource.initialize();
    console.log('DB DataSource initialized');
  } catch (err) {
    console.warn('DB DataSource not initialized — continuing in degraded mode', (err as any).message || err);
  }

  app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
}

main().catch(console.error);
