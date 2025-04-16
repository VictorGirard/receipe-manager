import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createRecette } from '../services/airtable';
import { Recette } from '../types/recette';

export default function NewRecette() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [recette, setRecette] = useState<Omit<Recette, 'id'>>({
    nom: '',
    duree: 0,
    calories: 0,
    categorie: '',
    ingredients: '',
    etapes: '',
    proteines: 0,
    glucides: 0,
    lipides: 0,
    fibres: 0,
    taillePortion: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newRecette = await createRecette(recette);
      navigate(`/recette/${newRecette.id}`);
    } catch (error) {
      console.error('Erreur lors de la création de la recette:', error);
      alert('Une erreur est survenue lors de la création de la recette');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecette({
      ...recette,
      [name]: name === 'duree' || name === 'calories' || name === 'proteines' || 
              name === 'glucides' || name === 'lipides' || name === 'fibres' 
              ? Number(value) 
              : value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </button>

        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text mb-6">Nouvelle recette</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de la recette
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={recette.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="duree" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  id="duree"
                  name="duree"
                  value={recette.duree}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                  required
                />
              </div>

              <div>
                <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Calories
                </label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={recette.calories}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <input
                type="text"
                id="categorie"
                name="categorie"
                value={recette.categorie}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                required
              />
            </div>

            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ingrédients (un par ligne)
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={recette.ingredients}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
              />
            </div>

            <div>
              <label htmlFor="etapes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Étapes (une par ligne)
              </label>
              <textarea
                id="etapes"
                name="etapes"
                value={recette.etapes}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="proteines" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Protéines (g)
                </label>
                <input
                  type="number"
                  id="proteines"
                  name="proteines"
                  value={recette.proteines}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                />
              </div>

              <div>
                <label htmlFor="glucides" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Glucides (g)
                </label>
                <input
                  type="number"
                  id="glucides"
                  name="glucides"
                  value={recette.glucides}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                />
              </div>

              <div>
                <label htmlFor="lipides" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lipides (g)
                </label>
                <input
                  type="number"
                  id="lipides"
                  name="lipides"
                  value={recette.lipides}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                />
              </div>

              <div>
                <label htmlFor="fibres" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fibres (g)
                </label>
                <input
                  type="number"
                  id="fibres"
                  name="fibres"
                  value={recette.fibres}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                />
              </div>
            </div>

            <div>
              <label htmlFor="taillePortion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Taille de la portion
              </label>
              <input
                type="text"
                id="taillePortion"
                name="taillePortion"
                value={recette.taillePortion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Création...' : 'Créer la recette'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 