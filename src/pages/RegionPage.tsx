import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import { WordCard } from '../components/WordCard';

// Tipos
interface Word {
  id: number;
  palabra: string;
  significado: string;
  ejemplo: string;
  pronunciacion: string;
  audio_url: string;
  region_id: number;
  provincia_id: number;
}

// Mapeo de regiones a IDs y nombres completos
const regionConfig: Record<string, { id: number; name: string; emoji: string; description: string }> = {
  costa: { 
    id: 1, 
    name: 'Coast Region', 
    emoji: '🌊',
    description: 'Explore the warm and rhythmic Spanish from Ecuador\'s Pacific coastline'
  },
  sierra: { 
    id: 2, 
    name: 'Andes Region', 
    emoji: '⛰️',
    description: 'Discover the clear and formal Spanish from the Ecuadorian highlands'
  },
  oriente: { 
    id: 3, 
    name: 'Amazon Region', 
    emoji: '🌿',
    description: 'Learn the unique jungle Spanish from Ecuador\'s Amazon rainforest'
  },
};

export const RegionPage = () => {
  const { regionId } = useParams<{ regionId: string }>();
  const navigate = useNavigate();
  
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Estado para favoritos
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Obtener configuración de la región actual
  const currentRegion = regionId ? regionConfig[regionId] : null;

  // Definir categorías según la región
  const getCategories = () => {
    switch (regionId) {
      case 'costa':
        return ['All', 'Greetings', 'Party', 'Food', 'Expressions', 'Conflicts'];
      case 'oriente':
        return ['All', 'Nature', 'Traditions', 'Gastronomy', 'Daily Life'];
      case 'sierra':
        return ['All', 'Expressions', 'Food', 'Informal', 'Affirmations'];
      default:
        return ['All'];
    }
  };

  const categories = getCategories();

  // Mapa de colores dinámicos según la región
  const getRegionTheme = () => {
    switch (regionId) {
      case 'costa':
        return {
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          hoverColor: 'hover:bg-blue-700'
        };
      case 'sierra':
        return {
          bgColor: 'bg-green-600',
          textColor: 'text-white',
          hoverColor: 'hover:bg-green-700'
        };
      case 'oriente':
        return {
          bgColor: 'bg-orange-400',
          textColor: 'text-white',
          hoverColor: 'hover:bg-orange-500'
        };
      default:
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          hoverColor: 'hover:bg-blue-600'
        };
    }
  };

  const theme = getRegionTheme();

  // Filtrar palabras según el término de búsqueda y categoría
  const filteredWords = words.filter(word => {
    const matchesSearch = 
      word.palabra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.significado.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      (word as any).categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Verificar si hay usuario autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  // Obtener user ID del token
  const getUserId = (): number | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return user.id || null;
    } catch {
      return null;
    }
  };

  // Cargar favoritos del usuario
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated()) return;

      try {
        const response = await api.get('/favorites');

        // Crear Set con los IDs de palabras favoritas
        const favoriteIds = new Set<number>(response.data.map((fav: any) => fav.word_id));
        setFavorites(favoriteIds);
        
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchWords = async () => {
      if (!currentRegion) {
        setError('Invalid region');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/words');
        
        // Filtrar palabras por region_id
        const filteredWords = response.data.filter(
          (word: Word) => word.region_id === currentRegion.id
        );
        
        setWords(filteredWords);
      } catch (err) {
        console.error('Error fetching words:', err);
        setError('Failed to load words. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [regionId, currentRegion]);

  // Función para manejar favoritos
  const handleFavoriteToggle = async (wordId: number) => {
    // 1. Verificar autenticación
    if (!isAuthenticated()) {
      // Redirigir a login
      navigate('/login', { 
        state: { from: window.location.pathname } 
      });
      return;
    }

    const userId = getUserId();
    if (!userId) {
      alert('Error: User ID not found. Please login again.');
      navigate('/login');
      return;
    }

    // 2. Optimistic UI update
    const isFavorite = favorites.has(wordId);
    const newFavorites = new Set(favorites);
    
    if (isFavorite) {
      newFavorites.delete(wordId);
    } else {
      newFavorites.add(wordId);
    }
    
    setFavorites(newFavorites);

    // 3. Hacer request al backend
    try {
      if (isFavorite) {
        // ELIMINAR favorito
        await api.delete(`/api/favorites/${wordId}`);
      } else {
        // AGREGAR favorito
        await api.post('/favorites', { word_id: wordId });
      }

    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      
      // Revertir cambio optimista si falló
      setFavorites(favorites);
      
      // Manejar errores específicos
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert('Failed to update favorite. Please try again.');
      }
    }
  };

  // Manejo de errores
  if (!currentRegion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Invalid Region</h1>
          <p className="text-gray-600 mb-6">The region "{regionId}" does not exist.</p>
          <Link to="/">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    // --- OVERLAY DE FONDO (Simula un Modal) ---
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      
      {/* --- CONTENEDOR MODAL BLANCO --- */}
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl mx-4">
        
        {/* --- HEADER DINÁMICO SEGÚN LA REGIÓN (Mejorado) --- */}
        <div className={`${theme.bgColor} px-6 py-5 flex justify-between items-center relative`}>
          {/* Efecto de brillo/overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                {currentRegion.emoji}
              </span>
              <h1 className={`text-2xl font-black ${theme.textColor} tracking-tight`}
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                {currentRegion.name}
              </h1>
            </div>
            <p className={`${theme.textColor} text-sm font-medium opacity-90 ml-12`}>
              {currentRegion.description}
            </p>
          </div>
          
          {/* Botón Cerrar (X) - Mejorado */}
          <Link 
            to="/" 
            className={`${theme.textColor} ${theme.hoverColor} p-2 rounded-full transition-all duration-200 transform hover:scale-110 hover:rotate-90 relative z-10 bg-black/10`}
            aria-label="Close and return home"
          >
            <FaTimes className="text-xl" />
          </Link>
        </div>

        {/* --- CUERPO SCROLLEABLE --- */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Spinner size="xl" color="success" />
              <span className="ml-3 text-xl text-gray-600">Loading words...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-red-700 mb-2">⚠️ Error</h3>
              <p className="text-red-600">{error}</p>
              <button 
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredWords.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-yellow-700 mb-2">
                {searchTerm ? 'No Results Found' : 'No Words Yet'}
              </h3>
              <p className="text-yellow-600 mb-4">
                {searchTerm 
                  ? `No words match "${searchTerm}". Try a different search term.`
                  : 'There are no words available for this region yet.'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Words Grid */}
          {!loading && !error && filteredWords.length > 0 && (
            <>
              {/* BARRA DE BÚSQUEDA */}
              <div className="mb-4">
                <div className={`bg-white rounded-xl shadow-lg border-2 ${
                  searchTerm ? 'border-' + (regionId === 'costa' ? 'blue' : regionId === 'sierra' ? 'green' : 'orange') + '-400' : 'border-gray-200'
                } p-4 flex items-center gap-3 transition-all duration-200 hover:shadow-xl`}>
                  <div className={`w-10 h-10 ${theme.bgColor} rounded-lg flex items-center justify-center shadow-md`}>
                    <FaSearch className="text-white text-lg" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 font-medium"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      aria-label="Clear search"
                    >
                      <FaTimes className="text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* FILTROS POR CATEGORÍA */}
              <div className="mb-6 overflow-x-auto">
                <div className="flex gap-2 pb-2 items-center">
                  {/* Botón de regresar a "All" */}
                  {selectedCategory !== 'All' && (
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-105 shadow-md flex items-center gap-2 ${theme.bgColor} ${theme.textColor}`}
                      title="Back to all words"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back
                    </button>
                  )}
                  
                  {/* Botones de categorías */}
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-105 shadow-md ${
                        selectedCategory === category
                          ? `${theme.bgColor} ${theme.textColor} shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de Tarjetas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWords.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    isFavorite={favorites.has(word.id)}
                    onFavoriteClick={handleFavoriteToggle}
                    regionId={regionId}
                  />
                ))}
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
};