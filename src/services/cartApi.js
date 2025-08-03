import { api } from '../lib/apiClient';

let errorFlags = {
  fetch: false,
  add: false,
  update: {},
  remove: {},
  clear: false,
};

// Mengambil semua item di keranjang pengguna saat ini
export async function fetchCartItems() {
  if (errorFlags.fetch) return null;
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    errorFlags.fetch = true;
    console.error('Error fetching cart items:', error);
    return null;
  }
}

export async function addItemToCart(itemData) {
  if (errorFlags.add) return null;
  try {
    const response = await api.post('/cart/add', itemData);
    return response.data;
  } catch (error) {
    errorFlags.add = true;
    console.error('Error adding item to cart:', error);
    return null;
  }
}

export async function updateCartItemQuantity(itemId, newQuantity) {
  if (errorFlags.update[itemId]) return null;
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
    return response.data;
  } catch (error) {
    errorFlags.update[itemId] = true;
    console.error('Error updating cart item quantity:', error);
    return null;
  }
}

export async function removeCartItem(itemId) {
  if (errorFlags.remove[itemId]) return null;
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    errorFlags.remove[itemId] = true;
    console.error('Error removing cart item:', error);
    return null;
  }
}

export async function clearUserCart() {
  if (errorFlags.clear) return null;
  try {
    const response = await api.delete('/cart/clear');
    return response.data;
  } catch (error) {
    errorFlags.clear = true;
    console.error('Error clearing cart:', error);
    return null;
  }
}

// Untuk reset error flags
export function resetCartApiErrorFlags() {
  errorFlags = {
    fetch: false,
    add: false,
    update: {},
    remove: {},
    clear: false,
  };
}