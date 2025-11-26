import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShip, FaMountain, FaLeaf, FaMapMarkerAlt, FaUsers, FaGlobeAmericas, FaVolumeUp, FaMap, FaBookOpen, FaEnvelope, FaRegCompass, FaPlayCircle, FaGamepad, FaHeadphones, FaBook, FaHeart } from 'react-icons/fa';

// Array de imágenes para el carrusel del Hero
const heroImages = ["/img/costa-carrucel.jpg", "/img/sierra-carrucel.jpg", "/img/oriente-carrucel.jpg"];

export const HomePage = () => {
  // Estado para controlar el índice de la imagen actual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Estado para controlar el modal del video
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  // Estado para controlar el modal del juego
  const [openGameModal, setOpenGameModal] = useState(false);
  
  const navigate = useNavigate();

  // Función para manejar el inicio del juego (solo usuarios logueados)
  const handleStartGame = () => {
    const token = localStorage.getItem('token');
    setOpenGameModal(false);
    
    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/login');
    } else {
      // Si hay token, ir al juego
      navigate('/game');
    }
  };

  // Efecto para cambiar la imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section 
        className="relative min-h-[600px] bg-cover bg-center flex items-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url("${heroImages[currentImageIndex]}")`,
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-left">
            
            {/* Título Principal con Colores */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Discover </span>
              <span className="text-yellow-400">Ecuador's</span>
              <br />
              <span className="text-green-400">Linguistic </span>
              <span className="text-white">Heritage</span>
            </h1>

            {/* Texto Secundario */}
            <p className="text-white text-lg mb-8 max-w-2xl">
              Explore authentic Ecuadorian words and expressions from all four regions. Learn pronunciation, meanings, and cultural context from Coast to Amazon.
            </p>

            {/* Botones */}
            <div className="flex flex-wrap gap-4">
              {/* Botón 1: Start Exploring */}
              <Link to="/region/costa">
                <button className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-lg">
                  <FaRegCompass className="text-xl" />
                  Start Exploring
                </button>
              </Link>

              {/* Botón 2: Ecu-Quiz */}
              <button 
                onClick={() => setOpenGameModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg"
              >
                <FaGamepad className="text-xl" />
                Ecu-Quiz
              </button>

              {/* Botón 3: Watch Introduction */}
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                <FaPlayCircle className="text-xl" />
                Watch Introduction
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- VIDEO MODAL --- */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            
            {/* Título */}
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to EcoLéxico
            </h3>
            
            {/* Video */}
            <video 
              src="/img/videos/intro.mp4"
              controls
              autoPlay
              className="w-full rounded-lg shadow-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* --- EXPLORE BY REGION SECTION --- */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Explore by Region
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Ecuador's Spanish varies beautifully across three unique geographic zones
          </p>

          {/* Grid de 3 regiones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* COAST CARD */}
            <div className="bg-white rounded-lg shadow-md border-t-4 border-blue-500 p-6 hover:shadow-xl transition-shadow h-full flex flex-col justify-between">
              
              {/* Contenido Superior */}
              <div className="flex-grow flex flex-col items-center">
                {/* Icono Circular */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaShip className="text-3xl text-blue-500" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                  Coast Region
                </h3>

                {/* Badge */}
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    150 words
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-center mb-4">
                  Warm, rhythmic Spanish from the Pacific beaches. Known for relaxed pronunciation and coastal slang.
                </p>
              </div>

              {/* Botón */}
              <Link to="/region/costa">
                <button className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors">
                  Explore Region
                </button>
              </Link>

            </div>

            {/* HIGHLANDS CARD */}
            <div className="bg-white rounded-lg shadow-md border-t-4 border-green-500 p-6 hover:shadow-xl transition-shadow h-full flex flex-col justify-between">
              
              {/* Contenido Superior */}
              <div className="flex-grow flex flex-col items-center">
                {/* Icono Circular */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <FaMountain className="text-3xl text-green-500" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                  Highlands Region
                </h3>

                {/* Badge */}
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                    150 words
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-center mb-4">
                  Clear, formal Spanish from the highlands. Strong influence from Quechua indigenous language.
                </p>
              </div>

              {/* Botón */}
              <Link to="/region/sierra">
                <button className="w-full border-2 border-green-500 text-green-500 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition-colors">
                  Explore Region
                </button>
              </Link>

            </div>

            {/* AMAZON CARD */}
            <div className="bg-white rounded-lg shadow-md border-t-4 border-yellow-400 p-6 hover:shadow-xl transition-shadow h-full flex flex-col justify-between">
              
              {/* Contenido Superior */}
              <div className="flex-grow flex flex-col items-center">
                {/* Icono Circular */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <FaLeaf className="text-3xl text-yellow-500" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                  Amazon Region
                </h3>

                {/* Badge */}
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm font-medium rounded-full">
                    150 words
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-center mb-4">
                  Unique jungle Spanish mixed with indigenous vocabulary. Rich in nature-related expressions.
                </p>
              </div>

              {/* Botón */}
              <Link to="/region/oriente">
                <button className="w-full border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 font-medium py-2 px-4 rounded-lg transition-colors">
                  Explore Region
                </button>
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Título y Subtítulo */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Why Choose EcoLéxico?
            </h2>
            <p className="text-gray-600 text-lg">
              The most comprehensive platform for learning authentic Ecuadorian Spanish
            </p>
          </div>

          {/* Grid de 3 Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* TARJETA 1: Audio Pronunciation */}
            <div className="bg-yellow-50 rounded-xl p-8 text-center">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FaVolumeUp className="text-white text-2xl" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Audio Pronunciation
              </h3>
              {/* Descripción */}
              <p className="text-gray-600">
                Listen to authentic regional pronunciations from native speakers across Ecuador.
              </p>
            </div>

            {/* TARJETA 2: Regional Context */}
            <div className="bg-emerald-50 rounded-xl p-8 text-center">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center">
                  <FaMap className="text-white text-2xl" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Regional Context
              </h3>
              {/* Descripción */}
              <p className="text-gray-600">
                Understand the cultural and geographical context behind each word and expression.
              </p>
            </div>

            {/* TARJETA 3: Cultural Examples */}
            <div className="bg-blue-50 rounded-xl p-8 text-center">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaBookOpen className="text-white text-2xl" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Cultural Examples
              </h3>
              {/* Descripción */}
              <p className="text-gray-600">
                Learn through real-life examples and situations where these words are commonly used.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT ECUADOR SECTION --- */}
      <section id="about" className="py-16 px-4 bg-gradient-to-r from-teal-500 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* CONTENIDO IZQUIERDA (Texto) */}
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">
                About Ecuador
              </h2>
              <p className="text-lg mb-6 text-white/90">
                Ecuador is a country of incredible diversity, from the Pacific Coast to the Amazon rainforest, from the Andean highlands to the unique Galápagos Islands.
              </p>

              {/* Lista de puntos con iconos */}
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <span className="text-lg">4 distinct geographical regions</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-white text-lg" />
                  </div>
                  <span className="text-lg">14+ indigenous languages spoken</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaGlobeAmericas className="text-white text-lg" />
                  </div>
                  <span className="text-lg">Rich cultural and linguistic heritage</span>
                </li>
              </ul>
            </div>

            {/* CONTENIDO DERECHA (Imagen) */}
            <div className="flex justify-center items-center">
              <img 
                src="/img/mapa-ecuador.jpg"
                alt="Ecuador regions map"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Grid de 4 Columnas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* COLUMNA 1: MARCA */}
            <div className="text-center md:text-left">
              <h3 className="text-white text-2xl font-bold mb-4">EcoLéxico</h3>
              <p className="text-gray-400">
                Preserving Ecuador's linguistic heritage for future generations.
              </p>
            </div>

            {/* COLUMNA 2: REGIONS */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold uppercase mb-4">Regions</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/region/costa" className="hover:text-white transition-colors">
                    Coast
                  </Link>
                </li>
                <li>
                  <Link to="/region/sierra" className="hover:text-white transition-colors">
                    Highlands
                  </Link>
                </li>
                <li>
                  <Link to="/region/oriente" className="hover:text-white transition-colors">
                    Amazon
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMNA 3: RESOURCES */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold uppercase mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pronunciation Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cultural Context
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Travel Tips
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMNA 4: CONTACT */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-bold uppercase mb-4">Contact Us</h4>
              <a 
                href="mailto:dgtovar@espe.edu.ec" 
                className="flex items-center gap-2 hover:text-white transition-colors justify-center md:justify-start"
              >
                <FaEnvelope className="text-lg" />
                <span>dgtovar@espe.edu.ec</span>
              </a>
            </div>

          </div>

          {/* BARRA INFERIOR */}
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-sm">
              © 2025 EcoLéxico. All rights reserved. | Created for Thesis Project
            </p>
          </div>

        </div>
      </footer>

      {/* --- GAME INFO MODAL --- */}
      {openGameModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setOpenGameModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-4 md:p-8 max-w-3xl w-full relative shadow-2xl max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              onClick={() => setOpenGameModal(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 text-2xl md:text-3xl font-bold transition-colors z-10"
            >
              ×
            </button>
            
            {/* Contenido con Scroll */}
            <div className="overflow-y-auto max-h-[60vh] md:max-h-none pr-2">
              {/* Encabezado Personalizado */}
              <div className="text-center mb-4 md:mb-8">
                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                  🎮 Reto Ñaño
                </h2>
                <p className="text-gray-500 text-base md:text-lg">
                  Ready to prove your skills?
                </p>
              </div>
              
              {/* Grid de 2 Columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
                
                {/* COLUMNA IZQUIERDA: Cómo Jugar */}
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">
                    How to Play
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {/* Mode 1 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <FaHeadphones className="text-2xl md:text-4xl text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm md:text-base">Mode 1: Listening</p>
                        <p className="text-xs md:text-sm text-gray-600">Hear the audio and choose the correct word.</p>
                      </div>
                    </div>
                    
                    {/* Mode 2 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <FaBook className="text-2xl md:text-4xl text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm md:text-base">Mode 2: Meaning</p>
                        <p className="text-xs md:text-sm text-gray-600">See a slang word and guess its meaning.</p>
                      </div>
                    </div>
                    
                    {/* 3 Lives */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <FaHeart className="text-2xl md:text-4xl text-red-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm md:text-base">3 Lives</p>
                        <p className="text-xs md:text-sm text-gray-600">Don't lose them all!</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* COLUMNA DERECHA: Tu Meta (Rangos) */}
                <div>
                  <h3 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">
                    Your Goal
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    {/* Rango 1 */}
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-gray-50 border border-gray-200 transition-transform hover:scale-105">
                      <span className="text-2xl md:text-3xl">🥉</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm md:text-base">Turista Novato</p>
                        <p className="text-xs text-gray-500">Newbie Tourist</p>
                      </div>
                    </div>
                    
                    {/* Rango 2 */}
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-gray-50 border border-gray-200 transition-transform hover:scale-105">
                      <span className="text-2xl md:text-3xl">🥈</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm md:text-base">Casi Ecuatoriano</p>
                        <p className="text-xs text-gray-500">Almost Ecuadorian</p>
                      </div>
                    </div>
                    
                    {/* Rango 3 (Destacado) */}
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-4 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-400 shadow-md transition-transform hover:scale-105">
                      <span className="text-2xl md:text-3xl">🥇</span>
                      <div>
                        <p className="font-bold text-yellow-800 text-sm md:text-base">¡Todo un Ñaño!</p>
                        <p className="text-xs text-yellow-700">A True Brother!</p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
            {/* Footer con botones (Siempre visible) */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 border-t border-gray-200 mt-4">
              <button 
                onClick={handleStartGame}
                className="flex-1 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🎮 Start Playing
              </button>
              <button 
                onClick={() => setOpenGameModal(false)}
                className="px-4 md:px-6 py-3 md:py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};