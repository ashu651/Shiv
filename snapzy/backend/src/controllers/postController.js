import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';
import { uploadToCloudinary, cloudinaryThumbnailFromUrl } from '../config/cloudinary.js';
import { emitToUser } from '../config/io.js';
import { User } from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractHashtags(caption) {
  const matches = (caption || '').match(/#([\p{L}0-9_]+)/gu) || [];
  return [...new Set(matches.map((m) => m.slice(1).toLowerCase()))];
}

export const createPost = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image provided' });

  let imageUrl = '';
  let thumbnailUrl = '';
  if (config.useCloudinary) {
    const result = await uploadToCloudinary(req.file.buffer, `${req.user._id}_${Date.now()}`, undefined, 'auto');
    imageUrl = result.secure_url;
    thumbnailUrl = cloudinaryThumbnailFromUrl(imageUrl);
  } else {
    const uploadsDir = path.resolve(__dirname, '../../', config.uploadDir);
    const thumbsDir = path.join(uploadsDir, 'thumbs');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

    const safeName = `${req.user._id}_${Date.now()}_${req.file.originalname}`.replace(/\s+/g, '_');
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, req.file.buffer);
    imageUrl = `/uploads/${safeName}`;

    const thumbPath = path.join(thumbsDir, safeName);
    await sharp(req.file.buffer).resize(600).jpeg({ quality: 80 }).toFile(thumbPath);
    thumbnailUrl = `/uploads/thumbs/${safeName}`;
  }

  const { caption = '' } = req.body;
  const hashtags = extractHashtags(caption);
  const post = await Post.create({ author: req.user._id, imageUrl, thumbnailUrl, caption, hashtags });
  const populated = await post.populate('author', 'username avatarUrl');

  // Emit to followers
  const author = await User.findById(req.user._id).select('followers');
  for (const followerId of author.followers) {
    emitToUser(followerId.toString(), 'new_post', { post: populated });
  }

  res.status(201).json({ post: populated });
});

export const getFeed = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
  const skip = (page - 1) * limit;
  const followingIds = req.user.following.concat([req.user._id]);
  const [posts, total] = await Promise.all([
    Post.find({ author: { $in: followingIds } })
      .populate('author', 'username avatarUrl')
      .populate('comments.user', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments({ author: { $in: followingIds } }),
  ]);
  res.json({ posts, page, limit, total, hasMore: skip + posts.length < total });
});

export const getExplore = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '12', 10), 60);
  const skip = (page - 1) * limit;
  const tag = (req.query.tag || '').toLowerCase();
  const filter = tag ? { hashtags: tag } : {};
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filter),
  ]);
  res.json({ posts, page, limit, total, hasMore: skip + posts.length < total });
});

export const getByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Post.find({ author: userId })
      .populate('author', 'username avatarUrl')
      .populate('comments.user', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments({ author: userId }),
  ]);
  res.json({ posts, page, limit, total, hasMore: skip + posts.length < total });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId).populate('author', 'username avatarUrl');
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const userIdStr = req.user._id.toString();
  const hasLiked = post.likes.some((id) => id.toString() === userIdStr);
  if (hasLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
  } else {
    post.likes.push(req.user._id);
    if (userIdStr !== post.author._id.toString()) {
      emitToUser(post.author._id.toString(), 'notification', { type: 'like', postId: post._id, fromUserId: userIdStr });
    }
  }
  await post.save();
  const populated = await Post.findById(post._id).populate('author', 'username avatarUrl');
  res.json({ post: populated });
});

export const addComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text required' });
  const post = await Post.findById(postId).populate('author', 'username avatarUrl');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.comments.push({ user: req.user._id, text });
  await post.save();
  emitToUser(post.author._id.toString(), 'notification', { type: 'comment', postId: post._id, fromUserId: req.user._id.toString(), text });
  const populated = await Post.findById(postId).populate('comments.user', 'username avatarUrl').populate('author', 'username avatarUrl');
  res.status(201).json({ post: populated });
});

export const updateCaption = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { caption = '' } = req.body;
  const hashtags = extractHashtags(caption);
  const post = await Post.findOneAndUpdate({ _id: postId, author: req.user._id }, { caption, hashtags }, { new: true })
    .populate('author', 'username avatarUrl');
  if (!post) return res.status(404).json({ message: 'Post not found or not owner' });
  res.json({ post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findOneAndDelete({ _id: postId, author: req.user._id });
  if (!post) return res.status(404).json({ message: 'Post not found or not owner' });
  res.json({ success: true });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const user = await User.findById(req.user._id).select('savedPosts');
  const saved = user.savedPosts.map((id) => id.toString()).includes(postId);
  if (saved) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { savedPosts: postId } });
  } else {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedPosts: postId } });
  }
  const updated = await User.findById(req.user._id).select('savedPosts');
  res.json({ savedPosts: updated.savedPosts });
});

export const getBookmarks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
  const skip = (page - 1) * limit;
  const user = await User.findById(req.user._id).select('savedPosts');
  const total = user.savedPosts.length;
  const ids = user.savedPosts.slice(skip, skip + limit);
  const posts = await Post.find({ _id: { $in: ids } })
    .populate('author', 'username avatarUrl')
    .sort({ createdAt: -1 });
  res.json({ posts, page, limit, total, hasMore: skip + posts.length < total });
});

export const trendingHashtags = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const results = await Post.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);
  res.json({ tags: results.map((r) => ({ tag: r._id, count: r.count })) });
});

export const replyComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { text, parentId } = req.body;
  if (!text || !parentId) return res.status(400).json({ message: 'text and parentId required' });
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.comments.push({ user: req.user._id, text, parent: parentId });
  await post.save();
  const populated = await Post.findById(postId).populate('comments.user', 'username avatarUrl').populate('author', 'username avatarUrl');
  res.status(201).json({ post: populated });
});