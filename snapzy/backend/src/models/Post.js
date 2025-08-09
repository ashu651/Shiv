import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const MediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    caption: { type: String, default: '' },
    hashtags: [{ type: String, index: true }],
    media: { type: [MediaSchema], default: [] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', PostSchema);