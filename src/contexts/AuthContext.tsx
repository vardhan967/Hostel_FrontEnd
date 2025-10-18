import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: any | null; // User data from the backend
  loading: boolean;
  token: string | null;
  // login now returns the fetched user object (or void on error)
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const navigate = useNavigate();

  // useEffect to react to changes in the token
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Fetch real user info from the API using the token
          const userData = await getMe(token);
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user info", error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (username, password) => {
    // Attempt login and accept different token response shapes
    const res = await loginUser({ username, password });
    // res may be { token } or { auth_token } or { key } depending on backend
    const tokenVal = (res as any).token || (res as any).auth_token || (res as any).key || (res as any).access || null;
    if (!tokenVal) {
      // If the login endpoint returned something unexpected, throw for the caller
      throw new Error('Login failed: no token returned');
    }

    // Persist token and update state
    localStorage.setItem('authToken', tokenVal);
    setToken(tokenVal);
    // Optimistic user to update UI immediately
    setUser({ email: username, username });

    // Fetch authoritative user profile
    try {
      const userData = await getMe(tokenVal);
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Failed to fetch user after login', err);
      // Keep optimistic user but still surface the token to caller
      return { email: username, username } as any;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const register = async (userData) => {
    await registerUser(userData);
    toast.success('Registration successful! Please log in.');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Defensive: during HMR or if provider isn't mounted for any reason,
  // return a safe fallback instead of throwing so the app doesn't crash.
  if (context === undefined) {
    return {
      user: null,
      loading: false,
      token: null,
      login: async () => {},
      logout: () => {},
      register: async () => {},
    } as any;
  }
  return context;
};

