import express from 'express';
import bodyParser from 'body-parser';
import chatRouter from './routes/chat';
import aiRouter from './routes/ai';
import hedraRouter from './routes/hedra';
import envoiRouter from './routes/envoi';
import oracleRouter from './routes/oracle';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/chat', chatRouter);
app.use('/api/ai', aiRouter);
app.use('/api/hedera', hedraRouter);
app.use('/api/envoi', envoiRouter);
app.use('/api/oracle', oracleRouter);

app.get('/', (_, res) => res.json({ok:true}));
export default app;
