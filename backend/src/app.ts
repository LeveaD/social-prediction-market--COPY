import express from 'express';
import bodyParser from 'body-parser';
import chatRouter from './routes/chat';
import aiRouter from './routes/ai';
import hedraRouter from './routes/hedra';
import envoiRouter from './routes/envoi';
import oracleRouter from './routes/oracle';
import authRouter from './routes/auth';
import healthRouter from './routes/health';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (_req, res) => res.json({ ok: true }));

app.use('/api/chat', chatRouter);
app.use('/api/ai', aiRouter);
app.use('/api/hedera', hedraRouter);
app.use('/api/envoi', envoiRouter);
app.use('/api/oracle', oracleRouter);
app.use('/api/auth', authRouter);
app.use('/health', healthRouter);

export default app;
