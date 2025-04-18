import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRecettes } from '../services/airtable';
import { getImageUrl } from '../services/imageService';
import { getModalContent } from '../services/modalService';
import { Recette } from '../types/recette';
import ReactMarkdown from 'react-markdown';

export default function RecetteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState(true);

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
          className="mb-6 flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 animate-slide-up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </button>

        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg overflow-hidden animate-slide-up [animation-delay:0.1s]">
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text animate-slide-up [animation-delay:0.2s]">{recette.nom}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 animate-slide-up [animation-delay:0.3s]">
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

              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 animate-slide-up [animation-delay:0.3s]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-text">Macronutriments</h3>
                  {recette.taillePortion && (
                    <span className="text-sm text-white bg-emerald-500 dark:bg-emerald-600 px-3 py-1 rounded-full">
                      Portion : {recette.taillePortion}
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Nutriment</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Quantité</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-dark-text-secondary">Protéines</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-dark-text-secondary">{recette.proteines || 0}g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-dark-text-secondary">Glucides</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-dark-text-secondary">{recette.glucides || 0}g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-dark-text-secondary">Lipides</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-dark-text-secondary">{recette.lipides || 0}g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-dark-text-secondary">Fibres</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-dark-text-secondary">{recette.fibres || 0}g</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 animate-slide-up [animation-delay:0.4s]">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">Ingrédients</h3>
                <div className="space-y-2">
                  {recette.ingredients?.split('\n').map((ingredient, index) => (
                    <p key={index} className="text-gray-600 dark:text-dark-text-secondary">
                      {ingredient.trim()}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 animate-slide-up [animation-delay:0.5s]">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">Instructions</h3>
                <div className="space-y-4">
                  {recette.etapes?.split('\n').map((etape, index) => (
                    <div key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 font-semibold mr-3">
                        {index + 1}
                      </span>
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            strong: ({ children }) => (
                              <strong className="text-amber-600 dark:text-amber-400 font-semibold">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="text-gray-500 dark:text-gray-400 italic">
                                {children}
                              </em>
                            ),
                            p: ({ children }) => (
                              <p className="text-gray-600 dark:text-dark-text-secondary mb-0">
                                {children}
                              </p>
                            ),
                          }}
                        >
                          {etape.trim()}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 