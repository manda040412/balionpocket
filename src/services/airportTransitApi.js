import { api } from '../lib/apiClient';

export async function fetchAirportTransitDestinations() {
  try {
    const response = await api.get('/airport-transits/destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching airport transit destinations:', error);
    throw error;
  }
}

export async function fetchAirportTransitDestinationById(id) {
  try {
    const response = await api.get(`/airport-transits/destinations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching airport transit destination by ID:', error);
    throw error;
  }
}

export async function createAirportTransitBooking(data) {
  try {
    const response = await api.post('/airport-transits/bookings', data);
    return response.data;
  } catch (error) {
    console.error('Error creating airport transit booking:', error);
    throw error;
  }
}

export async function fetchUserAirportTransitBookings(userId) {
  try {
    const response = await api.get(`/airport-transits/bookings?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user airport transit bookings:', error);
    throw error;
  }
}

export async function updateAirportTransitBookingStatus(bookingId, status) {
  try {
    const response = await api.patch(`/airport-transits/bookings/${bookingId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating airport transit booking status:', error);
    throw error;
  }
}