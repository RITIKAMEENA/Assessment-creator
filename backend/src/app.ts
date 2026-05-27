import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import assignmentRoutes from './routes/assignment.routes.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_, res) => res.json({ ok: true, service: 'VedaAI Assessment Creator API' }));
app.use('/api/assignments', assignmentRoutes);
