import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username: email,
        password: password
      });
      
      if (response.data.estado === "exito") {
        setUser(response.data.usuario);
        return { success: true };
      }
      return { success: false, error: response.data.mensaje };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión');
    }
  };

  useEffect(() => {
    // Verificar sesión al cargar la página
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/check-auth');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

const { user } = useAuth() || {};
