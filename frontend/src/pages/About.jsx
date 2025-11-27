import React from "react";
import fondoJapones from "../assets/images/fondo_japones.jpg";
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { language } = useLanguage();

  const texts = {
    es: {
      title: "Acerca de la aplicación",
      paragraph1:
        "Esta aplicación ha sido desarrollada como parte de un proyecto de tesis. Su objetivo es facilitar la gestión y visualización de datos relevantes para los usuarios, ofreciendo una experiencia intuitiva y eficiente.",
      paragraph2: "Si tienes preguntas o sugerencias, no dudes en contactarnos.",
    },
    en: {
      title: "About the application",
      paragraph1:
        "This application was developed as part of a thesis project. Its goal is to make it easier for users to manage and visualize relevant data, offering an intuitive and efficient experience.",
      paragraph2: "If you have any questions or suggestions, feel free to contact us.",
    },
  };

  const t = texts[language] || texts.es;

  return (
    <div
      className="
        max-w-xl mx-auto my-10 p-6
        bg-white/90 dark:bg-gray-800/90
        text-gray-900 dark:text-gray-100
        rounded-xl shadow-lg
        transition-colors duration-300
      "
      style={{
        backgroundImage: `url(${fondoJapones})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <h1 className="text-2xl font-bold mb-4">{t.title}</h1>
      <p className="mb-3">{t.paragraph1}</p>
      <p>{t.paragraph2}</p>
    </div>
  );
};

export default About;
