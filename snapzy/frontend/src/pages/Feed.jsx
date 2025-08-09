import { useEffect, useState } from 'react';
import { PostAPI, UserAPI } from '../lib/api.js';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    PostAPI.feed()
      .then(({ posts }) => setPosts(posts))
      .finally(() => setLoading(false));
    UserAPI.suggestions?.() && UserAPI.suggestions().then(({ users }) => setSuggested(users)).catch(() => {});
  }, []);

  const updatePost = (updated) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  if (loading) return <div className="p-6">Loading feed...</div>;

  return (
    <div className="max-w-xl mx-auto p-3 space-y-4">
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-white"></div>
            </div>
            <div className="text-xs text-gray-500">Story</div>
          </div>
        ))}
      </div>
      {suggested.length > 0 && (
        <div className="border rounded-xl p-3 bg-white shadow-soft">
          <div className="font-medium mb-2">Suggested for you</div>
          <div className="flex flex-wrap gap-2">
            {suggested.map((u) => (
              <div key={u._id} className="px-2 py-1 border rounded-full text-sm hover:bg-primary-50">@{u.username}</div>
            ))}
          </div>
        </div>
      )}
      {posts.length === 0 && (
        <div className="text-center text-gray-600">Your feed is empty. Follow users or upload a post.</div>
      )}
      {posts.map((p) => (
        <PostCard key={p._id} post={p} onUpdate={updatePost} />
      ))}
    </div>
  );
}