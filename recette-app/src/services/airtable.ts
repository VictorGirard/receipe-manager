import axios from 'axios';
import { Recette, Categorie } from '../types/recette';

const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID; // À remplacer
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME; // Ou autre nom de table
const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN; // Ton token Airtable (clé secrète perso)

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

interface AirtableRecord {
  id: string;
  fields: {
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
  };
}

export const fetchRecettes = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
    });

    const records = response.data.records;

    return records.map((recette: AirtableRecord) => ({
      id: recette.id,
      ...recette.fields,
    }));
  } catch (error) {
    console.error('Erreur Airtable:', error);
    return [];
  }
};

const validateRecette = (recette: Partial<Recette>) => {
  const errors: string[] = [];
  
  if (!recette.nom) errors.push('Le nom est obligatoire');
  if (recette.duree === undefined) errors.push('La durée est obligatoire');
  if (recette.calories === undefined) errors.push('Les calories sont obligatoires');
  if (!recette.categorie) errors.push('La catégorie est obligatoire');
  
  if (errors.length > 0) {
    throw new Error(`Erreur de validation: ${errors.join(', ')}`);
  }
};

export const updateRecette = async (id: string, recette: Partial<Recette>) => {
  try {
    validateRecette(recette);
    
    // Créer un objet fields qui ne contient que les champs qui ont des valeurs
    const fields: Record<string, any> = {};
    
    // Champs obligatoires
    fields.nom = recette.nom;
    fields.duree = recette.duree;
    fields.calories = recette.calories;
    fields.categorie = recette.categorie;
    
    // Champs optionnels
    if (recette.ingredients !== undefined) fields.ingredients = recette.ingredients || '';
    if (recette.etapes !== undefined) fields.etapes = recette.etapes || '';
    if (recette.proteines !== undefined) fields.proteines = recette.proteines || 0;
    if (recette.glucides !== undefined) fields.glucides = recette.glucides || 0;
    if (recette.lipides !== undefined) fields.lipides = recette.lipides || 0;
    if (recette.fibres !== undefined) fields.fibres = recette.fibres || 0;
    if (recette.taillePortion !== undefined) fields.taillePortion = recette.taillePortion || '';
    if (recette.image !== undefined) fields.image = recette.image || [];

    const response = await axios.patch(
      `${BASE_URL}/${id}`,
      {
        fields,
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data || !response.data.id) {
      throw new Error('Réponse invalide de l\'API Airtable');
    }

    return {
      id: response.data.id,
      ...response.data.fields,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur Airtable:', error.response?.data || error.message);
      throw new Error(`Erreur lors de la mise à jour de la recette: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
};

export const createRecette = async (recette: Omit<Recette, 'id'>) => {
  try {
    validateRecette(recette);
    
    // Créer un objet fields qui ne contient que les champs qui ont des valeurs
    const fields: Record<string, any> = {};
    
    // Champs obligatoires
    fields.nom = recette.nom;
    fields.duree = recette.duree;
    fields.calories = recette.calories;
    fields.categorie = recette.categorie;
    
    // Champs optionnels
    if (recette.ingredients !== undefined) fields.ingredients = recette.ingredients || '';
    if (recette.etapes !== undefined) fields.etapes = recette.etapes || '';
    if (recette.proteines !== undefined) fields.proteines = recette.proteines || 0;
    if (recette.glucides !== undefined) fields.glucides = recette.glucides || 0;
    if (recette.lipides !== undefined) fields.lipides = recette.lipides || 0;
    if (recette.fibres !== undefined) fields.fibres = recette.fibres || 0;
    if (recette.taillePortion !== undefined) fields.taillePortion = recette.taillePortion || '';
    if (recette.image !== undefined) fields.image = recette.image || [];

    const response = await axios.post(
      BASE_URL,
      {
        fields,
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data || !response.data.id) {
      throw new Error('Réponse invalide de l\'API Airtable');
    }

    return {
      id: response.data.id,
      ...response.data.fields,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erreur Airtable:', error.response?.data || error.message);
      throw new Error(`Erreur lors de la création de la recette: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
};
