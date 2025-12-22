import api from './api';

export const contactService = {
  // Send a contact message (public - no auth required)
  async sendMessage(messageData) {
    const response = await api.post('/contact', {
      fullName: messageData.fullName,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message,
    });
    return response.data;
  },

  // Send a contact message (authenticated)
  async sendAuthenticatedMessage(messageData) {
    const response = await api.post('/contact/authenticated', {
      fullName: messageData.fullName,
      email: messageData.email,
      subject: messageData.subject,
      message: messageData.message,
    });
    return response.data;
  },

  // Get user's own messages (authenticated)
  async getMyMessages() {
    const response = await api.get('/contact/my-messages');
    return response.data;
  },
};

export default contactService;
