interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setLogin: (accessToken: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  user: User | null;
  initialLoading: () => void
}