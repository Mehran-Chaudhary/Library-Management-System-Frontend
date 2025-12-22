import api from './api';

/**
 * Book Service
 * Handles all book-related API calls
 */

const bookService = {
  /**
   * Get all books with filtering and pagination
   * @param {Object} filters - Query parameters for filtering
   * @returns {Promise} Books array with pagination metadata
   */
  async getBooks(filters = {}) {
    try {
      const response = await api.get('/books', { params: filters });
      return response;
    } catch (error) {
      console.error('Get books error:', error);
      throw error;
    }
  },

  /**
   * Get featured books
   * @param {number} limit - Number of books to return
   * @returns {Promise} Featured books array
   */
  async getFeaturedBooks(limit = 6) {
    try {
      const response = await api.get('/books/featured', { params: { limit } });
      return response;
    } catch (error) {
      console.error('Get featured books error:', error);
      throw error;
    }
  },

  /**
   * Get new arrival books
   * @param {number} limit - Number of books to return
   * @returns {Promise} New arrival books array
   */
  async getNewArrivals(limit = 8) {
    try {
      const response = await api.get('/books/new-arrivals', { params: { limit } });
      return response;
    } catch (error) {
      console.error('Get new arrivals error:', error);
      throw error;
    }
  },

  /**
   * Get popular books
   * @param {number} limit - Number of books to return
   * @returns {Promise} Popular books array
   */
  async getPopularBooks(limit = 10) {
    try {
      const response = await api.get('/books/popular', { params: { limit } });
      return response;
    } catch (error) {
      console.error('Get popular books error:', error);
      throw error;
    }
  },

  /**
   * Get single book by ID
   * @param {string} bookId - Book UUID
   * @returns {Promise} Book details with authors, genres, and reviews
   */
  async getBookById(bookId) {
    try {
      const response = await api.get(`/books/${bookId}`);
      return response;
    } catch (error) {
      console.error('Get book by ID error:', error);
      throw error;
    }
  },

  /**
   * Check book availability
   * @param {string} bookId - Book UUID
   * @returns {Promise} Availability status with copies info
   */
  async checkAvailability(bookId) {
    try {
      const response = await api.get(`/books/${bookId}/availability`);
      return response;
    } catch (error) {
      console.error('Check availability error:', error);
      throw error;
    }
  },

  /**
   * Create new book (Admin/Librarian only)
   * @param {Object} bookData - Book data
   * @returns {Promise} Created book object
   */
  async createBook(bookData) {
    try {
      const response = await api.post('/books', bookData);
      return response;
    } catch (error) {
      console.error('Create book error:', error);
      throw error;
    }
  },

  /**
   * Update book (Admin/Librarian only)
   * @param {string} bookId - Book UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise} Updated book object
   */
  async updateBook(bookId, updates) {
    try {
      const response = await api.patch(`/books/${bookId}`, updates);
      return response;
    } catch (error) {
      console.error('Update book error:', error);
      throw error;
    }
  },

  /**
   * Delete book (Admin only)
   * @param {string} bookId - Book UUID
   * @returns {Promise} Success message
   */
  async deleteBook(bookId) {
    try {
      const response = await api.delete(`/books/${bookId}`);
      return response;
    } catch (error) {
      console.error('Delete book error:', error);
      throw error;
    }
  },
};

export default bookService;
