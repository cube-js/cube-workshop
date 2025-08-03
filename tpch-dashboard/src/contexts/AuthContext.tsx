import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import cubeApi from '../services/cubeApi';

interface User {
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string, role: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('workshop_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Update Cube API service with JWT token
        if (userData.token) {
          cubeApi.setToken(userData.token);
        }
      } catch (error) {
        // Clear invalid session data
        localStorage.removeItem('workshop_user');
      }
    }
  }, []);

  const login = (email: string, name: string, role: string, token: string) => {
    const userData = { email, name, role, token };
    setUser(userData);
    localStorage.setItem('workshop_user', JSON.stringify(userData));
    
    // Update Cube API service with JWT token
    cubeApi.setToken(token);
    
    console.log('🔐 User logged in:', { email, name, role });
    console.log('🎫 JWT token generated and set');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workshop_user');
    
    console.log('🚪 User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};