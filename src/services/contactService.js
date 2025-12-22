import api from './api';

/**
 * Contact Service
 * Handles all contact message-related API calls
 */

const contactService = {
  /**
   * Send a contact message (Public - no authentication required)
   * @param {Object} messageData - { name, email, subject, message, phone? }
   * @returns {Promise} Confirmation with message ID
   */
  async sendContactMessage(messageData) {
    try {
      const response = await api.post('/contact', messageData);
      return response;
    } catch (error) {
      console.error('Send contact message error:', error);
      throw error;
    }
  },

  /**
   * Send authenticated contact message (uses user's stored info)
   * @param {Object} messageData - { subject, message, phone? }
   * @returns {Promise} Created message object with user details
   */
  async sendAuthenticatedMessage(messageData) {
    try {
      const response = await api.post('/contact/authenticated', messageData);
      return response;
    } catch (error) {
      console.error('Send authenticated message error:', error);
      throw error;
    }
  },

  /**
   * Get user's own messages
   * @returns {Promise} Array of user's contact messages
   */
  async getMyMessages() {
    try {
      const response = await api.get('/contact/my-messages');
      return response;
    } catch (error) {
      console.error('Get my messages error:', error);
      throw error;
    }
  },

  // Admin/Librarian Functions

  /**
   * Get all contact messages (Admin/Librarian only)
   * @returns {Promise} All contact messages
   */
  async getAllMessages() {
    try {
      const response = await api.get('/contact');
      return response;
    } catch (error) {
      console.error('Get all messages error:', error);
      throw error;
    }
  },

  /**
   * Get pending messages (Admin/Librarian only)
   * @returns {Promise} Pending messages array
   */
  async getPendingMessages() {
    try {
      const response = await api.get('/contact/pending');
      return response;
    } catch (error) {
      console.error('Get pending messages error:', error);
      throw error;
    }
  },

  /**
   * Get count of pending messages (Admin/Librarian only)
   * @returns {Promise<number>} Number of pending messages
   */
  async getPendingCount() {
    try {
      const response = await api.get('/contact/pending/count');
      return response;
    } catch (error) {
      console.error('Get pending count error:', error);
      throw error;
    }
  },

  /**
   * Mark message as read (Admin/Librarian only)
   * @param {string} messageId - Contact message UUID
   * @returns {Promise} Updated message object
   */
  async markMessageAsRead(messageId) {
    try {
      const response = await api.patch(`/contact/${messageId}/read`);
      return response;
    } catch (error) {
      console.error('Mark message as read error:', error);
      throw error;
    }
  },

  /**
   * Close a message (Admin/Librarian only)
   * @param {string} messageId - Contact message UUID
   * @returns {Promise} Updated message object
   */
  async closeMessage(messageId) {
    try {
      const response = await api.patch(`/contact/${messageId}/close`);
      return response;
    } catch (error) {
      console.error('Close message error:', error);
      throw error;
    }
  },

  /**
   * Update message (add response or change status) (Admin/Librarian only)
   * @param {string} messageId - Contact message UUID
   * @param {Object} updates - { response?, status? }
   * @returns {Promise} Updated message object
   */
  async updateMessage(messageId, updates) {
    try {
      const response = await api.patch(`/contact/${messageId}`, updates);
      return response;
    } catch (error) {
      console.error('Update message error:', error);
      throw error;
    }
  },

  /**
   * Delete a contact message (Admin only)
   * @param {string} messageId - Contact message UUID
   * @returns {Promise} Deletion confirmation
   */
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`/contact/${messageId}`);
      return response;
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  },
};

export default contactService;
