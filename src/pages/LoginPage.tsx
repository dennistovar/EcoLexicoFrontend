import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import api from '../services/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    email: '',
    clave: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        // Registro de nuevo usuario
        const response = await api.post('/auth/register', {
          nombre_usuario: formData.nombre_usuario,
          email: formData.email,
          clave: formData.clave
        });

        const { token, user } = response.data;
        
        // Debugging: Ver qué datos llegan del backend
        console.log('Respuesta Backend (Registro):', response.data);
        console.log('Usuario completo:', user);
        console.log('Rol del usuario:', user.rol);
        
        // Guardar token y usuario
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Marcar que el usuario acaba de iniciar sesión para mostrar el mensaje de bienvenida
        sessionStorage.setItem('justLoggedIn', 'true');
        
        // Redirigir según el rol
        if (user.rol === 'admin') {
          console.log('✅ Redirigiendo a /admin/dashboard');
          navigate('/admin/dashboard');
        } else if (user.rol === 'turista') {
          console.log('✅ Redirigiendo a /home');
          navigate('/home');
        }
      } else {
        // Login de usuario existente
        const response = await api.post('/auth/login', {
          nombre_usuario: formData.nombre_usuario || formData.email,
          clave: formData.clave
        });

        const { token, user } = response.data;
        
        // Debugging: Ver qué datos llegan del backend
        console.log('Respuesta Backend (Login):', response.data);
        console.log('Usuario completo:', user);
        console.log('Rol del usuario:', user.rol);
        
        // Guardar token y usuario
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Marcar que el usuario acaba de iniciar sesión para mostrar el mensaje de bienvenida
        sessionStorage.setItem('justLoggedIn', 'true');
        
        // Redirigir según el rol
        if (user.rol === 'admin') {
          console.log('✅ Redirigiendo a /admin/dashboard');
          navigate('/admin/dashboard');
        } else if (user.rol === 'turista') {
          console.log('✅ Redirigiendo a /home');
          navigate('/home');
        }
      }
      
    } catch (err: any) {
      console.error('Auth error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 409) {
        setError('User already exists. Please login instead.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`${isRegistering ? 'Registration' : 'Login'} failed. Please check your connection and try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        
        {/* Logo y título */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <div className="bg-white p-4 rounded-full shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105 mb-6">
              <img 
                src="/img/logo.png" 
                alt="EcoLéxico Logo" 
                className="w-28 h-28 object-cover rounded-full"
              />
            </div>
          </Link>
          <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-yellow-600 to-green-600 text-transparent bg-clip-text mb-3">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-700 text-lg font-semibold">
            {isRegistering ? 'Join our community of language learners' : 'Sign in to continue learning'}
          </p>
        </div>

        {/* Card de Login/Register */}
        <Card className="shadow-2xl rounded-3xl border border-white/20 bg-white/95 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <Alert color="failure" className="mb-2">
                <span className="font-medium">⚠️ Error:</span> {error}
              </Alert>
            )}

            {/* Username Field */}
            <div className="group">
              <label className="block mb-3">
                <span className="text-sm font-black text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  Username
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder={isRegistering ? "Choose a username" : "Enter your username"}
                  required
                  value={formData.nombre_usuario}
                  onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3.5 text-base font-semibold text-gray-800 bg-white border-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </label>
            </div>

            {/* Email Field - Solo requerido en registro */}
            {isRegistering && (
              <div className="group">
                <label className="block mb-3">
                  <span className="text-sm font-black text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Email
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required={isRegistering}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3.5 text-base font-semibold text-gray-800 bg-white border-3 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </label>
              </div>
            )}

            {/* Password Field */}
            <div className="group">
              <label className="block mb-3">
                <span className="text-sm font-black text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  Password
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder={isRegistering ? "Create a password" : "Enter your password"}
                  required
                  value={formData.clave}
                  onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-3.5 text-base font-semibold text-gray-800 bg-white border-3 border-gray-200 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-yellow-500 to-green-600 hover:from-blue-700 hover:via-yellow-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-black text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed uppercase tracking-wide"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isRegistering ? 'Creating...' : 'Signing in...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={isRegistering ? "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" : "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"} />
                    </svg>
                    {isRegistering ? 'Create Account' : 'Sign In'}
                  </div>
                )}
              </button>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                  setFormData({ nombre_usuario: '', email: '', clave: '' });
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 font-bold text-base transition-all duration-300 hover:scale-105 inline-block"
              >
                {isRegistering ? '¿Already have an account? Log in' : "Don't have an account? Sign up"}
              </button>
            </div>

          </form>
        </Card>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-2xl">🌎</span>
            </div>
            <div>
              <h3 className="font-black text-gray-800 mb-1">Universal Access Point</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                One login for everyone. Whether you're a learner exploring Ecuadorian Spanish or an admin managing content, this is your entry point.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};