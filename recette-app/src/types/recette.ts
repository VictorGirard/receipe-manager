export interface Recette {
  id: string;
  nom: string;
  duree: number;
  calories: number;
  categorie: string;
  ingredients?: string;
  etapes?: string;
  image?: {
    url: string;
    thumbnails: {
      small: { url: string };
      large: { url: string };
      full: { url: string };
    };
  }[];
} 