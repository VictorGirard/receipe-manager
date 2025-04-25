import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { login as loginService, register as registerService, updateUserFavorites, getUserFavorites } from '../services/authService';
import { saveSession, getSession, clearSession } from '../services/sessionService';

interface User {
  id: string;
  email: string;
  name: string;
  favorites?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  addToFavorites: (recipeId: string) => Promise<void>;
  removeFromFavorites: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoadRef = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      if (!initialLoadRef.current) {
        initialLoadRef.current = true;
        try {
          const sessionUser = await getSession();
          if (sessionUser) {
            const favorites = await getUserFavorites(sessionUser.id);
            setUser({ ...sessionUser, favorites });
          }
        } catch (error) {
          console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await loginService(email, password);
    if (user) {
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        favorites: user.favorites || []
      };
      setUser(sessionUser);
      saveSession(sessionUser);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string) => {
    const user = await registerService(email, password, name);
    if (user) {
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        favorites: user.favorites || []
      };
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

  const addToFavorites = async (recipeId: string) => {
    if (!user) return;
    
    const currentFavorites = user.favorites || [];
    if (currentFavorites.includes(recipeId)) return;

    const newFavorites = [...currentFavorites, recipeId];
    const updatedUser = await updateUserFavorites(user.id, newFavorites);
    
    if (updatedUser) {
      const sessionUser = {
        ...user,
        favorites: newFavorites
      };
      setUser(sessionUser);
      saveSession(sessionUser);
    }
  };

  const removeFromFavorites = async (recipeId: string) => {
    if (!user) return;
    
    const currentFavorites = user.favorites || [];
    const newFavorites = currentFavorites.filter(id => id !== recipeId);
    const updatedUser = await updateUserFavorites(user.id, newFavorites);
    
    if (updatedUser) {
      const sessionUser = {
        ...user,
        favorites: newFavorites
      };
      setUser(sessionUser);
      saveSession(sessionUser);
    }
  };

  const isFavorite = (recipeId: string): boolean => {
    return user?.favorites?.includes(recipeId) || false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
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