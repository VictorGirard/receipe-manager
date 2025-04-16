import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRecettes } from '../services/airtable';
import { getImageUrl } from '../services/imageService';
import { Recette } from '../types/recette';
import ReactMarkdown from 'react-markdown';

export default function RecetteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showNutrition, setShowNutrition] = useState(false);

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
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-2xl text-gray-800 dark:text-dark-text">Chargement de la recette...</p>
        </div>
      </div>
    );
  }

  if (!recette) {
    return null;
  }

  const calculateTotalCalories = () => {
    const proteines = recette.proteines || 0;
    const glucides = recette.glucides || 0;
    const lipides = recette.lipides || 0;
    return (proteines * 4) + (glucides * 4) + (lipides * 9);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 bg-white dark:bg-dark-surface text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Retour à l'accueil"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </button>

          <button
            onClick={() => navigate(`/recette/${id}/edit`)}
            className="flex items-center px-4 py-2 bg-white dark:bg-dark-surface text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Modifier la recette"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier la recette
          </button>

          <button
            onClick={() => setShowNutrition(!showNutrition)}
            className="flex items-center px-4 py-2 bg-white dark:bg-dark-surface text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Afficher les détails nutritionnels"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {showNutrition ? 'Masquer les détails' : 'Afficher les détails'}
          </button>
        </div>

        <article className="bg-white dark:bg-dark-surface rounded-xl shadow-lg overflow-hidden">
          {recette.image?.[0] && (
            <div className="relative h-64 sm:h-80 md:h-96">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img
                src={getImageUrl(recette.image, 'large')}
                alt={recette.nom}
                className={`w-full h-full object-cover ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={() => setIsImageLoading(false)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          <div className="p-6 space-y-8">
            <header>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-dark-text mb-4">
                {recette.nom}
              </h1>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {recette.duree} min
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  {recette.calories} kcal
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100">
                  {recette.categorie}
                </span>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section className="bg-gray-50 dark:bg-dark-bg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">Macronutriments</h2>
                {recette.taillePortion && (
                  <p className="mb-4 text-sm text-white bg-emerald-500 dark:bg-emerald-600 px-3 py-1 rounded-full inline-block">
                    Portion : {recette.taillePortion}
                  </p>
                )}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-text-secondary">Protéines</span>
                    <span className="font-medium text-gray-800 dark:text-dark-text">{recette.proteines || 0}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-text-secondary">Glucides</span>
                    <span className="font-medium text-gray-800 dark:text-dark-text">{recette.glucides || 0}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-text-secondary">Lipides</span>
                    <span className="font-medium text-gray-800 dark:text-dark-text">{recette.lipides || 0}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-dark-text-secondary">Fibres</span>
                    <span className="font-medium text-gray-800 dark:text-dark-text">{recette.fibres || 0}g</span>
                  </div>
                </div>

                {showNutrition && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">Détails nutritionnels</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-dark-text-secondary">Calories totales</span>
                        <span className="font-medium text-gray-800 dark:text-dark-text">{calculateTotalCalories()} kcal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-dark-text-secondary">Calories des protéines</span>
                        <span className="font-medium text-gray-800 dark:text-dark-text">{((recette.proteines || 0) * 4)} kcal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-dark-text-secondary">Calories des glucides</span>
                        <span className="font-medium text-gray-800 dark:text-dark-text">{((recette.glucides || 0) * 4)} kcal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-dark-text-secondary">Calories des lipides</span>
                        <span className="font-medium text-gray-800 dark:text-dark-text">{((recette.lipides || 0) * 9)} kcal</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-gray-50 dark:bg-dark-bg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">Ingrédients</h2>
                <ul className="space-y-2">
                  {recette.ingredients?.split('\n').map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 mt-1 mr-2 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-xs">
                        •
                      </span>
                      <span className="text-gray-600 dark:text-dark-text-secondary">
                        {ingredient.trim()}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="bg-gray-50 dark:bg-dark-bg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recette.etapes?.split('\n').map((etape, index) => (
                  <li key={index} className="flex items-start">
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
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
} 