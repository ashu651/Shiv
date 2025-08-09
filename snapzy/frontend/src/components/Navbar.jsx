import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import { UserAPI } from '../lib/api.js';
import { BellIcon, BookmarkIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, PhotoIcon, RocketLaunchIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout, unreadCount } = useAuth();
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
    <nav className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-primary-700 hover:text-primary-800">
          <RocketLaunchIcon className="w-6 h-6" />
          <span className="font-extrabold text-xl">Snapzy</span>
        </Link>
        <div className="relative flex-1">
          <input value={q} onChange={onSearch} placeholder="Search users..." className="w-full border rounded-full px-4 py-2 bg-white/80 focus:outline-primary-500" />
          {results.length > 0 && (
            <div className="absolute bg-white border w-full mt-2 rounded-xl shadow-soft overflow-hidden">
              {results.map((u) => (
                <button key={u._id} onClick={() => { setResults([]); setQ(''); navigate(`/u/${u.username}`); }} className="block w-full text-left px-4 py-2 hover:bg-primary-50">
                  @{u.username}
                </button>
              ))}
            </div>
          )}
        </div>
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/explore" className="px-3 py-2 rounded-full hover:bg-primary-50 text-primary-700 flex items-center gap-1"><Squares2X2Icon className="w-5 h-5" /><span className="hidden sm:inline">Explore</span></Link>
            <Link to="/bookmarks" className="px-3 py-2 rounded-full hover:bg-primary-50 text-primary-700"><BookmarkIcon className="w-5 h-5" /></Link>
            <Link to="/notifications" className="relative px-3 py-2 rounded-full hover:bg-primary-50 text-primary-700">
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full px-1.5 py-0.5">{unreadCount}</span>
              )}
            </Link>
            <Link to="/collections" className="px-3 py-2 rounded-full hover:bg-primary-50 text-primary-700"><BookmarkIcon className="w-5 h-5" /></Link>
            <Link to="/chat" className="px-3 py-2 rounded-full hover:bg-primary-50 text-primary-700"><ChatBubbleLeftRightIcon className="w-5 h-5" /></Link>
            <Link to="/upload" className="px-3 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1"><PhotoIcon className="w-5 h-5" /><span className="hidden sm:inline">Upload</span></Link>
            <Link to={`/u/${user.username}`} className="px-3 py-2 rounded-full hover:bg-primary-50 text-primary-700">@{user.username}</Link>
            <Link to="/settings" className="px-3 py-2 rounded-full hover:bg-primary-50 text-primary-700"><Cog6ToothIcon className="w-5 h-5" /></Link>
            <button onClick={logout} className="px-3 py-2 rounded-full border hover:bg-gray-50">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 rounded-full border hover:bg-gray-50">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-full bg-primary-600 text-white hover:bg-primary-700">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}