import express from 'express';
import { body, param } from 'express-validator';
import { authenticateUser, getUserById, updateUser } from '../controllers/userController';
import { verifyUser, verifyOwnership } from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/v1/users/auth - Authenticate user from NextAuth
router.post(
  '/auth',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('provider')
      .isIn(['google', 'github', 'credentials'])
      .withMessage('Valid provider is required'),
  ],
  authenticateUser
);

// GET /api/v1/users/:userId - Get user by ID
router.get(
  '/:userId',
  [param('userId').notEmpty().withMessage('User ID is required')],
  verifyUser,
  getUserById
);

// PUT /api/v1/users/:userId - Update user profile
router.put(
  '/:userId',
  [
    param('userId').notEmpty().withMessage('User ID is required'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ],
  verifyUser,
  verifyOwnership,
  updateUser
);

export default router;
