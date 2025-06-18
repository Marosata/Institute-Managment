import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Gérer les erreurs d'authentification
      if (error.response.status === 401) {
        store.dispatch(logout());
      }

      // Retourner le message d'erreur du serveur
      return Promise.reject({
        ...error,
        message: error.response.data.message || 'Une erreur est survenue',
      });
    }

    // Gérer les erreurs réseau
    if (error.request) {
      return Promise.reject({
        ...error,
        message: 'Impossible de contacter le serveur',
      });
    }

    // Gérer les autres types d'erreurs
    return Promise.reject({
      ...error,
      message: 'Une erreur est survenue',
    });
  }
);

export default axiosInstance; 