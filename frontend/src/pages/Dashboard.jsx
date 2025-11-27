import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Users, CheckCircle, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const texts = {
    es: {
      greeting: "¡Hola",
      welcome: "Bienvenido a tu panel de control. Aquí puedes visualizar estadísticas y gestionar tus datos.",
      totalUsers: "Total Usuarios",
      activeProjects: "Proyectos Activos",
      completedTasks: "Tareas Completadas",
      registerUser: "Registrar Usuario",
      registerUserDesc: "Agrega un nuevo usuario al sistema.",
      reviewProjects: "Revisar Proyectos",
      reviewProjectsDesc: "Visualiza el progreso de tus proyectos activos.",
      pendingTasks: "Tareas Pendientes",
      pendingTasksDesc: "Gestiona y completa las tareas pendientes del equipo.",
    },
    en: {
      greeting: "Hello",
      welcome: "Welcome to your control panel. Here you can view statistics and manage your data.",
      totalUsers: "Total Users",
      activeProjects: "Active Projects",
      completedTasks: "Completed Tasks",
      registerUser: "Register User",
      registerUserDesc: "Add a new user to the system.",
      reviewProjects: "Review Projects",
      reviewProjectsDesc: "View the progress of your active projects.",
      pendingTasks: "Pending Tasks",
      pendingTasksDesc: "Manage and complete team pending tasks.",
    },
  };

  const t = texts[language] || texts.es;

  // Datos de ejemplo para las estadísticas
  const stats = [
    {
      title: t.totalUsers,
      value: 1234,
      icon: <Users className="w-8 h-8 text-white" />,
      bg: "from-blue-500 to-blue-600",
    },
    {
      title: t.activeProjects,
      value: 42,
      icon: <ClipboardList className="w-8 h-8 text-white" />,
      bg: "from-green-500 to-green-600",
    },
    {
      title: t.completedTasks,
      value: 856,
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      bg: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 transition-colors duration-300">
      {/* Saludo principal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t.greeting}, {user.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {t.welcome}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`flex items-center justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br ${stat.bg} text-white transition-transform duration-300 hover:scale-105`}
          >
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-3xl font-bold mt-2">{stat.value.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-full">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Sección de acciones rápidas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            {t.registerUser}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{t.registerUserDesc}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            {t.reviewProjects}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{t.reviewProjectsDesc}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            {t.pendingTasks}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{t.pendingTasksDesc}</p>
        </div>
      </div>
    </div>
  );
}