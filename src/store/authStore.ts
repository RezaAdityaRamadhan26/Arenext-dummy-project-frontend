import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (user: any, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => {
        set({ user, token });

        // Simpan ke cookies untuk middleware
        Cookies.set('token', token, { expires: 7, path: '/', sameSite: 'Lax' });
        Cookies.set('role', user.role, { expires: 7, path: '/', sameSite: 'Lax' });
        Cookies.set('user', JSON.stringify(user), { expires: 7, path: '/', sameSite: 'Lax' });
      },

      clearAuth: () => {
        set({ user: null, token: null });

        // Hapus dari cookies
        Cookies.remove('token', { path: '/' });
        Cookies.remove('role', { path: '/' });
        Cookies.remove('user', { path: '/' });
      },
    }),
    {
      name: 'arenext-auth',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : undefined as any)),
    }
  )
);