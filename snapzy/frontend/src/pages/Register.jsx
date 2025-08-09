import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register: registerUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full border rounded px-3 py-2" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full py-2 rounded bg-black text-white">Create Account</button>
      </form>
      <p className="mt-3 text-sm">Have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  );
}