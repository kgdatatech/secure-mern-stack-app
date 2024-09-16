import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_APP_API_URL || 'https://yourbusinessdomain.com/api', // PROD
  // withCredentials: true,
  baseURL: import.meta.env.VITE_APP_API_URL || 'https://localhost:5000/api', // DEV
  withCredentials: true,
});

let csrfToken = null;
let csrfTokenPromise = null;

const isAuthenticated = () => {
  return !!Cookies.get('jwt');
};

const fetchCsrfToken = async () => {
  if (!csrfTokenPromise && !csrfToken) {
    csrfTokenPromise = axiosInstance.get('/csrf-token')
      .then(response => {
        csrfToken = response.data.csrfToken;
        return csrfToken;
      })
      .catch(error => {
        console.error('Error fetching CSRF token:', error);
        throw error;
      })
      .finally(() => {
        csrfTokenPromise = null;
      });
  }
  return csrfTokenPromise;
};

axiosInstance.interceptors.request.use(async (config) => {
  if (isAuthenticated()) {
    const token = Cookies.get('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const csrfToken = await fetchCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      if (error.response.status === 401 && isAuthenticated() && !originalRequest._retry) {
        console.warn('401 Unauthorized error bypassed for testing.');
        return Promise.reject(error);
      } else if (error.response.status === 403 && isAuthenticated()) {
        console.warn('403 Forbidden error bypassed for testing.');
        return Promise.reject(error);
      } else if (error.response.status === 429) {
        console.error('Too many requests, please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
