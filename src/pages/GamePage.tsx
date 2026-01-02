import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Progress } from 'flowbite-react';
import { FaHeart, FaVolumeUp, FaTrophy, FaRedo, FaHome } from 'react-icons/fa';
import axios from 'axios';

// --- LEVEL DATA ---
const LEVEL_DATA = [
  {
    id: 'novato',
    threshold: 0,
    title: "Newbie Tourist",
    phrase: "Good start! Don't get lost.",
    icon: "🥉",
    medalColor: "from-orange-400 via-orange-300 to-orange-500",
    ribbonColor: "bg-gradient-to-r from-orange-500 to-orange-600"
  },
  {
    id: 'casi',
    threshold: 5,
    title: "Almost Local",
    phrase: "Nice! You almost got the slang.",
    icon: "🥈",
    medalColor: "from-gray-300 via-gray-200 to-gray-400",
    ribbonColor: "bg-gradient-to-r from-gray-400 to-gray-500"
  },
  {
    id: 'nano',
    threshold: 15,
    title: "True Ecuadorian!",
    phrase: "Amazing! You are a true Ñaño.",
    icon: "🥇",
    medalColor: "from-yellow-400 via-yellow-300 to-yellow-500",
    ribbonColor: "bg-gradient-to-r from-yellow-500 to-yellow-600"
  }
];

// --- TIPOS ---
interface Word {
  id: number;
  palabra: string;
  significado: string;
  audio_url?: string;
  region_id: number;
}

interface Question {
  target: Word;
  options: Word[];
}

type GameState = 'loading' | 'playing' | 'gameover' | 'win';

// --- HELPER: GET LEVEL RESULT ---
const getLevelResult = (score: number) => {
  // Buscar del nivel más alto al más bajo
  for (let i = LEVEL_DATA.length - 1; i >= 0; i--) {
    if (score >= LEVEL_DATA[i].threshold) {
      return LEVEL_DATA[i];
    }
  }
  return LEVEL_DATA[0]; // Por defecto devolver el primer nivel
};

