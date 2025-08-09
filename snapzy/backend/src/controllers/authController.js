import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';

function signAccessToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '15m' });
}
function signRefreshToken(userId) {
  return jwt.sign({ userId, type: 'refresh' }, config.jwtSecret, { expiresIn: '30d' });
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
  const token = signAccessToken(user._id.toString());
  const refresh = signRefreshToken(user._id.toString());
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  res.status(201).json({ token, refresh, user: safeUser });
});

export const login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) return res.status(400).json({ message: 'Missing fields' });

  const query = emailOrUsername.includes('@') ? { email: emailOrUsername } : { username: emailOrUsername.toLowerCase() };
  const user = await User.findOne(query);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signAccessToken(user._id.toString());
  const refresh = signRefreshToken(user._id.toString());
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  res.json({ token, refresh, user: safeUser });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refresh } = req.body;
  if (!refresh) return res.status(400).json({ message: 'Missing refresh token' });
  try {
    const payload = jwt.verify(refresh, config.jwtSecret);
    if (payload.type !== 'refresh') throw new Error('Invalid');
    const token = signAccessToken(payload.userId);
    const newRefresh = signRefreshToken(payload.userId);
    res.json({ token, refresh: newRefresh });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { bio, avatarUrl } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { bio, avatarUrl }, { new: true }).select('-passwordHash');
  res.json({ user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: true });
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await PasswordResetToken.create({ user: user._id, tokenHash, expiresAt });
  // In production, send email with link containing token
  res.json({ success: true, token });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid' });
  const prt = await PasswordResetToken.findOne({ user: user._id, used: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
  if (!prt) return res.status(400).json({ message: 'Invalid' });
  const ok = await bcrypt.compare(token, prt.tokenHash);
  if (!ok) return res.status(400).json({ message: 'Invalid' });
  user.passwordHash = await User.hashPassword(password);
  await user.save();
  prt.used = true;
  await prt.save();
  res.json({ success: true });
});