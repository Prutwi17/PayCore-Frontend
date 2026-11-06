import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { UserProfile, UserRole, LoginCredentials, RegisterFormData, AuthResponse } from '@/types/auth';
import { authService } from '@/services/api/authService';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isMerchant: boolean;
  isCustomer: boolean;
  hasRole: (role: UserRole | string) => boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  loginWithGoogle: (idToken: string) => Promise<AuthResponse>;
  register: (data: RegisterFormData) => Promise<UserProfile>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'paycore_access_token';
const REFRESH_TOKEN_KEY = 'paycore_refresh_token';
const USER_KEY = 'paycore_user_cache';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(USER_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as UserProfile;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    const activeRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (activeRefreshToken) {
      authService.logout(activeRefreshToken);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = localStorage.getItem(TOKEN_KEY);
    if (!activeToken) {
      setUser(null);
      return;
    }

    try {
      const profile = await authService.getMe();
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    } catch (error) {
      console.warn('Session verification failed, logging out:', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const profile = await authService.getMe();
          if (isMounted) {
            setUser(profile);
            localStorage.setItem(USER_KEY, JSON.stringify(profile));
          }
        } catch {
          if (isMounted) {
            logout();
          }
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);
      localStorage.setItem(TOKEN_KEY, authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
      setToken(authData.accessToken);
      setUser(authData.user);
      return authData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const authData = await authService.loginWithGoogle(idToken);
      localStorage.setItem(TOKEN_KEY, authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
      setToken(authData.accessToken);
      setUser(authData.user);
      return authData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterFormData): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(data);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback((role: UserRole | string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role as UserRole);
  }, [user]);

  const isAdmin = useMemo(() => hasRole('ROLE_ADMIN'), [hasRole]);
  const isMerchant = useMemo(() => hasRole('ROLE_MERCHANT'), [hasRole]);
  const isCustomer = useMemo(() => hasRole('ROLE_CUSTOMER'), [hasRole]);
  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin,
    isMerchant,
    isCustomer,
    hasRole,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshUser,
  }), [user, token, isAuthenticated, isLoading, isAdmin, isMerchant, isCustomer, hasRole, login, loginWithGoogle, register, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
