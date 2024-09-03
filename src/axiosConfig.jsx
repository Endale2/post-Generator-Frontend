import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://post-generator-backend-1.onrender.com/api',
  withCredentials: true, 
});

export default instance;
