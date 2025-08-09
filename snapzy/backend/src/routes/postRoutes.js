import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createPost, getFeed, getExplore, getByUser, toggleLike, addComment, updateCaption, deletePost, toggleBookmark, getBookmarks } from '../controllers/postController.js';

const router = Router();

router.get('/feed', requireAuth, getFeed);
router.get('/explore', requireAuth, getExplore);
router.get('/bookmarks', requireAuth, getBookmarks);
router.get('/user/:userId', requireAuth, getByUser);
router.post('/', requireAuth, upload.single('image'), createPost);
router.post('/:postId/like', requireAuth, toggleLike);
router.post('/:postId/comment', requireAuth, addComment);
router.post('/:postId/bookmark', requireAuth, toggleBookmark);
router.put('/:postId', requireAuth, updateCaption);
router.delete('/:postId', requireAuth, deletePost);

export default router;