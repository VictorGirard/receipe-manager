import { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  Bars3Icon, 
  Squares2X2Icon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDownIcon,
  ClockIcon,
  FireIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { fetchRecettes } from './services/airtable';
import { getImageUrl } from './services/imageService';
import RecetteDetail from './pages/RecetteDetail';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ThemeToggle from './components/ThemeToggle';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

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
  const { user, logout, addToFavorites, removeFromFavorites, isFavorite } = useAuth();

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
      <div className="min-h-screen bg-white dark:bg-dark-bg p-4 flex items-center justify-center">
        <p className="text-xl text-gray-800 dark:text-dark-text">Chargement des recettes...</p>
      </div>
    );
  }

  const currentRecette = filteredRecettes[currentIndex];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      <div className="flex justify-between items-center p-4">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 text-gray-800 dark:text-dark-text">
          Nos Recettes <span className="text-amber-500">🍽️</span>
        </h1>
        
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
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
                  <XMarkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
                </button>
              )}
            </div>
            
            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-700 dark:text-dark-text">
                <span className="mr-2">{selectedCategory || 'Toutes les catégories'}</span>
                <ChevronDownIcon className="h-5 w-5" />
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-dark-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`${
                            active ? 'bg-amber-50 dark:bg-amber-900 text-amber-900 dark:text-amber-50' : 'text-gray-700 dark:text-dark-text'
                          } block w-full text-left px-4 py-2 text-sm`}
                        >
                          Toutes les catégories
                        </button>
                      )}
                    </Menu.Item>
                    {categories.map((category) => (
                      <Menu.Item key={category}>
                        {({ active }) => (
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className={`${
                              active ? 'bg-amber-50 dark:bg-amber-900 text-amber-900 dark:text-amber-50' : 'text-gray-700 dark:text-dark-text'
                            } block w-full text-left px-4 py-2 text-sm`}
                          >
                            {category}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

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
                <Squares2X2Icon className="h-5 w-5" />
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
                <Bars3Icon className="h-5 w-5" />
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
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 relative"
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
                      <ClockIcon className="h-4 w-4 mr-1" /> {recette.duree} min
                    </span>
                    <span className="flex items-center">
                      <FireIcon className="h-4 w-4 mr-1" /> {recette.calories} kcal
                    </span>
                  </div>
                  <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                    {recette.categorie}
                  </span>
                </div>
                <button
                  onClick={(e) => handleFavoriteClick(e, recette.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200"
                >
                  {isFavorite(recette.id) ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton de déconnexion avec effet de survol */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="group flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-red-50 dark:bg-gray-700 dark:hover:bg-red-900 rounded-lg shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-600"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="relative overflow-hidden">
            <span className="block text-sm text-gray-700 dark:text-gray-200 group-hover:translate-y-[-100%] transition-transform duration-200">
              {user?.name}
            </span>
            <span className="block text-sm text-red-600 dark:text-red-400 absolute top-full group-hover:translate-y-[-100%] transition-transform duration-200">
              Déconnexion
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/recette/:id"
              element={
                <PrivateRoute>
                  <RecetteDetail />
                </PrivateRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;