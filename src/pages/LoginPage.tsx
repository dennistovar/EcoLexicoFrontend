import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import axios from 'axios';

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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      if (isRegistering) {
        // Registro de nuevo usuario
        const response = await axios.post(`${API_URL}/api/auth/register`, {
          nombre_usuario: formData.nombre_usuario,
          email: formData.email,
          clave: formData.clave
        });

        const { token, user } = response.data;
        
        // Verificar que NO sea administrador
        if (user.esAdmin || user.role === 'admin') {
          setError('Esta zona es solo para Turistas. Por favor usa el Acceso Administrativo.');
          setLoading(false);
          return;
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/');
      } else {
        // Login de usuario existente
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          nombre_usuario: formData.nombre_usuario || formData.email,
          clave: formData.clave,
          esAdmin: false
        });

        const { token, user } = response.data;
        
        // Verificar que NO sea administrador
        if (user.esAdmin || user.role === 'admin') {
          setError('Esta zona es solo para Turistas. Por favor usa el Acceso Administrativo.');
          setLoading(false);
          return;
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/');
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* Logo y título */}
        <div className="text-center mb-8">
          <Link to="/">
            <img 
              src="/img/logo.png" 
              alt="EcoLéxico Logo" 
              className="w-36 h-36 mx-auto mb-6 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-base">
            {isRegistering ? 'Join our community of language learners' : 'Sign in to continue learning'}
          </p>
        </div>

        {/* Card de Login/Register */}
        <Card className="shadow-2xl rounded-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Error Alert */}
            {error && (
              <Alert color="failure" className="mb-2">
                <span className="font-medium">⚠️ Error:</span> {error}
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
                placeholder={isRegistering ? "Choose a username" : "Enter your username"}
                required
                value={formData.nombre_usuario}
                onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
                disabled={loading}
                color={error ? 'failure' : 'gray'}
                sizing="lg"
              />
            </div>

            {/* Email Field - Solo requerido en registro */}
            {isRegistering && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email">Email</Label>
                </div>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required={isRegistering}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  color={error ? 'failure' : 'gray'}
                  sizing="lg"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Password</Label>
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder={isRegistering ? "Create a password" : "Enter your password"}
                required
                value={formData.clave}
                onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                disabled={loading}
                color={error ? 'failure' : 'gray'}
                sizing="lg"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              color="success" 
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isRegistering ? 'Creating account...' : 'Signing in...'}
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRegistering ? "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" : "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"} />
                  </svg>
                  {isRegistering ? 'Register' : 'Sign In'}
                </>
              )}
            </Button>

            {/* Toggle Login/Register */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                  setFormData({ nombre_usuario: '', email: '', clave: '' });
                }}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                {isRegistering ? '¿Already have an account? Log in' : "Don't have an account? Sign up"}
              </button>
            </div>

          </form>
        </Card>

        {/* Info Box */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
          <p className="text-sm text-gray-700">
            <span className="font-bold">🌎 For Tourists & Learners:</span> Explore authentic Ecuadorian Spanish from all three regions. Save your favorite words and track your learning progress.
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};