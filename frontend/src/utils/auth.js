import axios from './axiosInstance';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No hay refresh token disponible');
  }

  try {
    const response = await axios.post('/auth/refresh', { refresh_token: refreshToken });
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('refresh_token', refresh_token); // Actualizar el refresh token
    return access_token;
  } catch (error) {
    console.error('Error al refrescar el access token', error);
    throw error;
  }
};
