import api from './api';

export const wishlistService = {
  // Get user's wishlist
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add book to wishlist
  async addToWishlist(bookId, priority = 1, notes = '') {
    const response = await api.post('/wishlist', { bookId, priority, notes });
    return response.data;
  },

  // Remove book from wishlist by book ID
  async removeFromWishlist(bookId) {
    const response = await api.delete(`/wishlist/book/${bookId}`);
    return response;
  },

  // Remove wishlist item by ID
  async removeById(id) {
    const response = await api.delete(`/wishlist/${id}`);
    return response;
  },

  // Update wishlist item
  async updateWishlistItem(id, updates) {
    const response = await api.patch(`/wishlist/${id}`, updates);
    return response.data;
  },

  // Check if book is in wishlist
  async isInWishlist(bookId) {
    const response = await api.get(`/wishlist/check/${bookId}`);
    return response.data.isInWishlist;
  },

  // Clear entire wishlist
  async clearWishlist() {
    const response = await api.delete('/wishlist');
    return response;
  },

  // Get wishlist count
  async getWishlistCount() {
    const response = await api.get('/wishlist/count');
    return response.data.count;
  },
};

export default wishlistService;
