import { useEffect, useState } from 'react';
import { PostAPI } from '../lib/api.js';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    PostAPI.feed()
      .then(({ posts }) => setPosts(posts))
      .finally(() => setLoading(false));
  }, []);

  const updatePost = (updated) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  if (loading) return <div className="p-6">Loading feed...</div>;

  return (
    <div className="max-w-xl mx-auto p-3 space-y-4">
      {posts.length === 0 && (
        <div className="text-center text-gray-600">Your feed is empty. Follow users or upload a post.</div>
      )}
      {posts.map((p) => (
        <PostCard key={p._id} post={p} onUpdate={updatePost} />
      ))}
    </div>
  );
}