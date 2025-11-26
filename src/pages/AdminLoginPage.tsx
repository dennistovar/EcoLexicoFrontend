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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* --- LOGO FUERA DE LA TARJETA --- */}
        <div className="text-center mb-6">
          <Link to="/">
            <img 
              src="/img/logo.png" 
              alt="EcoLéxico Logo" 
              className="w-36 h-36 mx-auto mb-6 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </Link>
        </div>

        {/* --- CARD PRINCIPAL --- */}
        <Card className="shadow-2xl rounded-2xl border border-gray-100 bg-white">
          
          {/* --- HEADER CON TÍTULO --- */}
          <div className="text-center mb-6">
            {/* Badge Admin */}
            <div className="inline-block px-3 py-1 bg-green-100 rounded-full mb-3">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                Admin Portal
              </span>
            </div>
            
            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Administrator Access
            </h1>
            
            {/* Subtítulo */}
            <p className="text-gray-500 text-sm">
              Authorized personnel only
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
              className="w-full bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 rounded-xl"
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
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            All access attempts are monitored and logged.
          </p>
          <Link 
            to="/" 
            className="text-gray-600 hover:text-gray-900 text-sm flex items-center justify-center gap-2 transition-colors"
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
