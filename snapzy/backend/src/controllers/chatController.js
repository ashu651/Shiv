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
  let chat = await Chat.findOne({ participants: { $all: [req.user._id, peerId] } });
  if (!chat) {
    chat = await Chat.create({ participants: [req.user._id, peerId] });
  }
  chat = await chat.populate('participants', 'username avatarUrl');
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
  const peerId = chat.participants.find((id) => id.toString() !== req.user._id.toString());
  const msg = await Message.create({ chat: chat._id, from: req.user._id, to: peerId, text, mediaUrl });
  await Chat.findByIdAndUpdate(chat._id, { lastMessageAt: new Date(), lastMessage: text || '[media]' });
  emitToUser(peerId.toString(), 'message', { chatId: chat._id.toString(), message: msg });
  res.status(201).json({ message: msg });
});