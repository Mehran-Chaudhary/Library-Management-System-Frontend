import api from './api';

export const bookService = {
  // Get all books with optional filters
  async getBooks(params = {}) {
    const response = await api.get('/books', { params });
    return response;
  },

  // Get featured books
  async getFeaturedBooks(limit = 10) {
    const response = await api.get('/books/featured', { params: { limit } });
    return response.data;
  },

  // Get new arrivals
  async getNewArrivals(limit = 10) {
    const response = await api.get('/books/new-arrivals', { params: { limit } });
    return response.data;
  },

  // Get popular books
  async getPopularBooks(limit = 10) {
    const response = await api.get('/books/popular', { params: { limit } });
    return response.data;
  },

  // Get single book by ID
  async getBookById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Check book availability
  async checkAvailability(id) {
    const response = await api.get(`/books/${id}/availability`);
    return response.data;
  },

  // Search books by title or author
  async searchBooks(query, genre = null) {
    const params = { search: query };
    if (genre && genre !== 'All') {
      params.genre = genre;
    }
    const response = await api.get('/books', { params });
    return response;
  },
};

export default bookService;
