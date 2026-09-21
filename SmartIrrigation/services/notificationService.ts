import api from './api';

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('notifications/');
      return response.data;
    } catch (error) {
      console.error('notificationService.getNotifications error:', error);
      throw error;
    }
  },
};

export default notificationService;
