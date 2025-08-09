import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createPost, getFeed, getByUser, toggleLike, addComment, updateCaption, deletePost } from '../controllers/postController.js';

const router = Router();

router.get('/feed', requireAuth, getFeed);
router.get('/user/:userId', requireAuth, getByUser);
router.post('/', requireAuth, upload.single('image'), createPost);
router.post('/:postId/like', requireAuth, toggleLike);
router.post('/:postId/comment', requireAuth, addComment);
router.put('/:postId', requireAuth, updateCaption);
router.delete('/:postId', requireAuth, deletePost);

export default router;