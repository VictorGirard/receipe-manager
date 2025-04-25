import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, FireIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { getImageUrl } from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import { Recette } from '../types/recette';

interface CarouselProps {
  recettes: Recette[];
}

export default function Carousel({ recettes }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();

  const nextSlide = () => {
    if (recettes.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recettes.length);
    }
  };

  const prevSlide = () => {
    if (recettes.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + recettes.length) % recettes.length);
    }
  };

  useEffect(() => {
    if (recettes.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [recettes.length]);

  const handleFavoriteClick = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    if (isFavorite(recipeId)) {
      await removeFromFavorites(recipeId);
    } else {
      await addToFavorites(recipeId);
    }
  };

  if (recettes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-lg">Aucune recette ne correspond à votre recherche</p>
      </div>
    );
  }

  const currentRecette = recettes[currentIndex];
  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-[400px] sm:h-[500px] md:h-[600px]">
        <div 
          className="cursor-pointer p-6 sm:p-8 relative h-full"
          onClick={() => navigate(`/recette/${currentRecette.id}`)}
        >
          {(
            <div className="absolute inset-0">
              <img 
                src={getImageUrl(currentRecette.image, 'large', currentRecette.imageURL)}
                alt={currentRecette.nom}
                className="w-full h-full object-cover"
                style={{ filter: 'blur(8px)' }}
              />
              <div className="absolute inset-0 dark:bg-gray-800" />
            </div>
          )}
          <div className="flex flex-col items-center text-center relative z-10 h-full justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/90 rounded-full mb-6 flex items-center justify-center text-4xl backdrop-blur-sm shadow-lg">
              🍽️
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {currentRecette.nom}
            </h2>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 text-white mb-6">
              <span className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <ClockIcon className="h-5 w-5 mr-2" /> {currentRecette.duree} min
              </span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <FireIcon className="h-5 w-5 mr-2" /> {currentRecette.calories} kcal
              </span>
            </div>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentRecette.categorie}
            </span>
          </div>
          <button
            onClick={(e) => handleFavoriteClick(e, currentRecette.id)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200"
          >
            {isFavorite(currentRecette.id) ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6 text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>
        
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-600" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {recettes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 