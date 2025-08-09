import { useEffect, useState } from 'react';
import { PostAPI } from '../lib/api.js';
import PostCard from '../components/PostCard.jsx';

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    load(1, true);
  }, []);

  const load = async (nextPage = page + 1, reset = false) => {
    const { posts: items, hasMore: more } = await PostAPI.bookmarks({ page: nextPage });
    setPosts((prev) => (reset ? items : [...prev, ...items]));
    setPage(nextPage);
    setHasMore(more);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Bookmarks</h1>
      {posts.map((p) => (
        <PostCard key={p._id} post={p} onUpdate={(u) => setPosts((prev) => prev.map((x) => (x._id === u._id ? u : x)))} />
      ))}
      {hasMore && (<button onClick={() => load()} className="w-full py-2 rounded border">Load more</button>)}
    </div>
  );
}