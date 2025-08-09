import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { connectToDatabase } from './config/db.js';
import { initCloudinary } from './config/cloudinary.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.clientUrl, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
  app.use(limiter);

  if (!config.useCloudinary) {
    app.use('/uploads', express.static(path.resolve(__dirname, '../', config.uploadDir)));
  }

  initCloudinary();
  await connectToDatabase();

  app.get('/', (req, res) => {
    res.json({ name: 'Snapzy API', status: 'ok' });
  });

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

bootstrap();