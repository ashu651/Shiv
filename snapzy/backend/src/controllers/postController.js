import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Post } from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPost = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image provided' });

  let imageUrl = '';
  if (config.useCloudinary) {
    const result = await uploadToCloudinary(req.file.buffer, `${req.user._id}_${Date.now()}`);
    imageUrl = result.secure_url;
  } else {
    const uploadsDir = path.resolve(__dirname, '../../', config.uploadDir);
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const filename = `${req.user._id}_${Date.now()}_${req.file.originalname}`.replace(/\s+/g, '_');
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, req.file.buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const { caption = '' } = req.body;
  const post = await Post.create({ author: req.user._id, imageUrl, caption });
  const populated = await post.populate('author', 'username avatarUrl');
  res.status(201).json({ post: populated });
});

export const getFeed = asyncHandler(async (req, res) => {
  const followingIds = req.user.following.concat([req.user._id]);
  const posts = await Post.find({ author: { $in: followingIds } })
    .populate('author', 'username avatarUrl')
    .populate('comments.user', 'username avatarUrl')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ posts });
});

export const getByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const posts = await Post.find({ author: userId })
    .populate('author', 'username avatarUrl')
    .populate('comments.user', 'username avatarUrl')
    .sort({ createdAt: -1 });
  res.json({ posts });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const userIdStr = req.user._id.toString();
  const hasLiked = post.likes.some((id) => id.toString() === userIdStr);
  if (hasLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
  } else {
    post.likes.push(req.user._id);
  }
  await post.save();
  const populated = await post.populate('author', 'username avatarUrl');
  res.json({ post: populated });
});

export const addComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text required' });
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.comments.push({ user: req.user._id, text });
  await post.save();
  const populated = await Post.findById(postId).populate('comments.user', 'username avatarUrl').populate('author', 'username avatarUrl');
  res.status(201).json({ post: populated });
});

export const updateCaption = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { caption = '' } = req.body;
  const post = await Post.findOneAndUpdate({ _id: postId, author: req.user._id }, { caption }, { new: true })
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