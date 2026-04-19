import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

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
      },
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
