import api from './api';

/**
 * Wishlist Service
 * Handles all wishlist-related API calls
 */

const wishlistService = {
  /**
   * Get user's complete wishlist
   * @returns {Promise} Array of wishlist items with book details
   */
  async getWishlist() {
    try {
      const response = await api.get('/wishlist');
      return response;
    } catch (error) {
      console.error('Get wishlist error:', error);
      throw error;
    }
  },

  /**
   * Add a book to wishlist
   * @param {string} bookId - Book UUID
   * @param {number} priority - Priority (1-5, default: 3)
   * @param {string} notes - Optional notes
   * @returns {Promise} Created wishlist item
   */
  async addToWishlist(bookId, priority = 3, notes = '') {
    try {
      const response = await api.post('/wishlist', { 
        bookId, 
        priority, 
        notes 
      });
      return response;
    } catch (error) {
      console.error('Add to wishlist error:', error);
      throw error;
    }
  },

  /**
   * Remove book from wishlist by book ID
   * @param {string} bookId - Book UUID
   * @returns {Promise} Deletion confirmation
   */
  async removeFromWishlist(bookId) {
    try {
      const response = await api.delete(`/wishlist/book/${bookId}`);
      return response;
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      throw error;
    }
  },

  /**
   * Remove wishlist item by wishlist item ID
   * @param {string} id - Wishlist item UUID
   * @returns {Promise} Deletion confirmation
   */
  async removeById(id) {
    try {
      const response = await api.delete(`/wishlist/${id}`);
      return response;
    } catch (error) {
      console.error('Remove wishlist item by ID error:', error);
      throw error;
    }
  },

  /**
   * Update wishlist item (priority, notes)
   * @param {string} id - Wishlist item UUID
   * @param {Object} updates - { priority?, notes? }
   * @returns {Promise} Updated wishlist item
   */
  async updateWishlistItem(id, updates) {
    try {
      const response = await api.patch(`/wishlist/${id}`, updates);
      return response;
    } catch (error) {
      console.error('Update wishlist item error:', error);
      throw error;
    }
  },

  /**
   * Check if a book is in user's wishlist
   * @param {string} bookId - Book UUID
   * @returns {Promise<boolean>} True if book is in wishlist
   */
  async isInWishlist(bookId) {
    try {
      const response = await api.get(`/wishlist/check/${bookId}`);
      // API interceptor already extracts .data, so response is the data object
      return response?.isInWishlist ?? false;
    } catch (error) {
      console.error('Check wishlist error:', error);
      return false; // Return false instead of throwing on error
    }
  },

  /**
   * Clear entire wishlist
   * @returns {Promise} Deletion confirmation
   */
  async clearWishlist() {
    try {
      const response = await api.delete('/wishlist');
      return response;
    } catch (error) {
      console.error('Clear wishlist error:', error);
      throw error;
    }
  },

  /**
   * Get wishlist count
   * @returns {Promise<number>} Number of items in wishlist
   */
  async getWishlistCount() {
    try {
      const response = await api.get('/wishlist/count');
      // API interceptor already extracts .data, so response is the data object
      return response?.count ?? 0;
    } catch (error) {
      console.error('Get wishlist count error:', error);
      return 0; // Return 0 instead of throwing on error
    }
  },
};

export default wishlistService;
