import { api } from '../lib/apiClient';

let errorFlags = {
  login: false,
  register: false,
  logout: false,
};

export async function loginUser(credentials) {
  if (errorFlags.login) return null;
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    errorFlags.login = true;
    console.error('Login failed:', error.response?.data?.message || error.message);
    return null;
  }
}

export async function registerUser(userData) {
  if (errorFlags.register) return null;
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    errorFlags.register = true;
    console.error('Registration failed:', error.response?.data?.message || error.message);
    return null;
  }
}

export async function logoutUser() {
  if (errorFlags.logout) return null;
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    errorFlags.logout = true;
    console.error('Logout failed:', error.response?.data?.message || error.message);
    return null;
  }
}

// Untuk reset error flags
export function resetAuthApiErrorFlags() {
  errorFlags = {
    login: false,
    register: false,
    logout: false,
  };
}