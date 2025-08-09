import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listChats, getOrCreateChat, listMessages, sendMessage, createGroup, addMember, removeMember } from '../controllers/chatController.js';

const router = Router();

router.get('/', requireAuth, listChats);
router.post('/with/:userId', requireAuth, getOrCreateChat);
router.post('/group', requireAuth, createGroup);
router.post('/:chatId/members', requireAuth, addMember);
router.delete('/:chatId/members', requireAuth, removeMember);
router.get('/:chatId/messages', requireAuth, listMessages);
router.post('/:chatId/messages', requireAuth, sendMessage);

export default router;