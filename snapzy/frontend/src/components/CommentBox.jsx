import { useState } from 'react';

export default function CommentBox({ onSubmit }) {
  const [text, setText] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; onSubmit(text.trim()); setText(''); }} className="flex gap-2">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" className="flex-1 border rounded px-3 py-1" />
      <button className="px-3 py-1 rounded bg-black text-white">Post</button>
    </form>
  );
}