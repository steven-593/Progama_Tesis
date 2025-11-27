import { createContext, useContext, useState, useEffect } from "react";
import translations from "../utils/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "es");

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key) => {
    if (!translations[language] || !translations[language][key]) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return translations.es[key] || key;
    }
    return translations[language][key];
  };

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
