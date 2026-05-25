import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:        null,
      token:       null,
      loading:     false,
      initialized: false,

      setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
      },

      // Called once on app mount — restores session from localStorage
      init: async () => {
        const token = localStorage.getItem('token');
        if (!token) return set({ initialized: true, user: null, token: null });
        try {
          const { data } = await authService.getMe();
          set({ user: data.user, token, initialized: true });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null, initialized: true });
        }
      },

      register: async (formData) => {
        set({ loading: true });
        try {
          const { data } = await authService.register(formData);
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, loading: false });
          toast.success('Account created!');
          return true;
        } catch (err) {
          toast.error(err.response?.data?.message || 'Registration failed');
          set({ loading: false });
          return false;
        }
      },

      login: async (formData) => {
        set({ loading: true });
        try {
          const { data } = await authService.login(formData);
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, loading: false });
          toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
          return true;
        } catch (err) {
          toast.error(err.response?.data?.message || 'Invalid email or password');
          set({ loading: false });
          return false;
        }
      },

      logout: async () => {
        try { await authService.logout(); } catch { /* silent */ }
        localStorage.removeItem('token');
        set({ user: null, token: null });
        toast.success('Logged out');
      },

      updateUser: (updates) => set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ token: s.token }),
    }
  )
);

export default useAuthStore;