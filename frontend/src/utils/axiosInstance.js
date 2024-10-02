import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'https://v-r-notes-backend-984a522b7c9d.herokuapp.com', // backend URL
  headers: {
    'Content-Type': 'application/json',
    //'Cache-Control': 'no-cache',  // Desactiva el cache
    //'Pragma': 'no-cache',         // Desactiva el cache
    //'Expires': '0',               // Desactiva el cache
  },
  withCredentials: true, 
});

//Registra un nuevo ususario
export const registerUser = (username, password) => {
  return axiosInstance.post('/auth/register', { username:username, password:password});
};

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

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Obtener el refresh token desde el localStorage
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Intentar refrescar el token
          const { data } = await axiosInstance.post('auth/refresh', { refresh_token: refreshToken });

          // Guardar el nuevo access token
          localStorage.setItem('access_token', data.access_token);

          // Actualizar el header del access token
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${data.access_token}`;

          return axiosInstance(originalRequest); // Reintentar la solicitud original
        } catch (refreshError) {
          // Si falla el refresco del token, eliminar los tokens y redirigir al login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login'; // Redirigir al login
        }
      } else {
        window.location.href = '/login'; // Si no hay refresh token, redirigir al login
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;