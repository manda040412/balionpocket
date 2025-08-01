import { api } from '../lib/apiClient';

export async function fetchUserProfile() {
  try {
    const response = await api.get('/user/profile'); // Endpoint untuk mendapatkan profil user
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(profileData) {
  try {
    const response = await api.put('/user/profile', profileData); // Endpoint untuk update profil
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function fetchUserOrders() {
  try {
    const response = await api.get('/user/orders'); // Endpoint untuk riwayat pesanan
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}