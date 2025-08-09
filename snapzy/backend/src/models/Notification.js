import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['like', 'comment', 'follow', 'post'], required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    text: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', NotificationSchema);