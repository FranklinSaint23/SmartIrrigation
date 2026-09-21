import api from './api';

export const maintenanceService = {
  getInterventions: async () => {
    try {
      const response = await api.get('interventions/');
      return response.data;
    } catch (error) {
      console.error('maintenanceService.getInterventions error:', error);
      throw error;
    }
  },

  getInterventionDetail: async (id: number) => {
    try {
      const response = await api.get(`interventions/${id}/`);
      return response.data;
    } catch (error) {
      console.error('maintenanceService.getInterventionDetail error:', error);
      throw error;
    }
  },

  reportBreakdown: async (breakdownData: { breakdown_type: string; description: string; photo_url?: string }) => {
    try {
      const response = await api.post('interventions/', breakdownData);
      return response.data;
    } catch (error) {
      console.error('maintenanceService.reportBreakdown error:', error);
      throw error;
    }
  },

  assignTechnician: async (interventionId: number, technicianId: number) => {
    try {
      const response = await api.post(`interventions/${interventionId}/assign/`, { technician_id: technicianId });
      return response.data;
    } catch (error) {
      console.error('maintenanceService.assignTechnician error:', error);
      throw error;
    }
  },

  startIntervention: async (id: number) => {
    try {
      const response = await api.post(`interventions/${id}/start/`);
      return response.data;
    } catch (error) {
      console.error('maintenanceService.startIntervention error:', error);
      throw error;
    }
  },

  closeIntervention: async (id: number, notes: string, checks: any) => {
    try {
      const response = await api.post(`interventions/${id}/close/`, {
        resolution_notes: notes,
        checks_completed: JSON.stringify(checks),
      });
      return response.data;
    } catch (error) {
      console.error('maintenanceService.closeIntervention error:', error);
      throw error;
    }
  },
};

export default maintenanceService;
