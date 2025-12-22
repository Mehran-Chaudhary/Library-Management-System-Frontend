import api from './api';

export const reviewService = {
  // Get reviews for a book
  async getReviewsByBook(bookId) {
    const response = await api.get(`/reviews/book/${bookId}`);
    return response.data;
  },

  // Get current user's reviews
  async getMyReviews() {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },

  // Create a review for a book
  async createReview(bookId, reviewData) {
    const response = await api.post(`/reviews/book/${bookId}`, {
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
    return response.data;
  },

  // Update a review
  async updateReview(reviewId, reviewData) {
    const response = await api.patch(`/reviews/${reviewId}`, {
      rating: reviewData.rating,
      comment: reviewData.comment,
    });
    return response.data;
  },

  // Delete a review
  async deleteReview(reviewId) {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response;
  },
};

export default reviewService;
