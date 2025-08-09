import { Router } from 'express';
import { register, login, me, updateProfile, health, refreshToken, forgotPassword, resetPassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/health', health);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);
router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateProfile);

export default router;