import express from 'express';
import {
  createSnippet,
  getAllSnippets,
  getSnippetById,
  getSnippetsByUser,
  updateSnippet,
  deleteSnippet,
  toggleLike,
  getLikedSnippets,
} from '../controllers/snippetController';
import {
  createSnippetValidation,
  updateSnippetValidation,
  snippetQueryValidation,
  idValidation,
  paginationValidation,
} from '../middleware/validation';

const router = express.Router();

// Snippet routes
router.post('/', createSnippetValidation, createSnippet);
router.get('/', snippetQueryValidation, getAllSnippets);
router.get('/user/:userId', [...idValidation, ...paginationValidation], getSnippetsByUser);
router.get('/liked/:userId', [...idValidation, ...paginationValidation], getLikedSnippets);
router.get('/:id', idValidation, getSnippetById);
router.put('/:id', [...idValidation, ...updateSnippetValidation], updateSnippet);
router.delete('/:id', idValidation, deleteSnippet);
router.post('/:id/like', idValidation, toggleLike);

export default router;