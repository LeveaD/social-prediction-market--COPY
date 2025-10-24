import { DataSource } from 'typeorm';
import { Message } from './models/message';
import { User } from './models/user';
import { Market } from './models/market';
import { Reputation } from './models/reputation';
import { ModerationQueue } from './models/moderationQueue';

function parseDatabaseUrl(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: parseInt(u.port || '5432', 10),
      username: u.username,
      password: u.password,
      database: u.pathname ? u.pathname.replace(/^\//, '') : undefined,
    };
  } catch (e) {
    return null;
  }
}

const dbFromUrl = parseDatabaseUrl(process.env.DATABASE_URL);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbFromUrl?.host || process.env.PG_HOST || 'localhost',
  port: dbFromUrl?.port || parseInt(process.env.PG_PORT || '5432', 10),
  username: dbFromUrl?.username || process.env.PG_USER || 'postgres',
  password: dbFromUrl?.password || process.env.PG_PASSWORD || 'mypassword',
  database: dbFromUrl?.database || process.env.PG_DB || 'prediction_market',
  entities: [Message, User, Market, Reputation, ModerationQueue],
  synchronize: (process.env.NODE_ENV || 'development') === 'development', // dev convenience; for production use migrations
  logging: false,
});

export default AppDataSource;
