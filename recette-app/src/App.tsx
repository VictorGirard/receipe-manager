import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { fetchRecettes } from './services/airtable';
import { getImageUrl } from './services/imageService';
import RecetteDetail from './pages/RecetteDetail';
import EditRecette from './pages/EditRecette';
import NewRecette from './pages/NewRecette';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <div className="min-h-screen bg-white dark:bg-dark-bg p-4 flex items-center justify-center">
        <p className="text-xl text-gray-800 dark:text-dark-text">Chargement des recettes...</p>
      </div>
    );
  }

  const currentRecette = filteredRecettes[currentIndex];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-dark-text">
            Nos Recettes <span className="text-amber-500">🍽️</span>
          </h1>
          <button
            onClick={() => navigate('/recette/new')}
            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle recette
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-dark-text"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-700 dark:text-dark-text"
              >
                <span className="mr-2">{selectedCategory || 'Toutes les catégories'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-dark-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all duration-200 transform opacity-100 scale-100">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-amber-50 dark:hover:bg-amber-900 hover:text-amber-900 dark:hover:text-amber-50"
                    >
                      Toutes les catégories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-amber-50 dark:hover:bg-amber-900 hover:text-amber-900 dark:hover:text-amber-50"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('carousel')}
                className={`p-2 rounded-lg ${
                  viewMode === 'carousel'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-700'
                } transition-colors duration-200`}
                title="Vue carrousel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-700'
                } transition-colors duration-200`}
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
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg">Aucune recette ne correspond à votre recherche</p>
          </div>
        ) : viewMode === 'carousel' ? (
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[400px] sm:h-[500px] md:h-[600px]">
              <div 
                className="cursor-pointer p-6 sm:p-8 relative h-full"
                onClick={() => navigate(`/recette/${currentRecette.id}`)}
              >
                {currentRecette.image?.[0] && (
                  <div className="absolute inset-0">
                    <img 
                      src={getImageUrl(currentRecette.image, 'large')}
                      alt={currentRecette.nom}
                      className="w-full h-full object-cover"
                      style={{ filter: 'blur(8px)' }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {currentRecette.duree} min
                    </span>
                    <span className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      {currentRecette.calories} kcal
                    </span>
                  </div>
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentRecette.categorie}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {filteredRecettes.map((_, index) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecettes.map((recette) => (
              <div
                key={recette.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => navigate(`/recette/${recette.id}`)}
              >
                {recette.image?.[0] && (
                  <div className="relative h-48">
                    <img
                      src={getImageUrl(recette.image, 'large')}
                      alt={recette.nom}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{recette.nom}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {recette.duree} min
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      {recette.calories} kcal
                    </span>
                  </div>
                  <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                    {recette.categorie}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-dark-bg">
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recette/:id" element={<RecetteDetail />} />
            <Route path="/recette/:id/edit" element={<EditRecette />} />
            <Route path="/recette/new" element={<NewRecette />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}export default App;

