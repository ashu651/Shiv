import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { user: updated } = await AuthAPI.updateMe({ bio, avatarUrl });
      setUser(updated);
      navigate(`/u/${updated.username}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="Avatar URL" className="w-full border rounded px-3 py-2" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" className="w-full border rounded px-3 py-2" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full py-2 rounded bg-black text-white">Save</button>
      </form>
    </div>
  );
}