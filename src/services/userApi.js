import { api } from '../lib/apiClient';

let errorFlags = {
  profile: false,
  updateProfile: false,
  orders: false,
};

export async function fetchUserProfile() {
  if (errorFlags.profile) return null;
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    errorFlags.profile = true;
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(profileData) {
  if (errorFlags.updateProfile) return null;
  try {
    const response = await api.put('/profile/update', profileData);
    return response.data;
  } catch (error) {
    errorFlags.updateProfile = true;
    console.error('Error updating user profile:', error);
    return null;
  }
}

export async function fetchUserOrders() {
  if (errorFlags.orders) return null;
  try {
    const response = await api.get('/payment/list');
    return response.data;
  } catch (error) {
    errorFlags.orders = true;
    console.error('Error fetching user orders:', error);
    return null;
  }
}

// Untuk reset error flags
export function resetUserApiErrorFlags() {
  errorFlags = {
    profile: false,
    updateProfile: false,
    orders: false,
  };
}