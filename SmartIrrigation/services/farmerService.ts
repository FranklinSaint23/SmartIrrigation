import api from './api';

export const farmerService = {
  getFarmers: async () => {
    try {
      const response = await api.get('admin/farmers/');
      return response.data;
    } catch (error) {
      console.error('farmerService.getFarmers error:', error);
      throw error;
    }
  },

  getFarmerDetail: async (id: number) => {
    try {
      const response = await api.get(`admin/farmers/${id}/`);
      return response.data;
    } catch (error) {
      console.error('farmerService.getFarmerDetail error:', error);
      throw error;
    }
  },
};

export default farmerService;
