import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response with user data and access token
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        address: userData.address || '',
      });
      
      // Store token and user data in localStorage
      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with user data and access token
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      // Store token and user data
      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Apply dark mode preference if enabled
        if (response.user?.darkModeEnabled) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} Current user profile data
   */
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/auth/me');
      
      // Update stored user data
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
      }
      
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is expired or invalid, clear storage
      if (error.message.includes('401') || error.message.includes('token')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
      throw error;
    }
  },

  /**
   * Change user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Success response
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   * Clears all authentication data from localStorage
   */
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    document.documentElement.classList.remove('dark');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get stored user from localStorage
   * @returns {Object|null} User object or null
   */
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get stored token from localStorage
   * @returns {string|null} Token or null
   */
  getToken() {
    return localStorage.getItem('accessToken');
  },
};

export default authService;

