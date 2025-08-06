import { api } from '../lib/apiClient';

let errorFlags = {
  fetchAll: false,
  fetchById: {},
  addToCart: false,
};

export async function fetchTourPackages() {
  if (errorFlags.fetchAll) return null;
  try {
    const response = await api.get('/tour-packages');
    return response.data;
  } catch (error) {
    errorFlags.fetchAll = true;
    console.error('Error fetching tour packages:', error);
    return null;
  }
}

export async function fetchTourPackageById(id) {
  if (errorFlags.fetchById[id]) return null;
  try {
    const response = await api.get(`/tour-packages/${id}`);
    return response.data;
  } catch (error) {
    errorFlags.fetchById[id] = true;
    console.error(`Error fetching tour package with ID ${id}:`, error);
    return null;
  }
}

// --- START PERUBAHAN DI SINI ---
export async function addTourPackageToCart(itemData) {
  if (errorFlags.addToCart) return null;
  try {
    const response = await api.post('/cart/tour-package', itemData); // Mengirim seluruh objek itemData
    return response.data;
  } catch (error) {
    errorFlags.addToCart = true;
    console.error('Error adding tour package to cart:', error);
    return null;
  }
}

// Untuk reset error flags
export function resetTourPackageApiErrorFlags() {
  errorFlags = {
    fetchAll: false,
    fetchById: {},
    addToCart: false,
  };
}