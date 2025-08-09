import { asyncHandler } from '../utils/asyncHandler.js';
import { Chat, Message } from '../models/Chat.js';
import { emitToUser } from '../config/io.js';

export const listChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'username avatarUrl')
    .sort({ updatedAt: -1 });
  res.json({ chats });
});

export const getOrCreateChat = asyncHandler(async (req, res) => {
  const peerId = req.params.userId;
  let chat = await Chat.findOne({ isGroup: false, participants: { $all: [req.user._id, peerId] } });
  if (!chat) {
    chat = await Chat.create({ participants: [req.user._id, peerId] });
  }
  chat = await chat.populate('participants', 'username avatarUrl');
  res.json({ chat });
});

export const createGroup = asyncHandler(async (req, res) => {
  const { name, memberIds } = req.body;
  const participants = [req.user._id, ...(memberIds || [])];
  const chat = await Chat.create({ isGroup: true, name: name || 'Group', participants, admins: [req.user._id] });
  const populated = await chat.populate('participants', 'username avatarUrl');
  res.status(201).json({ chat: populated });
});

export const addMember = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const { userId } = req.body;
  let chat = await Chat.findById(chatId);
  if (!chat?.isGroup) return res.status(400).json({ message: 'Not a group' });
  await Chat.findByIdAndUpdate(chatId, { $addToSet: { participants: userId } });
  chat = await Chat.findById(chatId).populate('participants', 'username avatarUrl');
  res.json({ chat });
});

export const removeMember = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const { userId } = req.body;
  let chat = await Chat.findById(chatId);
  if (!chat?.isGroup) return res.status(400).json({ message: 'Not a group' });
  await Chat.findByIdAndUpdate(chatId, { $pull: { participants: userId } });
  chat = await Chat.findById(chatId).populate('participants', 'username avatarUrl');
  res.json({ chat });
});

export const listMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const skip = (page - 1) * limit;
  const [messages, total] = await Promise.all([
    Message.find({ chat: chatId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Message.countDocuments({ chat: chatId })
  ]);
  res.json({ messages: messages.reverse(), page, limit, total, hasMore: skip + messages.length < total });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const { text = '', mediaUrl = '' } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  if (!chat.participants.map((id) => id.toString()).includes(req.user._id.toString())) {
    return res.status(403).json({ message: 'Not a participant' });
  }
  const msg = await Message.create({ chat: chat._id, from: req.user._id, text, mediaUrl });
  await Chat.findByIdAndUpdate(chat._id, { lastMessageAt: new Date(), lastMessage: text || '[media]' });
  for (const uid of chat.participants) {
    if (uid.toString() === req.user._id.toString()) continue;
    emitToUser(uid.toString(), 'message', { chatId: chat._id.toString(), message: msg });
  }
  res.status(201).json({ message: msg });
});