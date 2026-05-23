import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  isPostAdModalOpen: boolean;
  isLoading: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openPostAdModal: () => void;
  closePostAdModal: () => void;
  handleSignIn: (email: string, password: string, name?: string, mode?: 'login' | 'register') => Promise<void>;
  handleSignOut: () => void;
  handleUpdateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);
  const [shouldOpenPostAdAfterAuth, setShouldOpenPostAdAfterAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (authAPI.isLoggedIn()) {
        try {
          const data = await authAPI.getMe();
          setUser(data.user);
        } catch (error) {
          authAPI.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setShouldOpenPostAdAfterAuth(false);
  };
  const openPostAdModal = () => {
    if (!user) {
      setShouldOpenPostAdAfterAuth(true);
      setIsAuthModalOpen(true);
    } else {
      setIsPostAdModalOpen(true);
    }
  };
  const closePostAdModal = () => setIsPostAdModalOpen(false);

  const handleSignIn = async (email: string, password: string, name?: string, mode?: 'login' | 'register') => {
    try {
      let data;
      if (mode === 'register' && name) {
        data = await authAPI.register(name, email, password);
      } else {
        data = await authAPI.login(email, password);
      }
      setUser(data.user);
      closeAuthModal();
      if (shouldOpenPostAdAfterAuth) {
        setIsPostAdModalOpen(true);
        setShouldOpenPostAdAfterAuth(false);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const handleSignOut = () => {
    authAPI.logout();
    setUser(null);
  };

  const handleUpdateUser = async (updates: Partial<User>) => {
    try {
      if (updates.avatar && Object.keys(updates).length === 1) {
        setUser((prev) => (prev ? { ...prev, ...updates } : prev));
        return;
      }
      const data = await authAPI.updateProfile(updates);
      setUser(data.user);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const value = {
    user,
    isAuthModalOpen,
    isPostAdModalOpen,
    isLoading,
    openAuthModal,
    closeAuthModal,
    openPostAdModal,
    closePostAdModal,
    handleSignIn,
    handleSignOut,
    handleUpdateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
