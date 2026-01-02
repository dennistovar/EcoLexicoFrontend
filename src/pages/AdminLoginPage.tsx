import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import axios from 'axios';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    clave: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // POST con propiedad esAdmin: true
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        nombre_usuario: formData.nombre_usuario,
        clave: formData.clave,
        esAdmin: true
      });

      const { token, user } = response.data;

      // Verificar que el usuario sea administrador
      if (!user.esAdmin || user.role !== 'admin') {
        setError('Access denied. This account does not have administrator privileges.');
        setLoading(false);
        return;
      }

      // Guardar credenciales en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirigir al dashboard de admin
      navigate('/admin');
      
    } catch (err: any) {
      console.error('Admin login error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid credentials');
      } else if (err.response?.status === 403) {
        setError('Access denied. Administrator privileges required.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        
        {/* --- LOGO FUERA DE LA TARJETA --- */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <div className="bg-white p-4 rounded-full shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105">
              <img 
                src="/img/logo.png" 
                alt="EcoLéxico Logo" 
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          </Link>
        </div>

        {/* --- CARD PRINCIPAL --- */}
        <Card className="shadow-2xl rounded-3xl border border-white/20 bg-white/95 backdrop-blur-xl">
          
          {/* --- HEADER CON TÍTULO --- */}
          <div className="text-center mb-8">
            {/* Badge Admin */}
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
              <span className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
                Admin Portal
              </span>
            </div>
            
            {/* Título */}
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text mb-3">
              Administrator Access
            </h1>
            
            {/* Subtítulo */}
            <p className="text-gray-600 font-medium">
              🔒 Authorized personnel only
            </p>
          </div>

          {/* --- FORMULARIO --- */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Alert - Solo si hay error */}
            {error && (
              <Alert color="failure" className="text-sm">
                <span className="font-medium">Error:</span> {error}
              </Alert>
            )}

            {/* Username Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username">Username</Label>
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="admin"
                required
                value={formData.nombre_usuario}
                onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
                disabled={loading}
                sizing="lg"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Password</Label>
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={formData.clave}
                onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                disabled={loading}
                sizing="lg"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:ring-emerald-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </Button>

          </form>
        </Card>

        {/* --- INFO BOX --- */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/90 mb-4 font-medium">
            🔐 All access attempts are monitored and logged.
          </p>
          <Link 
            to="/" 
            className="text-white/80 hover:text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Public Site
          </Link>
        </div>

      </div>
    </div>
  );
};
