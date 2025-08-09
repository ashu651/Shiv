import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Notification.find({ toUser: req.user._id })
      .populate('fromUser', 'username avatarUrl')
      .populate('post', 'thumbnailUrl imageUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ toUser: req.user._id }),
  ]);
  res.json({ items, page, limit, total, hasMore: skip + items.length < total });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ toUser: req.user._id, read: false }, { $set: { read: true } });
  res.json({ success: true });
});