import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "SUPER_ADMIN";
};

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true });
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Erro ao fazer login." }));
      set({ loading: false });
      throw new Error(data.message);
    }
    const data = await res.json();
    set({ user: data.user, loading: false });
  },

  register: async (name, email, password, passwordConfirmation) => {
    set({ loading: true });
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, passwordConfirmation }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Erro ao cadastrar." }));
      set({ loading: false });
      throw new Error(data.message);
    }
    const data = await res.json();
    set({ user: data.user, loading: false });
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, loading: false });
  },

  fetchProfile: async () => {
    try {
      set({ loading: true });
      const res = await fetch("/api/auth/profile");
      if (res.ok) {
        const user = await res.json();
        set({ user, loading: false, initialized: true });
      } else {
        set({ user: null, loading: false, initialized: true });
      }
    } catch {
      set({ user: null, loading: false, initialized: true });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true });
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Erro ao atualizar." }));
      set({ loading: false });
      throw new Error(err.message);
    }
    const updated = await res.json();
    set({ user: updated, loading: false });
  },
}));
