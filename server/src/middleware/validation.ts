import { body, param, query, ValidationChain } from 'express-validator';

// Snippet validation
export const createSnippetValidation: ValidationChain[] = [
  body('title')
    .notEmpty()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title is required and must be max 200 characters'),
  body('description')
    .notEmpty()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description is required and must be max 1000 characters'),
  body('code').notEmpty().withMessage('Code is required'),
  body('languageCode').notEmpty().trim().withMessage('Language code is required'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with max 10 items'),
  body('authorId').notEmpty().withMessage('Author ID is required'),
  body('authorName').notEmpty().withMessage('Author name is required'),
  body('complexity').optional().isString().withMessage('Complexity must be a string').bail().trim(),
];

export const updateSnippetValidation: ValidationChain[] = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be max 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be max 1000 characters'),
  body('code').optional().notEmpty().withMessage('Code cannot be empty'),
  body('languageCode').optional().trim().notEmpty().withMessage('Language code cannot be empty'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with max 10 items'),
  body('complexity').optional().isString().withMessage('Complexity must be a string').bail().trim(),
];

// Query validation
export const paginationValidation: ValidationChain[] = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const snippetQueryValidation: ValidationChain[] = [
  ...paginationValidation,
  query('languageCode').optional().trim(),
  query('tag').optional().trim(),
  query('search').optional().trim(),
  query('sort').optional().isIn(['latest', 'oldest']).withMessage('Sort must be latest or oldest'),
];

// ID validation
export const idValidation: ValidationChain[] = [
  param('id').notEmpty().withMessage('ID parameter is required'),
];
