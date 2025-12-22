import api from './api';

/**
 * Author Service
 * Handles all author-related API calls
 */

const authorService = {
  /**
   * Get all authors
   * @param {string} search - Optional search query
   * @returns {Promise} Authors array
   */
  async getAuthors(search = '') {
    try {
      const params = search ? { search } : {};
      const response = await api.get('/authors', { params });
      return response;
    } catch (error) {
      console.error('Get authors error:', error);
      throw error;
    }
  },

  /**
   * Get author by ID
   * @param {string} authorId - Author UUID
   * @returns {Promise} Author details with books
   */
  async getAuthorById(authorId) {
    try {
      const response = await api.get(`/authors/${authorId}`);
      return response;
    } catch (error) {
      console.error('Get author by ID error:', error);
      throw error;
    }
  },

  /**
   * Create new author (Admin/Librarian only)
   * @param {Object} authorData - Author data
   * @returns {Promise} Created author object
   */
  async createAuthor(authorData) {
    try {
      const response = await api.post('/authors', authorData);
      return response;
    } catch (error) {
      console.error('Create author error:', error);
      throw error;
    }
  },

  /**
   * Update author (Admin/Librarian only)
   * @param {string} authorId - Author UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise} Updated author object
   */
  async updateAuthor(authorId, updates) {
    try {
      const response = await api.patch(`/authors/${authorId}`, updates);
      return response;
    } catch (error) {
      console.error('Update author error:', error);
      throw error;
    }
  },

  /**
   * Delete author (Admin only)
   * @param {string} authorId - Author UUID
   * @returns {Promise} Success message
   */
  async deleteAuthor(authorId) {
    try {
      const response = await api.delete(`/authors/${authorId}`);
      return response;
    } catch (error) {
      console.error('Delete author error:', error);
      throw error;
    }
  },
};

export default authorService;
