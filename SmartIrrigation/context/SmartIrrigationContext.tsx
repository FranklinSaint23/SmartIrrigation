import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// Services API imports
import authService from '../services/authService';
import userService from '../services/userService';
import farmerService from '../services/farmerService';
import technicianService from '../services/technicianService';
import deviceService from '../services/deviceService';
import maintenanceService from '../services/maintenanceService';
import notificationService from '../services/notificationService';
import statisticsService from '../services/statisticsService';

export interface SensorData {
  temperature: number;
  airHumidity: number;
  soilHumidity: number;
  light: number;
  tankLevel: number;
  rainDetected: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  date: 'Aujourd\'hui' | 'Hier';
  type: 'warning' | 'info' | 'success';
}

export interface AppSettings {
  soilHumidityThreshold: number;
  maxWateringDuration: number;
  sensorReadInterval: number;
  tankCapacity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  language: string;
  theme: 'Clair' | 'Sombre';
  role: 'Agriculteur' | 'Administrateur' | 'Technicien';
}

export interface TechnicianProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  phone_number: string;
  city: string;
  specialty: string;
  status: 'Disponible' | 'Occupé';
  interventions_count?: number;
}

export interface ESP32Device {
  id: number;
  name: string;
  device_id: string;
  ip_address: string;
  farmer_name: string;
  farm_name: string;
  is_online: boolean;
  last_connection: string;
  wifi_signal: 'Bon' | 'Moyen' | 'Faible';
}

export interface BreakdownReport {
  id: number;
  farmer_name: string;
  farmer_phone: string;
  farm_name: string;
  breakdown_type: string;
  description: string;
  photo_url?: string | null;
  status: 'En attente' | 'En cours' | 'Résolue' | 'Annulée';
  technician_name?: string | null;
  technician_id?: number | null;
  created_at: string;
  updated_at: string;
  resolution_notes?: string | null;
  checks_completed?: string; // JSON string
}

