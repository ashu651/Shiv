import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true }
);

export const Collection = mongoose.model('Collection', CollectionSchema);