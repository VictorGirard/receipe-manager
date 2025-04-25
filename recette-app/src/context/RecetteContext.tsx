import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { fetchRecettes } from '../services/airtable';
import { Recette } from '../types/recette';

interface RecetteContextType {
  recettes: Recette[];
  loading: boolean;
  error: Error | null;
  refreshRecettes: () => Promise<void>;
}

const RecetteContext = createContext<RecetteContextType | undefined>(undefined);

export function RecetteProvider({ children }: { children: ReactNode }) {
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initialLoadRef = useRef(false);

  const refreshRecettes = async () => {
    try {
      setLoading(true);
      const data = await fetchRecettes();
      setRecettes(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      refreshRecettes();
    }
  }, []);

  return (
    <RecetteContext.Provider value={{ recettes, loading, error, refreshRecettes }}>
      {children}
    </RecetteContext.Provider>
  );
}

export function useRecettes() {
  const context = useContext(RecetteContext);
  if (context === undefined) {
    throw new Error('useRecettes must be used within a RecetteProvider');
  }
  return context;
} 