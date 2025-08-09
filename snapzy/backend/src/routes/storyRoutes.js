import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createStory, getStories } from '../controllers/storyController.js';

const router = Router();

router.get('/', requireAuth, getStories);
router.post('/', requireAuth, createStory);

export default router;