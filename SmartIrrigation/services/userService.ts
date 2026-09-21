import api from './api';

export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('settings/'); // Standard user profile settings
      return response.data;
    } catch (error) {
      console.error('userService.getProfile error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put('settings/', profileData);
      return response.data;
    } catch (error) {
      console.error('userService.updateProfile error:', error);
      throw error;
    }
  },
};

export default userService;
