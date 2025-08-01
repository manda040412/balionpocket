import { api } from '../lib/apiClient';

export async function fetchTourPackages() {
  try {
    const response = await api.get('/tour-packages'); // Endpoint untuk daftar semua paket
    return response.data;
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
}

export async function fetchTourPackageById(id) {
  try {
    const response = await api.get(`/tour-packages/${id}`); 
    return response.data;
  } catch (error) {
    console.error(`Error fetching tour package with ID ${id}:`, error);
    throw error; 
  }
}

export async function addTourPackageToCart(packageId, quantity, selectedDate) {
  try {
    const response = await api.post('/cart/add-tour-package', {
      packageId,
      quantity,
      selectedDate,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding tour package to cart:', error);
    throw error;
  }
}