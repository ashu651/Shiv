import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext.jsx';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const { setUnreadCount } = useAuth();

  useEffect(() => {
    api.get('/notifications').then((r) => setItems(r.data.items));
    api.post('/notifications/read').then(() => setUnreadCount(0));
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-2">
        {items.map((n) => (
          <div key={n._id} className="border rounded p-3">
            <div className="text-sm text-gray-500">{dayjs(n.createdAt).fromNow?.() || dayjs(n.createdAt).format('YYYY-MM-DD HH:mm')}</div>
            <div>
              <span className="font-medium">@{n.fromUser?.username}</span>
              {n.type === 'follow' && ' followed you.'}
              {n.type === 'like' && ' liked your post.'}
              {n.type === 'comment' && ` commented: ${n.text}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}