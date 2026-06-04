import { create } from 'zustand';

interface VendorState {
  user: { id?: string; email: string; role: string; token: string } | null;
  login: (email: string, role: string, token: string, id?: string) => void;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useStore = create<VendorState>((set) => ({
  user: null,
  login: (email, role, token, id) => set({ user: { id, email, role, token } }),
  logout: () => set({ user: null }),

  theme: 'light',
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { theme: nextTheme };
  }),
}));
