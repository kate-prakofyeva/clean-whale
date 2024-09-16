import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      alert('User is not authorized, you will be redirected to the login page');
      originalRequest._isRetry = true;
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('isActivated');

        window.location.href = '/logout';
      } catch (error) {
        console.log(
          'User is not authorized, you will be redirected to the login page',
          error
        );
      }

      //The code below is for refresh token implementation
      // originalRequest._isRetry = true;
      // try {
      //   const response = await axios.get(`${API_URL}/refresh`, {
      //     withCredentials: true,
      //   });
      //   localStorage.setItem('token', response.data.accessToken);
      //   return api.request(originalRequest);
      // } catch (error) {
      //   console.log('User not authorized', error);
      // }
    }
    throw error;
  }
);

export default api;
