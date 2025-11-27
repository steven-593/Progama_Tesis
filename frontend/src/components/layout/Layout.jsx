import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Home,
  User,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../common/Button";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/", labelKey: "dashboard", icon: Home, color: "text-blue-400" },
    { path: "/profile", labelKey: "profile", icon: User, color: "text-purple-400" },
    { path: "/users", labelKey: "users", icon: UsersIcon, color: "text-green-400" },
    { path: "/settings", labelKey: "settings", icon: SettingsIcon, color: "text-yellow-400" },
    { path: "/about", labelKey: "about", icon: Info, color: "text-pink-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors">
      {user && (
        <nav
          className="
            sticky top-0 z-50
            backdrop-blur-xl bg-white/60 dark:bg-gray-900/50
            border-b border-white/20 dark:border-gray-700
            shadow-lg transition-all
          "
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="flex justify-between items-center h-16">
              {/* 🧭 Logo reducido solo al ícono */}
              <Link to="/" className="flex items-center gap-2 group">
                <Home
                  className="text-blue-500 group-hover:rotate-6 transition-transform"
                  size={26}
                />
              </Link>

              {/* 🧩 Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {navItems.map(({ path, labelKey, icon: Icon, color }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                        ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                            : "hover:bg-white/40 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                        }
                      `}
                    >
                      <Icon
                        size={20}
                        className={`${color} ${isActive ? "text-white" : ""} transition-colors`}
                      />
                      {t(labelKey)}
                    </Link>
                  );
                })}
              </div>

              {/* 🌐 Selector de idioma + Usuario + Logout */}
              <div className="flex items-center gap-4">
                {/* 🔤 Selector de idioma */}
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm focus:outline-none dark:text-white"
                >
                  <option value="es">🇪🇸 ES</option>
                  <option value="en">🇺🇸 EN</option>
                </select>

                {/* 👤 Usuario */}
                <div className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>

                {/* 🚪 Cerrar sesión */}
                <Button
                  variant="danger"
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition-transform"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">{t("logout")}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 📱 Mobile Navigation */}
          <div className="md:hidden border-t border-white/20 dark:border-gray-700 bg-white/60 dark:bg-gray-900/50 backdrop-blur-md shadow-md">
            <div className="flex justify-around py-2">
              {navItems.map(({ path, labelKey, icon: Icon, color }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`
                      flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all
                      ${
                        isActive
                          ? "text-blue-500 font-semibold scale-105"
                          : "text-gray-600 dark:text-gray-300 hover:text-blue-400"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={`${color} ${isActive ? "text-blue-500" : ""}`}
                    />
                    {t(labelKey)}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* 🧱 Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 transition-all">
        {children}
      </main>
    </div>
  );
}
