import api from './api';
 
// Forme de la réponse renvoyée par tinyml_predict_needs (backend Django)
export interface IrrigationPrediction {
  need: 'Faible' | 'Moyen' | 'Élevé';
  recommendation: string;
  soil_humidity: number;
  threshold: number;
  trend_per_minute: number;
  minutes_until_threshold: number | null;
  reason: 'predictive' | 'reactive' | 'rain' | 'rain_forecast' | 'insufficient_data';
}
 
export const deviceService = {
  getDevices: async () => {
    try {
      const response = await api.get('admin/devices/');
      return response.data;
    } catch (error) {
      console.error('deviceService.getDevices error:', error);
      throw error;
    }
  },
 
  togglePump: async (active: boolean) => {
    try {
      const response = await api.post('control/pump/', { pump_active: active });
      return response.data;
    } catch (error) {
      console.error('deviceService.togglePump error:', error);
      throw error;
    }
  },
 
  setMode: async (mode: 'Auto' | 'Manual') => {
    try {
      const response = await api.post('control/pump/', { mode });
      return response.data;
    } catch (error) {
      console.error('deviceService.setMode error:', error);
      throw error;
    }
  },
 
  updateSettings: async (settings: any) => {
    try {
      const response = await api.put('settings/', settings);
      return response.data;
    } catch (error) {
      console.error('deviceService.updateSettings error:', error);
      throw error;
    }
  },
 
  getSensors: async () => {
    try {
      const response = await api.get('telemetry/latest/');
      return response.data;
    } catch (error) {
      console.error('deviceService.getSensors error:', error);
      throw error;
    }
  },
 
  // Appelle tinyml_predict_needs côté Django : tendance capteurs + météo
  // combinées pour estimer le besoin en eau des cultures.
  getIrrigationPrediction: async (): Promise<IrrigationPrediction> => {
    try {
      const response = await api.get('predictions/needs/');
      return response.data;
    } catch (error) {
      console.error('deviceService.getIrrigationPrediction error:', error);
      throw error;
    }
  },
 
  runDiagnostic: async (component: string) => {
    try {
      // Diagnostic API endpoint or fallback simulation response
      return { status: 'Fonctionnel' as const };
    } catch (error) {
      console.error('deviceService.runDiagnostic error:', error);
      throw error;
    }
  },
};
 
export default deviceService;
 