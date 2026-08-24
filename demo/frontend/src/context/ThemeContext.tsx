import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from '../i18n';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: keyof Translations) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('ROBO_THEME') as Theme;
    return savedTheme || 'dark';
  });

  const [lang, setLangState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('ROBO_LANG') as Language;
    return savedLang || 'tr';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('ROBO_THEME', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('ROBO_LANG', l);
  };

  const toggleLang = () => {
    setLang(lang === 'tr' ? 'en' : 'tr');
  };

  const t = (key: keyof Translations): string => {
    const dict = translations[lang] || translations.tr;
    return dict[key] || translations.tr[key] || key;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, lang, setLang, toggleLang, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