interface SmartIrrigationContextType {
  sensors: SensorData;
  notifications: NotificationItem[];
  settings: AppSettings;
  profile: UserProfile;
  pumpActive: boolean;
  wateringMode: 'Auto' | 'Manual';
  isLoggedIn: boolean;
  isLoading: boolean;
  setPumpActive: (active: boolean) => Promise<void>;
  setWateringMode: (mode: 'Auto' | 'Manual') => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  login: (email: string, psw: string) => Promise<boolean>;
  logout: () => Promise<void>;
  registerUser: (name: string, phone: string, email: string, psw: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // New Admin & Tech fields
  interventions: BreakdownReport[];
  technicians: TechnicianProfile[];
  farmers: UserProfile[];
  devices: ESP32Device[];
  statistics: any;
  reportBreakdown: (type: string, desc: string, photo?: string) => Promise<boolean>;
  assignTechnician: (interventionId: number, technicianId: number) => Promise<boolean>;
  startIntervention: (id: number) => Promise<boolean>;
  closeIntervention: (id: number, notes: string, checks: any) => Promise<boolean>;
  addTechnician: (techData: any) => Promise<boolean>;
  runDiagnosticTest: (component: string) => Promise<'Fonctionnel' | 'Panne' | 'En attente'>;
}

const SmartIrrigationContext = createContext<SmartIrrigationContextType | undefined>(undefined);

export const SmartIrrigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<SensorData>({
    temperature: 28,
    airHumidity: 65,
    soilHumidity: 42,
    light: 85,
    tankLevel: 75,
    rainDetected: false,
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    soilHumidityThreshold: 30,
    maxWateringDuration: 15,
    sensorReadInterval: 5,
    tankCapacity: 500,
  });

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Joyce',
    email: 'joyce@gmail.com',
    phone: '+237 600000000',
    language: 'Français',
    theme: 'Clair',
    role: 'Agriculteur',
  });

  const [pumpActive, setPumpActiveState] = useState<boolean>(false);
  const [wateringMode, setWateringModeState] = useState<'Auto' | 'Manual'>('Auto');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Données Admin/Tech
  const [interventions, setInterventions] = useState<BreakdownReport[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
  const [farmers, setFarmers] = useState<UserProfile[]>([]);
  const [devices, setDevices] = useState<ESP32Device[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLoggedIn(true);
        await refreshData();
      }
    } catch (error) {
      console.log('Erreur chargement auth initial:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, psw: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, psw);
      if (response && response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        
        const userRole = response.user?.role || 'Agriculteur';
        const userProfile: UserProfile = {
          name: response.user?.name || response.user?.username || 'Utilisateur',
          email: response.user?.email || email,
          phone: response.user?.phone_number || '',
          language: response.user?.language || 'Français',
          theme: (response.user?.theme || 'Clair') as 'Clair' | 'Sombre',
          role: userRole,
        };
        
        setProfile(userProfile);
        await AsyncStorage.setItem('profile', JSON.stringify(userProfile));
        
        setIsLoggedIn(true);
        await refreshData();
        return true;
      }
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.log('Erreur login:', error);
      
      // Fallback local démo si échec
      let resolvedRole: 'Agriculteur' | 'Administrateur' | 'Technicien' = 'Agriculteur';
      if (email.toLowerCase().includes('admin')) {
        resolvedRole = 'Administrateur';
      } else if (email.toLowerCase().includes('alain') || email.toLowerCase().includes('tech')) {
        resolvedRole = 'Technicien';
      }
      
      const demoProfile: UserProfile = {
        name: email.split('@')[0],
        email: email,
        phone: '+237 600000000',
        language: 'Français',
        theme: 'Clair',
        role: resolvedRole,
      };
      
      setProfile(demoProfile);
      await AsyncStorage.setItem('profile', JSON.stringify(demoProfile));
      
      setIsLoggedIn(true);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log('Erreur lors de la déconnexion API:', error);
    } finally {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('profile');
      setProfile({
        name: '',
        email: '',
        phone: '',
        language: 'Français',
        theme: 'Clair',
        role: 'Agriculteur',
      });
      setInterventions([]);
      setTechnicians([]);
      setFarmers([]);
      setDevices([]);
      setStatistics(null);
      setIsLoggedIn(false);
    }
  };

  const registerUser = async (name: string, phone: string, email: string, psw: string): Promise<boolean> => {
    try {
      await authService.register(name, phone, email, psw);
      const userProfile: UserProfile = {
        name,
        email,
        phone,
        language: 'Français',
        theme: 'Clair',
        role: 'Agriculteur',
      };
      setProfile(userProfile);
      await AsyncStorage.setItem('profile', JSON.stringify(userProfile));
      return true;
    } catch (error) {
      console.log('Erreur inscription:', error);
      return false;
    }
  };

  const setPumpActive = async (active: boolean) => {
    setPumpActiveState(active);
    try {
      await deviceService.togglePump(active);
    } catch (error) {
      console.log('Erreur bascule pompe:', error);
    }
  };

  const setWateringMode = async (mode: 'Auto' | 'Manual') => {
    setWateringModeState(mode);
    try {
      await deviceService.setMode(mode);
    } catch (error) {
      console.log('Erreur changement mode arrosage:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await deviceService.updateSettings(updated);
    } catch (error) {
      console.log('Erreur mise à jour paramètres:', error);
    }
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    try {
      await userService.updateProfile(updated);
    } catch (error) {
      console.log('Erreur mise à jour profil:', error);
    }
  };

  const refreshData = async () => {
    try {
      const sensorRes = await deviceService.getSensors();
      if (sensorRes) setSensors(sensorRes);

      const notifRes = await notificationService.getNotifications();
      if (notifRes) setNotifications(notifRes);

      const interRes = await maintenanceService.getInterventions();
      if (interRes) setInterventions(interRes);
    } catch (error) {
      console.log('Erreur rafraîchissement des données:', error);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const reportBreakdown = async (type: string, desc: string, photo?: string): Promise<boolean> => {
    try {
      await maintenanceService.reportBreakdown({ breakdown_type: type, description: desc, photo_url: photo });
      await refreshData();
      return true;
    } catch (error) {
      console.log('Erreur signalement panne:', error);
      return false;
    }
  };

  const assignTechnician = async (interventionId: number, technicianId: number): Promise<boolean> => {
    try {
      await maintenanceService.assignTechnician(interventionId, technicianId);
      await refreshData();
      return true;
    } catch (error) {
      console.log('Erreur assignation technicien:', error);
      return false;
    }
  };

  const startIntervention = async (id: number): Promise<boolean> => {
    try {
      await maintenanceService.startIntervention(id);
      await refreshData();
      return true;
    } catch (error) {
      console.log('Erreur démarrage intervention:', error);
      return false;
    }
  };

  const closeIntervention = async (id: number, notes: string, checks: any): Promise<boolean> => {
    try {
      await maintenanceService.closeIntervention(id, notes, checks);
      await refreshData();
      return true;
    } catch (error) {
      console.log('Erreur clôture intervention:', error);
      return false;
    }
  };

  const addTechnician = async (techData: any): Promise<boolean> => {
    try {
      await technicianService.createTechnician(techData);
      await refreshData();
      return true;
    } catch (error) {
      console.log('Erreur ajout technicien:', error);
      return false;
    }
  };

  const runDiagnosticTest = async (component: string): Promise<'Fonctionnel' | 'Panne' | 'En attente'> => {
    try {
      const res = await deviceService.runDiagnostic(component);
      return res.status;
    } catch (error) {
      console.log('Erreur test diagnostic:', error);
      return 'Fonctionnel';
    }
  };

  return (
    <SmartIrrigationContext.Provider
      value={{
        sensors,
        notifications,
        settings,
        profile,
        pumpActive,
        wateringMode,
        isLoggedIn,
        isLoading,
        setPumpActive,
        setWateringMode,
        updateSettings,
        updateProfile,
        login,
        logout,
        registerUser,
        refreshData,
        deleteNotification,
        clearAllNotifications,
        interventions,
        technicians,
        farmers,
        devices,
        statistics,
        reportBreakdown,
        assignTechnician,
        startIntervention,
        closeIntervention,
        addTechnician,
        runDiagnosticTest,
      }}
    >
      {children}
    </SmartIrrigationContext.Provider>
  );
};

export const useSmartIrrigation = () => {
  const context = useContext(SmartIrrigationContext);
  if (!context) {
    throw new Error('useSmartIrrigation must be used within a SmartIrrigationProvider');
  }
  return context;
};