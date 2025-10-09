import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/User';

/**
 * Create or update user from NextAuth session
 * @route POST /api/v1/users/auth
 */
export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { userId, email, name, image, provider } = req.body;

    // Find existing user or create new one
    let user = await User.findOne({ userId });

    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      user.image = image || user.image;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        userId,
        email,
        name,
        image,
        provider,
        lastLogin: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in authenticateUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/v1/users/:userId
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId }).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/v1/users/:userId
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { userId } = req.params;
    const { name, image } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
