import axios from 'axios';
console.log(process.env.EXPO_PUBLIC_API_URL)
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://localhost:8080',
  withCredentials: true,
});
