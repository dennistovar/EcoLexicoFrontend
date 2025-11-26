import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaHeadphones } from 'react-icons/fa';
import { WordCard } from '../components/WordCard';
import axios from 'axios';

interface Word {
  id: number;
  palabra: string;
  significado: string;
  ejemplo?: string;
  pronunciacion?: string;
  audio_url?: string;
  region_id: number;
}

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar favoritos del backend
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setFavorites(response.data);
      } catch (err: any) {
        console.error('Error fetching favorites:', err);
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to load favorites. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  // Función para manejar toggle de favoritos
  const handleFavoriteToggle = async (wordId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Remover de favoritos
      await axios.delete(`${API_URL}/api/favorites/${wordId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Actualizar estado local
      setFavorites(favorites.filter(word => word.id !== wordId));
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-10">
      
      {/* --- CONTENEDOR PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- ENCABEZADO CENTRADO --- */}
        <div className="text-center mb-12">
          
          {/* Icono Principal (Círculo Rojo con Corazón) */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <FaHeart className="text-white text-4xl" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Favorite Words
          </h1>

          {/* Subtítulo */}
          <p className="text-gray-600 mt-2">
            Keep track of the Ecuadorian words you love the most
          </p>

        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* ESTADO VACÍO (Cuando no hay favoritos) */}
        {!loading && !error && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20">
            
            {/* Icono de Corazón Vacío */}
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FaRegHeart className="text-gray-400 text-5xl" />
            </div>

            {/* Título Estado Vacío */}
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              No favorites yet
            </h2>

            {/* Texto Descriptivo */}
            <p className="text-gray-600 text-center max-w-md mb-8">
              Start exploring words from different regions and save your favorites to access them quickly here.
            </p>

            {/* Botón para Explorar */}
            <Link to="/">
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md">
                Explore Words
              </button>
            </Link>

          </div>
        )}

        {/* GRID DE FAVORITOS (Se mostrará cuando haya datos) */}
        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {favorites.map((word) => (
              <WordCard 
                key={word.id} 
                word={word}
                onFavoriteClick={handleFavoriteToggle}
                isFavorite={true}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