export const GamePage = () => {
  const navigate = useNavigate();
  
  // --- ESTADOS DEL JUEGO ---
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [usedWordIds, setUsedWordIds] = useState<Set<number>>(new Set());
  
  // Estados de feedback visual
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // --- CARGAR PALABRAS AL INICIAR ---
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setGameState('loading');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_URL}/api/words`);
        
        if (response.data.length < 4) {
          alert(' Need at least 4 words in the database to play');
          navigate('/');
          return;
        }
        
        setAllWords(response.data);
        setGameState('playing');
        
      } catch (error) {
        console.error('Error loading words:', error);
        alert('Failed to load game. Please check your connection.');
        navigate('/');
      }
    };

    fetchWords();
  }, [navigate]);

  // --- GENERAR PREGUNTA CUANDO HAY PALABRAS ---
  useEffect(() => {
    if (allWords.length > 0 && gameState === 'playing' && !currentQuestion) {
      generateQuestion();
    }
  }, [allWords, gameState]);

  // --- FUNCIÓN: GENERAR PREGUNTA ---
  const generateQuestion = () => {
    if (allWords.length < 4) return;

    // Filtrar palabras no usadas
    const availableWords = allWords.filter(word => !usedWordIds.has(word.id));
    
    // Si ya usamos todas las palabras, el jugador GANÓ
    if (availableWords.length === 0) {
      setGameState('win');
      return;
    }

    // 1. Elegir palabra TARGET (correcta)
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const target = availableWords[randomIndex];

    // 2. Elegir 3 DISTRACTORS (incorrectas)
    const distractors: Word[] = [];
    const otherWords = allWords.filter(w => w.id !== target.id);
    
    while (distractors.length < 3 && distractors.length < otherWords.length) {
      const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
      if (!distractors.find(d => d.id === randomWord.id)) {
        distractors.push(randomWord);
      }
    }

    // 3. MEZCLAR las 4 opciones
    const options = shuffle([target, ...distractors]);

    // 4. Actualizar estados
    setCurrentQuestion({ target, options });
    setUsedWordIds(prev => new Set([...prev, target.id]));
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // --- FUNCIÓN: MEZCLAR ARRAY (Fisher-Yates) ---
  const shuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // --- FUNCIÓN: REPRODUCIR AUDIO ---
  const playAudio = (audioUrl?: string) => {
    if (!audioUrl) {
      alert('Audio not available for this word');
      return;
    }
    
    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
    });
  };

  // --- FUNCIÓN: MANEJAR RESPUESTA ---
  const handleAnswer = (selectedWord: Word) => {
    if (showFeedback) return; // Evitar múltiples clics

    setSelectedAnswer(selectedWord.id);
    setShowFeedback(true);

    // Verificar si es correcta
    if (selectedWord.id === currentQuestion?.target.id) {
      //  RESPUESTA CORRECTA
      setIsCorrect(true);
      setScore(prev => prev + 10);
      playSuccessSound();
      
      // Esperar 1.5s y generar nueva pregunta
      setTimeout(() => {
        setCurrentQuestion(null);
        setTimeout(() => generateQuestion(), 100);
      }, 1500);
      
    } else {
      //  RESPUESTA INCORRECTA
      setIsCorrect(false);
      const newLives = lives - 1;
      setLives(newLives);
      playErrorSound();
      
      if (newLives === 0) {
        // Game Over
        setTimeout(() => {
          setGameState('gameover');
        }, 1500);
      } else {
        // Continuar jugando
        setTimeout(() => {
          setCurrentQuestion(null);
          setTimeout(() => generateQuestion(), 100);
        }, 1500);
      }
    }
  };

  // --- SONIDOS (usando Web Audio API simple) ---
  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const playErrorSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // --- FUNCIÓN: REINICIAR JUEGO ---
  const restartGame = () => {
    // 1. Resetear contadores
    setScore(0);
    setLives(3);
    setUsedWordIds(new Set());
    setSelectedAnswer(null);
    setShowFeedback(false);
    
    // 2. Generar pregunta inmediatamente
    generateQuestion();
    
    // 3. Cambiar a estado de juego
    setGameState('playing');
  };

  // --- EFECTO DE SONIDO PARA GAME OVER ---
  useEffect(() => {
    if (gameState === 'gameover') {
      const audio = new Audio('/win.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Audio play failed:', err));
    }
  }, [gameState]);

  // --- CALCULAR PROGRESO ---
  const progressPercentage = (usedWordIds.size / allWords.length) * 100;

  // --- RENDER: LOADING ---
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-500 to-indigo-600 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Game...</h2>
          <p className="text-gray-600 mt-2">Preparing your trivia challenge</p>
        </Card>
      </div>
    );
  }

  // --- RENDER: GAME OVER (DISEÑO MEJORADO) ---
  if (gameState === 'gameover') {
    const levelResult = getLevelResult(score);
    
    return (
      // Full Screen Overlay con Patrón de Confetti
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden">
        
        {/* Animated Confetti Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Confetti pieces */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: ['#fbbf24', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Glowing circles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
        
        {/* Main Result Card */}
        <div className="relative max-w-xl w-full animate-scale-pop z-10">
          
          {/* Trophy/Medal Circle */}
          <div className="flex justify-center mb-6">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${levelResult.medalColor} flex items-center justify-center shadow-2xl border-4 border-white animate-bounce-slow`}>
              <span className="text-6xl drop-shadow-2xl">{levelResult.icon}</span>
            </div>
          </div>
          
          {/* White Card Container */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-white/50">
            
            {/* Title Section */}
            <div className="text-center mb-6">
              <div className="inline-block mb-3">
                <span className={`inline-block px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${levelResult.ribbonColor} text-white shadow-lg`}>
                  {score >= 15 ? '🎉 Outstanding!' : score >= 5 ? '👏 Well Done!' : '💪 Keep Trying!'}
                </span>
              </div>
              <h2 className="text-5xl font-black text-gray-900 mb-3 leading-tight"
                  style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.05)' }}>
                {levelResult.title}
              </h2>
              <p className="text-xl text-gray-600 font-medium italic">
                "{levelResult.phrase}"
              </p>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                {/* Score */}
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Score</p>
                  <p className={`text-6xl font-black bg-gradient-to-br ${levelResult.medalColor} bg-clip-text text-transparent`}>
                    {score}
                  </p>
                </div>
                {/* Progress */}
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Progress</p>
                  <p className="text-3xl font-bold text-gray-800">{usedWordIds.size}/{allWords.length}</p>
                  <p className="text-xs text-gray-500 mt-1">words attempted</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Play Again */}
              <button
                onClick={restartGame}
                className="group relative bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <FaRedo className="text-lg" />
                  <span>Play Again</span>
                </div>
              </button>

              {/* Home Button */}
              <button
                onClick={() => navigate('/')}
                className="group relative bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <FaHome className="text-lg" />
                  <span>Home</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* CSS para Animaciones */}
        <style>{`
          @keyframes scale-pop {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          
          @keyframes confetti {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          
          .animate-scale-pop {
            animation: scale-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          
          .animate-confetti {
            animation: confetti linear infinite;
          }
          
          .animation-delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </div>
    );
  }

  // --- RENDER: WIN (Completó todas las palabras) ---
  if (gameState === 'win') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-orange-500 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <FaTrophy className="text-6xl text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 Congratulations!</h2>
            <p className="text-gray-600 mb-4">You completed all words!</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Perfect Score!</p>
            <p className="text-5xl font-bold text-green-600">{score}</p>
            <p className="text-sm text-gray-500 mt-2">
              {allWords.length} / {allWords.length} words mastered
            </p>
            <p className="text-sm text-green-600 mt-2 font-medium">
              Lives remaining: {lives} ❤️
            </p>
          </div>

          <div className="flex gap-3">
            <Button color="success" className="flex-1" onClick={restartGame}>
              <FaRedo className="mr-2" />
              Play Again
            </Button>
            <Link to="/" className="flex-1">
              <Button color="gray" className="w-full">
                <FaHome className="mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // --- RENDER: JUGANDO ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 to-purple-600 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* --- BARRA SUPERIOR: VIDAS + PUNTAJE --- */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center">
          
          {/* Vidas */}
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium mr-2">Lives:</span>
            {[...Array(3)].map((_, i) => (
              <FaHeart 
                key={i}
                className={`text-2xl ${i < lives ? 'text-red-500' : 'text-gray-300'}`}
              />
            ))}
          </div>

          {/* Puntaje */}
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-3xl font-bold text-indigo-600">{score}</p>
          </div>

        </div>

        {/* --- BARRA DE PROGRESO --- */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {usedWordIds.size} / {allWords.length} words
            </span>
          </div>
          <Progress 
            progress={progressPercentage} 
            color="indigo"
            size="lg"
          />
        </div>

        {/* --- TARJETA DE PREGUNTA --- */}
        {currentQuestion && (
          <Card className="mb-6 bg-white shadow-2xl border-t-4 border-yellow-400">
            
            {/* Palabra a adivinar */}
            <div className="text-center mb-6">
              <p className="text-lg text-gray-600 mb-4">What does this word mean?</p>
              <h2 className="text-4xl font-bold text-indigo-700 mb-4">
                {currentQuestion.target.palabra}
              </h2>
              
              {/* Botón Audio */}
              {currentQuestion.target.audio_url && (
                <button
                  onClick={() => playAudio(currentQuestion.target.audio_url)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <FaVolumeUp className="text-xl" />
                  <span className="font-medium">Listen</span>
                </button>
              )}
            </div>

            {/* Grid de Opciones 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isTarget = option.id === currentQuestion.target.id;
                const shouldShowCorrect = showFeedback && isTarget;
                const shouldShowIncorrect = showFeedback && isSelected && !isTarget;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                    className={`
                      p-6 rounded-lg border-2 text-left transition-all transform hover:scale-105
                      ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
                      ${shouldShowCorrect ? 'bg-green-100 border-green-500 text-green-800' : ''}
                      ${shouldShowIncorrect ? 'bg-red-100 border-red-500 text-red-800' : ''}
                      ${!showFeedback ? 'bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50' : ''}
                    `}
                  >
                    <p className="text-lg font-medium">
                      {option.significado}
                    </p>
                    
                    {/* Icono de feedback */}
                    {shouldShowCorrect && (
                      <div className="mt-2 flex items-center text-green-600">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold">Correct!</span>
                      </div>
                    )}
                    
                    {shouldShowIncorrect && (
                      <div className="mt-2 flex items-center text-red-600">
                        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold">Wrong!</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

          </Card>
        )}

        {/* --- BOTÓN SALIR --- */}
        <div className="text-center">
          <Link to="/">
            <Button color="gray" outline>
              <FaHome className="mr-2" />
              Exit Game
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
