import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRecettes } from '../services/airtable';
import { getImageUrl, getImageStyle } from '../services/imageService';
import { getModalContent } from '../services/modalService';
import { Recette } from '../types/recette';
import { iosTheme } from '../styles/iosTheme';

export default function RecetteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecette = async () => {
      try {
        const recettes = await fetchRecettes();
        const foundRecette = recettes.find(r => r.id === id);
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
      <div className={`min-h-screen ${iosTheme.colors.background} p-4 flex items-center justify-center`}>
        <p className={`${iosTheme.typography.h2} ${iosTheme.colors.text}`}>Chargement de la recette...</p>
      </div>
    );
  }

  if (!recette) {
    return null;
  }

  return (
    <div className={`min-h-screen ${iosTheme.colors.background} p-4 sm:p-6 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className={`mb-6 flex items-center ${iosTheme.colors.primary} hover:${iosTheme.colors.secondary}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </button>

        <div className={iosTheme.components.card.container}>
          {recette.image?.[0] && (
            <div className={getImageStyle('modal').container}>
              <img
                src={getImageUrl(recette.image, 'large')}
                alt={recette.nom}
                className={getImageStyle('modal').image}
              />
              <div className={getImageStyle('modal').overlay} />
            </div>
          )}

          <div className="p-6 space-y-6">
            <h1 className={`${iosTheme.typography.h1} ${iosTheme.colors.text}`}>{recette.nom}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className={iosTheme.components.list.item}>
                <h3 className={`${iosTheme.typography.h3} ${iosTheme.colors.text} mb-2`}>Informations</h3>
                <p className={`${iosTheme.typography.body} ${iosTheme.colors.textSecondary}`}>
                  ⏱️ Durée : {getModalContent(recette).duration}
                </p>
                <p className={`${iosTheme.typography.body} ${iosTheme.colors.textSecondary}`}>
                  🔥 Calories : {getModalContent(recette).calories}
                </p>
                <p className={`${iosTheme.typography.body} ${iosTheme.colors.textSecondary}`}>
                  📋 Catégorie : {getModalContent(recette).category}
                </p>
              </div>

              <div className={iosTheme.components.list.item}>
                <h3 className={`${iosTheme.typography.h3} ${iosTheme.colors.text} mb-2`}>Ingrédients</h3>
                <ul className={`list-disc pl-5 ${iosTheme.typography.body} ${iosTheme.colors.textSecondary}`}>
                  {getModalContent(recette).ingredients.map((ingredient: string, index: number) => (
                    <li key={index}>{ingredient.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={iosTheme.components.list.item}>
              <h3 className={`${iosTheme.typography.h3} ${iosTheme.colors.text} mb-2`}>Instructions</h3>
              <p className={`${iosTheme.typography.body} ${iosTheme.colors.textSecondary} whitespace-pre-line`}>
                {getModalContent(recette).steps.join('\n')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 