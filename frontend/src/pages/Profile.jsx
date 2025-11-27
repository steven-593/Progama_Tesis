import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

export default function Profile() {
  const { user } = useAuth() || {};
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const texts = {
    es: {
      editProfile: "Editar Perfil",
      save: "Guardar",
      cancel: "Cancelar",
      projects: "Proyectos",
      completed: "Completados",
      workedHours: "Horas trabajadas",
      personalInfo: "Información Personal",
      fullName: "Nombre completo",
      email: "Correo electrónico",
      phone: "Teléfono",
      location: "Ubicación",
      biography: "Biografía",
      recentActivity: "Actividad Reciente",
      profileUpdated: "✅ Perfil actualizado correctamente",
      guestUser: "Usuario Invitado",
      sampleEmail: "correo@ejemplo.com",
      defaultBio: "Desarrollador Full Stack apasionado por crear soluciones innovadoras.",
      activities: {
        completed: 'Completó el proyecto "Dashboard Redesign"',
        updated: "Actualizó su perfil",
        joined: "Se unió al equipo de desarrollo",
        created: "Creó 5 nuevas tareas",
      },
      timeAgo: {
        hours: "Hace 2 horas",
        day: "Hace 1 día",
        days: "Hace 3 días",
        week: "Hace 1 semana",
      },
    },
    en: {
      editProfile: "Edit Profile",
      save: "Save",
      cancel: "Cancel",
      projects: "Projects",
      completed: "Completed",
      workedHours: "Worked Hours",
      personalInfo: "Personal Information",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      location: "Location",
      biography: "Biography",
      recentActivity: "Recent Activity",
      profileUpdated: "✅ Profile updated successfully",
      guestUser: "Guest User",
      sampleEmail: "email@example.com",
      defaultBio: "Full Stack Developer passionate about creating innovative solutions.",
      activities: {
        completed: 'Completed the "Dashboard Redesign" project',
        updated: "Updated their profile",
        joined: "Joined the development team",
        created: "Created 5 new tasks",
      },
      timeAgo: {
        hours: "2 hours ago",
        day: "1 day ago",
        days: "3 days ago",
        week: "1 week ago",
      },
    },
  };

  const t = texts[language] || texts.es;

  const [formData, setFormData] = useState({
    name: user?.name || t.guestUser,
    email: user?.email || t.sampleEmail,
    phone: "+593 99 123 4567",
    location: "Guayaquil, Ecuador",
    bio: t.defaultBio,
  });

  const handleSave = () => {
    console.log("Guardando datos:", formData);
    setIsEditing(false);
    alert(t.profileUpdated);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || t.guestUser,
      email: user?.email || t.sampleEmail,
      phone: "+593 99 123 4567",
      location: "Guayaquil, Ecuador",
      bio: t.defaultBio,
    });
    setIsEditing(false);
  };

  const activities = [
    { action: t.activities.completed, time: t.timeAgo.hours },
    { action: t.activities.updated, time: t.timeAgo.day },
    { action: t.activities.joined, time: t.timeAgo.days },
    { action: t.activities.created, time: t.timeAgo.week },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 transition-colors duration-300">
      {/* Encabezado */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-6 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {formData.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.role || "Usuario"}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <Edit2 size={18} />
              {t.editProfile}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="success" onClick={handleSave}>
                <Save size={18} />
                {t.save}
              </Button>
              <Button variant="danger" onClick={handleCancel}>
                <X size={18} />
                {t.cancel}
              </Button>
            </div>
          )}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Metric color="blue" label={t.projects} value="156" />
          <Metric color="green" label={t.completed} value="89%" />
          <Metric color="purple" label={t.workedHours} value="2.5k" />
        </div>
      </div>

      {/* Información personal */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-6 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t.personalInfo}
        </h2>

        <div className="space-y-4">
          <Field
            label={t.fullName}
            icon={User}
            value={formData.name}
            editable={isEditing}
            onChange={(value) => setFormData({ ...formData, name: value })}
          />
          <Field
            label={t.email}
            icon={Mail}
            value={formData.email}
            editable={isEditing}
            onChange={(value) => setFormData({ ...formData, email: value })}
          />
          <Field
            label={t.phone}
            icon={Phone}
            value={formData.phone}
            editable={isEditing}
            onChange={(value) => setFormData({ ...formData, phone: value })}
          />
          <Field
            label={t.location}
            icon={MapPin}
            value={formData.location}
            editable={isEditing}
            onChange={(value) => setFormData({ ...formData, location: value })}
          />

          {/* Biografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.biography}
            </label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span className="text-gray-700 dark:text-gray-200">
                  {formData.bio}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t.recentActivity}
        </h2>
        <div className="space-y-3">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Calendar className="text-blue-500" size={20} />
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-200">{activity.action}</p>
                <p className="text-sm text-gray-400 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 🔧 Componente de métricas */
function Metric({ color, label, value }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };
  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} dark:from-${color}-600 dark:to-${color}-700 rounded-lg p-4 text-center shadow-md text-white transition-all duration-300`}
    >
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  );
}

/* 🔧 Campo editable */
function Field({ label, icon: Icon, value, editable, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      {editable ? (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          icon={Icon}
        />
      ) : (
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Icon className="text-gray-400 dark:text-gray-500" size={20} />
          <span className="text-gray-700 dark:text-gray-200">{value}</span>
        </div>
      )}
    </div>
  );
}