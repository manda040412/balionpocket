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
