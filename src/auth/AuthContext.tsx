import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

// Hardcoded users for demonstration
const USERS = [
  {
    id: '1',
    username: 'ello_admin',
    password: 'stellar',
    name: 'Ello Admin',
    company: 'ello'
  },
  {
    id: '2',
    username: 'stacia_admin',
    password: 'stellar',
    name: 'Stacia Admin',
    company: 'stacia'
  }
];

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Find user with matching credentials
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Remove password before storing
      const { id, username, name, company } = user;
      const userWithoutPassword = { id, username, name, company };
      setCurrentUser(userWithoutPassword as User);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};