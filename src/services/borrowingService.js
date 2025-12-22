import api from './api';

/**
 * Borrowing Service
 * Handles all borrowing-related API calls
 */

const borrowingService = {
  /**
   * Get user's all borrowings
   * @returns {Promise} User's borrowings array
   */
  async getMyBorrowings() {
    try {
      const response = await api.get('/borrowings/my-borrowings');
      return response;
    } catch (error) {
      console.error('Get my borrowings error:', error);
      throw error;
    }
  },

  /**
   * Get active borrowings
   * @returns {Promise} Active borrowings array
   */
  async getActiveBorrowings() {
    try {
      const response = await api.get('/borrowings/active');
      return response;
    } catch (error) {
      console.error('Get active borrowings error:', error);
      throw error;
    }
  },

  /**
   * Get borrowing history (returned books)
   * @returns {Promise} Borrowing history array
   */
  async getBorrowingHistory() {
    try {
      const response = await api.get('/borrowings/history');
      return response;
    } catch (error) {
      console.error('Get borrowing history error:', error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats object
   */
  async getDashboardStats() {
    try {
      const response = await api.get('/borrowings/dashboard');
      return response;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },

  /**
   * Extend borrowing by 7 days
   * @param {string} borrowingId - Borrowing UUID
   * @returns {Promise} Updated borrowing object
   */
  async extendBorrowing(borrowingId) {
    try {
      const response = await api.patch(`/borrowings/${borrowingId}/extend`);
      return response;
    } catch (error) {
      console.error('Extend borrowing error:', error);
      throw error;
    }
  },

  /**
   * Get single borrowing by ID
   * @param {string} borrowingId - Borrowing UUID
   * @returns {Promise} Borrowing details
   */
  async getBorrowingById(borrowingId) {
    try {
      const response = await api.get(`/borrowings/${borrowingId}`);
      return response;
    } catch (error) {
      console.error('Get borrowing by ID error:', error);
      throw error;
    }
  },

  // Admin/Librarian Functions

  /**
   * Get all borrowings (Admin/Librarian only)
   * @returns {Promise} All borrowings array
   */
  async getAllBorrowings() {
    try {
      const response = await api.get('/borrowings');
      return response;
    } catch (error) {
      console.error('Get all borrowings error:', error);
      throw error;
    }
  },

  /**
   * Create borrowing manually (Admin/Librarian only)
   * @param {Object} borrowingData - Borrowing data
   * @returns {Promise} Created borrowing object
   */
  async createBorrowing(borrowingData) {
    try {
      const response = await api.post('/borrowings', borrowingData);
      return response;
    } catch (error) {
      console.error('Create borrowing error:', error);
      throw error;
    }
  },

  /**
   * Return book (Admin/Librarian only)
   * @param {string} borrowingId - Borrowing UUID
   * @returns {Promise} Updated borrowing object
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
   * Pay fine (Admin/Librarian only)
   * @param {string} borrowingId - Borrowing UUID
   * @returns {Promise} Updated borrowing object
   */
  async payFine(borrowingId) {
    try {
      const response = await api.patch(`/borrowings/${borrowingId}/pay-fine`);
      return response;
    } catch (error) {
      console.error('Pay fine error:', error);
      throw error;
    }
  },

  /**
   * Get all overdue borrowings (Admin/Librarian only)
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
};

export default borrowingService;
