import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { getSocket } from '../lib/socket.js';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get('/chats').then((r) => setChats(r.data.chats));
    const token = localStorage.getItem('snapzy_token');
    const s = getSocket(token);
    s.on('message', (payload) => {
      if (payload.chatId === active?._id) {
        setMessages((prev) => [...prev, payload.message]);
      }
    });
  }, [active?._id]);

  const openChat = async (chat) => {
    setActive(chat);
    const { data } = await api.get(`/chats/${chat._id}/messages`);
    setMessages(data.messages);
  };

  const send = async () => {
    if (!text.trim() || !active) return;
    const { data } = await api.post(`/chats/${active._id}/messages`, { text });
    setMessages((prev) => [...prev, data.message]);
    setText('');
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 p-4">
      <div className="border rounded p-2 space-y-2">
        {chats.map((c) => (
          <button key={c._id} onClick={() => openChat(c)} className={`block w-full text-left px-3 py-2 rounded ${active?._id === c._id ? 'bg-gray-200' : 'hover:bg-gray-50'}`}>
            {c.participants.map((p) => p.username).join(', ')}
          </button>
        ))}
      </div>
      <div className="col-span-2 border rounded p-2 flex flex-col">
        <div className="flex-1 space-y-2 overflow-auto">
          {messages.map((m) => (
            <div key={m._id} className="px-3 py-2 bg-gray-100 rounded">{m.text || '[media]'}</div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" className="flex-1 border rounded px-3 py-1" />
          <button onClick={send} className="px-3 py-1 rounded bg-black text-white">Send</button>
        </div>
      </div>
    </div>
  );
}