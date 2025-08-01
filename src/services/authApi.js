import { api } from '../lib/apiClient';

export async function loginUser(credentials) {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

export async function logoutUser() {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error.response?.data?.message || error.message);
    throw error;
  }
}