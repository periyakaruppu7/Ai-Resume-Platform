import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          setUser(response.data);
          localStorage.setItem('user_info', JSON.stringify(response.data));
        } catch (error) {
          console.error("Auth session expired", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const { token, user: userData } = response.data;
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_info', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const { token, user: newUser } = response.data;
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_info', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
