import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN
}));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
