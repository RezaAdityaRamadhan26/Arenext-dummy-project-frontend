import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (user: any, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null,
  token: Cookies.get('token') || null,

  login: (user, token) => {
    set({ user, token });

    Cookies.set('token', token, { expires: 1, path: '/' });
    Cookies.set('role', user.role, { expires: 1, path: '/' });
    Cookies.set('user', JSON.stringify(user), { expires: 1, path: '/' });
  },

  clearAuth: () => {
    set({ user: null, token: null });

    Cookies.remove('token', { path: '/' });
    Cookies.remove('role', { path: '/' });
    Cookies.remove('user', { path: '/' });
    
    localStorage.removeItem('auth-storage'); 
  },
}));