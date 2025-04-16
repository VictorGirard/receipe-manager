import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { fetchRecettes } from './services/airtable';
import { getImageUrl, getImageStyle } from './services/imageService';
import RecetteDetail from './pages/RecetteDetail';
import { iosTheme } from './styles/iosTheme';

interface Recette {
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

function Home() {
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getRecettes = async () => {
      const data = await fetchRecettes();
      setRecettes(data);
    };

    getRecettes();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(recettes.map(r => r.categorie)));
  }, [recettes]);

  const filteredRecettes = useMemo(() => {
    return recettes.filter(recette => {
      const matchesSearch = recette.nom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || recette.categorie === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recettes, searchTerm, selectedCategory]);

  const nextSlide = () => {
    if (filteredRecettes.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredRecettes.length);
    }
  };

  const prevSlide = () => {
    if (filteredRecettes.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredRecettes.length) % filteredRecettes.length);
    }
  };

  useEffect(() => {
    if (filteredRecettes.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [filteredRecettes.length]);

  if (recettes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <p className="text-xl">Chargement des recettes...</p>
      </div>
    );
  }

  const currentRecette = filteredRecettes[currentIndex];

  return (
    <div className={`min-h-screen ${iosTheme.colors.background} p-4 sm:p-6 md:p-8`}>
      <h1 className={`${iosTheme.typography.h1} text-center mb-6 sm:mb-8 ${iosTheme.colors.text}`}>
        Nos Recettes 🍽️
      </h1>
      
      <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className={iosTheme.components.input.container}>
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={iosTheme.components.input.field}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#000000]"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`${iosTheme.components.button.outline} ${
                !selectedCategory ? iosTheme.components.button.primary : ''
              }`}
            >
              Toutes
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${iosTheme.components.button.outline} ${
                  selectedCategory === category ? iosTheme.components.button.primary : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('carousel')}
              className={`${iosTheme.components.button.outline} ${
                viewMode === 'carousel' ? iosTheme.components.button.primary : ''
              }`}
              title="Vue carrousel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`${iosTheme.components.button.outline} ${
                viewMode === 'list' ? iosTheme.components.button.primary : ''
              }`}
              title="Vue liste"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filteredRecettes.length === 0 ? (
        <div className={`text-center ${iosTheme.colors.textSecondary} ${iosTheme.typography.body}`}>
          Aucune recette ne correspond à votre recherche
        </div>
      ) : viewMode === 'carousel' ? (
        <div className="max-w-4xl mx-auto relative">
          <div className={`${iosTheme.components.card.container} h-[300px] sm:h-[400px] md:h-[500px]`}>
            <div 
              className="cursor-pointer p-4 sm:p-6 md:p-8 relative h-full"
              onClick={() => navigate(`/recette/${currentRecette.id}`)}
            >
              {currentRecette.image?.[0] && (
                <div className={getImageStyle('carousel').container}>
                  <img 
                    src={getImageUrl(currentRecette.image, 'large')}
                    alt={currentRecette.nom}
                    className={getImageStyle('carousel').image}
                    style={{ filter: 'blur(8px)' }}
                  />
                  <div className={getImageStyle('carousel').overlay} />
                </div>
              )}
              <div className="flex flex-col items-center text-center relative z-10 h-full justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/80 rounded-full mb-4 sm:mb-6 flex items-center justify-center text-3xl sm:text-4xl backdrop-blur-sm">
                  🍽️
                </div>
                <h2 className={`${iosTheme.typography.h2} text-white mb-3 sm:mb-4 drop-shadow-lg`}>
                  {currentRecette.nom}
                </h2>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-white mb-4 sm:mb-6">
                  <span className={`flex items-center bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full ${iosTheme.typography.body}`}>
                    <span className="mr-2">⏱️</span> {currentRecette.duree} min
                  </span>
                  <span className={`flex items-center bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full ${iosTheme.typography.body}`}>
                    <span className="mr-2">🔥</span> {currentRecette.calories} kcal
                  </span>
                </div>
                <span className={`inline-block bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full ${iosTheme.typography.caption} font-medium`}>
                  {currentRecette.categorie}
                </span>
              </div>
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {filteredRecettes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRecettes.map((recette) => (
            <div
              key={recette.id}
              className={`${iosTheme.components.card.container} cursor-pointer hover:shadow-md transition-shadow duration-300`}
              onClick={() => navigate(`/recette/${recette.id}`)}
            >
              {recette.image?.[0] && (
                <div className={getImageStyle('card').container}>
                  <img
                    src={getImageUrl(recette.image, 'large')}
                    alt={recette.nom}
                    className={getImageStyle('card').image}
                    style={{ filter: 'blur(4px)' }}
                  />
                  <div className={getImageStyle('card').overlay} />
                </div>
              )}
              <div className={iosTheme.components.card.content}>
                <h2 className={`${iosTheme.typography.h3} ${iosTheme.colors.text} mb-2`}>
                  {recette.nom}
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-[#8E8E93] mb-2">
                  <span className={`flex items-center ${iosTheme.typography.body}`}>
                    <span className="mr-1">⏱️</span> {recette.duree} min
                  </span>
                  <span className={`flex items-center ${iosTheme.typography.body}`}>
                    <span className="mr-1">🔥</span> {recette.calories} kcal
                  </span>
                </div>
                <span className={`inline-block bg-[#F2F2F7] text-[#5856D6] px-2 sm:px-3 py-1 rounded-full ${iosTheme.typography.caption}`}>
                  {recette.categorie}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recette/:id" element={<RecetteDetail />} />
      </Routes>
    </Router>
  );
}

export default App;