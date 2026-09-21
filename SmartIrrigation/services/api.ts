import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Adresse IP de ton PC obtenue via `ipconfig` (utilisée pour mobile physique)
const DEFAULT_IP = '10.121.230.1';

// Sur Web, utilise automatiquement le hostname courant (ex: localhost ou 127.0.0.1)
const LOCAL_IP = Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname
  ? window.location.hostname
  : DEFAULT_IP;

// URL de base pointant vers l'API Django
const BASE_URL = `http://${LOCAL_IP}:8000/api/`;

// Initialisation de l'instance Axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter automatiquement le jeton de connexion
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
    } catch (error) {
      console.error('Erreur de lecture du token dans le stockage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL, LOCAL_IP };