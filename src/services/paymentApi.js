import { api } from '../lib/apiClient';

export async function createPaymentIntent(orderId, paymentMethodDetails) {
  try {
    // Endpoint untuk membuat intent pembayaran (misal dengan Stripe, Midtrans, dll.)
    const response = await api.post('/payment/create-intent', { orderId, paymentMethodDetails });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function confirmPayment(paymentId, confirmationData) {
  try {
    // Endpoint untuk mengkonfirmasi pembayaran setelah klien menerima detail dari gateway pembayaran
    const response = await api.post(`/payment/confirm/${paymentId}`, confirmationData);
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}

export async function processCheckout(checkoutData) {
  try {
    // Endpoint umum untuk memproses seluruh checkout, mungkin melibatkan pembuatan order dan pembayaran
    const response = await api.post('/checkout/process', checkoutData);
    return response.data;
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw error;
  }
}