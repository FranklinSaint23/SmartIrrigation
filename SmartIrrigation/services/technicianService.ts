import api from './api';

export const technicianService = {
  getTechnicians: async () => {
    try {
      const response = await api.get('admin/technicians/');
      return response.data;
    } catch (error) {
      console.error('technicianService.getTechnicians error:', error);
      throw error;
    }
  },

  createTechnician: async (techData: any) => {
    try {
      const response = await api.post('admin/technicians/', techData);
      return response.data;
    } catch (error) {
      console.error('technicianService.createTechnician error:', error);
      throw error;
    }
  },
};

export default technicianService;
