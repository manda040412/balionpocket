import { api } from '../lib/apiClient';

export async function fetchAvailableCars() {
  try {
    const response = await api.get('/car-rentals/available');
    return response.data;
  } catch (error) {
    console.error('Error fetching available cars:', error);
    throw error;
  }
}

export async function createCarRentalOrder(orderData) {
  try {
    const response = await api.post('/car-rentals/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating car rental order:', error);
    throw error;
  }
}