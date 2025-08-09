import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function Collections() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  const refresh = async () => {
    const { data } = await api.get('/collections');
    setItems(data.items);
  };

  useEffect(() => { refresh(); }, []);

  const create = async () => {
    if (!name.trim()) return;
    await api.post('/collections', { name });
    setName('');
    refresh();
  };

  const rename = async (id, newName) => {
    await api.put(`/collections/${id}`, { name: newName });
    refresh();
  };

  const remove = async (id) => {
    await api.delete(`/collections/${id}`);
    refresh();
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Collections</h1>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New collection name" className="border rounded px-3 py-1" />
        <button onClick={create} className="px-3 py-1 rounded border">Create</button>
      </div>
      <div className="space-y-2">
        {items.map((c) => (
          <div key={c._id} className="border rounded p-3 flex items-center justify-between">
            <div className="font-medium">{c.name}</div>
            <div className="flex gap-2">
              <button onClick={() => rename(c._id, prompt('New name', c.name) || c.name)} className="px-3 py-1 rounded border">Rename</button>
              <button onClick={() => remove(c._id)} className="px-3 py-1 rounded border">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}