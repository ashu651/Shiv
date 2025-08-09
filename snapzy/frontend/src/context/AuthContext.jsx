import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthAPI, loadTokenFromStorage, setAuthToken } from '../lib/api.js';
import { getSocket, closeSocket } from '../lib/socket.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = loadTokenFromStorage();
    if (!token) {
      setLoading(false);
      return;
    }
    AuthAPI.me()
      .then((data) => {
        setUser(data.user);
        const s = getSocket(token);
        s.on('notification', () => setUnreadCount((c) => c + 1));
        s.on('new_post', () => {});
      })
      .catch(() => setAuthToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (emailOrUsername, password) => {
    const { token, user: u } = await AuthAPI.login({ emailOrUsername, password });
    setAuthToken(token);
    setUser(u);
    const s = getSocket(token);
    s.on('notification', () => setUnreadCount((c) => c + 1));
    s.on('new_post', () => {});
  };

  const register = async (username, email, password) => {
    const { token, user: u } = await AuthAPI.register({ username, email, password });
    setAuthToken(token);
    setUser(u);
    const s = getSocket(token);
    s.on('notification', () => setUnreadCount((c) => c + 1));
    s.on('new_post', () => {});
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    closeSocket();
    setUnreadCount(0);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser, unreadCount, setUnreadCount }), [user, loading, unreadCount]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}