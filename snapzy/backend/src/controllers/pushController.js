import webpush from 'web-push';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

const VAPID_PUBLIC = process.env.VAPID_PUBLIC || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || '';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails('mailto:admin@snapzy.app', VAPID_PUBLIC, VAPID_PRIVATE);
}

export const getVapidPublicKey = asyncHandler(async (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC });
});

export const saveSubscription = asyncHandler(async (req, res) => {
  const sub = req.body;
  if (!sub?.endpoint) return res.status(400).json({ message: 'Invalid subscription' });
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { pushSubscriptions: sub } });
  res.json({ success: true });
});

export const sendTestPush = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  const payload = JSON.stringify({ title: 'Snapzy', body: 'Push works!' });
  const results = [];
  for (const sub of user.pushSubscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      results.push({ ok: true });
    } catch (e) {
      results.push({ ok: false, error: e.message });
    }
  }
  res.json({ results });
});