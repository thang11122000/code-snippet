import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Snippet from '../models/Snippet';
import Like from '../models/Like';
import Tag from '../models/Tag';
import { AppError, asyncHandler } from '../middleware/errorHandler';

// @desc    Create snippet
// @route   POST /api/snippets
// @access  Public (should be protected in production)
export const createSnippet = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const snippet = await Snippet.create(req.body);

  // Update tag counts
  if (snippet.tags && snippet.tags.length > 0) {
    await updateTagCounts(snippet.tags, 1);
  }

  res.status(201).json({
    success: true,
    data: snippet,
  });
});

// @desc    Get all snippets with filters
// @route   GET /api/snippets
// @access  Public
export const getAllSnippets = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const { languageCode, tag, search, sort = 'latest' } = req.query;

  // Build query
  const query: any = { isPublic: true };

  if (languageCode) {
    query.languageCode = languageCode;
  }

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    // Use regex search for title, description, tags, and author
    query.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { description: { $regex: search as string, $options: 'i' } },
      { tags: { $regex: search as string, $options: 'i' } },
      { authorName: { $regex: search as string, $options: 'i' } },
    ];
  }

  // Build sort
  let sortOption: any = { createdAt: -1 };
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  }

  const [snippets, total] = await Promise.all([
    Snippet.find(query).sort(sortOption).skip(skip).limit(limit),
    Snippet.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: snippets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get snippet by ID
// @route   GET /api/snippets/:id
// @access  Public
export const getSnippetById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const snippet = await Snippet.findById(id);

  if (!snippet) {
    throw new AppError('Snippet not found', 404);
  }

  res.status(200).json({
    success: true,
    data: snippet,
  });
});

// @desc    Get snippets by user
// @route   GET /api/snippets/user/:userId
// @access  Public
export const getSnippetsByUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [snippets, total] = await Promise.all([
    Snippet.find({ authorId: userId, isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Snippet.countDocuments({ authorId: userId, isPublic: true }),
  ]);

  res.status(200).json({
    success: true,
    data: snippets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Public (should be protected in production)
export const updateSnippet = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { id } = req.params;
  const updates = req.body;

  // Don't allow updating these fields
  delete updates.authorId;

  const oldSnippet = await Snippet.findById(id);
  if (!oldSnippet) {
    throw new AppError('Snippet not found', 404);
  }

  const snippet = await Snippet.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  // Update tag counts if tags changed
  if (updates.tags) {
    const oldTags = oldSnippet.tags;
    const newTags = updates.tags;

    const removedTags = oldTags.filter((tag: string) => !newTags.includes(tag));
    const addedTags = newTags.filter((tag: string) => !oldTags.includes(tag));

    if (removedTags.length > 0) {
      await updateTagCounts(removedTags, -1);
    }
    if (addedTags.length > 0) {
      await updateTagCounts(addedTags, 1);
    }
  }

  res.status(200).json({
    success: true,
    data: snippet,
  });
});

// @desc    Delete snippet
// @route   DELETE /api/snippets/:id
// @access  Public (should be protected in production)
export const deleteSnippet = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const snippet = await Snippet.findByIdAndDelete(id);

  if (!snippet) {
    throw new AppError('Snippet not found', 404);
  }

  // Update tag counts
  if (snippet.tags && snippet.tags.length > 0) {
    await updateTagCounts(snippet.tags, -1);
  }

  // Delete associated likes
  await Like.deleteMany({ snippetId: id });

  res.status(200).json({
    success: true,
    message: 'Snippet deleted successfully',
  });
});

// @desc    Like/Unlike snippet
// @route   POST /api/snippets/:id/like
// @access  Public (should be protected in production)
export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    throw new AppError('User ID is required', 400);
  }

  const snippet = await Snippet.findById(id);
  if (!snippet) {
    throw new AppError('Snippet not found', 404);
  }

  const existingLike = await Like.findOne({ userId, snippetId: id });

  if (existingLike) {
    // Unlike
    await Like.deleteOne({ userId, snippetId: id });
  } else {
    // Like
    await Like.create({ userId, snippetId: id });
  }

  const likeCount = await Like.countDocuments({ snippetId: id });

  res.status(200).json({
    success: true,
    message: existingLike ? 'Snippet unliked' : 'Snippet liked',
    liked: !existingLike,
    likes: likeCount,
  });
});

// @desc    Get liked snippets by user
// @route   GET /api/snippets/liked/:userId
// @access  Public
export const getLikedSnippets = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const likes = await Like.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('snippetId');

  const snippetIds = likes.map((like) => like.snippetId);

  const [snippets, total] = await Promise.all([
    Snippet.find({ _id: { $in: snippetIds }, isPublic: true }),
    Like.countDocuments({ userId }),
  ]);

  res.status(200).json({
    success: true,
    data: snippets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get popular tags and authors for search suggestions
// @route   GET /api/snippets/search-suggestions
// @access  Public
export const getSearchSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.length < 2) {
    res.status(200).json({
      success: true,
      data: { tags: [], authors: [] },
    });
    return;
  }

  const searchRegex = new RegExp(q, 'i');

  const [tags, authors] = await Promise.all([
    // Get popular tags that match search
    Snippet.aggregate([
      { $match: { isPublic: true } },
      { $unwind: '$tags' },
      { $match: { tags: searchRegex } },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]),
    // Get authors that match search
    Snippet.aggregate([
      { $match: { isPublic: true, authorName: searchRegex } },
      { $group: { _id: '$authorName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: { tags, authors },
  });
});

// Helper function to update tag counts
async function updateTagCounts(tags: string[], increment: number) {
  for (const tagName of tags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-');
    await Tag.findOneAndUpdate(
      { slug },
      {
        $inc: { count: increment },
        $setOnInsert: { name: tagName, slug },
      },
      { upsert: true, new: true }
    );
  }
}
