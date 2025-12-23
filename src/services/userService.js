import api from './api';

/**
 * User Service
 * Handles all user-related API calls
 */

const userService = {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  async getUserProfile() {
    try {
      const response = await api.get('/users/profile');
      
      // Update stored user data
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
      }
      
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} updates - Profile fields to update
   * @returns {Promise} Updated user data
   */
  async updateUserProfile(updates) {
    try {
      const response = await api.patch('/users/profile', updates);
      
      // Update local storage with new data
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Toggle dark mode preference
   * @param {boolean} enabled - Whether dark mode should be enabled
   * @returns {Promise} Updated preference
   */
  async toggleDarkMode(enabled) {
    try {
      const response = await api.patch('/users/dark-mode', { enabled });
      
      // Apply dark mode to DOM
      if (enabled) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Update user in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.darkModeEnabled = enabled;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response;
    } catch (error) {
      console.error('Toggle dark mode error:', error);
      throw error;
    }
  },

  /**
   * Get all users (Admin/Librarian only)
   * @returns {Promise} Array of all users
   */
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      console.error('Get all users error:', error);
      if (error.message.includes('403')) {
        throw new Error('Insufficient permissions');
      }
      throw error;
    }
  },

  /**
   * Get user by ID (Admin/Librarian only)
   * @param {string} userId - User ID
   * @returns {Promise} User data
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },
};

export default userService;
