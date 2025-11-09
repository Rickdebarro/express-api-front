import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IAuthContext, AuthResult, LoginResponse } from '../types';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<IAuthContext | null>(null);

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse | { message: string } = await response.json();

      if (!response.ok) {
        throw new Error((data as { message: string }).message || 'Falha no login');
      }

      const { token } = data as LoginResponse;
      setToken(token);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true };

    } catch (error) {
      setLoading(false);

      return { success: false, message: (error as Error).message };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha no registro');
      }
      
      setLoading(false);
      return { success: true };

    } catch (error) {
      setLoading(false);
      return { success: false, message: (error as Error).message };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};