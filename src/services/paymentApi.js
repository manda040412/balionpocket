import { api } from '../lib/apiClient';

let errorFlags = {
  createIntent: false,
  confirm: {},
  checkout: false,
};

export async function createPaymentIntent(orderId, paymentMethodDetails) {
  if (errorFlags.createIntent) return null;
  try {
    const response = await api.post('/payment/create-intent', { orderId, paymentMethodDetails });
    return response.data;
  } catch (error) {
    errorFlags.createIntent = true;
    console.error('Error creating payment intent:', error);
    return null;
  }
}

export async function confirmPayment(paymentId, confirmationData) {
  if (errorFlags.confirm[paymentId]) return null;
  try {
    const response = await api.post(`/payment/confirm/${paymentId}`, confirmationData);
    return response.data;
  } catch (error) {
    errorFlags.confirm[paymentId] = true;
    console.error('Error confirming payment:', error);
    return null;
  }
}

export async function processCheckout(checkoutData) {
  if (errorFlags.checkout) return null;
  try {
    const response = await api.post('/checkout/process', checkoutData);
    return response.data;
  } catch (error) {
    errorFlags.checkout = true;
    console.error('Error processing checkout:', error);
    return null;
  }
}

// Untuk reset error flags
export function resetPaymentApiErrorFlags() {
  errorFlags = {
    createIntent: false,
    confirm: {},
    checkout: false,
  };
}