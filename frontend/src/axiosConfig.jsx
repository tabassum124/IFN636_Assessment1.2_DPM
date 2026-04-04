import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://13.239.27.99:5001', // live
   baseURL: 'http://localhost:5001',   // use local backend in dev
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
