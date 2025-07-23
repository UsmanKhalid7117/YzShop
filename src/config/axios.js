import axios from 'axios';

export const axiosi = axios.create({
  baseURL: 'https://yz-backend-lemon.vercel.app/',  // or from .env
  withCredentials: true  // 👈 VERY important for cookies
});
