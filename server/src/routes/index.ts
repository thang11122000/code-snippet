import express from 'express';
import snippetRoutes from './snippetRoutes';
import tagRoutes from './tagRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/snippets', snippetRoutes);
router.use('/tags', tagRoutes);
router.use('/users', userRoutes);

export default router;
