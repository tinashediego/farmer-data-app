import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  return api.post('/auth/login/', { email, password });
};

export const getFarmTypes = async () => {
  return api.get('/farmtype/');
};

export const getCrops = async () => {
  return api.get('/crop/');
};

export const submitFarmerData = async (data) => {
  return api.post('/farmerdata/', data);
};

export const syncFarmerData = async (data) => {
    return api.post('/farmerdata/sync/', data); // Assuming endpoint to sync
};

export default api;