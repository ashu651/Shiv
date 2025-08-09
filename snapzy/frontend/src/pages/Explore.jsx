import { useEffect, useState } from 'react';
import { PostAPI, api } from '../lib/api.js';
import PostCard from '../components/PostCard.jsx';

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tag, setTag] = useState('');
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    api.get('/posts/trending').then((r) => setTrending(r.data.tags));
  }, []);

  useEffect(() => {
    load(1, true);
  }, [tag]);

  const load = async (nextPage = page + 1, reset = false) => {
    const { posts: items, hasMore: more } = await PostAPI.explore({ page: nextPage, tag });
    setPosts((prev) => (reset ? items : [...prev, ...items]));
    setPage(nextPage);
    setHasMore(more);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2">
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Filter by #hashtag (without #)" className="border rounded px-3 py-1" />
        <button onClick={() => load(1, true)} className="px-3 py-1 rounded border">Search</button>
      </div>
      {trending.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {trending.map((t) => (
            <button key={t.tag} onClick={() => setTag(t.tag)} className="px-2 py-1 border rounded text-sm">#{t.tag}</button>
          ))}
        </div>
      )}
      {posts.map((p) => (
        <PostCard key={p._id} post={p} onUpdate={(u) => setPosts((prev) => prev.map((x) => (x._id === u._id ? u : x)))} />
      ))}
      {hasMore && (
        <button onClick={() => load()} className="w-full py-2 rounded border">Load more</button>
      )}
    </div>
  );
}