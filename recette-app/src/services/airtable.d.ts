export interface Recette {
  id: string;
  nom: string;
  duree: number;
  calories: number;
  categorie: string;
}

export function fetchRecettes(): Promise<Recette[]>; 