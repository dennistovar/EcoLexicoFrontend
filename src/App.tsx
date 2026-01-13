import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Outlet, Navigate } from 'react-router-dom';

// Importamos las páginas (todas usan exportación nombrada)
import { HomePage } from './pages/HomePage';
import { RegionPage } from './pages/RegionPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { FavoritesPage } from './pages/FavoritesPage';
import { GamePage } from './pages/GamePage';

// --- COMPONENTE PROTECCIÓN DE RUTAS ---
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const userString = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Si hay token pero no hay usuario, redirigir al login
  if (!userString) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user = JSON.parse(userString);
    
    // Verificar si el usuario tiene un rol permitido
    if (!allowedRoles.includes(user.rol)) {
      // Si es admin intentando acceder a ruta de turista, redirigir a admin dashboard
      if (user.rol === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      // Si es turista intentando acceder a ruta de admin, redirigir a home
      if (user.rol === 'turista') {
        return <Navigate to="/home" replace />;
      }
      // Si no coincide con ningún rol conocido, redirigir al login
      return <Navigate to="/login" replace />;
    }
    
    // Si el usuario tiene el rol correcto, mostrar el contenido
    return <>{children}</>;
  } catch (error) {
    console.error('Error al parsear usuario:', error);
    return <Navigate to="/login" replace />;
  }
}

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
        {/* GRUPO A: Rutas Públicas CON Navbar (Protegidas para turistas) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute allowedRoles={['turista']}>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/region/:regionId" 
            element={
              <ProtectedRoute allowedRoles={['turista']}>
                <RegionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute allowedRoles={['turista']}>
                <FavoritesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/game" 
            element={
              <ProtectedRoute allowedRoles={['turista']}>
                <GamePage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* GRUPO B: Rutas SIN Navbar */}
        {/* Login - Ruta pública */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Dashboard - Solo para admins */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirección de /admin a /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
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
  // Estado para controlar la visibilidad del navbar
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Verificar el token al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si estamos en la parte superior, siempre mostrar
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Si scrolleamos hacia abajo, ocultar
      else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }
      // Si scrolleamos hacia arriba, mostrar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  
  // Función auxiliar para determinar si una ruta está activa
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`bg-blue-600 shadow-xl border-b-4 border-yellow-400 sticky top-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO PERSONALIZADO CON DEGRADADO --- */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo de la marca */}
            <img 
              src="/img/logo.png" 
              alt="EcoLéxico" 
              className="w-12 h-12 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 object-cover ring-2 ring-yellow-300"
            />
            
            {/* Texto del Logo */}
            <div className="flex flex-col">
              <span className="text-xl font-black text-white leading-tight drop-shadow-lg">
                EcoLéxico
              </span>
              <span className="text-xs text-yellow-100 font-semibold leading-tight">
                Ecuadorian Words
              </span>
            </div>
          </Link>

          {/* --- ENLACES DE NAVEGACIÓN (Escritorio) --- */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Link: Explore */}
            <Link 
              to="/" 
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                isActive('/') 
                  ? 'text-blue-900 bg-yellow-400 shadow-md' 
                  : 'text-white hover:text-blue-900 hover:bg-yellow-300'
              }`}
            >
              Explore
            </Link>
            
            {/* Link: About Ecuador */}
            <a 
              href="/#about" 
              className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 text-white hover:text-blue-900 hover:bg-yellow-300"
            >
              About Ecuador
            </a>
            
            {/* Link: Practice Game (solo para usuarios logueados) */}
            {isLoggedIn && (
              <Link 
                to="/game" 
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/game') 
                    ? 'text-blue-900 bg-yellow-400 shadow-md' 
                    : 'text-white hover:text-blue-900 hover:bg-yellow-300'
                }`}
              >
                <span className="text-lg">🎮</span>
                Practice
              </Link>
            )}
            
            {/* Link: Favorites (con icono de corazón) */}
            <Link 
              to="/favorites" 
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                isActive('/favorites') 
                    ? 'text-blue-900 bg-yellow-400 shadow-md' 
                    : 'text-white hover:text-blue-900 hover:bg-yellow-300'
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
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 text-white bg-red-600 hover:bg-red-700 hover:shadow-lg flex items-center gap-2"
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