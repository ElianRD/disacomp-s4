import axios from 'axios';

import { authStore } from '../stores/auth';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Puerto por defecto del API Gateway
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Opcional, para manejar 401 UnAuthorized globalmente)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (authStore.isAuthenticated) {
        authStore.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
