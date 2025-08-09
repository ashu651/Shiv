import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthAPI, loadTokenFromStorage, setAuthToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = loadTokenFromStorage();
    if (!token) {
      setLoading(false);
      return;
    }
    AuthAPI.me()
      .then((data) => setUser(data.user))
      .catch(() => setAuthToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (emailOrUsername, password) => {
    const { token, user: u } = await AuthAPI.login({ emailOrUsername, password });
    setAuthToken(token);
    setUser(u);
  };

  const register = async (username, email, password) => {
    const { token, user: u } = await AuthAPI.register({ username, email, password });
    setAuthToken(token);
    setUser(u);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, setUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}