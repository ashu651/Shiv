export default function LikeButton({ liked, count, onClick }) {
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded border ${liked ? 'bg-black text-white' : ''}`}>
      ❤ {count}
    </button>
  );
}