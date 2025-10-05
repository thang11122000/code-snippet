import { Request, Response } from 'express';
import Tag from '../models/Tag';
import { asyncHandler } from '../middleware/errorHandler';

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
export const getAllTags = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const [tags, total] = await Promise.all([
    Tag.find({ count: { $gt: 0 } })
      .sort({ count: -1 })
      .skip(skip)
      .limit(limit),
    Tag.countDocuments({ count: { $gt: 0 } }),
  ]);

  res.status(200).json({
    success: true,
    data: tags,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get popular tags
// @route   GET /api/tags/popular
// @access  Public
export const getPopularTags = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;

  const tags = await Tag.find({ count: { $gt: 0 } })
    .sort({ count: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    data: tags,
  });
});

// @desc    Search tags
// @route   GET /api/tags/search
// @access  Public
export const searchTags = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { q } = req.query;

  if (!q) {
    res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
    return;
  }

  const tags = await Tag.find({
    name: { $regex: q as string, $options: 'i' },
    count: { $gt: 0 },
  })
    .sort({ count: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    data: tags,
  });
});
