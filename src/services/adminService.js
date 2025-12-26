import api from './api';

/**
 * Admin Service
 * Handles all admin/librarian-specific API calls
 */

const adminService = {
  // ==================== Dashboard ====================

  /**
   * Get comprehensive dashboard statistics
   * @returns {Promise} Dashboard stats object
   */
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard');
      return response;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },

  /**
   * Get recent activity feed
   * @param {number} limit - Number of activities to fetch
   * @returns {Promise} Activity array
   */
  async getRecentActivity(limit = 20) {
    try {
      const response = await api.get('/admin/activity', { params: { limit } });
      return response;
    } catch (error) {
      console.error('Get recent activity error:', error);
      throw error;
    }
  },

  /**
   * Get inventory statistics with low stock alerts
   * @returns {Promise} Inventory stats object
   */
  async getInventoryStats() {
    try {
      const response = await api.get('/admin/inventory');
      return response;
    } catch (error) {
      console.error('Get inventory stats error:', error);
      throw error;
    }
  },

  /**
   * Get user analytics and trends
   * @returns {Promise} User analytics object
   */
  async getUserAnalytics() {
    try {
      const response = await api.get('/admin/analytics/users');
      return response;
    } catch (error) {
      console.error('Get user analytics error:', error);
      throw error;
    }
  },

  // ==================== Books Management ====================

  /**
   * Get paginated books with admin filters
   * @param {Object} filters - Query parameters
   * @returns {Promise} Books with pagination metadata
   */
  async getBooks(filters = {}) {
    try {
      const response = await api.get('/admin/books', { params: filters });
      return response;
    } catch (error) {
      console.error('Admin get books error:', error);
      throw error;
    }
  },

  // ==================== Reservations Management ====================

  /**
   * Get all reservations with filters
   * @param {Object} filters - Query parameters (page, limit, status)
   * @returns {Promise} Reservations with pagination
   */
  async getReservations(filters = {}) {
    try {
      const response = await api.get('/admin/reservations', { params: filters });
      return response;
    } catch (error) {
      console.error('Admin get reservations error:', error);
      throw error;
    }
  },

  /**
   * Mark reservation as picked up
   * @param {string} reservationId - Reservation UUID
   * @returns {Promise} Updated reservation
   */
  async markReservationPickedUp(reservationId) {
    try {
      const response = await api.patch(`/reservations/${reservationId}/pickup`);
      return response;
    } catch (error) {
      console.error('Mark pickup error:', error);
      throw error;
    }
  },

  /**
   * Find reservation by reservation number
   * @param {string} reservationNumber - Reservation number (e.g., RES-202312-XXXX)
   * @returns {Promise} Reservation details
   */
  async getReservationByNumber(reservationNumber) {
    try {
      const response = await api.get(`/reservations/by-number/${reservationNumber}`);
      return response;
    } catch (error) {
      console.error('Get reservation by number error:', error);
      throw error;
    }
  },

  // ==================== Borrowings Management ====================

  /**
   * Get all borrowings with filters
   * @param {Object} filters - Query parameters (page, limit, status, overdue)
   * @returns {Promise} Borrowings with pagination
   */
  async getBorrowings(filters = {}) {
    try {
      const response = await api.get('/admin/borrowings', { params: filters });
      return response;
    } catch (error) {
      console.error('Admin get borrowings error:', error);
      throw error;
    }
  },

  /**
   * Process book return
   * @param {string} borrowingId - Borrowing UUID
   * @returns {Promise} Updated borrowing with fine info
   */
  async returnBook(borrowingId) {
    try {
      const response = await api.patch(`/borrowings/${borrowingId}/return`);
      return response;
    } catch (error) {
      console.error('Return book error:', error);
      throw error;
    }
  },

  /**
   * Mark fine as paid
   * @param {string} borrowingId - Borrowing UUID
   * @returns {Promise} Updated borrowing
   */
  async markFinePaid(borrowingId) {
    try {
      const response = await api.patch(`/borrowings/${borrowingId}/pay-fine`);
      return response;
    } catch (error) {
      console.error('Mark fine paid error:', error);
      throw error;
    }
  },

  /**
   * Get all overdue borrowings
   * @returns {Promise} Overdue borrowings array
   */
  async getOverdueBorrowings() {
    try {
      const response = await api.get('/borrowings/overdue/all');
      return response;
    } catch (error) {
      console.error('Get overdue borrowings error:', error);
      throw error;
    }
  },

  // ==================== Users Management ====================

  /**
   * Get all users with filters
   * @param {Object} filters - Query parameters (page, limit, role, search)
   * @returns {Promise} Users with pagination
   */
  async getUsers(filters = {}) {
    try {
      const response = await api.get('/admin/users', { params: filters });
      return response;
    } catch (error) {
      console.error('Admin get users error:', error);
      throw error;
    }
  },

  /**
   * Get user details
   * @param {string} userId - User UUID
   * @returns {Promise} User details
   */
  async getUserDetails(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user details error:', error);
      throw error;
    }
  },

  // ==================== Contact Messages ====================

  /**
   * Get all contact messages
   * @returns {Promise} Messages array
   */
  async getContactMessages() {
    try {
      const response = await api.get('/contact');
      return response;
    } catch (error) {
      console.error('Get contact messages error:', error);
      throw error;
    }
  },

  /**
   * Get pending messages
   * @returns {Promise} Pending messages array
   */
  async getPendingMessages() {
    try {
      const response = await api.get('/contact/pending');
      return response;
    } catch (error) {
      console.error('Get pending messages error:', error);
      throw error;
    }
  },

  /**
   * Get pending messages count
   * @returns {Promise} Count object
   */
  async getPendingMessageCount() {
    try {
      const response = await api.get('/contact/pending/count');
      return response;
    } catch (error) {
      console.error('Get pending count error:', error);
      throw error;
    }
  },

  /**
   * Mark message as read
   * @param {string} messageId - Message UUID
   * @returns {Promise} Updated message
   */
  async markMessageRead(messageId) {
    try {
      const response = await api.patch(`/contact/${messageId}/read`);
      return response;
    } catch (error) {
      console.error('Mark message read error:', error);
      throw error;
    }
  },

  /**
   * Close/archive message
   * @param {string} messageId - Message UUID
   * @returns {Promise} Updated message
   */
  async closeMessage(messageId) {
    try {
      const response = await api.patch(`/contact/${messageId}/close`);
      return response;
    } catch (error) {
      console.error('Close message error:', error);
      throw error;
    }
  },
};

export default adminService;
