import { Link } from 'react-router-dom';
import { PostAPI } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LikeButton from './LikeButton.jsx';
import CommentBox from './CommentBox.jsx';

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();

  const toggleLike = async () => {
    const { post: updated } = await PostAPI.like(post._id);
    onUpdate(updated);
  };

  const addComment = async (text) => {
    const { post: updated } = await PostAPI.comment(post._id, text);
    onUpdate(updated);
  };

  const liked = !!post.likes?.some?.((id) => id === user?._id);

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="flex items-center gap-2 p-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
          {post.author.avatarUrl && <img src={post.author.avatarUrl} className="w-full h-full object-cover" />}
        </div>
        <Link to={`/u/${post.author.username}`} className="font-medium">@{post.author.username}</Link>
      </div>
      <div className="bg-black">
        <img src={post.imageUrl} className="w-full object-cover" alt={post.caption} />
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-3">
          <LikeButton liked={liked} count={post.likes?.length || 0} onClick={toggleLike} />
        </div>
        {post.caption && <p>{post.caption}</p>}
        <div className="space-y-1">
          {post.comments?.slice(0, 3).map((c) => (
            <div key={c._id} className="text-sm"><span className="font-medium">@{c.user?.username}</span>: {c.text}</div>
          ))}
        </div>
        <CommentBox onSubmit={addComment} />
      </div>
    </div>
  );
}