import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function signToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
}

export const health = asyncHandler(async (req, res) => {
  res.json({ status: 'ok' });
});

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const exists = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
  if (exists) return res.status(409).json({ message: 'User already exists' });

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ username, email, passwordHash });
  const token = signToken(user._id.toString());
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  res.status(201).json({ token, user: safeUser });
});

export const login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) return res.status(400).json({ message: 'Missing fields' });

  const query = emailOrUsername.includes('@') ? { email: emailOrUsername } : { username: emailOrUsername.toLowerCase() };
  const user = await User.findOne(query);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user._id.toString());
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  res.json({ token, user: safeUser });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { bio, avatarUrl } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { bio, avatarUrl }, { new: true }).select('-passwordHash');
  res.json({ user });
});