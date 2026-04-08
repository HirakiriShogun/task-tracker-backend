import { create } from 'zustand';
import type { SafeUser } from 'entities/auth/types';

const STORAGE_KEY = 'task-tracker-auth';

type AuthStatus = 'booting' | 'guest' | 'authenticated';

type PersistedAuth = {
  token: string | null;
  user: SafeUser | null;
};

type AuthState = PersistedAuth & {
  status: AuthStatus;
  setSession: (payload: PersistedAuth) => void;
  setUser: (user: SafeUser) => void;
  setStatus: (status: AuthStatus) => void;
  clearSession: () => void;
};

function readPersistedAuth(): PersistedAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw) as PersistedAuth;

    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null,
    };
  } catch {
    return { token: null, user: null };
  }
}

function writePersistedAuth(data: PersistedAuth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const persisted = typeof window === 'undefined'
  ? { token: null, user: null }
  : readPersistedAuth();

export const useAuthStore = create<AuthState>((set) => ({
  token: persisted.token,
  user: persisted.user,
  status: persisted.token ? 'booting' : 'guest',
  setSession: ({ token, user }) => {
    writePersistedAuth({ token, user });
    set({
      token,
      user,
      status: 'authenticated',
    });
  },
  setUser: (user) => {
    const token = useAuthStore.getState().token;
    writePersistedAuth({ token, user });
    set({
      user,
      status: token ? 'authenticated' : 'guest',
    });
  },
  setStatus: (status) => set({ status }),
  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      token: null,
      user: null,
      status: 'guest',
    });
  },
}));
