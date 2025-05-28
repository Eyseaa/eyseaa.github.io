import React from 'react';
import { addToast } from '@heroui/react';

interface User {
  username: string;
  name: string;
  email?: string; // Add email field
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });
  
  const [user, setUser] = React.useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Mock user data - in a real app, this would be handled by a backend
  const mockUsers = [
    { username: 'kacper', password: 'reliance123', name: 'Kacper' },
    { username: 'demo', password: 'demo123', name: 'Demo User' },
  ];

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    if (user) {
      const userData = { username: user.username, name: user.name, email: user.username + '@example.com' };
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store auth state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      
      addToast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
        color: "success",
      });
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear auth state from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    addToast({
      title: "Logged out",
      description: "You have been logged out successfully",
      color: "primary",
    });
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);