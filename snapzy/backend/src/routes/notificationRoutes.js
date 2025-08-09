import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listNotifications, markAllRead } from '../controllers/notificationController.js';

const router = Router();

router.get('/', requireAuth, listNotifications);
router.post('/read', requireAuth, markAllRead);

export default router;