import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, default: '' },
    mediaUrl: { type: String, default: '' },
    readAt: { type: Date },
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessageAt: { type: Date },
    lastMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', MessageSchema);
export const Chat = mongoose.model('Chat', ChatSchema);