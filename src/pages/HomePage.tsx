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
            <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white drop-shadow-lg">Discover </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text drop-shadow-lg">Ecuador's</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text drop-shadow-lg">Linguistic </span>
              <span className="text-white drop-shadow-lg">Heritage</span>
            </h1>

            {/* Texto Secundario */}
            <p className="text-white text-xl md:text-2xl mb-8 max-w-2xl font-light leading-relaxed drop-shadow-md">
              Explore authentic Ecuadorian words and expressions from all three regions. Learn pronunciation, meanings, and cultural context from Coast to Amazon.
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
      <section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-6 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-black text-sm uppercase tracking-widest rounded-full">
                Discover Ecuador
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-emerald-700 mb-4">
              Explore by Region
            </h2>
            <p className="text-center text-gray-600 text-xl font-light max-w-3xl mx-auto leading-relaxed">
              Ecuador's Spanish varies beautifully across three unique geographic zones
            </p>
          </div>

          {/* Grid de 3 regiones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* COAST CARD */}
            <div className="bg-white rounded-lg shadow-md border-t-4 border-blue-500 p-6 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col justify-between group">
              
              {/* Contenido Superior */}
              <div className="flex-grow flex flex-col items-center">
                {/* Icono Circular */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300">
                    <FaShip className="text-3xl text-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-black text-gray-800 text-center mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Coast Region
                </h3>

                {/* Badge */}
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    150 words
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-center mb-4 leading-relaxed font-light">
                  Warm, rhythmic Spanish from the Pacific beaches. Known for relaxed pronunciation and coastal slang.
                </p>
              </div>

              {/* Botón */}
              <Link to="/region/costa">
                <button className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                  Explore Region
                </button>
              </Link>

            </div>

            {/* HIGHLANDS CARD */}
            <div className="bg-white rounded-lg shadow-md border-t-4 border-green-500 p-6 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col justify-between group">
              
              {/* Contenido Superior */}
              <div className="flex-grow flex flex-col items-center">
                {/* Icono Circular */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-all duration-300">
                    <FaMountain className="text-3xl text-green-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-black text-gray-800 text-center mb-2 group-hover:text-green-600 transition-colors duration-300">
                  Highlands Region
                </h3>

                {/* Badge */}
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                    150 words
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-center mb-4 leading-relaxed font-light">
                  Clear, formal Spanish from the highlands. Strong influence from Quechua indigenous language.
                </p>
              </div>

              {/* Botón */}
              <Link to="/region/sierra">
                <button className="w-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105">
                  Explore Region
                </button>
              </Link>

            </div>

            {/* AMAZON CARD */}
            <div className="bg-white rounded-lg shadow-md border-t-4 border-yellow-400 p-6 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col justify-between group">
              
              {/* Contenido Superior */}
              <div className="flex-grow flex flex-col items-center">
                {/* Icono Circular */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-500 transition-all duration-300">
                    <FaLeaf className="text-3xl text-yellow-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-black text-gray-800 text-center mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                  Amazon Region
                </h3>

                {/* Badge */}
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm font-medium rounded-full">
                    150 words
                  </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-center mb-4 leading-relaxed font-light">
                  Unique jungle Spanish mixed with indigenous vocabulary. Rich in nature-related expressions.
                </p>
              </div>

              {/* Botón */}
              <Link to="/region/oriente">
                <button className="w-full border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105">
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
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-transparent bg-clip-text mb-4">
              Why Choose EcoLéxico?
            </h2>
            <p className="text-gray-600 text-xl font-light">
              The most comprehensive platform for learning authentic Ecuadorian Spanish
            </p>
          </div>

          {/* Grid de 4 Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* TARJETA 1: Audio Pronunciation */}
            <div className="bg-yellow-50 rounded-xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaVolumeUp className="text-white text-2xl group-hover:animate-pulse" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                Audio Pronunciation
              </h3>
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed font-light">
                Listen to authentic regional pronunciations from native speakers across Ecuador.
              </p>
            </div>

            {/* TARJETA 2: Regional Context */}
            <div className="bg-emerald-50 rounded-xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaMap className="text-white text-2xl group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                Regional Context
              </h3>
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed font-light">
                Understand the cultural and geographical context behind each word and expression.
              </p>
            </div>

            {/* TARJETA 3: Cultural Examples */}
            <div className="bg-blue-50 rounded-xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaBookOpen className="text-white text-2xl group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                Cultural Examples
              </h3>
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed font-light">
                Learn through real-life examples and situations where these words are commonly used.
              </p>
            </div>

            {/* TARJETA 4: Favorites List */}
            <div className="bg-red-50 rounded-xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaHeart className="text-white text-2xl group-hover:scale-125 transition-transform duration-300" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                Favorites List
              </h3>
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed font-light">
                Save words to your personal list to review and practice later.
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
              <h2 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-lg">
                About Ecuador
              </h2>
              <p className="text-xl mb-6 text-white/95 font-light leading-relaxed">
                Ecuador is a country of incredible diversity, from the Pacific Coast to the Amazon rainforest, from the Andean highlands to the unique Galápagos Islands.
              </p>

              {/* Lista de puntos con iconos */}
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-light">3 distinct geographical regions</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-light">14+ indigenous languages spoken</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaGlobeAmericas className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-light">Rich cultural and linguistic heritage</span>
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
            className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl max-w-3xl w-full max-h-[90vh] relative shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar Mejorado */}
            <button
              onClick={() => setOpenGameModal(false)}
              className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 z-20 shadow-xl group"
            >
              <span className="text-2xl font-bold transform group-hover:rotate-90 transition-transform">×</span>
            </button>
            
            {/* Hero Header Rediseñado */}
            <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 px-8 py-8 text-center overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-5 left-5 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-5 right-5 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse animation-delay-1s"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-block p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl mb-3">
                  <span className="text-4xl drop-shadow-2xl">🎮</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                  Reto Ñaño
                </h1>
                <p className="text-base text-white/95 font-semibold">
                  Ready to prove your skills?
                </p>
              </div>
            </div>
            
            {/* Content Grid - Con Scroll */}
            <div className="overflow-y-auto flex-1 px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column - How to Play */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaHeadphones className="text-white text-lg" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase">How to Play</h3>
                </div>
                
                <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-2xl">🎧</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base mb-1">Mode 1: Listening</p>
                      <p className="text-sm text-gray-600">Hear the audio and choose the correct word.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-5 shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-2xl">📖</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base mb-1">Mode 2: Meaning</p>
                      <p className="text-sm text-gray-600">See a slang word and guess its meaning.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-5 shadow-md border border-red-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <FaHeart className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base mb-1">3 Lives</p>
                      <p className="text-sm text-gray-600">Don't lose them all!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Achievement Levels */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">🏆</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 uppercase">Your Goal</h3>
                </div>
                
                {/* Bronze Level */}
                <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-orange-200 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-4xl">🥉</span>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg">Turista Novato</p>
                        <p className="text-sm text-gray-600">Newbie Tourist</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-orange-600">0-4</span>
                  </div>
                </div>
                
                {/* Silver Level */}
                <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-300 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-4xl">🥈</span>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg">Casi Ecuatoriano</p>
                        <p className="text-sm text-gray-600">Almost Local</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-gray-600">5-14</span>
                  </div>
                </div>
                
                {/* Gold Level - Destacado */}
                <div className="relative bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-2xl p-5 shadow-xl border-3 border-yellow-500 hover:shadow-2xl hover:scale-105 transition-all overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-4xl drop-shadow-lg">🥇</span>
                      </div>
                      <div>
                        <p className="font-black text-yellow-900 text-lg">¡Todo un Ñaño!</p>
                        <p className="text-sm text-yellow-800 font-semibold">True Ecuadorian!</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-yellow-800">15+</span>
                  </div>
                </div>
              </div>
              </div>
            </div>
            
            {/* Footer Buttons - Siempre Visible */}
            <div className="px-8 py-6 bg-white border-t border-gray-200 flex gap-4 flex-shrink-0">
              <button 
                onClick={handleStartGame}
                className="flex-1 group relative px-8 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <FaGamepad className="text-2xl" />
                  <span>Start Playing</span>
                </div>
              </button>
              <button 
                onClick={() => setOpenGameModal(false)}
                className="px-8 py-5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
          
          {/* CSS Animations */}
          <style>{`
            @keyframes shimmer-fast {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
            
            .animate-shimmer-fast {
              animation: shimmer-fast 2s ease-in-out infinite;
            }
            
            .animation-delay-1s {
              animation-delay: 1s;
            }
          `}</style>
        </div>
      )}

    </div>
  );
};