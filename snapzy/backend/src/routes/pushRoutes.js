import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getVapidPublicKey, saveSubscription, sendTestPush } from '../controllers/pushController.js';

const router = Router();

router.get('/key', requireAuth, getVapidPublicKey);
router.post('/subscribe', requireAuth, saveSubscription);
router.post('/test', requireAuth, sendTestPush);

export default router;