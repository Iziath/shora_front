import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken, removeAuthToken, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await verifyToken();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        removeAuthToken();
        setUser(null);
      }
    } catch (error) {
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier si un token existe et le valider
    checkAuth();

    // Écouter les événements de stockage pour détecter les changements de token
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Exposer la fonction pour mettre à jour l'utilisateur après connexion
  useEffect(() => {
    (window as any).__updateAuthUser = (userData: User) => {
      setUser(userData);
      setLoading(false);
    };
  }, []);

  const signOut = async () => {
    await removeAuthToken();
    setUser(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
