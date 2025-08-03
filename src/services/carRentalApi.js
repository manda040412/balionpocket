import { api } from '../lib/apiClient';

let errorFlags = {
  availableCars: false,
  createOrder: false,
};

export async function fetchAvailableCars() {
  if (errorFlags.availableCars) return null;
  try {
    const response = await api.get('/car-rentals/available');
    return response.data;
  } catch (error) {
    errorFlags.availableCars = true;
    console.error('Error fetching available cars:', error);
    return null;
  }
}

export async function createCarRentalOrder(orderData) {
  if (errorFlags.createOrder) return null;
  try {
    const response = await api.post('/car-rentals/order', orderData);
    return response.data;
  } catch (error) {
    errorFlags.createOrder = true;
    console.error('Error creating car rental order:', error);
    return null;
  }
}

// Untuk reset error flags
export function resetCarRentalApiErrorFlags() {
  errorFlags = {
    availableCars: false,
    createOrder: false,
  };
}