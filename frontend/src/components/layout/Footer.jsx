import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const getFooterText = () => {
    switch (language) {
      case "es":
        return "© 2023 Programa Tesis. Todos los derechos reservados.";
      case "en":
        return "© 2023 Thesis Program. All rights reserved.";
      case "pt":
        return "© 2023 Programa de Tese. Todos os direitos reservados.";
      case "fr":
        return "© 2023 Programme de Thèse. Tous droits réservés.";
      default:
        return "© 2023 Programa Tesis. Todos los derechos reservados.";
    }
  };

  return (
    <footer
      style={{
        backgroundColor: theme === "dark" ? "#1a202c" : "#f9fafb",
        color: theme === "dark" ? "#ffffff" : "#000000",
        textAlign: "center",
        padding: "16px 0",
        borderTop: `1px solid ${theme === "dark" ? "#2d3748" : "#e5e7eb"}`,
      }}
    >
      <p>{getFooterText()}</p>
    </footer>
  );
};

export default Footer;
