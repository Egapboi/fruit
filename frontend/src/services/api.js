import axios from 'axios';

const useMock = false; // Set to false to use real backend

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Update with actual backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials) => {
  if (useMock) {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { token: 'mock-token', user: { name: 'User' } } }), 1000));
  }
  return api.post('/auth/login', credentials);
};

export const signup = async (userData) => {
    if (useMock) {
        return new Promise((resolve) => setTimeout(() => resolve({ data: { token: 'mock-token', user: { name: userData.name } } }), 1000));
    }
  return api.post('/auth/signup', userData);
};

export const getPlants = async () => {
    if (useMock) {
        return new Promise((resolve) => setTimeout(() => resolve({ data: [
            { id: 1, name: 'Monstera', description: 'Tropical plant', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80' },
            { id: 2, name: 'Snake Plant', description: 'Hardy indoor plant', image: 'https://images.unsplash.com/photo-1599598424900-530e922e9e68?auto=format&fit=crop&w=600&q=80' }
        ] }), 800));
    }
  return api.get('/plants');
};

export default api;
