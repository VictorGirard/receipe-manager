export type Categorie = 
  | 'Entrée'
  | 'Plat principal'
  | 'Dessert'
  | 'Apéritif'
  | 'Boisson'
  | 'Sauce'
  | 'Accompagnement';

export interface Recette {
  id: string;
  nom: string;
  duree: number;
  calories: number;
  categorie: Categorie;
  ingredients?: string;
  etapes?: string;
  proteines?: number;
  glucides?: number;
  lipides?: number;
  fibres?: number;
  taillePortion?: string;
  image?: {
    url: string;
    thumbnails: {
      small: { url: string };
      large: { url: string };
      full: { url: string };
    };
  }[];
} 