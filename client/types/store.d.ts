interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setLogin: (accessToken: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  user: User | null;
  initialLoading: () => void
  currentLocation: CurrentLocation | null
  setCurrentLocation: (data: CurrentLocation) => void
}

type Language = "en" | "bn";

interface TranslationStore {
  language: Language;
  translations: Record<Language, Record<string, string>>;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface CurrentLocation {
  latitude: number,
  longitude: number,
  place_name: string | null
}
