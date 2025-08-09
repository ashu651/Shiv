import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostAPI } from '../lib/api.js';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) return setError('Select media');
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('caption', caption);
      await PostAPI.create(form);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Post</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full" />
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (use #hashtags)" className="w-full border rounded px-3 py-2" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full py-2 rounded bg-black text-white">Post</button>
      </form>
    </div>
  );
}