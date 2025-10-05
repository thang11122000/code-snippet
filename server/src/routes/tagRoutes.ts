import express from 'express';
import { getAllTags, getPopularTags, searchTags } from '../controllers/tagController';
import { paginationValidation } from '../middleware/validation';

const router = express.Router();

// Tag routes
router.get('/', paginationValidation, getAllTags);
router.get('/popular', getPopularTags);
router.get('/search', searchTags);

export default router;