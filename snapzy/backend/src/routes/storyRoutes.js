import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createStory, getStories, viewStory, listViewers } from '../controllers/storyController.js';

const router = Router();

router.get('/', requireAuth, getStories);
router.post('/', requireAuth, createStory);
router.post('/:id/view', requireAuth, viewStory);
router.get('/:id/viewers', requireAuth, listViewers);

export default router;