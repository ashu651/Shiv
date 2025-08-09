import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostAPI, UserAPI } from '../lib/api.js';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    UserAPI.profile(username).then(({ user }) => {
      setProfile(user);
      PostAPI.byUser(user._id).then(({ posts }) => setPosts(posts));
    });
  }, [username]);

  const isMe = user && profile && user._id === profile._id;
  const isFollowing = user && profile && user.following?.some?.((id) => id === profile._id);

  const followToggle = async () => {
    if (!profile) return;
    if (isFollowing) await UserAPI.unfollow(profile._id);
    else await UserAPI.follow(profile._id);
    const { user: refreshed } = await UserAPI.profile(username);
    setProfile(refreshed);
  };

  const updatePost = (updated) => setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
          {profile.avatarUrl && <img src={profile.avatarUrl} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">@{profile.username}</h1>
            {!isMe && (
              <button onClick={followToggle} className="px-3 py-1 rounded border">{isFollowing ? 'Unfollow' : 'Follow'}</button>
            )}
          </div>
          <p className="text-gray-600">{profile.bio}</p>
          <div className="text-sm text-gray-500 mt-1">{profile.followers?.length || 0} followers · {profile.following?.length || 0} following</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-6">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} onUpdate={updatePost} />
        ))}
      </div>
    </div>
  );
}