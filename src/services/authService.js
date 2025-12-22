import api from './api';

export const authService = {
  // Register a new user
  async register(userData) {
    const response = await api.post('/auth/register', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || null,
      address: userData.address || null,
    });
    
    // Store token and user data
    if (response.data?.accessToken) {
      localStorage.setItem('booknest_token', response.data.accessToken);
      localStorage.setItem('booknest_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    // Store token and user data
    if (response.data?.accessToken) {
      localStorage.setItem('booknest_token', response.data.accessToken);
      localStorage.setItem('booknest_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Get current user profile
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Change password
  async changePassword(oldPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response;
  },

  // Logout user
  logout() {
    localStorage.removeItem('booknest_token');
    localStorage.removeItem('booknest_user');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('booknest_token');
  },

  // Get stored user
  getStoredUser() {
    const user = localStorage.getItem('booknest_user');
    return user ? JSON.parse(user) : null;
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('booknest_token');
  },
};

export default authService;
