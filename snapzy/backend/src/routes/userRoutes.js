import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, follow, unfollow, searchUsers } from '../controllers/userController.js';

const router = Router();

router.get('/search', requireAuth, searchUsers);
router.get('/:username', requireAuth, getProfile);
router.post('/:userId/follow', requireAuth, follow);
router.post('/:userId/unfollow', requireAuth, unfollow);

export default router;