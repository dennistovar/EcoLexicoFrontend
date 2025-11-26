import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import axios from 'axios';
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
  
  // Estado para favoritos
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Obtener configuración de la región actual
  const currentRegion = regionId ? regionConfig[regionId] : null;

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
          bgColor: 'bg-amber-500',
          textColor: 'text-gray-900',
          hoverColor: 'hover:bg-amber-600'
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

  // Filtrar palabras según el término de búsqueda
  const filteredWords = words.filter(word =>
    word.palabra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.significado.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });

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
        
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/words`);
        
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      if (isFavorite) {
        // ELIMINAR favorito
        await axios.delete(`${API_URL}/api/favorites/${wordId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // AGREGAR favorito
        await axios.post(
          `${API_URL}/api/favorites`,
          { word_id: wordId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
        
        {/* --- HEADER DINÁMICO SEGÚN LA REGIÓN --- */}
        <div className={`${theme.bgColor} px-6 py-4 flex justify-between items-center`}>
          <div>
            <h1 className={`text-2xl font-bold ${theme.textColor}`}>
              {currentRegion.name}
            </h1>
            <p className={`${theme.textColor} text-sm opacity-90`}>
              Discover authentic words from this region
            </p>
          </div>
          
          {/* Botón Cerrar (X) */}
          <Link 
            to="/" 
            className={`${theme.textColor} ${theme.hoverColor} p-2 rounded-full transition-colors`}
            aria-label="Close and return home"
          >
            <FaTimes className="text-2xl" />
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
              {/* BARRA DE BÚSQUEDA Y CONTADOR */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                {/* Barra de Búsqueda (Izquierda) */}
                <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3 w-full md:w-96">
                  <FaSearch className="text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Contador (Derecha) */}
                <p className="text-gray-600 text-sm md:text-base">
                  Showing {filteredWords.length} of {words.length} words
                </p>
              </div>

              {/* Grid de Tarjetas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWords.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    isFavorite={favorites.has(word.id)}
                    onFavoriteClick={handleFavoriteToggle}
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