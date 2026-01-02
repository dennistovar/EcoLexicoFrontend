import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

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

  // Colores dinámicos según la región
  const getAudioButtonColor = () => {
    switch (regionId) {
      case 'costa':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'sierra':
        return 'bg-green-500 hover:bg-green-600';
      case 'oriente':
        return 'bg-orange-400 hover:bg-orange-500';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Si no hay token, reproducir directamente (menos seguro pero funcional)
      if (!token) {
        console.warn('No token found, playing audio directly');
        playAudioDirectly(word.audio_url);
        return;
      }

      // 2. Solicitar URL firmada al backend
      const response = await fetch(
        `${API_URL}/api/audio/signed-url?url=${encodeURIComponent(word.audio_url)}`,
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full">
      
      {/* Contenedor Flexbox para alinear el footer al fondo */}
      <div className="flex flex-col h-full justify-between">
        
        {/* Contenido Superior */}
        <div>
          {/* --- ENCABEZADO: Palabra + Botón Audio --- */}
          <div className="flex justify-between items-start mb-4">
            
            {/* Título */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {word.palabra}
              </h3>
            </div>

            {/* Botón Audio (Color Dinámico según Región) */}
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying || !word.audio_url}
              className={`w-10 h-10 ${getAudioButtonColor()} disabled:bg-gray-300 
                        rounded-lg flex items-center justify-center transition-colors shadow-md`}
              aria-label="Play audio"
            >
              <FaVolumeUp className="text-white text-lg" />
            </button>

          </div>

          {/* --- CUERPO: Significado y Ejemplo --- */}
          <div className="space-y-3 mb-4">
            
            {/* Sección Meaning */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">Meaning</p>
              <p className="text-gray-600">{word.significado}</p>
            </div>

            {/* Sección Example */}
            {word.ejemplo && (
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Example</p>
                <p className="text-gray-600 italic">"{word.ejemplo}"</p>
              </div>
            )}

          </div>
        </div>

        {/* --- PIE DE TARJETA: Regional Expression + Save --- */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          
          {/* Izquierda: Icono Pin + Texto */}
          <div className="flex items-center gap-2 text-gray-500">
            <FaMapMarkerAlt className="text-sm" />
            <span className="text-sm">Regional Expression</span>
          </div>

          {/* Derecha: Botón Save con Corazón */}
          <button
            onClick={handleSaveClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              isFavorite 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-red-500'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FaHeart className={isFavorite ? 'fill-current' : ''} />
            <span className="text-sm font-medium">Save</span>
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
