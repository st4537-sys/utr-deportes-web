import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const restaurarSesion = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) {
        setLoadingSession(false);
        return;
      }
      try {
        const data = await apiFetch('/api/auth/me');
        const userData = data.user || data;
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        setUser(null);
      } finally {
        setLoadingSession(false);
      }
    };

    restaurarSesion();
  }, []);

  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    localStorage.setItem('user_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    return await apiFetch('/api/auth/register', {
      method: 'POST',
      body: { ...formData, rol: 'USER' },
    });
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loadingSession, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);