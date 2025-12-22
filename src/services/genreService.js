import api from './api';

export const genreService = {
  // Get all genres
  async getGenres() {
    const response = await api.get('/genres');
    return response.data;
  },

  // Get genre by ID
  async getGenreById(id) {
    const response = await api.get(`/genres/${id}`);
    return response.data;
  },
};

export default genreService;
