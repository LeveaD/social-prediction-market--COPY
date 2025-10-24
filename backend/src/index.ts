require('dotenv').config();
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';

const PORT = process.env.PORT || 4000;

async function main(){
  await createConnection(); // reads ormconfig or env config
  app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
}

main().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});
