import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, register as registerService } from '../services/authService';
import { saveSession, getSession, clearSession } from '../services/sessionService';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionUser = await getSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await loginService(email, password);
    if (user) {
      const sessionUser = { id: user.id, email: user.email, name: user.name };
      setUser(sessionUser);
      saveSession(sessionUser);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string) => {
    const user = await registerService(email, password, name);
    if (user) {
      const sessionUser = { id: user.id, email: user.email, name: user.name };
      setUser(sessionUser);
      saveSession(sessionUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 