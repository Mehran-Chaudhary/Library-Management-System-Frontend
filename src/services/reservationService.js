import api from './api';

export const reservationService = {
  // Create a new reservation
  async createReservation(items) {
    const response = await api.post('/reservations', { items });
    return response.data;
  },

  // Confirm a reservation with pickup details
  async confirmReservation(reservationId, confirmData) {
    const response = await api.patch(`/reservations/${reservationId}/confirm`, confirmData);
    return response.data;
  },

  // Cancel a reservation
  async cancelReservation(reservationId) {
    const response = await api.patch(`/reservations/${reservationId}/cancel`);
    return response.data;
  },

  // Get user's reservations
  async getMyReservations() {
    const response = await api.get('/reservations/my-reservations');
    return response.data;
  },

  // Get active reservations
  async getActiveReservations() {
    const response = await api.get('/reservations/active');
    return response.data;
  },

  // Get reservation history
  async getReservationHistory() {
    const response = await api.get('/reservations/history');
    return response.data;
  },

  // Get single reservation by ID
  async getReservationById(id) {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  // Get late return policy
  async getLateReturnPolicy() {
    const response = await api.get('/reservations/policy');
    return response.data;
  },
};

export default reservationService;
