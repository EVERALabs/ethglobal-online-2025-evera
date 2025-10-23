import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Role } from "../const/roles";
import { AUTH_CONFIG } from "../const/auth";

export interface User {
  id: string;
  address?: string;
  email?: string;
  name?: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on app start
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(
          AUTH_CONFIG.STORAGE_KEYS.TOKEN
        );

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        // Clear corrupted data
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(
      AUTH_CONFIG.STORAGE_KEYS.USER,
      JSON.stringify(userData)
    );
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.ROLE, userData.role);
    // In a real app, you'd also store the auth token
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN, "mock-token");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.ROLE);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_PROVIDER);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(
        AUTH_CONFIG.STORAGE_KEYS.USER,
        JSON.stringify(updatedUser)
      );
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
