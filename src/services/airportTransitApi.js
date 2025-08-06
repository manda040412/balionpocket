import { api } from '../lib/apiClient';

let errorFlags = {
  destinations: false,
  destinationById: {},
  createBooking: false,
  userBookings: {},
  updateBooking: {},
};

export async function fetchAirportTransitDestinations() {
  if (errorFlags.destinations) return null;
  try {
    const response = await api.get('/airport-transits');
    return response.data;
  } catch (error) {
    errorFlags.destinations = true;
    console.error('Error fetching airport transit destinations:', error);
    return null;
  }
}

export async function fetchAirportTransitDestinationById(id) {
  if (errorFlags.destinationById[id]) return null;
  try {
    const response = await api.get(`/airport-transits/${id}`);
    return response.data;
  } catch (error) {
    errorFlags.destinationById[id] = true;
    console.error('Error fetching airport transit destination by ID:', error);
    return null;
  }
}

export async function createAirportTransitBooking(data) {
  if (errorFlags.createBooking) return null;
  try {
    const response = await api.post('/cart/airport-transit', data);
    return response.data;
  } catch (error) {
    errorFlags.createBooking = true;
    console.error('Error creating airport transit booking:', error);
    return null;
  }
}

export async function fetchUserAirportTransitBookings(userId) {
  if (errorFlags.userBookings[userId]) return null;
  try {
    const response = await api.get(`/airport-transits/bookings?userId=${userId}`);
    return response.data;
  } catch (error) {
    errorFlags.userBookings[userId] = true;
    console.error('Error fetching user airport transit bookings:', error);
    return null;
  }
}

export async function updateAirportTransitBookingStatus(bookingId, status) {
  if (errorFlags.updateBooking[bookingId]) return null;
  try {
    const response = await api.patch(`/airport-transits/bookings/${bookingId}`, { status });
    return response.data;
  } catch (error) {
    errorFlags.updateBooking[bookingId] = true;
    console.error('Error updating airport transit booking status:', error);
    return null;
  }
}

export async function createAirportTransferOrder(orderData) {
  try {
    const response = await api.post('/airport-transits/transfer-order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating airport transfer order:', error);
    return null;
  }
}

// ...existing code...
export function resetAirportTransitApiErrorFlags() {
  errorFlags = {
    destinations: false,
    destinationById: {},
    createBooking: false,
    userBookings: {},
    updateBooking: {},
  };
}