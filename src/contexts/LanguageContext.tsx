import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationStrings, TRANSLATIONS } from '../lib/translations';

interface LanguageContextType {
  lang: Language;
  setLanguage: (newLang: Language) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('Smaran_lang') as Language;
      if (saved && ['en', 'as', 'brx', 'mni', 'hi'].includes(saved)) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('Smaran_lang', newLang);
    }
  };

  useEffect(() => {
    // Keep document lang attribute in sync
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Safe fallback if used outside provider
    const fallbackLang: Language = (typeof window !== 'undefined' && (localStorage.getItem('Smaran_lang') as Language)) || 'en';
    return {
      lang: fallbackLang,
      setLanguage: () => {},
      t: TRANSLATIONS[fallbackLang] || TRANSLATIONS.en,
    };
  }
  return context;
}
