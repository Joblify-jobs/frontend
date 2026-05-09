import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  subscription: {
    is_subscribed: boolean;
    end_date?: string;
  };
  bookmarks: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  checkSession: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      login: async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email); // FastAPI OAuth2 uses 'username'
        formData.append('password', password);

        const response = await axios.post(`${API_URL}/auth/login`, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token } = response.data;
        
        // Fetch user data after login
        const userRes = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` }
        });

        set({ 
          user: userRes.data, 
          token: access_token, 
          refreshToken: refresh_token 
        });

        // Set automatic logout timer for 1 hour
        setTimeout(() => {
          useAuthStore.getState().logout();
          toast.error("Session Expired", {
            description: "Your session has expired. Please login again.",
          });
          setTimeout(() => {
            window.location.href = '/login?expired=true';
          }, 2000);
        }, 60 * 60 * 1000);
      },
      logout: () => {
        set({ user: null, token: null, refreshToken: null });
        // Optionally notify backend if token is still valid
      },
      checkSession: () => {
        const { token } = (useAuthStore.getState() as any);
        if (!token) return;
        // In a real app, you might check JWT expiration claim here
      },
      fetchUser: async () => {
        const { token } = (useAuthStore.getState() as any);
        if (!token) return;
        const userRes = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        set({ user: userRes.data });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
