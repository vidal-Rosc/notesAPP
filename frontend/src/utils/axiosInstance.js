import axios from 'axios';
import { refreshAccessToken } from './auth';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000', // backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el access token en cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no se ha intentado ya, intentar refrescar el token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        // Actualizar el token en el localStorage
        localStorage.setItem('access_token', newAccessToken);
        // Actualizar el encabezado Authorization
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        // Repetir la solicitud original con el nuevo token
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error('Error al refrescar el token:', err);
        // Si falla el refresco, redirigir al login
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
