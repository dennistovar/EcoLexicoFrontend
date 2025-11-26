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
}

export const WordCard = ({ word, onFavoriteClick, isFavorite = false }: WordCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const navigate = useNavigate();

  // --- FUNCIÓN PARA REPRODUCIR AUDIO ---
  const handlePlayAudio = () => {
    if (!word.audio_url) {
      setAudioError(true);
      return;
    }

    setAudioError(false);
    setIsPlaying(true);

    const audio = new Audio(word.audio_url);

    audio.play().catch((err) => {
      console.error('Error playing audio:', err);
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      
      {/* --- ENCABEZADO: Palabra + Botón Audio --- */}
      <div className="flex justify-between items-start mb-4">
        
        {/* Título y Pronunciación */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {word.palabra}
          </h3>
          {word.pronunciacion && (
            <p className="text-sm text-gray-500 uppercase mt-1">
              {word.pronunciacion}
            </p>
          )}
        </div>

        {/* Botón Audio (Cuadrado Azul) */}
        <button
          onClick={handlePlayAudio}
          disabled={isPlaying || !word.audio_url}
          className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 
                     rounded-lg flex items-center justify-center transition-colors"
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

      {/* --- PIE DE TARJETA: Regional Expression + Save --- */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        
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
  );
};
