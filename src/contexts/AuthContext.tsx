import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, getCurrentUser, isAuthenticated, changePassword } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (googleUser: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext(undefined);

export function AuthProvider({ children }: { children: any }) {
  // Initialize from localStorage immediately to prevent logout on hot reload
  const [user, setUser] = useState(() => {
    try {
      // Try to get user immediately from token (synchronous check)
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token));
          // Return a placeholder user - will be updated when DB is ready
          return { id: payload.userId } as User;
        } catch {
          return null;
        }
      }
    } catch {
      return null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for database to be initialized before checking auth
    const checkAuth = async () => {
      // If we already have a user with full details, skip if token still exists
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Ensure database is initialized
        await import('../db/database').then(module => module.initDatabase());
        
        // Small delay to ensure database is fully ready
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Check if user is already logged in
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id) {
          setUser(currentUser);
        } else if (user?.id) {
          // If we have a user ID from initial state but getCurrentUser failed,
          // keep the user state - prevents logout during hot reload
          // Will retry to get full user details
          setTimeout(async () => {
            try {
              const retryUser = getCurrentUser();
              if (retryUser && retryUser.id) {
                setUser(retryUser);
              }
            } catch {
              // Keep existing user state
            }
          }, 300);
        } else if (token) {
          // Token exists but no user - restore from token
          try {
            const payload = JSON.parse(atob(token));
            setUser({ id: payload.userId } as User);
          } catch {
            // Ignore
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Never clear user if token exists - this prevents logout on hot reload
        if (token && !user) {
          // Token exists but user not set - try to restore from token
          try {
            const payload = JSON.parse(atob(token));
            setUser({ id: payload.userId } as User);
          } catch {
            // Ignore parse errors
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmail(email, password);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const response = await signUpWithEmail(email, password, name, phone);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async (googleUser: any) => {
    try {
      const response = await signInWithGoogle(googleUser);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    signOut();
    setUser(null);
  };

  const refreshUser = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.id) {
      return { success: false, error: 'User not found' };
    }
    return await changePassword(user.id, currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuth: isAuthenticated(),
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
        changePassword: handleChangePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

