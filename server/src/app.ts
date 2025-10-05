import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}`, routes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Code Snippet API',
    version: apiVersion,
    endpoints: {
      health: `/api/${apiVersion}/health`,
      users: `/api/${apiVersion}/users`,
      snippets: `/api/${apiVersion}/snippets`,
      tags: `/api/${apiVersion}/tags`,
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
