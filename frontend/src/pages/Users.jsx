import { useState, useEffect } from "react";
import { Users as UsersIcon, Search, UserPlus, Edit2, Trash2, X } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Users() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const dark = theme === "dark";

  // ✅ Endpoint del backend
  const API_USERS = "http://localhost/api_rest/backend/endpoints/usuarios.php";

  // 📚 Traducciones
  const texts = {
    es: {
      title: "Usuarios",
      subtitle: "Gestiona los usuarios de tu aplicación",
      searchPlaceholder: "Buscar usuarios por nombre o email...",
      allRoles: "Todos los roles",
      admin: "Admin",
      editor: "Editor",
      user: "Usuario",
      newUser: "Nuevo Usuario",
      userHeader: "Usuario",
      phone: "Teléfono",
      role: "Rol",
      status: "Estado",
      actions: "Acciones",
      active: "Activo",
      inactive: "Inactivo",
      noUsers: "No se encontraron usuarios",
      editUser: "Editar Usuario",
      deleteConfirm: "¿Estás seguro de eliminar este usuario?",
      fullName: "Nombre completo",
      email: "Correo electrónico",
      cancel: "Cancelar",
      saveChanges: "Guardar Cambios",
      addUser: "Agregar Usuario",
      completeFields: "Por favor completa los campos obligatorios",
    },
    en: {
      title: "Users",
      subtitle: "Manage your application users",
      searchPlaceholder: "Search users by name or email...",
      allRoles: "All roles",
      admin: "Admin",
      editor: "Editor",
      user: "User",
      newUser: "New User",
      userHeader: "User",
      phone: "Phone",
      role: "Role",
      status: "Status",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      noUsers: "No users found",
      editUser: "Edit User",
      deleteConfirm: "Are you sure you want to delete this user?",
      fullName: "Full name",
      email: "Email address",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      addUser: "Add User",
      completeFields: "Please complete the required fields",
    },
  };

  const t = texts[language] || texts.es;

  // 🧠 Estados
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "Usuario",
    estado: "active",
  });

  // 📥 Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(API_USERS);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Error al cargar usuarios:", err);
    }
  };

  // ✏️ Abrir modal (crear o editar)
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        estado: user.estado,
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        rol: "Usuario",
        estado: "active",
      });
    }
    setIsModalOpen(true);
  };

  // 💾 Guardar usuario (crear o editar)
  const handleSaveUser = async () => {
    if (!formData.nombre || !formData.email) {
      alert(t.completeFields);
      return;
    }

    const method = editingUser ? "PUT" : "POST";

    try {
      await fetch(API_USERS, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await cargarUsuarios();
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Error al guardar usuario:", err);
    }
  };

  // 🗑️ Eliminar usuario
  const handleDeleteUser = async (id_usuario) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await fetch(`${API_USERS}?id=${id_usuario}`, { method: "DELETE" });
        await cargarUsuarios();
      } catch (err) {
        console.error("❌ Error al eliminar usuario:", err);
      }
    }
  };

  // 🎨 Colores visuales
  const getRoleColor = (role) => {
    const colors = {
      Admin: dark ? "bg-purple-800 text-purple-200" : "bg-purple-100 text-purple-700",
      Editor: dark ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-700",
      Usuario: dark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700",
    };
    return colors[role] || (dark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700");
  };

  const getStatusColor = (status) =>
    status === "active"
      ? dark
        ? "bg-green-800 text-green-200"
        : "bg-green-100 text-green-700"
      : dark
      ? "bg-red-800 text-red-200"
      : "bg-red-100 text-red-700";

  // 🔍 Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || user.rol.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // 🧩 Renderizado principal
  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${dark ? "bg-gray-900 text-gray-100 min-h-screen" : ""}`}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
        <p className={dark ? "text-gray-400" : "text-gray-600"}>{t.subtitle}</p>
      </div>

      {/* 🔹 Barra de búsqueda y filtros */}
      <div
        className={`rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 ${
          dark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex-1">
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              dark ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
            }`}
          >
            <option value="all">{t.allRoles}</option>
            <option value="admin">{t.admin}</option>
            <option value="editor">{t.editor}</option>
            <option value="usuario">{t.user}</option>
          </select>

          <Button variant="primary" onClick={() => handleOpenModal()}>
            <UserPlus size={18} />
            {t.newUser}
          </Button>
        </div>
      </div>

      {/* 🔹 Tabla de usuarios */}
      <div className={`rounded-2xl shadow-lg overflow-hidden ${dark ? "bg-gray-800" : "bg-white"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={dark ? "bg-gray-700" : "bg-gray-50 border-b"}>
              <tr>
                <th className="px-6 py-4 text-left">{t.userHeader}</th>
                <th className="px-6 py-4 text-left">{t.phone}</th>
                <th className="px-6 py-4 text-left">{t.role}</th>
                <th className="px-6 py-4 text-left">{t.status}</th>
                <th className="px-6 py-4 text-left">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id_usuario} className={dark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4">{user.nombre}</td>
                  <td className="px-6 py-4">{user.telefono}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.rol)}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.estado)}`}>
                      {user.estado === "active" ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(user)} className="p-2 text-blue-500">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id_usuario)} className="p-2 text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">{t.noUsers}</p>
          </div>
        )}
      </div>

      {/* 🔹 Modal para crear/editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-2xl shadow-xl w-full max-w-lg p-6 ${dark ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {editingUser ? t.editUser : t.newUser}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder={t.fullName}
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
              <Input
                type="email"
                placeholder={t.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                type="tel"
                placeholder={t.phone}
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />

              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                className={`w-full border rounded-lg px-4 py-3 ${
                  dark ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                }`}
              >
                <option value="Admin">{t.admin}</option>
                <option value="Editor">{t.editor}</option>
                <option value="Usuario">{t.user}</option>
              </select>

              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className={`w-full border rounded-lg px-4 py-3 ${
                  dark ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                }`}
              >
                <option value="active">{t.active}</option>
                <option value="inactive">{t.inactive}</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                {t.cancel}
              </Button>
              <Button variant="primary" onClick={handleSaveUser}>
                {editingUser ? t.saveChanges : t.addUser}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
