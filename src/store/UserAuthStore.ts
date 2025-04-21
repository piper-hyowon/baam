import { create } from "zustand";

interface AuthStore {
  token: string; // Access Token
  isAuthenticated: boolean;
  refreshToken: string; // Refresh Token
  setToken: (token: string) => void;
  setIsAuthenticated: (condition: boolean) => void;
  setRefreshToken: (token: string) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  token: "",
  isAuthenticated: false,
  refreshToken: "",
  setToken: (token) => set({ token: token }),
  setIsAuthenticated: (condition) => set({ isAuthenticated: !!condition }),
  setRefreshToken: (token) => set({ refreshToken: token })
}));

export default useAuthStore;
