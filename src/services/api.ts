import axios from 'axios';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request: Agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si existe el token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Manejar errores de request
    return Promise.reject(error);
  }
);

// Interceptor de Response (opcional): Manejar errores globales
api.interceptors.response.use(
  (response) => {
    // Retornar la respuesta exitosa
    return response;
  },
  (error) => {
    // Manejar errores de respuesta
    if (error.response?.status === 401) {
      // Si el token expiró o no es válido, redirigir al login
      console.error('Unauthorized - Token expired or invalid');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('Access denied - Insufficient permissions');
    }
    
    return Promise.reject(error);
  }
);

export default api;
