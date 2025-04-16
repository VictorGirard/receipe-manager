import axios from 'axios';

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
    categorie: string;
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
