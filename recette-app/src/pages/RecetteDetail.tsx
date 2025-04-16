import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRecettes } from '../services/airtable';
import { getImageUrl } from '../services/imageService';
import { getModalContent } from '../services/modalService';
import { Recette } from '../types/recette';
import { useTheme } from '../context/ThemeContext';

export default function RecetteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const loadRecette = async () => {
      try {
        const recettes = await fetchRecettes();
        const foundRecette = recettes.find((r: Recette) => r.id === id);
        if (foundRecette) {
          setRecette(foundRecette);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la recette:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadRecette();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-dark-bg p-4 flex items-center justify-center">
        <p className="text-2xl text-gray-800 dark:text-dark-text">Chargement de la recette...</p>
      </div>
    );
  }

  if (!recette) {
    return null;
  }

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

        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg overflow-hidden">
          {recette.image?.[0] && (
            <div className="relative h-64">
              <img
                src={getImageUrl(recette.image, 'large')}
                alt={recette.nom}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          )}

          <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text">{recette.nom}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">Informations</h3>
                <p className="text-gray-600 dark:text-dark-text-secondary">
                  ⏱️ Durée : {getModalContent(recette).duration}
                </p>
                <p className="text-gray-600 dark:text-dark-text-secondary">
                  🔥 Calories : {getModalContent(recette).calories}
                </p>
                <p className="text-gray-600 dark:text-dark-text-secondary">
                  📋 Catégorie : {getModalContent(recette).category}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">Ingrédients</h3>
                <ul className="list-disc pl-5 text-gray-600 dark:text-dark-text-secondary">
                  {getModalContent(recette).ingredients.map((ingredient: string, index: number) => (
                    <li key={index}>{ingredient.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">Instructions</h3>
              <p className="text-gray-600 dark:text-dark-text-secondary whitespace-pre-line">
                {getModalContent(recette).steps.join('\n')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 