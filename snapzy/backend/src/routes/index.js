import { Router } from 'express';
import authRoutes from './authRoutes.js';
import postRoutes from './postRoutes.js';
import userRoutes from './userRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import storyRoutes from './storyRoutes.js';
import chatRoutes from './chatRoutes.js';
import collectionRoutes from './collectionRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/stories', storyRoutes);
router.use('/chats', chatRoutes);
router.use('/collections', collectionRoutes);

export default router;