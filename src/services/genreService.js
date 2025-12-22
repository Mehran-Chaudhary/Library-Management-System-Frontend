import api from './api';

/**
 * Genre Service
 * Handles all genre-related API calls
 */

const genreService = {
  /**
   * Get all genres
   * @returns {Promise} Genres array
   */
  async getGenres() {
    try {
      const response = await api.get('/genres');
      return response;
    } catch (error) {
      console.error('Get genres error:', error);
      throw error;
    }
  },

  /**
   * Get genre by ID
   * @param {string} genreId - Genre UUID
   * @returns {Promise} Genre details with books
   */
  async getGenreById(genreId) {
    try {
      const response = await api.get(`/genres/${genreId}`);
      return response;
    } catch (error) {
      console.error('Get genre by ID error:', error);
      throw error;
    }
  },

  /**
   * Create new genre (Admin/Librarian only)
   * @param {Object} genreData - Genre data
   * @returns {Promise} Created genre object
   */
  async createGenre(genreData) {
    try {
      const response = await api.post('/genres', genreData);
      return response;
    } catch (error) {
      console.error('Create genre error:', error);
      throw error;
    }
  },

  /**
   * Update genre (Admin/Librarian only)
   * @param {string} genreId - Genre UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise} Updated genre object
   */
  async updateGenre(genreId, updates) {
    try {
      const response = await api.patch(`/genres/${genreId}`, updates);
      return response;
    } catch (error) {
      console.error('Update genre error:', error);
      throw error;
    }
  },

  /**
   * Delete genre (Admin only)
   * @param {string} genreId - Genre UUID
   * @returns {Promise} Success message
   */
  async deleteGenre(genreId) {
    try {
      const response = await api.delete(`/genres/${genreId}`);
      return response;
    } catch (error) {
      console.error('Delete genre error:', error);
      throw error;
    }
  },
};

export default genreService;
