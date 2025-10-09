import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

/**
 * Middleware to verify if user exists in the database
 * This can be used to protect routes that require authentication
 */
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user ID from request headers or params
    const userId = req.headers['x-user-id'] || req.params.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. User ID not provided.',
      });
    }

    // Check if user exists in database
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. User not found.',
      });
    }

    // Attach user to request object for use in route handlers
    (req as any).user = user;

    return next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
};

/**
 * Middleware to verify if the authenticated user matches the requested user ID
 * This can be used to protect routes that require user ownership
 */
export const verifyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get authenticated user from previous middleware
    const authenticatedUser = (req as any).user;

    // Get requested user ID from params
    const requestedUserId = req.params.userId;

    if (!authenticatedUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if authenticated user matches requested user
    if (authenticatedUser.userId !== requestedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this resource.',
      });
    }

    return next();
  } catch (error) {
    console.error('Error in ownership verification middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization',
    });
  }
};
