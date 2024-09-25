import axiosInstance from './axiosInstance';

// solicitará un nuevo access token utilizando el refresh token almacenado.
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No hay refresh token disponible');
  }

  try {
    const response = await axiosInstance.post('/auth/refresh', { refresh_token: refreshToken });
    const { access_token, refresh_token } = response.data;
    // Actualizar el refresh token en el localStorage
    localStorage.setItem('refresh_token', refresh_token);
    return access_token;
  } catch (error) {
    console.error('Error al refrescar el access token:', error);
    throw error;
  }
};
