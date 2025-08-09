import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import { UserAPI } from '../lib/api.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const onSearch = async (e) => {
    const value = e.target.value;
    setQ(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    const { users } = await UserAPI.search(value);
    setResults(users);
  };

  return (
    <nav className="border-b sticky top-0 bg-white/80 backdrop-blur z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="font-bold text-xl">Snapzy</Link>
        <div className="relative flex-1">
          <input value={q} onChange={onSearch} placeholder="Search users" className="w-full border rounded px-3 py-1" />
          {results.length > 0 && (
            <div className="absolute bg-white border w-full mt-1 rounded shadow">
              {results.map((u) => (
                <button key={u._id} onClick={() => { setResults([]); setQ(''); navigate(`/u/${u.username}`); }} className="block w-full text-left px-3 py-2 hover:bg-gray-50">
                  @{u.username}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/upload" className="px-3 py-1 rounded bg-black text-white">Upload</Link>
              <Link to={`/u/${user.username}`} className="hover:underline">@{user.username}</Link>
              <Link to="/settings" className="px-3 py-1 rounded border">Settings</Link>
              <button onClick={logout} className="px-3 py-1 rounded border">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded border">Login</Link>
              <Link to="/register" className="px-3 py-1 rounded bg-black text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}