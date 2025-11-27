import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

export default function Home() {
  const { language } = useLanguage();

  const texts = {
    es: {
      title: "Página de Inicio",
      buttonText: "Click aquí",
      alertMessage: "¡Hola!",
    },
    en: {
      title: "Home Page",
      buttonText: "Click here",
      alertMessage: "Hello!",
    },
  };

  const t = texts[language] || texts.es;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {t.title}
        </h1>
        <Button onClick={() => alert(t.alertMessage)}>
          {t.buttonText}
        </Button>
      </div>
    </div>
  );
}