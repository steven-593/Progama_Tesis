import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_LOGIN = "http://localhost/api_rest/backend/endpoints/auth.php";
const API_REGISTER = "http://localhost/api_rest/backend/endpoints/register.php";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Login con backend
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password_hash: password }),
      });

      const data = await response.json();
      console.log("🟢 Login backend:", data);

      if (data?.status === "ok") {
        const token = data.result.token;
        const username = data.result.user;

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setUser({ username, token });
        navigate("/");
        return { success: true };
      } else {
        return { success: false, error: data?.result?.error_msg || "Credenciales incorrectas" };
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      return { success: false, error: "Error al conectar con el servidor" };
    } finally {
      setLoading(false);
    }
  };

// 🔹 Registrar usuario nuevo con auto-login
const register = async (email, password) => {
  setLoading(true);
  try {
    const response = await fetch(API_REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password_hash: password }),
    });

    const data = await response.json();
    console.log("🟣 Registro backend:", data);

    if (data?.status === "ok" && data?.result?.token) {
      const token = data.result.token;
      const username = data.result.user;

      // Guardar sesión y redirigir automáticamente
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      setUser({ username, token });
      navigate("/");

      return { success: true, message: data.result.message };
    }

    return { success: false, error: data?.result?.error_msg || "No se pudo crear la cuenta" };
  } catch (err) {
    console.error("❌ Error en registro:", err);
    return { success: false, error: "Error al conectar con el servidor" };
  } finally {
    setLoading(false);
  }
};
  // 🔹 Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // 🔹 Mantener sesión activa
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) setUser({ username, token });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return { ...context, isAuthenticated: !!context.user };
}
