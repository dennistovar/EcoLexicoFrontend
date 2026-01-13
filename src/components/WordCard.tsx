import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

// --- MAPEO DE REGIONES ---
const regionNames: Record<number, string> = {
  1: 'Costa',
  2: 'Sierra',
  3: 'Oriente'
};

// --- INTERFACE DE LA PALABRA ---
interface Word {
  id?: number;
  palabra: string;
  significado: string;
  ejemplo?: string;
  pronunciacion?: string;
  audio_url?: string;
  region_id: number;
}

// --- PROPS DEL COMPONENTE ---
interface WordCardProps {
  word: Word;
  onFavoriteClick?: (wordId: number) => void;
  isFavorite?: boolean;
  regionId?: string; // Agregar para colores dinámicos
}

export const WordCard = ({ word, onFavoriteClick, isFavorite = false, regionId }: WordCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const navigate = useNavigate();

  // Obtener el nombre de la región
  const getRegionName = () => {
    return regionNames[word.region_id] || 'Regional Expression';
  };

  // Colores dinámicos según la región
  const getAudioButtonColor = () => {
    switch (regionId) {
      case 'costa':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/50';
      case 'sierra':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/50';
      case 'oriente':
        return 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg shadow-green-500/50';
      default:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-lg shadow-yellow-500/50';
    }
  };

  // --- FUNCIÓN PARA REPRODUCIR AUDIO CON URL FIRMADA ---
  const handlePlayAudio = async () => {
    // 1. Validación: Verificar si existe audio_url
    if (!word.audio_url || word.audio_url.trim() === '') {
      console.warn('Audio URL no disponible para esta palabra');
      return;
    }

    setAudioError(false);
    setIsPlaying(true);

    try {
      const token = localStorage.getItem('token');
      
      // Si no hay token, reproducir directamente (menos seguro pero funcional)
      if (!token) {
        console.warn('No token found, playing audio directly');
        playAudioDirectly(word.audio_url);
        return;
      }

      // 2. Solicitar URL firmada al backend
      const response = await fetch(
        `/api/audio/signed-url?url=${encodeURIComponent(word.audio_url)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const data = await response.json();
      
      // 3. Reproducir con URL firmada
      playAudioDirectly(data.signedUrl);

    } catch (error) {
      console.error('Error getting signed URL:', error);
      // Fallback: reproducir URL original si falla
      playAudioDirectly(word.audio_url);
    }
  };

  // Función auxiliar para reproducir audio
  const playAudioDirectly = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";

    audio.play()
      .then(() => {
        console.log('Reproduciendo audio...');
      })
      .catch((error) => {
        console.error('Error de reproducción:', error);
        alert('No se pudo reproducir el audio.');
        setAudioError(true);
        setIsPlaying(false);
      });

    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.onerror = () => {
      setAudioError(true);
      setIsPlaying(false);
    };
  };

  // --- FUNCIÓN PARA MANEJAR FAVORITOS ---
  const handleSaveClick = () => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/login');
      return;
    }
    
    // Si hay token, ejecutar la lógica de guardar
    if (onFavoriteClick && word.id) {
      onFavoriteClick(word.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-yellow-200 hover:border-blue-400 p-6 h-full transform hover:scale-105 transition-all duration-300">
      
      {/* Contenedor Flexbox para alinear el footer al fondo */}
      <div className="flex flex-col h-full justify-between">
        
        {/* Contenido Superior */}
        <div>
          {/* --- ENCABEZADO: Palabra + Botón Audio --- */}
          <div className="flex justify-between items-start mb-4">
            
            {/* Título */}
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-yellow-600 via-blue-600 to-red-600 text-transparent bg-clip-text">
                {word.palabra}
              </h3>
            </div>

            {/* Botón Audio (Color Dinámico según Región) */}
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying || !word.audio_url}
              className={`w-12 h-12 ${getAudioButtonColor()} disabled:bg-gray-300 disabled:shadow-none
                        rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110`}
              aria-label="Play audio"
            >
              <FaVolumeUp className="text-white text-xl" />
            </button>

          </div>

          {/* --- CUERPO: Significado y Ejemplo --- */}
          <div className="space-y-3 mb-4">
            
            {/* Sección Meaning */}
            <div>
              <p className="text-sm font-bold text-blue-700 mb-1">Meaning</p>
              <p className="text-gray-700 leading-relaxed">{word.significado}</p>
            </div>

            {/* Sección Example */}
            {word.ejemplo && (
              <div>
                <p className="text-sm font-bold text-blue-700 mb-1">Example</p>
                <p className="text-gray-600 italic leading-relaxed">"{word.ejemplo}"</p>
              </div>
            )}

          </div>
        </div>

        {/* --- PIE DE TARJETA: Regional Expression + Save --- */}
        <div className="flex justify-between items-center pt-4 border-t border-yellow-200">
          
          {/* Izquierda: Icono Pin + Texto */}
          <div className="flex items-center gap-2 text-blue-700">
            <FaMapMarkerAlt className="text-sm" />
            <span className="text-sm font-bold">{getRegionName()}</span>
          </div>

          {/* Derecha: Botón Save con Corazón */}
          <button
            onClick={handleSaveClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isFavorite 
                ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50' 
                : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/50 border-2 border-yellow-400'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FaHeart className={isFavorite ? 'fill-current' : ''} />
            <span className="text-sm font-bold">Save</span>
          </button>

        </div>

        {/* Mensaje de Error de Audio */}
        {audioError && (
          <p className="text-red-600 text-sm mt-3">
            Audio not available for this word
          </p>
        )}

      </div>

    </div>
  );
};
