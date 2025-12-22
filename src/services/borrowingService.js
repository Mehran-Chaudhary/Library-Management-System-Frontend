import api from './api';

export const borrowingService = {
  // Get user's borrowings
  async getMyBorrowings() {
    const response = await api.get('/borrowings/my-borrowings');
    return response.data;
  },

  // Get active borrowings
  async getActiveBorrowings() {
    const response = await api.get('/borrowings/active');
    return response.data;
  },

  // Get borrowing history
  async getBorrowingHistory() {
    const response = await api.get('/borrowings/history');
    return response.data;
  },

  // Get dashboard stats
  async getDashboardStats() {
    const response = await api.get('/borrowings/dashboard');
    return response.data;
  },

  // Extend a borrowing
  async extendBorrowing(borrowingId) {
    const response = await api.patch(`/borrowings/${borrowingId}/extend`);
    return response.data;
  },

  // Get single borrowing by ID
  async getBorrowingById(id) {
    const response = await api.get(`/borrowings/${id}`);
    return response.data;
  },
};

export default borrowingService;
