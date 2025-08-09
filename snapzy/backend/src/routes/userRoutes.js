import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, follow, unfollow, searchUsers, togglePrivacy, suggestions } from '../controllers/userController.js';

const router = Router();

router.get('/search', requireAuth, searchUsers);
router.get('/suggestions', requireAuth, suggestions);
router.post('/privacy', requireAuth, togglePrivacy);
router.get('/:username', requireAuth, getProfile);
router.post('/:userId/follow', requireAuth, follow);
router.post('/:userId/unfollow', requireAuth, unfollow);

export default router;