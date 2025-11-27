import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import fondoJapones from "../assets/images/fondo_japones.jpg";
import Lottie from "lottie-react";
import "../index.css";

// Puedes usar una animación alojada o descargar el JSON
import loginAnimation from "../assets/animations/login.json"; // (crea esta carpeta y guarda el JSON de Lottie)

export default function LoginPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const { login, register } = useAuth();

  const texts = {
    es: {
      welcomeLogin: "Bienvenido",
      welcomeRegister: "Crea tu cuenta",
      emailPlaceholder: "✉️ Correo electrónico",
      passwordPlaceholder: "🔒 Contraseña",
      loginButton: "Iniciar Sesión",
      registerButton: "Registrar Cuenta",
      loggingIn: "Ingresando...",
      registering: "Registrando...",
      forgotPassword: "¿Olvidaste tu contraseña?",
      createAccount: "Crear cuenta",
      backToLogin: "Volver al inicio de sesión",
      completeFields: "Por favor completa todos los campos",
      loginError: "Error al iniciar sesión",
      registerSuccess: "✅ Cuenta creada correctamente. Ahora inicia sesión.",
      serverError: "Error al conectar con el servidor",
    },
  };

  const t = texts[language] || texts.es;

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError(t.completeFields);
      return;
    }

    try {
      setLoading(true);
      let result;

      if (isRegisterMode) {
        result = await register(email, password);
        if (result.success) {
          alert(t.registerSuccess);
          setIsRegisterMode(false);
        } else {
          setError(result.error || "No se pudo crear la cuenta");
        }
      } else {
        result = await login(email, password);
        if (!result.success) {
          setError(result.error || t.loginError);
        }
      }
    } catch {
      setError(t.serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${fondoJapones})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-blue-600 to-pink-500 opacity-40 animate-gradientMove"></div>

      <div
        className="flex flex-col items-center justify-center 
        w-full max-w-md mx-4 rounded-3xl overflow-hidden relative z-10
        backdrop-blur-2xl border border-white/20 shadow-2xl 
        transition-transform duration-500 hover:scale-[1.01] animate-fadeIn p-10 bg-white/10"
      >
        {/* 🔹 Animación Lottie */}
        <Lottie
          animationData={loginAnimation}
          loop
          className="w-48 h-48 mb-2"
        />

        <h1 className="text-3xl font-bold mb-6 text-white tracking-wide drop-shadow-md">
          {isRegisterMode ? t.welcomeRegister : t.welcomeLogin}
        </h1>

        <div className="space-y-4 w-full">
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <input
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 rounded-full bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:brightness-110 transition text-white font-semibold shadow-lg disabled:opacity-70"
          >
            {loading
              ? isRegisterMode
                ? t.registering
                : t.loggingIn
              : isRegisterMode
              ? t.registerButton
              : t.loginButton}
          </button>
        </div>

        {error && (
          <p className="text-red-400 mt-3 text-sm font-medium">{error}</p>
        )}

        <div className="flex justify-between text-sm text-gray-200 mt-4 w-full">
          {!isRegisterMode && (
            <a href="#" className="hover:underline">
              {t.forgotPassword}
            </a>
          )}

          <button
            onClick={() => {
              setError("");
              setIsRegisterMode(!isRegisterMode);
            }}
            className="hover:underline text-gray-200"
          >
            {isRegisterMode ? t.backToLogin : t.createAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
