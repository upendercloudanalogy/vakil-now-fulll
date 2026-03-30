import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // your backend URL
  withCredentials: true // if using cookies (e.g. for refresh tokens)
});

export default api;
