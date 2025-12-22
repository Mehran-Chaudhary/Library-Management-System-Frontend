import api from './api';

/**
 * Reservation Service
 * Handles all reservation-related API calls
 */

const reservationService = {
  /**
   * Create a new reservation
   * @param {Object} reservationData - Reservation data with pickupDate and items
   * @returns {Promise} Created reservation object
   */
  async createReservation(reservationData) {
    try {
      const response = await api.post('/reservations', reservationData);
      return response;
    } catch (error) {
      console.error('Create reservation error:', error);
      throw error;
    }
  },

  /**
   * Confirm a reservation
   * @param {string} reservationId - Reservation UUID
   * @param {string} paymentMethod - Payment method (CASH, CARD, ONLINE)
   * @returns {Promise} Confirmed reservation with QR code
   */
  async confirmReservation(reservationId, paymentMethod) {
    try {
      const response = await api.patch(
        `/reservations/${reservationId}/confirm`,
        { paymentMethod }
      );
      return response;
    } catch (error) {
      console.error('Confirm reservation error:', error);
      throw error;
    }
  },

  /**
   * Cancel a reservation
   * @param {string} reservationId - Reservation UUID
   * @returns {Promise} Cancelled reservation object
   */
  async cancelReservation(reservationId) {
    try {
      const response = await api.patch(`/reservations/${reservationId}/cancel`);
      return response;
    } catch (error) {
      console.error('Cancel reservation error:', error);
      throw error;
    }
  },

  /**
   * Get user's all reservations
   * @returns {Promise} User's reservations array
   */
  async getMyReservations() {
    try {
      const response = await api.get('/reservations/my-reservations');
      return response;
    } catch (error) {
      console.error('Get my reservations error:', error);
      throw error;
    }
  },

  /**
   * Get active reservations (PENDING or CONFIRMED)
   * @returns {Promise} Active reservations array
   */
  async getActiveReservations() {
    try {
      const response = await api.get('/reservations/active');
      return response;
    } catch (error) {
      console.error('Get active reservations error:', error);
      throw error;
    }
  },

  /**
   * Get reservation history (COMPLETED, CANCELLED, EXPIRED)
   * @returns {Promise} Reservation history array
   */
  async getReservationHistory() {
    try {
      const response = await api.get('/reservations/history');
      return response;
    } catch (error) {
      console.error('Get reservation history error:', error);
      throw error;
    }
  },

  /**
   * Get single reservation by ID
   * @param {string} reservationId - Reservation UUID
   * @returns {Promise} Reservation details
   */
  async getReservationById(reservationId) {
    try {
      const response = await api.get(`/reservations/${reservationId}`);
      return response;
    } catch (error) {
      console.error('Get reservation by ID error:', error);
      throw error;
    }
  },

  /**
   * Get late return policy (Public)
   * @returns {Promise} Policy details (finePerDay, gracePeriod, etc.)
   */
  async getLateReturnPolicy() {
    try {
      const response = await api.get('/reservations/policy');
      return response;
    } catch (error) {
      console.error('Get late return policy error:', error);
      throw error;
    }
  },

  // Admin/Librarian Functions

  /**
   * Get all reservations (Admin/Librarian only)
   * @returns {Promise} All reservations array
   */
  async getAllReservations() {
    try {
      const response = await api.get('/reservations');
      return response;
    } catch (error) {
      console.error('Get all reservations error:', error);
      throw error;
    }
  },

  /**
   * Mark reservation as picked up (Admin/Librarian only)
   * @param {string} reservationId - Reservation UUID
   * @returns {Promise} Updated reservation object
   */
  async markAsPickedUp(reservationId) {
    try {
      const response = await api.patch(`/reservations/${reservationId}/pickup`);
      return response;
    } catch (error) {
      console.error('Mark as picked up error:', error);
      throw error;
    }
  },

  /**
   * Find reservation by number (Admin/Librarian only)
   * @param {string} reservationNumber - Reservation number (e.g., RES-2024-001234)
   * @returns {Promise} Reservation object
   */
  async findReservationByNumber(reservationNumber) {
    try {
      const response = await api.get(`/reservations/by-number/${reservationNumber}`);
      return response;
    } catch (error) {
      console.error('Find reservation by number error:', error);
      throw error;
    }
  },
};

export default reservationService;
