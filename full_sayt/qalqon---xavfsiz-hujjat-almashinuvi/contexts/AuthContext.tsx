import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, AuthManager } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  company?: any;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    companyId?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        if (AuthManager.isAuthenticated()) {
          const savedUser = AuthManager.getUser();
          if (savedUser) {
            setUser(savedUser);
          } else {
            // Try to get user profile from API
            const profile = await authAPI.getProfile();
            setUser(profile);
            AuthManager.setUser(profile);
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        AuthManager.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      
      AuthManager.setToken(response.access_token);
      AuthManager.setUser(response.user);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      AuthManager.removeToken();
      setUser(null);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    companyId?: string;
  }) => {
    try {
      setIsLoading(true);
      await authAPI.register(userData);
      // Note: After registration, user might need admin approval
      // So we don't automatically log them in
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;