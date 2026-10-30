import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  setUser(response.data.data);

  return response.data;
};

const logout = async () => {
  await api.post("/auth/logout");

  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
      logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};