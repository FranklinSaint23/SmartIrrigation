import api from './api';

export const authService = {
  login: async (email: string, psw: string) => {
    try {
      const response = await api.post('auth/login/', { 
        username: email, 
        password: psw 
      });
      
      // Stocker le token dans les entêtes par défaut d'Axios si renvoyé
      if (response.data?.token) {
        api.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('authService.login error:', error);
      throw error;
    }
  },

  register: async (name: string, phone: string, email: string, psw: string) => {
    try {
      const response = await api.post('auth/register/', {
        username: email,
        email: email,
        name: name,
        phone_number: phone,
        password: psw,
      });

      if (response.data?.token) {
        api.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      console.error('authService.register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('auth/logout/');
      // Nettoyer l'entête d'autorisation lors de la déconnexion
      delete api.defaults.headers.common['Authorization'];
      return response.data;
    } catch (error) {
      console.error('authService.logout error:', error);
      // Supprimer le token même si la requête réseau échoue
      delete api.defaults.headers.common['Authorization'];
      throw error;
    }
  },
};

export default authService;