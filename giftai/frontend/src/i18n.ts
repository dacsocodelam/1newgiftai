import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationJA from "./locales/ja/translation.json";
import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";

const resources = {
  ja: {
    translation: translationJA,
  },
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

// Get language from localStorage or browser, fallback to Japanese
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
const browserLanguage = typeof window !== 'undefined' ? navigator.language.split('-')[0] : 'ja';
const defaultLanguage = savedLanguage || (resources[browserLanguage as keyof typeof resources] ? browserLanguage : 'ja');

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "ja",
  interpolation: { escapeValue: false },
});

// Save language preference when changed
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
  }
});

export default i18n;
