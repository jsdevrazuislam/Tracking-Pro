import { create } from 'zustand';
import bn from '@/i18n/bn';
import en from '@/i18n/en';

export const useTranslationStore = create<TranslationStore>((set, get) => ({
  language: 'bn',
  translations: {
    en,
    bn,
  },
  setLanguage: async lang => {
    set({ language: lang });
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error saving language to AsyncStorage:', error);
    }
  },
  t: key => {
    const { language, translations } = get();
    return translations[language][key] || key;
  },
}));

const initializeLanguage = () => {
  try {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      useTranslationStore.getState().setLanguage(storedLanguage as Language);
    }
  } catch (error) {
    console.error('Error loading language from AsyncStorage:', error);
  }
};

initializeLanguage();