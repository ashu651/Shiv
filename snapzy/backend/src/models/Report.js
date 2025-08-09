import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['post', 'comment', 'user'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    commentId: { type: mongoose.Schema.Types.ObjectId },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, default: '' },
    status: { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' },
    action: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', ReportSchema);