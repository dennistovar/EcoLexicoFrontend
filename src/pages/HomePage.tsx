import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShip, FaMountain, FaLeaf, FaMapMarkerAlt, FaUsers, FaGlobeAmericas, FaVolumeUp, FaMap, FaBookOpen, FaEnvelope, FaRegCompass, FaPlayCircle, FaGamepad, FaHeadphones, FaBook, FaHeart } from 'react-icons/fa';
import { Alert } from 'flowbite-react';

// Array de imágenes para el carrusel del Hero
const heroImages = ["/img/costa-carrucel.jpg", "/img/sierra-carrucel.jpg", "/img/oriente-carrucel.jpg"];

export const HomePage = () => {
  // Estado para controlar el índice de la imagen actual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Estado para controlar el modal del video
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  // Estado para controlar el modal del juego
  const [openGameModal, setOpenGameModal] = useState(false);
  // Estado para mostrar el mensaje de bienvenida
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState<string>('');
  
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

  // Efecto para mostrar mensaje de bienvenida al iniciar sesión
  useEffect(() => {
    // Verificar si hay un usuario logueado
    const userStr = localStorage.getItem('user');
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.nombre_usuario || user.email || 'Usuario');
        
        // Mostrar mensaje solo si acaba de iniciar sesión
        if (justLoggedIn === 'true') {
          setShowWelcome(true);
          // Remover la marca después de mostrar el mensaje
          sessionStorage.removeItem('justLoggedIn');
          
          // Ocultar el mensaje después de 5 segundos
          setTimeout(() => {
            setShowWelcome(false);
          }, 5000);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen">
      
      {/* --- WELCOME MESSAGE --- */}
      {showWelcome && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-200 p-4 max-w-xs">
            {/* Close button */}
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-start gap-3 pr-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-bold text-sm text-emerald-700 mb-1">
                  Welcome, {userName}!
                </h3>
                <p className="text-gray-600 text-xs">
                  Login successful. Start exploring! 🌎
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-400 text-transparent bg-clip-text drop-shadow-lg">Ecuador’s</span>
              <br />
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text drop-shadow-lg">Linguistic </span>
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
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-105">
                  <FaRegCompass className="text-xl" />
                  Start Exploring
                </button>
              </Link>

              {/* Botón 2: Ecu-Quiz */}
              <button 
                onClick={() => setOpenGameModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <FaGamepad className="text-xl" />
                Ecu-Quiz
              </button>

              {/* Botón 3: Watch Introduction */}
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-300 font-bold shadow-xl"
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
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 font-black text-sm uppercase tracking-widest rounded-full shadow-sm">
                Discover Ecuador
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-blue-800 mb-4">
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
      <section className="py-16 px-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          
          {/* Título y Subtítulo */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 text-transparent bg-clip-text mb-4">
              Why Choose EcoLéxico?
            </h2>
            <p className="text-gray-700 text-xl font-medium">
              The most comprehensive platform for learning authentic Ecuadorian Spanish
            </p>
          </div>

          {/* Grid de 4 Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* TARJETA 1: Audio Pronunciation */}
            <div className="bg-white rounded-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-yellow-200">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaVolumeUp className="text-white text-2xl" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-yellow-700 transition-colors duration-300">
                Audio Pronunciation
              </h3>
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed font-medium">
                Listen to authentic regional pronunciations from native speakers across Ecuador.
              </p>
            </div>

            {/* TARJETA 2: Regional Context */}
            <div className="bg-white rounded-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-green-200">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaMap className="text-white text-2xl" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                Regional Context
              </h3>
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed font-medium">
                Understand the cultural and geographical context behind each word and expression.
              </p>
            </div>

            {/* TARJETA 3: Cultural Examples */}
            <div className="bg-white rounded-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-blue-200">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaBookOpen className="text-white text-2xl" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                Cultural Examples
              </h3>
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed font-medium">
                Learn through real-life examples and situations where these words are commonly used.
              </p>
            </div>

            {/* TARJETA 4: Favorites List */}
            <div className="bg-white rounded-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-red-200">
              {/* Icono Circular */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaHeart className="text-white text-2xl" />
                </div>
              </div>
              {/* Título */}
              <h3 className="text-xl font-black text-gray-800 mb-3 group-hover:text-red-700 transition-colors duration-300">
                Favorites List
              </h3>
              {/* Descripción */}
              <p className="text-gray-600 leading-relaxed font-medium">
                Save words to your personal list to review and practice later.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT ECUADOR SECTION --- */}
      <section id="about" className="py-16 px-4 bg-gradient-to-br from-green-700 via-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* CONTENIDO IZQUIERDA (Texto) */}
            <div className="text-white">
              <h2 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-lg">
                About Ecuador
              </h2>
              <p className="text-xl mb-6 text-white/95 font-medium leading-relaxed">
                Ecuador is a country of incredible diversity, from the Pacific Coast to the Amazon rainforest, from the Andean highlands to the unique Galápagos Islands.
              </p>

              {/* Lista de puntos con iconos */}
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-medium">3 distinct geographical regions</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaUsers className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-medium">14+ indigenous languages spoken</span>
                </li>

                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaGlobeAmericas className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-medium">Rich cultural and linguistic heritage</span>
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
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setOpenGameModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] relative shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar Mejorado */}
            <button
              onClick={() => setOpenGameModal(false)}
              className="absolute top-2 right-2 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 z-20 shadow-xl group"
            >
              <span className="text-xl sm:text-2xl font-bold transform group-hover:rotate-90 transition-transform">×</span>
            </button>
            
            {/* Hero Header Rediseñado - Optimizado para móviles */}
            <div className="relative bg-gradient-to-br from-blue-500 via-yellow-500 to-green-500 px-4 py-4 sm:px-8 sm:py-6 text-center overflow-hidden flex-shrink-0">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-2 left-2 w-16 h-16 bg-white rounded-full blur-2xl"></div>
                <div className="absolute bottom-2 right-2 w-20 h-20 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-block p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl mb-2">
                  <span className="text-3xl sm:text-4xl drop-shadow-2xl">🎮</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2 tracking-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                  Reto Ñaño
                </h1>
                <p className="text-sm sm:text-base text-white/95 font-semibold">
                  Ready to prove your skills?
                </p>
              </div>
            </div>
            
            {/* Content Grid - Con Scroll */}
            <div className="overflow-y-auto flex-1 px-4 py-4 sm:px-8 sm:py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Left Column - How to Play */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <FaHeadphones className="text-white text-base sm:text-lg" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase">How to Play</h3>
                </div>
                
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border border-blue-100">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-xl sm:text-2xl">🎧</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base mb-1">Mode 1: Listening</p>
                      <p className="text-xs sm:text-sm text-gray-600">Hear the audio and choose the correct word.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border border-green-100">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-xl sm:text-2xl">📖</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base mb-1">Mode 2: Meaning</p>
                      <p className="text-xs sm:text-sm text-gray-600">See a slang word and guess its meaning.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border border-red-100">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <FaHeart className="text-white text-base sm:text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base mb-1">3 Lives</p>
                      <p className="text-xs sm:text-sm text-gray-600">Don't lose them all!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Achievement Levels */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-base sm:text-lg">🏆</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase">Your Goal</h3>
                </div>
                
                {/* Bronze Level */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border-2 border-orange-200">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-2xl sm:text-4xl">🥉</span>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm sm:text-lg">Turista Novato</p>
                        <p className="text-xs sm:text-sm text-gray-600">Newbie Tourist</p>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg font-black text-orange-600">0-4</span>
                  </div>
                </div>
                
                {/* Silver Level */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border-2 border-gray-300">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-2xl sm:text-4xl">🥈</span>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm sm:text-lg">Casi Ecuatoriano</p>
                        <p className="text-xs sm:text-sm text-gray-600">Almost Local</p>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg font-black text-gray-600">5-14</span>
                  </div>
                </div>
                
                {/* Gold Level - Destacado */}
                <div className="relative bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl border-2 sm:border-3 border-yellow-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast"></div>
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                        <span className="text-2xl sm:text-4xl drop-shadow-lg">🥇</span>
                      </div>
                      <div>
                        <p className="font-black text-yellow-900 text-sm sm:text-lg">¡Todo un Ñaño!</p>
                        <p className="text-xs sm:text-sm text-yellow-800 font-semibold">True Ecuadorian!</p>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg font-black text-yellow-800">15+</span>
                  </div>
                </div>
              </div>
              </div>
            </div>
            
            {/* Footer Buttons - Siempre Visible */}
            <div className="px-4 py-3 sm:px-8 sm:py-6 bg-white border-t border-gray-200 flex gap-2 sm:gap-4 flex-shrink-0">
              <button 
                onClick={handleStartGame}
                className="flex-1 group relative px-4 py-3 sm:px-8 sm:py-5 bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500 hover:from-green-600 hover:via-yellow-600 hover:to-blue-600 text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                  <FaGamepad className="text-xl sm:text-2xl" />
                  <span className="hidden xs:inline">Start Playing</span>
                  <span className="xs:hidden">Play</span>
                </div>
              </button>
              <button 
                onClick={() => setOpenGameModal(false)}
                className="px-4 py-3 sm:px-8 sm:py-5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
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