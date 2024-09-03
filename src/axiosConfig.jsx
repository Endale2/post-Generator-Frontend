import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
  baseURL: 'https://post-generator-backend-1.onrender.com/api',
  withCredentials: true, 
});

// Add a request interceptor to include the token in the headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
