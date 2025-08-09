import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(emailOrUsername, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} placeholder="Email or Username" className="w-full border rounded px-3 py-2" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full py-2 rounded bg-black text-white">Login</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="underline">Register</Link></p>
    </div>
  );
}