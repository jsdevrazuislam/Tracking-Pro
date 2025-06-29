import { create } from "zustand";
import Cookies from "js-cookie";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/constants";
import api from "@/lib/api";
import ApiStrings from "@/lib/api-strings";

const storeResetFns = new Set<() => void>();

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: Cookies.get(ACCESS_TOKEN) || null,
  isAuthenticated: !!Cookies.get(ACCESS_TOKEN),
  user: null,
  currentLocation: null,
  setUser: (user) => set({ user }),
  setCurrentLocation: (currentLocation) => set({ currentLocation }),
  setLogin: (accessToken, user) => {
    Cookies.set(ACCESS_TOKEN, accessToken);
    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },
  logout: () => {
    const resetAllStores = () => {
      storeResetFns.forEach((resetFn) => {
        resetFn();
      });
    };
    resetAllStores();
    Cookies.remove(REFRESH_TOKEN);
    Cookies.remove(ACCESS_TOKEN);
  },
  initialLoading: async () => {
    if (get().accessToken) {
      const { data } = await api.get(ApiStrings.ME);
      set({
        user: data?.data,
      });
    }
  },
}));
