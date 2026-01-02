import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';

// Importamos las páginas (todas usan exportación nombrada)
import { HomePage } from './pages/HomePage';
import { RegionPage } from './pages/RegionPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { FavoritesPage } from './pages/FavoritesPage';
import { GamePage } from './pages/GamePage';

// --- LAYOUT PÚBLICO (Con Navbar) ---
function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <NavbarComponent />
      
      {/* CONTENIDO DINÁMICO */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GRUPO A: Rutas Públicas CON Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/region/:regionId" element={<RegionPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/game" element={<GamePage />} />
        </Route>

        {/* GRUPO B: Rutas SIN Navbar (Login y Admin) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// --- COMPONENTE NAVBAR SEPARADO (Mejor organización) ---
function NavbarComponent() {
  const location = useLocation();
  
  // Verificar si el usuario está logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Estado para el menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Verificar el token al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  
  // Función auxiliar para determinar si una ruta está activa
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO PERSONALIZADO CON DEGRADADO --- */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo de la marca */}
            <img 
              src="/img/logo.png" 
              alt="EcoLéxico" 
              className="w-12 h-12 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 object-cover"
            />
            
            {/* Texto del Logo */}
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text leading-tight">
                EcoLéxico
              </span>
              <span className="text-xs text-gray-500 font-medium leading-tight">
                Ecuadorian Words
              </span>
            </div>
          </Link>

          {/* --- ENLACES DE NAVEGACIÓN (Escritorio) --- */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Link: Explore */}
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              Explore
            </Link>
            
            {/* Link: About Ecuador */}
            <a 
              href="/#about" 
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 text-gray-700 hover:text-teal-600 hover:bg-teal-50 hover:shadow-sm"
            >
              About Ecuador
            </a>
            
            {/* Link: Practice Game (solo para usuarios logueados) */}
            {isLoggedIn && (
              <Link 
                to="/game" 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/game') 
                    ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50 hover:shadow-sm'
                }`}
              >
                <span className="text-lg">🎮</span>
                Practice
              </Link>
            )}
            
            {/* Link: Favorites (con icono de corazón) */}
            <Link 
              to="/favorites" 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive('/favorites') 
                  ? 'text-red-600 bg-gradient-to-r from-red-50 to-pink-50 shadow-md' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50 hover:shadow-sm'
              }`}
            >
              <svg 
                className="w-5 h-5 group-hover:scale-110 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              Favorites
            </Link>

            {/* Logout / Login */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg flex items-center gap-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/login') 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg' 
                    : 'text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
                }`}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                  />
                </svg>
                Login
              </Link>
            )}

          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* --- MOBILE MENU (Collapse) --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 py-4 space-y-2 shadow-lg">
            
            {/* Link: Explore */}
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Explore
            </Link>
            
            {/* Link: About Ecuador */}
            <a 
              href="/#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              About Ecuador
            </a>
            
            {/* Link: Practice Game (solo para usuarios logueados) */}
            {isLoggedIn && (
              <Link 
                to="/game" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/game') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                🏆 Practice
              </Link>
            )}
            
            {/* Link: Favorites */}
            <Link 
              to="/favorites" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/favorites') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              ❤️ Favorites
            </Link>

            {/* Logout / Login */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                🚪 Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/login') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                🔐 Login
              </Link>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}

// --- PÁGINA 404 ---
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">Página no encontrada</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default App;