import { api } from '../lib/apiClient';

// Mengambil semua item di keranjang pengguna saat ini
export async function fetchCartItems() {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
}

export async function addItemToCart(itemData) {
  try {
    const response = await api.post('/cart/add', itemData);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
}

export async function updateCartItemQuantity(itemId, newQuantity) {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
}


export async function removeCartItem(itemId) {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
}

export async function clearUserCart() {
  try {
    const response = await api.delete('/cart/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}