import api from './api';

export const statisticsService = {
  getStatistics: async () => {
    try {
      const response = await api.get('admin/statistics/');
      return response.data;
    } catch (error) {
      console.error('statisticsService.getStatistics error:', error);
      throw error;
    }
  },
};

export default statisticsService;
