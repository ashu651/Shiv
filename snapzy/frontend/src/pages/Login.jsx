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
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft border p-6">
        <h1 className="text-2xl font-extrabold text-primary-700 mb-4">Welcome back</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} placeholder="Email or Username" className="w-full border rounded-xl px-3 py-2 focus:outline-primary-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-3 py-2 focus:outline-primary-500" />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700">Login</button>
        </form>
        <p className="mt-4 text-sm text-gray-600">No account? <Link to="/register" className="text-primary-700 hover:underline">Register</Link></p>
      </div>
    </div>
  );
}