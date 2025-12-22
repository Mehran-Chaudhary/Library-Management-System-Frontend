import api from './api';

/**
 * Review Service
 * Handles all book review-related API calls
 */

const reviewService = {
  /**
   * Get all reviews for a specific book (Public)
   * @param {string} bookId - Book UUID
   * @returns {Promise} Array of reviews with user details
   */
  async getBookReviews(bookId) {
    try {
      const response = await api.get(`/reviews/book/${bookId}`);
      return response;
    } catch (error) {
      console.error('Get book reviews error:', error);
      throw error;
    }
  },

  /**
   * Get current user's reviews
   * @returns {Promise} Array of user's reviews
   */
  async getMyReviews() {
    try {
      const response = await api.get('/reviews/my-reviews');
      return response;
    } catch (error) {
      console.error('Get my reviews error:', error);
      throw error;
    }
  },

  /**
   * Create a review for a book
   * @param {string} bookId - Book UUID
   * @param {number} rating - Rating (1-5)
   * @param {string} comment - Review comment (min 10 chars)
   * @returns {Promise} Created review object
   */
  async createReview(bookId, rating, comment) {
    try {
      const response = await api.post(`/reviews/book/${bookId}`, {
        rating,
        comment,
      });
      return response;
    } catch (error) {
      console.error('Create review error:', error);
      throw error;
    }
  },

  /**
   * Update an existing review
   * @param {string} reviewId - Review UUID
   * @param {Object} updates - { rating?, comment? }
   * @returns {Promise} Updated review object
   */
  async updateReview(reviewId, updates) {
    try {
      const response = await api.patch(`/reviews/${reviewId}`, updates);
      return response;
    } catch (error) {
      console.error('Update review error:', error);
      throw error;
    }
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review UUID
   * @returns {Promise} Deletion confirmation
   */
  async deleteReview(reviewId) {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response;
    } catch (error) {
      console.error('Delete review error:', error);
      throw error;
    }
  },
};

export default reviewService;
