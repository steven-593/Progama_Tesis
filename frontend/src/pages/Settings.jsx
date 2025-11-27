import { useState } from 'react';
import {
  Bell,
  Lock,
  Mail,
  Shield,
  Database,
  Moon,
  Sun,
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();

  const texts = {
    es: {
      title: "Configuración",
      subtitle: "Administra las preferencias de tu cuenta",
      notifications: "Notificaciones",
      emailNotif: "Notificaciones por Email",
      emailNotifDesc: "Recibe actualizaciones por correo",
      pushNotif: "Notificaciones Push",
      pushNotifDesc: "Recibe notificaciones en el navegador",
      smsNotif: "Notificaciones SMS",
      smsNotifDesc: "Recibe mensajes de texto",
      security: "Seguridad",
      currentPassword: "Contraseña actual",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar nueva contraseña",
      currentPasswordPlaceholder: "Ingresa tu contraseña actual",
      newPasswordPlaceholder: "Ingresa tu nueva contraseña",
      confirmPasswordPlaceholder: "Confirma tu nueva contraseña",
      changePassword: "Cambiar Contraseña",
      preferences: "Preferencias",
      appTheme: "Tema de la aplicación",
      light: "Claro",
      dark: "Oscuro",
      passwordsMismatch: "⚠️ Las contraseñas no coinciden",
      completeFields: "⚠️ Por favor completa todos los campos",
      passwordUpdated: "✅ Contraseña actualizada correctamente",
      passwordError: "❌ Error al cambiar la contraseña",
    },
    en: {
      title: "Settings",
      subtitle: "Manage your account preferences",
      notifications: "Notifications",
      emailNotif: "Email Notifications",
      emailNotifDesc: "Receive updates via email",
      pushNotif: "Push Notifications",
      pushNotifDesc: "Receive browser notifications",
      smsNotif: "SMS Notifications",
      smsNotifDesc: "Receive text messages",
      security: "Security",
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      currentPasswordPlaceholder: "Enter your current password",
      newPasswordPlaceholder: "Enter your new password",
      confirmPasswordPlaceholder: "Confirm your new password",
      changePassword: "Change Password",
      preferences: "Preferences",
      appTheme: "Application theme",
      light: "Light",
      dark: "Dark",
      passwordsMismatch: "⚠️ Passwords do not match",
      completeFields: "⚠️ Please complete all fields",
      passwordUpdated: "✅ Password updated successfully",
      passwordError: "❌ Error changing password",
    },
  };

  const t = texts[language] || texts.es;

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const notificationOptions = [
    {
      id: 'email',
      icon: Mail,
      title: t.emailNotif,
      desc: t.emailNotifDesc,
    },
    {
      id: 'push',
      icon: Bell,
      title: t.pushNotif,
      desc: t.pushNotifDesc,
    },
    {
      id: 'sms',
      icon: Mail,
      title: t.smsNotif,
      desc: t.smsNotifDesc,
    },
  ];

  const passwordFields = [
    {
      field: 'current',
      label: t.currentPassword,
      placeholder: t.currentPasswordPlaceholder,
    },
    {
      field: 'new',
      label: t.newPassword,
      placeholder: t.newPasswordPlaceholder,
    },
    {
      field: 'confirm',
      label: t.confirmPassword,
      placeholder: t.confirmPasswordPlaceholder,
    },
  ];

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert(t.passwordsMismatch);
      return;
    }

    if (!passwordData.current || !passwordData.new) {
      alert(t.completeFields);
      return;
    }

    try {
      console.log('Cambiando contraseña...');
      // Simulación de petición al backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(t.passwordUpdated);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      alert(t.passwordError);
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        {t.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        {t.subtitle}
      </p>

      {/* 🔔 NOTIFICACIONES */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t.notifications}
          </h2>
        </div>

        {notificationOptions.map(({ id, icon: Icon, title, desc }) => (
          <div
            key={id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3"
          >
            <div className="flex items-center gap-3">
              <Icon className="text-gray-400" size={20} />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[id]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [id]: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      {/* 🔐 SEGURIDAD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t.security}
          </h2>
        </div>

        {passwordFields.map(({ field, label, placeholder }) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label}
            </label>
            <Input
              type="password"
              placeholder={placeholder}
              value={passwordData[field]}
              onChange={(e) =>
                setPasswordData({ ...passwordData, [field]: e.target.value })
              }
              icon={Lock}
            />
          </div>
        ))}

        <Button onClick={handlePasswordChange} variant="primary">
          <Shield size={18} />
          {t.changePassword}
        </Button>
      </div>

      {/* ⚙️ PREFERENCIAS */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <Database className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t.preferences}
          </h2>
        </div>

        {/* Tema */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t.appTheme}
          </label>
          <div className="flex gap-3">
            {/* Botón Claro */}
            <button
              onClick={() => toggleTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                theme === "light"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-300 text-gray-700 dark:text-gray-200"
              }`}
            >
              <Sun size={18} />
              {t.light}
            </button>

            {/* Botón Oscuro */}
            <button
              onClick={() => toggleTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                theme === "dark"
                  ? "border-blue-500 bg-gray-800 text-white"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-300 text-gray-700 dark:text-gray-200"
              }`}
            >
              <Moon size={18} />
              {t.dark}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}